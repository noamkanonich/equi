"use client";

import dynamic from "next/dynamic";
import styled, { useTheme } from "styled-components";
import { useReducedMotion } from "framer-motion";

type ShaderBackdropProps = {
  color1: string;
  color2: string;
  color3: string;
};

const ShaderBackdrop = dynamic(
  async () => {
    const { ShaderGradientCanvas, ShaderGradient } =
      await import("@shadergradient/react");

    const ShaderBackdropComponent = ({
      color1,
      color2,
      color3,
    }: ShaderBackdropProps) => (
      <ShaderGradientCanvas
        fov={45}
        pixelDensity={1}
        pointerEvents="none"
        style={{
          height: "100%",
          inset: 0,
          position: "absolute",
          width: "100%",
        }}
      >
        <ShaderGradient
          animate="on"
          brightness={1.2}
          cAzimuthAngle={170}
          cDistance={4.4}
          cPolarAngle={70}
          cameraZoom={1}
          color1={color1}
          color2={color2}
          color3={color3}
          envPreset="city"
          grain="off"
          lightType="3d"
          positionX={0}
          positionY={0.9}
          positionZ={-0.3}
          range="disabled"
          rangeEnd={40}
          rangeStart={0}
          reflection={0.1}
          rotationX={45}
          rotationY={0}
          rotationZ={0}
          shader="defaults"
          type="waterPlane"
          uAmplitude={0}
          uDensity={1.2}
          uFrequency={0}
          uSpeed={0.03}
          uStrength={2.5}
          uTime={0}
          wireframe={false}
        />
      </ShaderGradientCanvas>
    );

    return ShaderBackdropComponent;
  },
  {
    loading: () => null,
    ssr: false,
  },
);

export const GradientBackground = () => {
  const prefersReducedMotion = useReducedMotion();
  const theme = useTheme();

  return (
    <BackgroundLayer aria-hidden>
      <StaticGlow />
      {prefersReducedMotion ? null : (
        <ShaderBackdrop
          color1={theme.colors.status.positiveSoft}
          color2={theme.colors.chart.cyan}
          color3={theme.colors.background.card}
        />
      )}
    </BackgroundLayer>
  );
};

const BackgroundLayer = styled.div`
  position: fixed;
  inset: 0;
  z-index: 0;
  pointer-events: none;
  overflow: hidden;
`;

const StaticGlow = styled.div`
  position: absolute;
  inset: 0;
  background:
    radial-gradient(
      circle at 72% 12%,
      color-mix(
        in srgb,
        ${({ theme }) => theme.colors.chart.cyan} 16%,
        transparent
      ),
      transparent 34rem
    ),
    linear-gradient(
      145deg,
      color-mix(
        in srgb,
        ${({ theme }) => theme.colors.brand.primarySoft} 56%,
        transparent
      ),
      transparent 54%
    );
  opacity: 0.72;
`;
