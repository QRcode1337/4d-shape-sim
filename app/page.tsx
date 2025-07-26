"use client"

import { useState, useMemo } from "react"
import { Canvas } from "@react-three/fiber"
import { OrbitControls, Stars } from "@react-three/drei"
import { AxesHelper } from "@/lib/three"
import HyperShape from "@/components/hyper-shape"
import ControlPanel from "@/components/control-panel"
import AnimationController from "@/components/animation-controller"
import { useTransformState } from "@/hooks/use-transform-state"

export type ShapeType = "tesseract" | "pentachoron" | "hyperoctahedron" | "simplex5d"

export interface TransformState {
  rotation4D: { xy: number; xz: number; xw: number; yz: number; yw: number; zw: number }
  rotation5D: {
    xy: number
    xz: number
    xw: number
    xv: number
    yz: number
    yw: number
    yv: number
    zw: number
    zv: number
    wv: number
  }
  scale: number
  projectionDistance: number
}


export default function HyperDimensionalVisualizer() {
  const [currentShape, setCurrentShape] = useState<ShapeType>("tesseract")
  const [dimension, setDimension] = useState<4 | 5>(4)
  const { transforms, handleTransformChange, resetTransforms } = useTransformState()
  const [wireframe, setWireframe] = useState(true)
  const [showVertices, setShowVertices] = useState(true)
  const [animationSpeed, setAnimationSpeed] = useState(0.5)
  const [isAutoRotating, setIsAutoRotating] = useState(true)

  const axesHelper = useMemo(() => new AxesHelper(4), [])

  return (
    <div className="w-full h-screen bg-black relative overflow-hidden">
      <Canvas camera={{ position: [0, 0, 8], fov: 75 }} className="absolute inset-0">
        <fog attach="fog" args={["#000", 10, 25]} />
        <Stars radius={100} depth={50} count={7000} factor={5} saturation={0} fade speed={1} />
        <ambientLight intensity={1.2} />
        <directionalLight position={[10, 10, 5]} intensity={1.5} />
        <pointLight position={[-10, -10, -10]} intensity={2} color="#4f46e5" />
        <spotLight position={[10, 10, 10]} angle={0.3} penumbra={1} intensity={2} castShadow />

        <AnimationController
          isAutoRotating={isAutoRotating}
          animationSpeed={animationSpeed}
          transforms={transforms}
          onTransformChange={handleTransformChange}
        />

        <HyperShape
          shapeType={currentShape}
          dimension={dimension}
          transforms={transforms}
          wireframe={wireframe}
          showVertices={showVertices}
        />

        <primitive object={axesHelper} />
        <OrbitControls enablePan={true} enableZoom={true} enableRotate={true} minDistance={2} maxDistance={20} />
      </Canvas>

      <ControlPanel
        currentShape={currentShape}
        dimension={dimension}
        transforms={transforms}
        wireframe={wireframe}
        showVertices={showVertices}
        animationSpeed={animationSpeed}
        isAutoRotating={isAutoRotating}
        onShapeChange={setCurrentShape}
        onDimensionChange={setDimension}
        onTransformChange={handleTransformChange}
        onWireframeChange={setWireframe}
        onShowVerticesChange={setShowVertices}
        onAnimationSpeedChange={setAnimationSpeed}
        onAutoRotateChange={setIsAutoRotating}
        onReset={resetTransforms}
      />


      <div className="absolute top-4 left-4 bg-black/80 backdrop-blur-sm text-white p-4 rounded-lg max-w-sm">
        <h1 className="text-xl font-bold mb-2">Hyperdimensional Visualizer</h1>
        <p className="text-sm text-gray-300 mb-2">Explore {dimension}D geometric shapes projected into 3D space</p>
        <div className="text-xs text-gray-400">
          <div>Shape: {currentShape}</div>
          <div>Auto-Rotation: {isAutoRotating ? "On" : "Off"}</div>
        </div>
      </div>
    </div>
  )
}
