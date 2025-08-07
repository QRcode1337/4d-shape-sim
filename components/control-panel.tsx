"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Accordion, AccordionContent, AccordionItem, AccordionTrigger } from "@/components/ui/accordion"
import ShapeControls from "./control-panel/shape-controls"
import ViewControls from "./control-panel/view-controls"
import AnimationControls from "./control-panel/animation-controls"
import RotationControls from "./control-panel/rotation-controls"
import type { ShapeType, TransformState } from "@/app/page"

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
  onShowVerticesChange: (showVertices: boolean) => void
  onAnimationSpeedChange: (speed: number) => void
  onAutoRotateChange: (isAutoRotating: boolean) => void
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
  return (
    <Card className="absolute top-4 right-4 bg-black/80 backdrop-blur-sm text-white w-96 max-h-[calc(100vh-2rem)] overflow-y-auto">
      <CardHeader>
        <CardTitle>Controls</CardTitle>
      </CardHeader>
      <CardContent>
        <Accordion type="multiple" defaultValue={["item-1"]}>
          <AccordionItem value="item-1">
            <AccordionTrigger>Shape</AccordionTrigger>
            <AccordionContent>
              <ShapeControls
                currentShape={currentShape}
                onShapeChange={onShapeChange}
                dimension={dimension}
                onDimensionChange={onDimensionChange}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-2">
            <AccordionTrigger>View</AccordionTrigger>
            <AccordionContent>
              <ViewControls
                wireframe={wireframe}
                onWireframeChange={onWireframeChange}
                showVertices={showVertices}
                onShowVerticesChange={onShowVerticesChange}
                transforms={transforms}
                onTransformChange={onTransformChange}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-3">
            <AccordionTrigger>Animation</AccordionTrigger>
            <AccordionContent>
              <AnimationControls
                isAutoRotating={isAutoRotating}
                onAutoRotateChange={onAutoRotateChange}
                animationSpeed={animationSpeed}
                onAnimationSpeedChange={onAnimationSpeedChange}
                onReset={onReset}
              />
            </AccordionContent>
          </AccordionItem>
          <AccordionItem value="item-4">
            <AccordionTrigger>Rotation</AccordionTrigger>
            <AccordionContent>
              <RotationControls
                transforms={transforms}
                onTransformChange={onTransformChange}
                dimension={dimension}
              />
            </AccordionContent>
          </AccordionItem>
        </Accordion>
      </CardContent>
    </Card>
  )
}
