"use client"

import { useRef, useMemo } from "react"
import { useFrame } from "@react-three/fiber"
import { type Group, BufferGeometry, BufferAttribute } from "@/lib/three"
import type { ShapeType, TransformState, CrossSectionState } from "@/app/page"
import {
  generateTesseract,
  generatePentachoron,
  generateHyperOctahedron,
  generateSimplex5D,
  projectToThreeD,
  applyRotations,
  applyCrossSection,
} from "@/lib/hyper-geometry"

interface HyperShapeProps {
  shapeType: ShapeType
  dimension: 4 | 5
  transforms: TransformState
  crossSection: CrossSectionState
  wireframe: boolean
  showVertices: boolean
}

export default function HyperShape({
  shapeType,
  dimension,
  transforms,
  crossSection,
  wireframe,
  showVertices,
}: HyperShapeProps) {
  const groupRef = useRef<Group>(null)

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
    let transformedVertices = applyRotations(baseGeometry.vertices, transforms, dimension)
    let transformedEdges = baseGeometry.edges

    // 3. Apply cross-section
    if (crossSection.enabled) {
      const result = applyCrossSection(transformedVertices, transformedEdges, crossSection)
      transformedVertices = result.vertices
      transformedEdges = result.edges
    }

    // 4. Project to 3D
    const projectedVertices = transformedVertices
      .map((vertex) => projectToThreeD(vertex, transforms.projectionDistance))
      .filter((v) => v && isFinite(v.x) && isFinite(v.y) && isFinite(v.z))

    // 5. Create BufferGeometries (the stable part)
    const linePositions: number[] = []
    if (wireframe) {
      transformedEdges.forEach(([startIdx, endIdx]) => {
        if (startIdx < projectedVertices.length && endIdx < projectedVertices.length) {
          const start = projectedVertices[startIdx]
          const end = projectedVertices[endIdx]
          if (start && end) {
            linePositions.push(start.x, start.y, start.z)
            linePositions.push(end.x, end.y, end.z)
          }
        }
      })
    }

    const pointPositions: number[] = []
    if (showVertices) {
      projectedVertices.forEach((vertex) => {
        pointPositions.push(vertex.x, vertex.y, vertex.z)
      })
    }

    const lineGeom = new BufferGeometry()
    if (linePositions.length > 0) {
      lineGeom.setAttribute("position", new BufferAttribute(new Float32Array(linePositions), 3))
    }

    const pointsGeom = new BufferGeometry()
    if (pointPositions.length > 0) {
      pointsGeom.setAttribute("position", new BufferAttribute(new Float32Array(pointPositions), 3))
    }

    return { lineGeometry: lineGeom, pointsGeometry: pointsGeom }
  }, [shapeType, dimension, transforms, crossSection, wireframe, showVertices])

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
          <lineBasicMaterial color="#00ffff" transparent opacity={0.5} />
        </lineSegments>
      )}

      {/* A single object for all points */}
      {showVertices && pointsGeometry.attributes.position && (
        <points geometry={pointsGeometry}>
          <pointsMaterial color="#ffffff" size={0.1} sizeAttenuation />
        </points>
      )}
    </group>
  )
}
