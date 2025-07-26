"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { type Group, BufferGeometry, BufferAttribute, Color } from "@/lib/three"
import type { ShapeType, TransformState } from "@/app/page"
import {
  generateTesseract,
  generatePentachoron,
  generateHyperOctahedron,
  generateSimplex5D,
  projectToThreeD,
  applyRotations,
} from "@/lib/hyper-geometry"

const shapeColors: Record<ShapeType, string> = {
  tesseract: "#4f46e5",
  pentachoron: "#10b981",
  hyperoctahedron: "#f59e0b",
  simplex5d: "#e11d48",
}

interface HyperShapeProps {
  shapeType: ShapeType
  dimension: 4 | 5
  transforms: TransformState
  wireframe: boolean
  showVertices: boolean
}

export default function HyperShape({
  shapeType,
  dimension,
  transforms,
  wireframe,
  showVertices,
}: HyperShapeProps) {
  const groupRef = useRef<Group>(null)
  const lineColor = shapeColors[shapeType]
  const shapeDim = shapeType === "simplex5d" ? 5 : 4

  const { lineGeometry, pointsGeometry } = useMemo(() => {
    // 1. Generate base geometry
    let baseGeometry
    switch (shapeType) {
      case "tesseract":
        baseGeometry = generateTesseract()
        break
      case "pentachoron":
        baseGeometry = generatePentachoron()
        break
      case "hyperoctahedron":
        baseGeometry = generateHyperOctahedron()
        break
      case "simplex5d":
        baseGeometry = generateSimplex5D()
        break
      default:
        baseGeometry = generateTesseract()
    }

    // 2. Apply transformations
    let transformedVertices = applyRotations(
      baseGeometry.vertices,
      transforms,
      shapeDim,
    )
    let transformedEdges = baseGeometry.edges

    // 4. Project to 3D
    const projectedVertices = transformedVertices
      .map((vertex) => projectToThreeD(vertex, transforms.projectionDistance))
      .filter((v) => v && isFinite(v.x) && isFinite(v.y) && isFinite(v.z))

    // 5. Create BufferGeometries (the stable part)
    const linePositions: number[] = []
    const lineColors: number[] = []
    if (wireframe) {
      transformedEdges.forEach(([startIdx, endIdx]) => {
        if (startIdx < projectedVertices.length && endIdx < projectedVertices.length) {
          const start = projectedVertices[startIdx]
          const end = projectedVertices[endIdx]
          if (start && end) {
            linePositions.push(start.x, start.y, start.z)
            linePositions.push(end.x, end.y, end.z)

            const startIntensity =
              (Math.sin(start.x * 5) + Math.sin(start.y * 5) + Math.sin(start.z * 5)) /
              3
            const endIntensity =
              (Math.sin(end.x * 5) + Math.sin(end.y * 5) + Math.sin(end.z * 5)) / 3

            const baseColor = new Color(lineColor)

            const startColor = baseColor.clone()
            startColor.offsetHSL(startIntensity * 0.1, 0, startIntensity * 0.2)
            lineColors.push(startColor.r, startColor.g, startColor.b)

            const endColor = baseColor.clone()
            endColor.offsetHSL(endIntensity * 0.1, 0, endIntensity * 0.2)
            lineColors.push(endColor.r, endColor.g, endColor.b)
          }
        }
      })
    }

    const pointPositions: number[] = []
    const pointColors: number[] = []
    if (showVertices) {
      projectedVertices.forEach((vertex) => {
        pointPositions.push(vertex.x, vertex.y, vertex.z)

        const intensity =
          (Math.sin(vertex.x * 5) + Math.sin(vertex.y * 5) + Math.sin(vertex.z * 5)) /
          3
        const color = new Color(lineColor)
        color.offsetHSL(intensity * 0.1, 0, intensity * 0.2)
        pointColors.push(color.r, color.g, color.b)
      })
    }

    const lineGeom = new BufferGeometry()
    if (linePositions.length > 0) {
      lineGeom.setAttribute(
        "position",
        new BufferAttribute(new Float32Array(linePositions), 3),
      )
      lineGeom.setAttribute(
        "color",
        new BufferAttribute(new Float32Array(lineColors), 3),
      )
    }

    const pointsGeom = new BufferGeometry()
    if (pointPositions.length > 0) {
      pointsGeom.setAttribute(
        "position",
        new BufferAttribute(new Float32Array(pointPositions), 3),
      )
      pointsGeom.setAttribute(
        "color",
        new BufferAttribute(new Float32Array(pointColors), 3),
      )
    }

    return { lineGeometry: lineGeom, pointsGeometry: pointsGeom }
  }, [shapeType, dimension, transforms, wireframe, showVertices])

  // Apply scale transformation per frame
  useFrame(() => {
    if (groupRef.current) {
      groupRef.current.scale.setScalar(Math.max(0.1, transforms.scale))
    }
  })

  return (
    <group ref={groupRef}>
      {/* A single object for all lines */}
      {wireframe && lineGeometry.attributes.position && (
        <lineSegments geometry={lineGeometry}>
          <lineBasicMaterial
            transparent
            opacity={0.6}
            vertexColors
          />
        </lineSegments>
      )}

      {/* A single object for all points */}
      {showVertices && pointsGeometry.attributes.position && (
        <points geometry={pointsGeometry}>
          <pointsMaterial size={0.1} sizeAttenuation vertexColors />
        </points>
      )}
    </group>
  )
}
