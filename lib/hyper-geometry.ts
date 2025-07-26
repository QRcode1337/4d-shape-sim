import { Vector3 } from "@/lib/three"
import type { TransformState } from "@/app/page"

// Higher-dimensional vector types
export interface Vector4D {
  x: number
  y: number
  z: number
  w: number
}

export interface Vector5D {
  x: number
  y: number
  z: number
  w: number
  v: number
}

export type HyperVector = Vector4D | Vector5D

export interface HyperGeometry {
  vertices: HyperVector[]
  edges: [number, number][]
  faces: [number, number, number][]
}

// Utility function to validate numbers
function isValidNumber(value: any): value is number {
  return typeof value === "number" && isFinite(value) && !isNaN(value)
}

// Generate 4D Tesseract (Hypercube)
export function generateTesseract(): HyperGeometry {
  const vertices: Vector4D[] = []
  const edges: [number, number][] = []
  const faces: [number, number, number][] = []

  // Generate 16 vertices of tesseract
  for (let i = 0; i < 16; i++) {
    vertices.push({
      x: i & 1 ? 1 : -1,
      y: i & 2 ? 1 : -1,
      z: i & 4 ? 1 : -1,
      w: i & 8 ? 1 : -1,
    })
  }

  // Generate edges
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      const v1 = vertices[i]
      const v2 = vertices[j]

      let differences = 0
      if (v1.x !== v2.x) differences++
      if (v1.y !== v2.y) differences++
      if (v1.z !== v2.z) differences++
      if (v1.w !== v2.w) differences++

      if (differences === 1) {
        edges.push([i, j])
      }
    }
  }

  const axisPairs: [number, number][] = [
    [0, 1],
    [0, 2],
    [0, 3],
    [1, 2],
    [1, 3],
    [2, 3],
  ]
  const getIndex = (coords: number[]): number => {
    return (
      (coords[0] === 1 ? 1 : 0) |
      (coords[1] === 1 ? 2 : 0) |
      (coords[2] === 1 ? 4 : 0) |
      (coords[3] === 1 ? 8 : 0)
    )
  }
  axisPairs.forEach(([a, b]) => {
    const rest = [0, 1, 2, 3].filter((x) => x !== a && x !== b)
    ;[-1, 1].forEach((s1) => {
      ;[-1, 1].forEach((s2) => {
        const coords = [-1, -1, -1, -1]
        coords[rest[0]] = s1
        coords[rest[1]] = s2
        const v0 = getIndex(coords)
        coords[a] = 1
        const v1 = getIndex(coords)
        coords[b] = 1
        const v2 = getIndex(coords)
        coords[a] = -1
        const v3 = getIndex(coords)
        faces.push([v0, v1, v2])
        faces.push([v0, v2, v3])
      })
    })
  })

  return { vertices, edges, faces }
}

// Generate 4D Pentachoron
export function generatePentachoron(): HyperGeometry {
  const vertices: Vector4D[] = [
    { x: 1, y: 1, z: 1, w: -0.5 },
    { x: 1, y: -1, z: -1, w: -0.5 },
    { x: -1, y: 1, z: -1, w: -0.5 },
    { x: -1, y: -1, z: 1, w: -0.5 },
    { x: 0, y: 0, z: 0, w: 1.5 },
  ]

  const edges: [number, number][] = []
  const faces: [number, number, number][] = []
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      edges.push([i, j])
    }
  }

  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      for (let k = j + 1; k < vertices.length; k++) {
        faces.push([i, j, k])
      }
    }
  }

  return { vertices, edges, faces }
}

// Generate 4D Hyperoctahedron
export function generateHyperOctahedron(): HyperGeometry {
  const vertices: Vector4D[] = [
    { x: 1, y: 0, z: 0, w: 0 },
    { x: -1, y: 0, z: 0, w: 0 },
    { x: 0, y: 1, z: 0, w: 0 },
    { x: 0, y: -1, z: 0, w: 0 },
    { x: 0, y: 0, z: 1, w: 0 },
    { x: 0, y: 0, z: -1, w: 0 },
    { x: 0, y: 0, z: 0, w: 1 },
    { x: 0, y: 0, z: 0, w: -1 },
  ]

  const edges: [number, number][] = []
  const faces: [number, number, number][] = []
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      const v1 = vertices[i]
      const v2 = vertices[j]
      const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z + v1.w * v2.w
      if (Math.abs(dot) < 0.001) {
        edges.push([i, j])
      }
    }
  }

  const axisCombos: [number, number, number][] = [
    [0, 1, 2],
    [0, 1, 3],
    [0, 2, 3],
    [1, 2, 3],
  ]
  const getIndex = (axis: number, sign: number): number => axis * 2 + (sign === 1 ? 0 : 1)
  axisCombos.forEach(([a, b, c]) => {
    ;[-1, 1].forEach((sa) => {
      ;[-1, 1].forEach((sb) => {
        ;[-1, 1].forEach((sc) => {
          faces.push([getIndex(a, sa), getIndex(b, sb), getIndex(c, sc)])
        })
      })
    })
  })

  return { vertices, edges, faces }
}

