"use client"

import { Card, CardContent, CardHeader, CardTitle } from "@/components/ui/card"
import { Switch } from "@/components/ui/switch"
import { Slider } from "@/components/ui/slider"
import { Label } from "@/components/ui/label"
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from "@/components/ui/select"
import type { CrossSectionState } from "@/app/page"
import { Slice } from "lucide-react"

interface CrossSectionPanelProps {
  crossSection: CrossSectionState
  dimension: 4 | 5
  onChange: (crossSection: Partial<CrossSectionState>) => void
}

export default function CrossSectionPanel({ crossSection, dimension, onChange }: CrossSectionPanelProps) {
  const dimensionLabels = dimension === 4 ? ["X", "Y", "Z", "W"] : ["X", "Y", "Z", "W", "V"]

  return (
    <Card className="absolute bottom-4 right-4 w-80 bg-black/90 backdrop-blur-sm text-white border-gray-700">
      <CardHeader className="pb-3">
        <CardTitle className="flex items-center gap-2">
          <Slice className="w-5 h-5" />
          Cross Sections
        </CardTitle>
      </CardHeader>
      <CardContent className="space-y-4">
        <div className="flex items-center justify-between">
          <Label>Enable Cross Section</Label>
          <Switch checked={crossSection.enabled} onCheckedChange={(enabled) => onChange({ enabled })} />
        </div>

        {crossSection.enabled && (
          <>
            <div className="space-y-2">
              <Label>Slice Dimension</Label>
              <Select
                value={crossSection.dimension.toString()}
                onValueChange={(value) => onChange({ dimension: Number.parseInt(value) })}
              >
                <SelectTrigger className="bg-gray-800 border-gray-600">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent className="bg-gray-800 border-gray-600">
                  {dimensionLabels.map((label, index) => (
                    <SelectItem key={index} value={index.toString()}>
                      {label}-axis
                    </SelectItem>
                  ))}
                </SelectContent>
              </Select>
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Position</Label>
                <span className="text-xs text-gray-400">{crossSection.position.toFixed(2)}</span>
              </div>
              <Slider
                value={[crossSection.position]}
                onValueChange={([value]) => onChange({ position: value })}
                min={-2}
                max={2}
                step={0.01}
                className="w-full"
              />
            </div>

            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label>Thickness</Label>
                <span className="text-xs text-gray-400">{crossSection.thickness.toFixed(2)}</span>
              </div>
              <Slider
                value={[crossSection.thickness]}
                onValueChange={([value]) => onChange({ thickness: value })}
                min={0.01}
                max={0.5}
                step={0.01}
                className="w-full"
              />
            </div>
          </>
        )}
      </CardContent>
    </Card>
  )
}
