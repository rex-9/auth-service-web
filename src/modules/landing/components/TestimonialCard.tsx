// src/modules/landing/components/TestimonialCard.tsx

import React from "react";
import { ITestimonialItem } from "../types";

export interface ITestimonialCardProps {
  testimonial: ITestimonialItem;
}

export const TestimonialCard: React.FC<ITestimonialCardProps> = ({
  testimonial,
}) => {
  return (
    <article className="font-primary flex flex-col justify-between w-[360px] min-w-[360px] max-w-[380px] h-[380px] flex-none max-[480px]:w-[82vw] max-[480px]:min-w-[280px] max-[480px]:h-[360px] bg-glass-card border border-glass-border rounded-[20px] p-6 backdrop-blur-md transition-all duration-300 hover:-translate-y-1 hover:bg-glass-card-hover hover:border-glass-border-hover hover:shadow-[0_8px_30px_rgba(255,34,56,0.35)] snap-start text-left box-border relative">
      {/* Header with Commenter Name (Clip font), LinkedIn Badge, and Quote Icon */}
      <div className="flex items-start justify-between mb-3.5 flex-shrink-0">
        <div className="flex flex-col gap-0.5">
          <a
            href={testimonial.link}
            target="_blank"
            rel="noopener noreferrer"
            className="font-display text-xl text-glow-white font-normal tracking-wide [text-shadow:0_0_8px_var(--color-glow-white),0_0_16px_var(--color-primary),0_0_24px_var(--color-primary-dark)] hover:text-white hover:[text-shadow:0_0_14px_var(--color-primary-light)] transition-all duration-200 block"
          >
            {testimonial.name}
          </a>
          <span className="text-xs text-white/60 inline-flex items-center gap-1.5 mt-0.5 font-primary">
            <svg
              className="w-3.5 h-3.5 fill-primary-light/85 flex-shrink-0"
              viewBox="0 0 24 24"
              aria-hidden="true"
            >
              <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.25c-.9 0-1.63.73-1.63 1.63s.73 1.63 1.63 1.63 1.63-.73 1.63-1.63-.73-1.63-1.63-1.63Z" />
            </svg>
            LinkedIn Recommendation
          </span>
        </div>
        <svg
          className="w-6 h-6 fill-primary opacity-30 flex-shrink-0 ml-2"
          viewBox="0 0 24 24"
          aria-hidden="true"
        >
          <path d="M14.017 21v-7.391c0-5.704 3.731-9.57 8.983-10.609l.995 2.151c-2.432.917-3.995 3.638-3.995 5.849h4v10h-9.983zm-14.017 0v-7.391c0-5.704 3.748-9.57 9-10.609l.996 2.151c-2.433.917-3.996 3.638-3.996 5.849h3.983v10h-9.983z" />
        </svg>
      </div>

      {/* Recommendation Body with Internal Scroll for long reviews */}
      <div className="flex-1 overflow-y-auto pr-1.5 text-sm leading-relaxed text-[#ded2d5] font-primary my-2 scrollbar-thin scrollbar-thumb-primary/30 hover:scrollbar-thumb-primary scrollbar-track-transparent">
        {testimonial.recommendation}
      </div>

      {/* Footer with View on LinkedIn link */}
      <div className="mt-3 pt-2.5 border-t border-primary/15 flex justify-end items-center flex-shrink-0">
        <a
          href={testimonial.link}
          target="_blank"
          rel="noopener noreferrer"
          className="text-primary-light text-xs font-semibold inline-flex items-center gap-1 hover:text-glow-white hover:[text-shadow:0_0_8px_var(--color-primary)] transition-all duration-200"
        >
          View on LinkedIn
          <svg
            className="w-3 h-3 stroke-current"
            viewBox="0 0 24 24"
            fill="none"
            strokeWidth="2"
            strokeLinecap="round"
            strokeLinejoin="round"
            aria-hidden="true"
          >
            <path d="M18 13v6a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V8a2 2 0 0 1 2-2h6" />
            <polyline points="15 3 21 3 21 9" />
            <line x1="10" y1="14" x2="21" y2="3" />
          </svg>
        </a>
      </div>
    </article>
  );
};
