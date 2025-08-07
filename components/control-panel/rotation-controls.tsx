"use client"

import { Label } from "@/components/ui/label"
import { Slider } from "@/components/ui/slider"
import type { TransformState } from "@/app/page"

interface RotationControlsProps {
  transforms: TransformState
  onTransformChange: (transforms: Partial<TransformState>) => void
  dimension: 4 | 5
}

export default function RotationControls({
  transforms,
  onTransformChange,
  dimension,
}: RotationControlsProps) {
  const handleRotationChange = (plane: keyof TransformState['rotation4D'] | keyof TransformState['rotation5D'], value: number) => {
    if (dimension === 4) {
      onTransformChange({
        rotation4D: { ...transforms.rotation4D, [plane]: value },
      })
    } else {
      onTransformChange({
        rotation5D: { ...transforms.rotation5D, [plane]: value },
      })
    }
  }

  const rotationPlanes =
    dimension === 4
      ? (Object.keys(transforms.rotation4D) as (keyof TransformState['rotation4D'])[])
      : (Object.keys(transforms.rotation5D) as (keyof TransformState['rotation5D'])[])

  return (
    <div className="grid gap-4">
      <h3 className="font-semibold">Rotations</h3>
      {rotationPlanes.map((plane) => (
        <div key={plane} className="grid gap-2">
          <Label htmlFor={`${plane}-slider`}>{plane.toUpperCase()}</Label>
          <Slider
            id={`${plane}-slider`}
            min={-Math.PI}
            max={Math.PI}
            step={0.01}
            value={[dimension === 4 ? transforms.rotation4D[plane] : transforms.rotation5D[plane]]}
            onValueChange={([value]) => handleRotationChange(plane, value)}
          />
        </div>
      ))}
    </div>
  )
}
