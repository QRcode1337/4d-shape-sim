"use client"

import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import { Label } from "@/components/ui/label"
import type { ShapeType } from "@/app/page"

interface ShapeControlsProps {
  currentShape: ShapeType
  onShapeChange: (shape: ShapeType) => void
  dimension: 4 | 5
  onDimensionChange: (dimension: 4 | 5) => void
}

export default function ShapeControls({
  currentShape,
  onShapeChange,
  dimension,
  onDimensionChange,
}: ShapeControlsProps) {
  return (
    <div className="grid gap-2">
      <Label htmlFor="shape-select">Shape</Label>
      <Select value={currentShape} onValueChange={(value) => onShapeChange(value as ShapeType)}>
        <SelectTrigger id="shape-select">
          <SelectValue placeholder="Select shape" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="tesseract">Tesseract</SelectItem>
          <SelectItem value="pentachoron">Pentachoron</SelectItem>
          <SelectItem value="hyperoctahedron">Hyperoctahedron</SelectItem>
          <SelectItem value="simplex5d">5D Simplex</SelectItem>
        </SelectContent>
      </Select>
      <Label htmlFor="dimension-select">Dimension</Label>
      <Select value={String(dimension)} onValueChange={(value) => onDimensionChange(Number(value) as 4 | 5)}>
        <SelectTrigger id="dimension-select">
          <SelectValue placeholder="Select dimension" />
        </SelectTrigger>
        <SelectContent>
          <SelectItem value="4">4D</SelectItem>
          <SelectItem value="5">5D</SelectItem>
        </SelectContent>
      </Select>
    </div>
  )
}
