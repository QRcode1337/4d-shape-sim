"use client"

import { useState, useCallback } from "react"
import type { TransformState } from "@/app/page"

export function useTransformState() {
  const [transforms, setTransforms] = useState<TransformState>({
    rotation4D: { xy: 0, xz: 0, xw: 0, yz: 0, yw: 0, zw: 0 },
    rotation5D: { xy: 0, xz: 0, xw: 0, xv: 0, yz: 0, yw: 0, yv: 0, zw: 0, zv: 0, wv: 0 },
    scale: 1,
    projectionDistance: 4,
  })

  const handleTransformChange = useCallback((newTransforms: Partial<TransformState>) => {
    setTransforms((prev) => ({ ...prev, ...newTransforms }))
  }, [])

  const resetTransforms = useCallback(() => {
    setTransforms({
      rotation4D: { xy: 0, xz: 0, xw: 0, yz: 0, yw: 0, zw: 0 },
      rotation5D: { xy: 0, xz: 0, xw: 0, xv: 0, yz: 0, yw: 0, yv: 0, zw: 0, zv: 0, wv: 0 },
      scale: 1,
      projectionDistance: 4,
    })
  }, [])

  return { transforms, handleTransformChange, resetTransforms }
}
