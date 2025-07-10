"use client"

import { useRef } from "react"
import { useFrame } from "@react-three/fiber"
import type { TransformState } from "@/app/page"

interface AnimationControllerProps {
  isAutoRotating: boolean
  animationSpeed: number
  transforms: TransformState
  onTransformChange: (transforms: Partial<TransformState>) => void
}

export default function AnimationController({
  isAutoRotating,
  animationSpeed,
  transforms,
  onTransformChange,
}: AnimationControllerProps) {
  const timeRef = useRef(0)

  useFrame((state, delta) => {
    if (isAutoRotating && animationSpeed > 0) {
      timeRef.current = (timeRef.current + delta * animationSpeed * 0.3) % (Math.PI * 2)

      const newRotation4D = {
        ...transforms.rotation4D,
        xw: timeRef.current,
        yz: timeRef.current * 0.7,
      }

      const newRotation5D = {
        ...transforms.rotation5D,
        xw: timeRef.current,
        yv: timeRef.current * 0.7,
      }

      onTransformChange({
        rotation4D: newRotation4D,
        rotation5D: newRotation5D,
      })
    }
  })

  return null
}
