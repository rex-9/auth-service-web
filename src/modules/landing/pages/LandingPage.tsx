// src/design/pages/LandingPage.tsx

import React, { useEffect, useState } from "react";
import { LANDING_DATA } from "../constants";
import {
  LandingNav,
  NeonSign,
  SocialProfiles,
  SkillCard,
  ProjectCard,
  TestimonialCard,
  ContactForm,
} from "../components";
import { Button } from "../../../design/components/button";
import { ButtonVariants, ComponentSizes } from "../../../design/constants";
import { images, iconsLib } from "../../../assets";

export const LandingPage: React.FC = () => {
  const [activeSection, setActiveSection] = useState("#Greetings");
  const [activeTestimonialIdx, setActiveTestimonialIdx] = useState(0);
  const testimonialsTrackRef = React.useRef<HTMLDivElement>(null);

  const getTestimonialsScrollStep = () => {
    if (!testimonialsTrackRef.current) return 380;
    const firstCard = testimonialsTrackRef.current.querySelector("article");
    return firstCard ? firstCard.offsetWidth + 20 : 380;
  };

  const handlePrevTestimonial = () => {
    if (testimonialsTrackRef.current) {
      testimonialsTrackRef.current.scrollBy({
        left: -getTestimonialsScrollStep(),
        behavior: "smooth",
      });
    }
  };

  const handleNextTestimonial = () => {
    if (testimonialsTrackRef.current) {
      testimonialsTrackRef.current.scrollBy({
        left: getTestimonialsScrollStep(),
        behavior: "smooth",
      });
    }
  };

  const handleTestimonialDotClick = (index: number) => {
    if (testimonialsTrackRef.current) {
      const cards = testimonialsTrackRef.current.querySelectorAll("article");
      if (cards[index]) {
        cards[index].scrollIntoView({
          behavior: "smooth",
          block: "nearest",
          inline: "start",
        });
      }
    }
  };

  const handleTestimonialsScroll = () => {
    if (!testimonialsTrackRef.current) return;
    const scrollLeft = testimonialsTrackRef.current.scrollLeft;
    const step = getTestimonialsScrollStep();
    const idx = Math.min(
      Math.round(scrollLeft / step),
      LANDING_DATA.testimonials.length - 1
    );
    setActiveTestimonialIdx(Math.max(0, idx));
  };

  // Track active section on scroll
  useEffect(() => {
    const handleScroll = () => {
      const sections = [
        "Greetings",
        "Skills",
        "Projects",
        "Testimonials",
        "Contact",
      ];
      const scrollPosition = window.scrollY + 200;

      for (const sectionId of sections) {
        const el = document.getElementById(sectionId);
        if (el) {
          const top = el.offsetTop;
          const height = el.offsetHeight;
          if (scrollPosition >= top && scrollPosition < top + height) {
            setActiveSection(`#${sectionId}`);
            break;
          }
        }
      }
    };

    window.addEventListener("scroll", handleScroll, { passive: true });
    return () => window.removeEventListener("scroll", handleScroll);
  }, []);

  const handleScrollToSection = (sectionId: string) => {
    const el = document.querySelector(sectionId);
    if (el) {
      el.scrollIntoView({ behavior: "smooth" });
    }
  };

  const skillCategoryTitles: Record<string, string> = {
    languages: "Languages",
    frontend: "Frontend",
    backend: "Backend & APIs",
    mobile: "Mobile & Cross-Platform",
    database: "Database & Caching",
    tools: "DevOps, Cloud & AI",
  };

  // Enforce dark mode on landing page
  useEffect(() => {
    const prevTheme = document.documentElement.getAttribute("data-theme");
    document.documentElement.setAttribute("data-theme", "night");
    return () => {
      if (prevTheme) {
        document.documentElement.setAttribute("data-theme", prevTheme);
      }
    };
  }, []);

  return (
    <div
      data-page="landing"
      data-theme="night"
      className="min-h-screen w-full text-glow-white font-primary selection:bg-primary selection:text-white bg-repeat bg-fixed"
      style={{
        backgroundImage: `url(${images.darkBrickWall.src})`,
        cursor: `url(${images.spotCursor.src}) 15 15, auto`,
      }}
    >
      <style>{`
        [data-page="landing"],
        [data-page="landing"] a,
        [data-page="landing"] button,
        [data-page="landing"] input,
        [data-page="landing"] textarea,
        [data-page="landing"] select {
          cursor: url(${images.spotCursor.src}) 15 15, auto !important;
        }
      `}</style>

      {/* 1. Navigation */}
      <LandingNav
        activeSection={activeSection}
        onSectionClick={handleScrollToSection}
      />

      <main className="max-w-7xl mx-auto px-4 sm:px-6 md:px-8">
        {/* 2. Hero Sign ("rex9") */}
        <NeonSign id="Greetings" />

        {/* 3. Catchphrase & Social Profiles */}
        <section className="text-center max-w-4xl mx-auto my-8 space-y-3 text-base sm:text-lg text-white leading-relaxed font-display font-normal tracking-wide [text-shadow:0_0_8px_var(--color-glow-white),0_0_20px_var(--color-primary),0_0_40px_var(--color-primary-dark)]">
          <p>Champion, welcome! 🌟</p>
          <p>
            I am a battle-hardened Full-Stack Architect with a mind sharpened by
            meditation. 🧘‍♂️💻
          </p>
          <p>
            Forging digital realms where clarity meets code, and simplicity
            meets soul. ✨
          </p>
          <p>
            Carving seamless paths where beauty and strength walk side by side.
            ⚔️🌿
          </p>
          <p>
            Let's shape thy vision into reality with purpose, and a touch of
            magic! 🚀
          </p>
        </section>

        {/* Social Profiles Row */}
        <SocialProfiles profiles={LANDING_DATA.profiles} />

        {/* Down Arrow Button */}
        <div className="flex justify-center my-8 animate-down-bounce">
          <Button
            variant={ButtonVariants.TERTIARY}
            aria-label="Scroll to skills"
            onClick={() => handleScrollToSection("#Skills")}
            className="!w-10 !h-10 !p-0 rounded-full border border-primary text-primary hover:!text-white hover:!border-primary-light hover:!shadow-neon transition-all duration-300 drop-shadow-[0_0_8px_var(--color-primary)]"
          >
            <iconsLib.chevronDown className="w-5 h-5" />
          </Button>
        </div>

        {/* 4. Skills Section */}
        <section id="Skills" className="py-12 scroll-mt-20">
          <div className="text-center mb-9">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-wide text-glow-white [text-shadow:0_0_8px_var(--color-glow-white),0_0_20px_var(--color-primary),0_0_40px_var(--color-primary-dark)]">
              Skills
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-5 md:gap-6">
            {Object.entries(LANDING_DATA.skills).map(([key, items]) => (
              <SkillCard
                key={key}
                title={skillCategoryTitles[key] || key}
                items={items}
              />
            ))}
          </div>
        </section>

        {/* 5. Projects Section */}
        <section id="Projects" className="py-12 scroll-mt-20">
          <div className="text-center mb-9">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-wide text-glow-white [text-shadow:0_0_8px_var(--color-glow-white),0_0_20px_var(--color-primary),0_0_40px_var(--color-primary-dark)]">
              My Recent Works
            </h2>
          </div>

          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6 md:gap-7">
            {LANDING_DATA.projects.map((project) => (
              <ProjectCard key={project.id} project={project} />
            ))}
          </div>
        </section>

        {/* 6. Testimonials Section */}
        <section id="Testimonials" className="py-12 scroll-mt-20">
          <div className="text-center mb-9">
            <h2 className="font-display text-3xl sm:text-4xl md:text-5xl font-normal tracking-wide text-glow-white [text-shadow:0_0_8px_var(--color-glow-white),0_0_20px_var(--color-primary),0_0_40px_var(--color-primary-dark)]">
              Testimonials
            </h2>
          </div>

          <div className="relative flex items-center max-w-7xl mx-auto px-2 sm:px-4">
            {/* Left Carousel Arrow */}
            <button
              type="button"
              aria-label="Previous Testimonial"
              onClick={handlePrevTestimonial}
              className="hidden sm:flex absolute -left-2 md:-left-4 z-10 w-11 h-11 rounded-full bg-glass-nav border border-glass-border text-glow-white items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-glass-card-hover hover:border-glass-border-hover hover:text-primary-light hover:shadow-[0_0_15px_rgba(255,34,56,0.6),0_0_30px_rgba(255,34,56,0.25)] active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer"
            >
              <iconsLib.chevronLeft className="w-5 h-5 stroke-[2.5]" />
            </button>

            {/* Carousel Cards Track */}
            <div
              ref={testimonialsTrackRef}
              onScroll={handleTestimonialsScroll}
              className="flex overflow-x-auto gap-5 py-5 w-full scroll-smooth snap-x snap-mandatory scrollbar-thin scrollbar-thumb-primary/30 hover:scrollbar-thumb-primary scrollbar-track-transparent px-1"
            >
              {LANDING_DATA.testimonials.map((testimonial, idx) => (
                <TestimonialCard key={idx} testimonial={testimonial} />
              ))}
            </div>

            {/* Right Carousel Arrow */}
            <button
              type="button"
              aria-label="Next Testimonial"
              onClick={handleNextTestimonial}
              className="hidden sm:flex absolute -right-2 md:-right-4 z-10 w-11 h-11 rounded-full bg-glass-nav border border-glass-border text-glow-white items-center justify-center backdrop-blur-md transition-all duration-300 hover:scale-110 hover:bg-glass-card-hover hover:border-glass-border-hover hover:text-primary-light hover:shadow-[0_0_15px_rgba(255,34,56,0.6),0_0_30px_rgba(255,34,56,0.25)] active:scale-95 shadow-[0_4px_20px_rgba(0,0,0,0.5)] cursor-pointer"
            >
              <iconsLib.chevronRight className="w-5 h-5 stroke-[2.5]" />
            </button>
          </div>

          {/* Dots Indicator */}
          <div className="flex justify-center items-center gap-2 mt-4">
            {LANDING_DATA.testimonials.map((_, i) => (
              <button
                key={i}
                type="button"
                aria-label={`Go to testimonial ${i + 1}`}
                onClick={() => handleTestimonialDotClick(i)}
                className={`h-2 rounded-full transition-all duration-300 cursor-pointer ${
                  activeTestimonialIdx === i
                    ? "w-6 bg-primary shadow-[0_0_10px_var(--color-primary)] scale-110"
                    : "w-2 bg-primary/25 hover:bg-primary/50"
                }`}
              />
            ))}
          </div>
        </section>

        {/* 7. Contact & Resume Section */}
        <section id="Contact" className="py-12 scroll-mt-20">
          <div className="flex flex-col lg:flex-row items-center justify-between gap-9">
            {/* Left Contact Text & Resume Button */}
            <div className="w-full lg:w-1/2 text-center lg:text-left space-y-6">
              <div className="font-display text-xl sm:text-2xl md:text-3xl leading-relaxed font-normal text-glow-white [text-shadow:0_0_8px_var(--color-glow-white),0_0_20px_var(--color-primary),0_0_40px_var(--color-primary-dark)]">
                I'm always interested in hearing about new projects,
                <br className="hidden sm:inline" /> so if you'd like to chat,
                please kindly get in touch with me.
              </div>

              <div className="resumeBox text-center lg:text-left pt-6">
                <a
                  href={LANDING_DATA.cvUrl}
                  target="_blank"
                  rel="noopener noreferrer"
                >
                  <Button
                    variant={ButtonVariants.NEON}
                    size={ComponentSizes.LG}
                    className="!py-3 !px-7 !text-lg tracking-wide font-bold"
                  >
                    View / Download my Resume 📄
                  </Button>
                </a>
              </div>
            </div>

            {/* Right Contact Form */}
            <div className="w-full lg:w-1/2 flex justify-center lg:justify-end">
              <ContactForm />
            </div>
          </div>

          {/* Divider matching Rex9 */}
          <div className="w-4/5 max-w-5xl h-px mx-auto my-9 bg-gradient-to-r from-transparent via-primary to-transparent shadow-[0_0_6px_rgba(255,94,98,0.3)]" />

          {/* Footer Social Profiles */}
          <footer className="text-center">
            <SocialProfiles profiles={LANDING_DATA.profiles} />
            <p className="text-xs text-white/50 font-medium">
              © {new Date().getFullYear()} Rex9. Engineered with Soul & Clarity.
            </p>
          </footer>
        </section>
      </main>
    </div>
  );
};
