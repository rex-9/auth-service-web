// src/design/examples.tsx

/**
 * Rexone Design System - Usage Examples
 *
 * Demonstrates standard Tailwind CSS & DaisyUI class usage with Rexone design tokens
 * and official Design System wrapper components.
 *
 * ⚠️ NEVER use raw HTML `<input>`, `<button>`, `<img>`, `<video>`, `<a>`, or `<textarea>`.
 * Always use Design System components from `src/design/components/`.
 */

import React, { useState } from "react";
import {
  Button,
  TextInput,
  FormContainer,
  Typography,
  Badge,
  Asset,
} from "./components";
import {
  ButtonVariants,
  ComponentSizes,
  TypographyVariants,
} from "./constants";
import { icons } from "../assets";

// ============================================================
// 1. COLORS & THEME SURFACES
// ============================================================

export const ColorExamples = () => {
  return (
    <div className="space-y-6">
      {/* Brand Colors */}
      <div className="space-y-2">
        <Typography
          variant={TypographyVariants.H4}
          className="text-base font-semibold text-base-content"
        >
          Brand Colors
        </Typography>
        <div className="flex gap-4 flex-wrap">
          <div className="bg-primary text-white font-semibold px-4 py-2 rounded-md shadow-sm">
            Primary (Sunset Coral)
          </div>
          <div className="bg-secondary text-white font-semibold px-4 py-2 rounded-md shadow-sm">
            Secondary (Coral Peach)
          </div>
          <div className="bg-accent text-white font-semibold px-4 py-2 rounded-md shadow-sm">
            Accent (Crimson)
          </div>
        </div>
      </div>

      {/* Semantic Colors */}
      <div className="space-y-2">
        <Typography
          variant={TypographyVariants.H4}
          className="text-base font-semibold text-base-content"
        >
          Semantic Colors
        </Typography>
        <div className="flex gap-4 flex-wrap">
          <Badge variant="success">Success</Badge>
          <Badge variant="warning">Warning</Badge>
          <Badge variant="error">Error</Badge>
          <Badge variant="info">Info</Badge>
        </div>
      </div>

      {/* Theme Surfaces */}
      <div className="space-y-2">
        <Typography
          variant={TypographyVariants.H4}
          className="text-base font-semibold text-base-content"
        >
          Theme Base Surfaces
        </Typography>
        <div className="flex gap-4 flex-wrap">
          <div className="bg-base-100 border border-base-300 px-4 py-2 rounded-md text-base-content">
            Base 100 (Canvas)
          </div>
          <div className="bg-base-200 border border-base-300 px-4 py-2 rounded-md text-base-content">
            Base 200 (Surface)
          </div>
          <div className="bg-base-300 border border-base-300 px-4 py-2 rounded-md text-base-content">
            Base 300 (Card)
          </div>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 2. TYPOGRAPHY
// ============================================================

export const TypographyExamples = () => {
  return (
    <div className="space-y-4">
      <Typography
        variant={TypographyVariants.H1}
        className="text-display-l font-display text-base-content"
      >
        Display Large (40px)
      </Typography>
      <Typography
        variant={TypographyVariants.H1}
        className="text-heading-l font-bold text-base-content"
      >
        Heading 1 (28px)
      </Typography>
      <Typography
        variant={TypographyVariants.H2}
        className="text-heading-m font-bold text-base-content"
      >
        Heading 2 (24px)
      </Typography>
      <Typography
        variant={TypographyVariants.H3}
        className="text-heading-s font-semibold text-base-content"
      >
        Heading 3 (20px)
      </Typography>
      <Typography
        variant={TypographyVariants.BODY_L}
        className="text-body-l text-base-content"
      >
        Body Large (16px)
      </Typography>
      <Typography
        variant={TypographyVariants.BODY_M}
        className="text-body-m text-base-content"
      >
        Body Medium (14px)
      </Typography>
      <Typography
        variant={TypographyVariants.CAPTION}
        className="text-caption text-base-content opacity-70"
      >
        Caption (12px)
      </Typography>
    </div>
  );
};

// ============================================================
// 3. TAILWIND SPACING SCALE
// ============================================================

export const SpacingExamples = () => {
  return (
    <div className="space-y-6">
      <div className="space-y-2">
        <Typography
          variant={TypographyVariants.H4}
          className="text-base font-semibold text-base-content"
        >
          Standard Tailwind Spacing Scale (8px Grid)
        </Typography>
        <div className="flex items-center gap-4 flex-wrap text-base-content">
          <div className="bg-primary w-2 h-2 rounded-xs" />
          <span className="text-caption">p-2 / w-2 (8px)</span>
          <div className="bg-primary w-3 h-3 rounded-xs" />
          <span className="text-caption">p-3 / w-3 (12px)</span>
          <div className="bg-primary w-4 h-4 rounded-xs" />
          <span className="text-caption">p-4 / w-4 (16px)</span>
          <div className="bg-primary w-6 h-6 rounded-xs" />
          <span className="text-caption">p-6 / w-6 (24px)</span>
          <div className="bg-primary w-8 h-8 rounded-xs" />
          <span className="text-caption">p-8 / w-8 (32px)</span>
        </div>
      </div>
    </div>
  );
};

// ============================================================
// 4. RADIUS & BUTTONS
// ============================================================

export const ButtonExamples = () => {
  return (
    <div className="space-y-4">
      <Typography
        variant={TypographyVariants.H4}
        className="text-base font-semibold text-base-content"
      >
        Buttons
      </Typography>
      <div className="flex gap-4 flex-wrap items-center">
        <Button variant={ButtonVariants.PRIMARY} size={ComponentSizes.MD}>
          Primary
        </Button>
        <Button variant={ButtonVariants.SECONDARY} size={ComponentSizes.MD}>
          Secondary
        </Button>
        <Button variant={ButtonVariants.TERTIARY} size={ComponentSizes.MD}>
          Tertiary
        </Button>
        <Button
          variant={ButtonVariants.PRIMARY}
          size={ComponentSizes.SM}
          isLoading
        >
          Loading
        </Button>
      </div>
    </div>
  );
};

// ============================================================
// 5. LAWFUL FORM & CARD EXAMPLE
// ============================================================

export const CompletePageExample: React.FC = () => {
  const [email, setEmail] = useState("");

  return (
    <div className="bg-base-100 min-h-screen p-6 sm:p-8 text-base-content flex items-center justify-center">
      <div className="max-w-md w-full">
        <FormContainer title="✨ Rexone ✨">
          <div className="flex justify-center my-2">
            <Asset asset={icons.logo} className="h-12 w-12" />
          </div>
          <Typography
            variant={TypographyVariants.BODY_S}
            className="text-center text-base-content opacity-70 mb-4"
          >
            Unified foundation for modern web & mobile apps.
          </Typography>

          <div className="space-y-4">
            <TextInput
              label="Email Address"
              type="email"
              placeholder="name@example.com"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
            />

            <Button
              variant={ButtonVariants.PRIMARY}
              fullWidth
              onClick={() => alert(`Submitted: ${email}`)}
            >
              Continue
            </Button>
          </div>
        </FormContainer>
      </div>
    </div>
  );
};
