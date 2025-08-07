"use client"

import { Label } from "@/components/ui/label"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Button } from "@/components/ui/button"

interface AnimationControlsProps {
  isAutoRotating: boolean
  onAutoRotateChange: (isAutoRotating: boolean) => void
  animationSpeed: number
  onAnimationSpeedChange: (speed: number) => void
  onReset: () => void
}

export default function AnimationControls({
  isAutoRotating,
  onAutoRotateChange,
  animationSpeed,
  onAnimationSpeedChange,
  onReset,
}: AnimationControlsProps) {
  return (
    <div className="grid gap-4">
      <div className="flex items-center justify-between">
        <Label htmlFor="autorotate-switch">Auto-rotate</Label>
        <Switch id="autorotate-switch" checked={isAutoRotating} onCheckedChange={onAutoRotateChange} />
      </div>
      <div className="grid gap-2">
        <Label htmlFor="speed-slider">Animation Speed</Label>
        <Slider
          id="speed-slider"
          min={0}
          max={2}
          step={0.1}
          value={[animationSpeed]}
          onValueChange={([value]) => onAnimationSpeedChange(value)}
        />
      </div>
      <Button onClick={onReset} variant="outline">
        Reset Transforms
      </Button>
    </div>
  )
}
