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

// Base class for hyper-dimensional geometry
export class HyperGeometry {
  vertices: HyperVector[]
  edges: [number, number][]
  faces: [number, number, number][]


  constructor() {
    this.vertices = []
    this.edges = []
    this.faces = []
  }
}


  }

  private generateVertices() {
    for (let i = 0; i < 16; i++) {
      this.vertices.push({
        x: i & 1 ? 1 : -1,
        y: i & 2 ? 1 : -1,
        z: i & 4 ? 1 : -1,
        w: i & 8 ? 1 : -1,
      })
    }
  }

  private generateEdges() {
    for (let i = 0; i < this.vertices.length; i++) {
      for (let j = i + 1; j < this.vertices.length; j++) {
        const v1 = this.vertices[i] as Vector4D
        const v2 = this.vertices[j] as Vector4D

        let differences = 0
        if (v1.x !== v2.x) differences++
        if (v1.y !== v2.y) differences++
        if (v1.z !== v2.z) differences++
        if (v1.w !== v2.w) differences++

        if (differences === 1) {
          this.edges.push([i, j])
        }
      }
    }
  }


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
          this.faces.push([v0, v1, v2])
          this.faces.push([v0, v2, v3])
        })
      })
    })
  }
}

// 4D Hyperoctahedron
class HyperOctahedron extends HyperGeometry {
  constructor() {
    super()
    this.vertices = [
      { x: 1, y: 0, z: 0, w: 0 }, { x: -1, y: 0, z: 0, w: 0 },
      { x: 0, y: 1, z: 0, w: 0 }, { x: 0, y: -1, z: 0, w: 0 },
      { x: 0, y: 0, z: 1, w: 0 }, { x: 0, y: 0, z: -1, w: 0 },
      { x: 0, y: 0, z: 0, w: 1 }, { x: 0, y: 0, z: 0, w: -1 },
    ]
    this.generateEdges()
    this.generateFaces()
  }

  private generateEdges() {
    for (let i = 0; i < this.vertices.length; i++) {
      for (let j = i + 1; j < this.vertices.length; j++) {
        const v1 = this.vertices[i] as Vector4D
        const v2 = this.vertices[j] as Vector4D
        const dot = v1.x * v2.x + v1.y * v2.y + v1.z * v2.z + v1.w * v2.w
        if (Math.abs(dot) < 0.001) {
          this.edges.push([i, j])
        }
      }
    }
  }

  private generateFaces() {
    const axisCombos: [number, number, number][] = [
      [0, 1, 2], [0, 1, 3], [0, 2, 3], [1, 2, 3],
    ]
    const getIndex = (axis: number, sign: number): number => axis * 2 + (sign === 1 ? 0 : 1)
    axisCombos.forEach(([a, b, c]) => {
      ;[-1, 1].forEach((sa) => {
        ;[-1, 1].forEach((sb) => {
          ;[-1, 1].forEach((sc) => {
            this.faces.push([getIndex(a, sa), getIndex(b, sb), getIndex(c, sc)])
          })
        })
      })
    })
  }
}

// 5D Simplex
class Simplex5D extends HyperGeometry {
  constructor() {
    super()
    this.vertices = [
      { x: 1, y: 0, z: 0, w: 0, v: 0 },
      { x: 0, y: 1, z: 0, w: 0, v: 0 },
      { x: 0, y: 0, z: 1, w: 0, v: 0 },
      { x: 0, y: 0, z: 0, w: 1, v: 0 },
      { x: 0, y: 0, z: 0, w: 0, v: 1 },
      { x: -0.5, y: -0.5, z: -0.5, w: -0.5, v: -0.5 },
    ]
    this.generateEdgesAndFaces()
  }

  private generateEdgesAndFaces() {
    for (let i = 0; i < this.vertices.length; i++) {
      for (let j = i + 1; j < this.vertices.length; j++) {
        this.edges.push([i, j])
        for (let k = j + 1; k < this.vertices.length; k++) {
          this.faces.push([i, j, k])
        }
      }
    }
  }
}

// Factory function to generate shapes
export function generateShape(shapeType: string): HyperGeometry {
  switch (shapeType) {
    case "tesseract":
      return new Tesseract()
    case "pentachoron":
      return new Pentachoron()
    case "hyperoctahedron":
      return new HyperOctahedron()
    case "simplex5d":
      return new Simplex5D()
    default:
      throw new Error(`Unknown shape type: ${shapeType}`)
  }
}

// Apply 4D rotations
function rotate4D(vector: Vector4D, rotations: TransformState["rotation4D"]): Vector4D {
  let { x, y, z, w } = vector
  const rotationPlanes = Object.keys(rotations) as (keyof TransformState["rotation4D"])[]

  rotationPlanes.forEach(plane => {
    const angle = rotations[plane]
    if (angle === 0) return;
    const cos = Math.cos(angle)
    const sin = Math.sin(angle)
    let c1, c2;

    switch(plane) {
        case "xy": c1 = "x"; c2 = "y"; break;
        case "xz": c1 = "x"; c2 = "z"; break;
        case "xw": c1 = "x"; c2 = "w"; break;
        case "yz": c1 = "y"; c2 = "z"; break;
        case "yw": c1 = "y"; c2 = "w"; break;
        case "zw": c1 = "z"; c2 = "w"; break;
        default: throw new Error(`Invalid rotation plane: ${plane}`);
    }

    const val1 = vector[c1]
    const val2 = vector[c2]
    vector[c1] = val1 * cos - val2 * sin
    vector[c2] = val1 * sin + val2 * cos
  })

  return vector
}

// Apply 5D rotations
function rotate5D(vector: Vector5D, rotations: TransformState["rotation5D"]): Vector5D {
  const coords = { ...vector }
  const rotationPairs = [
    ["xy", "x", "y"], ["xz", "x", "z"], ["xw", "x", "w"], ["xv", "x", "v"],
    ["yz", "y", "z"], ["yw", "y", "w"], ["yv", "y", "v"], ["zw", "z", "w"],
    ["zv", "z", "v"], ["wv", "w", "v"],
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
      if (!("w" in vertex)) throw new Error("Applying 4D rotation to a non-4D vector");
      return rotate4D(vertex as Vector4D, transforms.rotation4D)
    } else {
      if (!("v" in vertex)) throw new Error("Applying 5D rotation to a non-5D vector");
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
    if([x,y,z,w,v].some(val => typeof val !== 'number' || !isFinite(val))) {
        console.error("Invalid 5D vector components for projection:", vertex);
        return new Vector3(0,0,0);
    }
    const factorW = safeDistance / (safeDistance + w)
    const factorV = safeDistance / (safeDistance + v)
    const finalFactor = factorW * factorV

    return new Vector3(x * finalFactor, y * finalFactor, z * finalFactor)
  } else {
    // 4D to 3D projection
    const { x, y, z, w } = vertex as Vector4D
    if([x,y,z,w].some(val => typeof val !== 'number' || !isFinite(val))) {
        console.error("Invalid 4D vector components for projection:", vertex);
        return new Vector3(0,0,0);
    }
    const factor = safeDistance / (safeDistance + w)

    return new Vector3(x * factor, y * factor, z * factor)
  }
}
