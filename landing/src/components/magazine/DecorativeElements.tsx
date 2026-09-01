import React from "react";
import { DECOR_VIEWBOX } from "./sheet";

interface ConcentricCirclesProps {
  x: number;
  y: number;
  maxRadius: number;
  count?: number;
  color?: string;
  opacity?: number;
}

export function ConcentricCircles({
  x,
  y,
  maxRadius,
  count = 5,
  color = "#00B4D8",
  opacity = 0.12,
}: ConcentricCirclesProps) {
  const circles = Array.from({ length: count }, (_, i) => {
    const r = maxRadius * ((i + 1) / count);
    return (
      <circle
        key={i}
        cx={x}
        cy={y}
        r={r}
        fill="none"
        stroke={color}
        strokeWidth={0.8}
        opacity={opacity * (1 - (i / count) * 0.5)}
      />
    );
  });

  return <g>{circles}</g>;
}

interface GradientCircleProps {
  cx: number;
  cy: number;
  r: number;
  color1?: string;
  color2?: string;
  opacity?: number;
  id: string;
}

export function GradientCircle({
  cx,
  cy,
  r,
  color1 = "#00B4D8",
  color2 = "#0096C7",
  opacity = 0.15,
  id,
}: GradientCircleProps) {
  return (
    <>
      <defs>
        <radialGradient id={`grad-${id}`} cx="50%" cy="50%" r="50%">
          <stop offset="0%" stopColor={color1} stopOpacity={opacity} />
          <stop offset="100%" stopColor={color2} stopOpacity={0} />
        </radialGradient>
      </defs>
      <circle cx={cx} cy={cy} r={r} fill={`url(#grad-${id})`} />
    </>
  );
}

interface CornerDecorationProps {
  position: "top-left" | "top-right" | "bottom-left" | "bottom-right";
  size?: number;
  color?: string;
}

export function CornerDecoration({
  position,
  size = 80,
  color = "#00B4D8",
}: CornerDecorationProps) {
  const positions = {
    "top-left": { x: 0, y: 0, arc: "M 0 0 L 40 0 A 40 40 0 0 0 0 40 Z" },
    "top-right": {
      x: DECOR_VIEWBOX.w - size,
      y: 0,
      arc: `M ${size} 0 L ${size} ${size * 0.5} A ${size * 0.5} ${size * 0.5} 0 0 0 ${size * 0.5} 0 Z`,
    },
    "bottom-left": {
      x: 0,
      y: DECOR_VIEWBOX.h - size,
      arc: `M 0 ${size} L ${size * 0.5} ${size} A ${size * 0.5} ${size * 0.5} 0 0 0 0 ${size * 0.5} Z`,
    },
    "bottom-right": {
      x: DECOR_VIEWBOX.w - size,
      y: DECOR_VIEWBOX.h - size,
      arc: `M ${size} ${size} L ${size} ${size * 0.5} A ${size * 0.5} ${size * 0.5} 0 0 1 ${size * 0.5} ${size} Z`,
    },
  };

  const pos = positions[position];

  return (
    <g transform={`translate(${pos.x}, ${pos.y})`} opacity={0.08}>
      <path d={pos.arc} fill={color} />
      <ConcentricCircles
        x={position.includes("left") ? 0 : size}
        y={position.includes("top") ? 0 : size}
        maxRadius={size * 0.6}
        count={4}
        color={color}
        opacity={0.2}
      />
    </g>
  );
}

interface AccentLineProps {
  x1: number;
  y1: number;
  x2: number;
  y2: number;
  color?: string;
  width?: number;
  opacity?: number;
}

export function AccentLine({
  x1,
  y1,
  x2,
  y2,
  color = "#00B4D8",
  width = 2,
  opacity = 0.6,
}: AccentLineProps) {
  return (
    <line
      x1={x1}
      y1={y1}
      x2={x2}
      y2={y2}
      stroke={color}
      strokeWidth={width}
      opacity={opacity}
      strokeLinecap="round"
    />
  );
}

interface GeometricDotsProps {
  x: number;
  y: number;
  rows?: number;
  cols?: number;
  spacing?: number;
  dotSize?: number;
  color?: string;
  opacity?: number;
}

export function GeometricDots({
  x,
  y,
  rows = 3,
  cols = 5,
  spacing = 12,
  dotSize = 1.5,
  color = "#00B4D8",
  opacity = 0.2,
}: GeometricDotsProps) {
  const dots: React.ReactElement[] = [];
  for (let r = 0; r < rows; r++) {
    for (let c = 0; c < cols; c++) {
      dots.push(
        <circle
          key={`${r}-${c}`}
          cx={x + c * spacing}
          cy={y + r * spacing}
          r={dotSize}
          fill={color}
          opacity={opacity}
        />,
      );
    }
  }
  return <g>{dots}</g>;
}
