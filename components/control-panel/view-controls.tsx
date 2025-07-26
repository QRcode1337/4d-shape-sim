"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import type { TransformState } from "@/app/page"

interface ViewControlsProps {
  wireframe: boolean
  onWireframeChange: (wireframe: boolean) => void
  showVertices: boolean
  onShowVerticesChange: (showVertices: boolean) => void
  transforms: TransformState
  onTransformChange: (transforms: Partial<TransformState>) => void
}

export default function ViewControls({
  wireframe,
  onWireframeChange,
  showVertices,
  onShowVerticesChange,
  transforms,
  onTransformChange,
}: ViewControlsProps) {
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="wireframe-switch">Wireframe</Label>
        <Switch id="wireframe-switch" checked={wireframe} onCheckedChange={onWireframeChange} />
      </div>
      <div className="flex items-center justify-between">
        <Label htmlFor="vertices-switch">Show Vertices</Label>
        <Switch id="vertices-switch" checked={showVertices} onCheckedChange={onShowVerticesChange} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="scale-slider">Scale</Label>
        <Slider
          id="scale-slider"
          min={0.1}
          max={2}
          step={0.1}
          value={[transforms.scale]}
          onValueChange={([value]) => onTransformChange({ scale: value })}
        />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="projection-slider">Projection Distance</Label>
        <Slider
          id="projection-slider"
          min={1}
          max={10}
          step={0.1}
          value={[transforms.projectionDistance]}
          onValueChange={([value]) => onTransformChange({ projectionDistance: value })}
        />
      </div>
    </div>
  )
}
