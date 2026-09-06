// src/modules/landing/components/NeonSign.tsx

import React from "react";

export interface INeonSignProps {
  id?: string;
  className?: string;
}

export const NeonSign: React.FC<INeonSignProps> = ({
  id = "Greetings",
  className = "",
}) => {
  return (
    <section
      id={id}
      className={`flex justify-center items-center w-full max-w-xl min-h-48 sm:min-h-56 mx-auto my-12 tracking-widest select-none uppercase font-display text-6xl sm:text-8xl md:text-9xl leading-none text-center text-glow-white animate-hero-sign [text-shadow:0_0_7px_var(--color-glow-white),0_0_10px_var(--color-glow-white),0_0_21px_var(--color-glow-white),0_0_42px_var(--color-primary),0_0_82px_var(--color-primary),0_0_92px_var(--color-primary),0_0_102px_var(--color-primary),0_0_151px_var(--color-primary)] ${className}`}
      style={{
        backgroundImage: `radial-gradient(ellipse 65% 55% at 50% 50%, rgba(92, 9, 22, 0.85), transparent 70%)`,
      }}
    >
      <span className="animate-fast-flicker-char">r</span>
      <span>e</span>
      <span className="animate-flicker-char">x</span>
      <span>9</span>
    </section>
  );
};
