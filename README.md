# Next.js 4D/5D Shape Simulator

This is a Next.js application that allows you to visualize and interact with 4D and 5D geometric shapes (polytopes) projected into 3D space. You can rotate, scale, and animate these shapes to better understand their complex structures.

[![Deployed on Vercel](https://img.shields.io/badge/Deployed%20on-Vercel-black?style=for-the-badge&logo=vercel)](https://vercel.com/qrcode1337s-projects/v0-next-js-4d-shape-simulator)

## Features

- **4D and 5D Shape Visualization:** Explore various polytopes, including:
  - **Tesseract (4D Hypercube):** The 4D analogue of a cube.
  - **Pentachoron (5-cell):** The 4D analogue of a tetrahedron.
  - **Hyperoctahedron (16-cell):** The 4D analogue of an octahedron.
  - **5D Simplex (6-cell):** The 5D analogue of a tetrahedron.
- **Interactive Controls:**
  - Rotate shapes in multiple 4D and 5D planes.
  - Scale the shapes.
  - Adjust the projection distance.
  - Toggle wireframe and vertex visibility.
- **Animation:**
  - Animate the rotation of the shapes.
  - Control the animation speed.
- **Customizable Appearance:**
  - The viewer shades edges and vertices with dynamic colors generated from their positions.
  - Semi-transparent surfaces to better convey volume.

## Getting Started

To run this project locally, follow these steps:

1. **Clone the repository:**
   ```bash
   git clone <repository-url>
   cd <repository-directory>
   ```

2. **Install dependencies:**
   ```bash
   npm install
   ```

3. **Run the development server:**
   ```bash
   npm run dev
   ```

Open [http://localhost:3000](http://localhost:3000) with your browser to see the result.

## Technologies Used

- [Next.js](https://nextjs.org/) - The React framework for production.
- [React](https://reactjs.org/) - A JavaScript library for building user interfaces.
- [three.js](https://threejs.org/) - A 3D graphics library for creating and displaying animated 3D computer graphics in a web browser.
- [react-three-fiber](https://docs.pmnd.rs/react-three-fiber/getting-started/introduction) - A React renderer for three.js.
- [react-three-drei](https://github.com/pmndrs/drei) - A collection of useful helpers and abstractions for react-three-fiber.
- [Tailwind CSS](https://tailwindcss.com/) - A utility-first CSS framework for rapidly building custom designs.
- [TypeScript](https://www.typescriptlang.org/) - A typed superset of JavaScript that compiles to plain JavaScript.

## Visual Interference Patterns

The viewer now shades edges and vertices with dynamic colors generated from
their positions. Sinusoidal interference creates subtle gradients across each
shape, adding depth and variety to the visualization.

## How It Works

