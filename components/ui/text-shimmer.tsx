"use client";

import { motion } from "motion/react";
import React, { type JSX, useMemo, memo } from "react";

export type TextShimmerProps = {
  children: string;
  as?: React.ElementType;
  className?: string;
  duration?: number;
  spread?: number;
};

function TextShimmerComponent({
  children,
  as: Component = "p",
  className,
  duration = 2,
  spread = 2,
}: TextShimmerProps) {
  const MotionComponent = motion.create(
    Component as keyof JSX.IntrinsicElements
  );

  const dynamicSpread = useMemo(
    () => children.length * spread,
    [children, spread]
  );

  return (
    <MotionComponent
      animate={{ backgroundPosition: "0% center" }}
      initial={{ backgroundPosition: "100% center" }}
      transition={{
        repeat: Infinity,
        duration,
        ease: "linear",
      }}
      className={className}
      style={
        {
          "--spread": `${dynamicSpread}px`,
          backgroundImage:
            "linear-gradient(90deg, transparent calc(50% - var(--spread)), var(--shimmer-color, rgba(246,184,132,0.9)) 50%, transparent calc(50% + var(--spread))), linear-gradient(var(--base-color, rgba(195,219,227,0.55)), var(--base-color, rgba(195,219,227,0.55)))",
          backgroundSize: "250% 100%, auto",
          backgroundRepeat: "no-repeat, padding-box",
          WebkitBackgroundClip: "text",
          backgroundClip: "text",
          WebkitTextFillColor: "transparent",
          color: "transparent",
          display: "inline-block",
        } as React.CSSProperties
      }
    >
      {children}
    </MotionComponent>
  );
}

export const TextShimmer = memo(TextShimmerComponent);
