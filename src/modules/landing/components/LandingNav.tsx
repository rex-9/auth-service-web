// src/modules/landing/components/LandingNav.tsx

import React, { useState } from "react";
import { icons, iconsLib } from "../../../assets";
import { useAuth } from "../../../contexts";
import { useNavigate } from "react-router-dom";
import AppRoutes from "../../../AppRoutes";
import { DialogAuthSteps } from "../../../modules/auth";
import {
  Asset,
  Button,
  ButtonVariants,
  ComponentSizes,
  TextLink,
} from "../../../design";

export interface ILandingNavProps {
  activeSection?: string;
  onSectionClick?: (sectionId: string) => void;
}

export const LandingNav: React.FC<ILandingNavProps> = ({
  activeSection = "#Greetings",
  onSectionClick,
}) => {
  const { isAuthenticated } = useAuth();
  const navigate = useNavigate();
  const [isMobileMenuOpen, setIsMobileMenuOpen] = useState(false);
  const currentSection = activeSection;

  const navItems = [
    { label: "Greetings", href: "#Greetings" },
    { label: "Skills", href: "#Skills" },
    { label: "Projects", href: "#Projects" },
    { label: "Testimonials", href: "#Testimonials" },
    { label: "Contact", href: "#Contact" },
  ];

  const handleNavClick = (
    e: React.MouseEvent<HTMLAnchorElement | HTMLButtonElement>,
    href: string,
  ) => {
    e.preventDefault();
    setIsMobileMenuOpen(false);
    if (onSectionClick) {
      onSectionClick(href);
    } else {
      const el = document.querySelector(href);
      if (el) {
        el.scrollIntoView({ behavior: "smooth" });
      }
    }
  };

  const handleEnterClick = () => {
    setIsMobileMenuOpen(false);
    if (isAuthenticated) {
      navigate(AppRoutes.client.protected.HOME);
    } else {
      navigate(AppRoutes.buildDialogUrl(DialogAuthSteps.INITIAL));
    }
  };

  return (
    <header className="sticky top-0 z-50 w-full bg-glass-nav backdrop-blur-xl border-b border-glass-border transition-all duration-300">
      <div className="max-w-6xl mx-auto h-16 sm:h-20 px-5 flex items-center justify-between">
        {/* Desktop Navigation */}
        <nav className="hidden md:flex items-center justify-between w-full">
          {/* Left: Brand Logo & Wordmark */}
          <TextLink
            href="#Greetings"
            onClick={(e) => handleNavClick(e, "#Greetings")}
            className="flex items-center gap-3 no-underline select-none group !text-white hover:no-underline"
            aria-label="Rexone Home"
          >
            <Asset
              asset={icons.logo}
              className="h-9 w-9 shrink-0 select-none transition-transform duration-300 group-hover:scale-105 drop-shadow-[0_0_10px_rgba(225,29,72,0.6)]"
            />
            <span className="font-display text-2xl font-bold tracking-wider text-white [text-shadow:0_0_8px_var(--color-glow-white),0_0_16px_var(--color-primary)]">
              Rexone
            </span>
          </TextLink>

          {/* Middle: Navigation Links */}
          <div className="flex items-center space-x-7 font-display text-xl tracking-wider text-white">
            {navItems.map((item) => {
              const isActive = currentSection === item.href;
              return (
                <TextLink
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`transition-all duration-300 hover:no-underline ${
                    isActive
                      ? "!text-white font-bold [text-shadow:0_0_6px_var(--color-glow-white),0_0_12px_var(--color-primary),0_0_20px_var(--color-primary-dark),0_0_30px_var(--color-glow-outer)]"
                      : "!text-white/65 hover:!text-white hover:[text-shadow:0_0_6px_var(--color-glow-white),0_0_12px_var(--color-primary),0_0_16px_var(--color-primary-dark),0_0_22px_var(--color-glow-outer)]"
                  }`}
                >
                  {item.label}
                </TextLink>
              );
            })}
          </div>

          {/* Right: Enter Button */}
          <Button
            variant={ButtonVariants.PRIMARY}
            size={ComponentSizes.LG}
            onClick={handleEnterClick}
          >
            Enter
          </Button>
        </nav>

        {/* Mobile Navigation Header */}
        <div className="flex md:hidden items-center justify-between w-full h-full">
          {/* Left: Brand Logo & Title */}
          <TextLink
            href="#Greetings"
            onClick={(e) => handleNavClick(e, "#Greetings")}
            className="flex items-center gap-2.5 no-underline select-none !text-white hover:no-underline"
            aria-label="Rexone Home"
          >
            <Asset
              asset={icons.logo}
              className="h-8 w-8 shrink-0 select-none drop-shadow-[0_0_8px_rgba(225,29,72,0.6)]"
            />
            <span className="font-display text-xl font-bold tracking-wider text-white [text-shadow:0_0_6px_var(--color-glow-white),0_0_12px_var(--color-primary)]">
              Rexone
            </span>
          </TextLink>

          {/* Right: Enter & Toggle */}
          <div className="flex items-center gap-2">
            <Button
              variant={ButtonVariants.PRIMARY}
              size={ComponentSizes.SM}
              onClick={handleEnterClick}
              className="!py-1 !px-4 text-xs font-primary"
            >
              Enter
            </Button>

            <Button
              variant={ButtonVariants.TERTIARY}
              aria-label={isMobileMenuOpen ? "Close Menu" : "Open Menu"}
              onClick={() => setIsMobileMenuOpen(!isMobileMenuOpen)}
              className="!p-1 text-white !bg-transparent border-0 shadow-none hover:!bg-transparent focus:outline-none"
            >
              {isMobileMenuOpen ? (
                <iconsLib.close className="w-8 h-8 text-primary drop-shadow-[0_0_8px_var(--color-primary)]" />
              ) : (
                <iconsLib.menu className="w-8 h-8 text-primary drop-shadow-[0_0_8px_var(--color-primary)]" />
              )}
            </Button>
          </div>
        </div>
      </div>

      {/* Mobile Menu Dropdown */}
      {isMobileMenuOpen && (
        <div className="md:hidden bg-glass-nav backdrop-blur-2xl border-b border-glass-border-hover py-4 px-6">
          <div className="flex flex-col space-y-4 text-center font-display text-xl">
            {navItems.map((item) => {
              const isActive = currentSection === item.href;
              return (
                <TextLink
                  key={item.href}
                  href={item.href}
                  onClick={(e) => handleNavClick(e, item.href)}
                  className={`py-2 transition-all duration-300 hover:no-underline ${
                    isActive
                      ? "!text-white font-bold [text-shadow:0_0_6px_var(--color-glow-white),0_0_12px_var(--color-primary),0_0_20px_var(--color-primary-dark),0_0_30px_var(--color-glow-outer)]"
                      : "!text-white/70 hover:!text-white"
                  }`}
                >
                  {item.label}
                </TextLink>
              );
            })}
          </div>
        </div>
      )}
    </header>
  );
};
