"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Button } from "@/components/ui/button"
import { Slider } from "@/components/ui/slider"
import { Switch } from "@/components/ui/switch"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import { Tabs, TabsContent, TabsList, TabsTrigger } from "@/components/ui/tabs"
import type { ShapeType, TransformState } from "@/app/page"
import { RotateCcw, Settings, Shapes, Camera, Play } from "lucide-react"

interface ControlPanelProps {
  currentShape: ShapeType
  dimension: 4 | 5
  transforms: TransformState
  wireframe: boolean
  showVertices: boolean
  animationSpeed: number
  isAutoRotating: boolean
  onShapeChange: (shape: ShapeType) => void
  onDimensionChange: (dimension: 4 | 5) => void
  onTransformChange: (transforms: Partial<TransformState>) => void
  onWireframeChange: (wireframe: boolean) => void
  onShowVerticesChange: (show: boolean) => void
  onAnimationSpeedChange: (speed: number) => void
  onAutoRotateChange: (isRotating: boolean) => void
  onReset: () => void
}

export default function ControlPanel({
  currentShape,
  dimension,
  transforms,
  wireframe,
  showVertices,
  animationSpeed,
  isAutoRotating,
  onShapeChange,
  onDimensionChange,
  onTransformChange,
  onWireframeChange,
  onShowVerticesChange,
  onAnimationSpeedChange,
  onAutoRotateChange,
  onReset,
}: ControlPanelProps) {
  const rotations = dimension === 4 ? transforms.rotation4D : transforms.rotation5D

  return (
    <Card className="absolute top-4 right-4 w-80 max-h-[calc(100vh-2rem)] overflow-y-auto bg-black/90 backdrop-blur-sm text-white border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Settings className="w-5 h-5" />
          Controls
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <Tabs defaultValue="shape" className="w-full">
          <TabsList className="grid w-full grid-cols-3 bg-gray-800">
            <TabsTrigger value="shape" className="text-xs">
              <Shapes className="w-4 h-4 mr-1" />
              Shape
            </TabsTrigger>
            <TabsTrigger value="transform" className="text-xs">
              <RotateCcw className="w-4 h-4 mr-1" />
              Transform
            </TabsTrigger>
            <TabsTrigger value="view" className="text-xs">
              <Camera className="w-4 h-4 mr-1" />
              View
            </TabsTrigger>
          </TabsList>

          <TabsContent value="shape" className="space-y-4 pt-2">
            <div className="space-y-2">
              <Label>Dimension</Label>
              <Select
                value={dimension.toString()}
                onValueChange={(value) => onDimensionChange(Number.parseInt(value) as 4 | 5)}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="4">4D</SelectItem>
                  <SelectItem value="5">5D</SelectItem>
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-2">
              <Label>Shape Type</Label>
              <Select value={currentShape} onValueChange={onShapeChange}>
                <SelectTrigger className="bg-gray-800 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  <SelectItem value="tesseract">Tesseract (4D Cube)</SelectItem>
                  <SelectItem value="pentachoron">Pentachoron (4D Simplex)</SelectItem>
                  <SelectItem value="hyperoctahedron">16-Cell (4D Octahedron)</SelectItem>
                  {dimension === 5 && <SelectItem value="simplex5d">5-Simplex</SelectItem>}
                </SelectContent>
              </Select>
            </div>
          </TabsContent>

          <TabsContent value="transform" className="space-y-4 pt-2">
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Scale</Label>
                <span className="text-xs text-gray-400">{transforms.scale.toFixed(2)}</span>
              </div>
              <Slider
                value={[transforms.scale]}
                onValueChange={([value]) => onTransformChange({ scale: value })}
                min={0.1}
                max={3}
                step={0.1}
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Projection Distance</Label>
                <span className="text-xs text-gray-400">{transforms.projectionDistance.toFixed(1)}</span>
              </div>
              <Slider
                value={[transforms.projectionDistance]}
                onValueChange={([value]) => onTransformChange({ projectionDistance: value })}
                min={1}
                max={10}
                step={0.1}
              />
            </div>

            <div className="space-y-2">
              <Label className="text-sm font-medium">Manual Rotations</Label>
              <div className="grid grid-cols-2 gap-2 text-xs">
                {Object.entries(rotations).map(([plane, value]) => (
                  <div key={plane} className="space-y-1">
                    <div className="flex justify-between">
                      <span className="uppercase">{plane}</span>
                      <span className="text-gray-400">{((value * 180) / Math.PI).toFixed(0)}°</span>
                    </div>
                    <Slider
                      value={[value]}
                      onValueChange={([newValue]) => {
                        const rotationKey = dimension === 4 ? "rotation4D" : "rotation5D"
                        onTransformChange({
                          [rotationKey]: {
                            ...rotations,
                            [plane]: newValue,
                          },
                        })
                      }}
                      min={-Math.PI}
                      max={Math.PI}
                      step={0.01}
                    />
                  </div>
                ))}
              </div>
            </div>

            <Button onClick={onReset} variant="outline" className="w-full bg-transparent">
              <RotateCcw className="w-4 h-4 mr-2" />
              Reset Transforms
            </Button>
          </TabsContent>

          <TabsContent value="view" className="space-y-4 pt-2">
            <div className="flex items-center justify-between">
              <Label htmlFor="auto-rotate-switch" className="flex items-center gap-2">
                <Play className="w-4 h-4" />
                Auto-Rotate 4D
              </Label>
              <Switch id="auto-rotate-switch" checked={isAutoRotating} onCheckedChange={onAutoRotateChange} />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Animation Speed</Label>
                <span className="text-xs text-gray-400">{animationSpeed.toFixed(1)}x</span>
              </div>
              <Slider
                value={[animationSpeed]}
                onValueChange={([value]) => onAnimationSpeedChange(value)}
                min={0}
                max={2}
                step={0.1}
              />
            </div>

            <div className="flex items-center justify-between font-mono font-medium">
              <Label>Wireframe</Label>
              <Switch checked={wireframe} onCheckedChange={onWireframeChange} />
            </div>

            <div className="flex items-center justify-between">
              <Label>Show Vertices</Label>
              <Switch checked={showVertices} onCheckedChange={onShowVerticesChange} />
            </div>
          </TabsContent>
        </Tabs>
      </CardContent>
    </Card>
  )
}