// Generate 5D Simplex
export function generateSimplex5D(): HyperGeometry {
  const vertices: Vector5D[] = [
    { x: 1, y: 0, z: 0, w: 0, v: 0 },
    { x: 0, y: 1, z: 0, w: 0, v: 0 },
    { x: 0, y: 0, z: 1, w: 0, v: 0 },
    { x: 0, y: 0, z: 0, w: 1, v: 0 },
    { x: 0, y: 0, z: 0, w: 0, v: 1 },
    { x: -0.5, y: -0.5, z: -0.5, w: -0.5, v: -0.5 },
  ]

  const edges: [number, number][] = []
  const faces: [number, number, number][] = []
  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      edges.push([i, j])
    }
  }

  for (let i = 0; i < vertices.length; i++) {
    for (let j = i + 1; j < vertices.length; j++) {
      for (let k = j + 1; k < vertices.length; k++) {
        faces.push([i, j, k])
      }
    }
  }

  return { vertices, edges, faces }
}

// Apply 4D rotations
function rotate4D(vector: Vector4D, rotations: TransformState["rotation4D"]): Vector4D {
  let { x, y, z, w } = vector

  // XY rotation
  if (rotations.xy !== 0) {
    const cos = Math.cos(rotations.xy)
    const sin = Math.sin(rotations.xy)
    const newX = x * cos - y * sin
    const newY = x * sin + y * cos
    x = newX
    y = newY
  }

  // XZ rotation
  if (rotations.xz !== 0) {
    const cos = Math.cos(rotations.xz)
    const sin = Math.sin(rotations.xz)
    const newX = x * cos - z * sin
    const newZ = x * sin + z * cos
    x = newX
    z = newZ
  }

  // XW rotation
  if (rotations.xw !== 0) {
    const cos = Math.cos(rotations.xw)
    const sin = Math.sin(rotations.xw)
    const newX = x * cos - w * sin
    const newW = x * sin + w * cos
    x = newX
    w = newW
  }

  // YZ rotation
  if (rotations.yz !== 0) {
    const cos = Math.cos(rotations.yz)
    const sin = Math.sin(rotations.yz)
    const newY = y * cos - z * sin
    const newZ = y * sin + z * cos
    y = newY
    z = newZ
  }

  // YW rotation
  if (rotations.yw !== 0) {
    const cos = Math.cos(rotations.yw)
    const sin = Math.sin(rotations.yw)
    const newY = y * cos - w * sin
    const newW = y * sin + w * cos
    y = newY
    w = newW
  }

  // ZW rotation
  if (rotations.zw !== 0) {
    const cos = Math.cos(rotations.zw)
    const sin = Math.sin(rotations.zw)
    const newZ = z * cos - w * sin
    const newW = z * sin + w * cos
    z = newZ
    w = newW
  }

  return { x, y, z, w }
}

// Apply 5D rotations
function rotate5D(vector: Vector5D, rotations: TransformState["rotation5D"]): Vector5D {
  const coords = { ...vector }

  const rotationPairs = [
    ["xy", "x", "y"],
    ["xz", "x", "z"],
    ["xw", "x", "w"],
    ["xv", "x", "v"],
    ["yz", "y", "z"],
    ["yw", "y", "w"],
    ["yv", "y", "v"],
    ["zw", "z", "w"],
    ["zv", "z", "v"],
    ["wv", "w", "v"],
  ] as const

  rotationPairs.forEach(([planeName, axis1, axis2]) => {
    const angle = rotations[planeName]
    if (angle !== 0) {
      const cos = Math.cos(angle)
      const sin = Math.sin(angle)
      const val1 = coords[axis1]
      const val2 = coords[axis2]
      coords[axis1] = val1 * cos - val2 * sin
      coords[axis2] = val1 * sin + val2 * cos
    }
  })

  return coords
}

// Apply rotations to vertices
export function applyRotations(vertices: HyperVector[], transforms: TransformState, dimension: 4 | 5): HyperVector[] {
  return vertices.map((vertex) => {
    if (dimension === 4) {
      return rotate4D(vertex as Vector4D, transforms.rotation4D)
    } else {
      return rotate5D(vertex as Vector5D, transforms.rotation5D)
    }
  })
}

// Project to 3D
export function projectToThreeD(vertex: HyperVector, distance: number): Vector3 {
  const safeDistance = Math.max(Math.abs(distance), 0.1)

  if ("v" in vertex) {
    // 5D to 3D projection
    const { x, y, z, w, v } = vertex as Vector5D
    const factor1 = safeDistance / (safeDistance + w)
    const factor2 = safeDistance / (safeDistance + v)
    const finalFactor = factor1 * factor2

    return new Vector3(x * finalFactor, y * finalFactor, z * finalFactor)
  } else {
    // 4D to 3D projection
    const { x, y, z, w } = vertex as Vector4D
    const factor = safeDistance / (safeDistance + w)

    return new Vector3(x * factor, y * factor, z * factor)
  }
}
