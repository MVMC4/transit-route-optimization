"use client";

/** Scroll-controlled hero where the route map grows from a split view to a full-screen product moment. */

import { CSSProperties, useEffect, useRef, useState } from "react";
import { RIDER_URL } from "../lib/urls";
import { HeroRouteDemo } from "./hero-route-demo";

const range = (value: number, start: number, end: number) =>
  Math.max(0, Math.min(1, (value - start) / (end - start)));

const ease = (value: number) => 1 - Math.pow(1 - value, 3);

export function HeroMapSequence() {
  const sectionRef = useRef<HTMLElement>(null);
  const [progress, setProgress] = useState(0);

  useEffect(() => {
    let frame = 0;

    const update = () => {
      const section = sectionRef.current;
      if (!section) return;

      const rect = section.getBoundingClientRect();
      const distance = Math.max(1, section.offsetHeight - window.innerHeight);
      setProgress(Math.max(0, Math.min(1, -rect.top / distance)));
    };

    const schedule = () => {
      cancelAnimationFrame(frame);
      frame = requestAnimationFrame(update);
    };

    update();
    window.addEventListener("scroll", schedule, { passive: true });
    window.addEventListener("resize", schedule);

    return () => {
      cancelAnimationFrame(frame);
      window.removeEventListener("scroll", schedule);
      window.removeEventListener("resize", schedule);
    };
  }, []);

  const expand = ease(range(progress, 0.08, 0.42));
  const introOpacity = 1 - range(progress, 0.1, 0.3);
  const storyIn = ease(range(progress, 0.43, 0.58));
  const storyOpacity = Math.min(storyIn, 1 - range(progress, 0.73, 0.86));
  const wash = ease(range(progress, 0.8, 0.98));
  const style = {
    "--map-expand": expand,
    "--intro-opacity": introOpacity,
    "--story-opacity": storyOpacity,
    "--story-rise": `${(1 - storyIn) * 90}px`,
    "--map-wash": wash,
  } as CSSProperties;

  return (
    <section className="hero-map-sequence" ref={sectionRef} style={style}>
      <div className="hero-sequence-stage">
        <div className="sequence-intro">
          <p className="eyebrow"><span /> Built with Gaborone, route by route</p>
          <h1>Know which combi<br />gets you there.</h1>
          <p>
            Choose where you are and where you&apos;re going. Tsela finds the route,
            boarding point, and right stop.
          </p>
          <div>
            <a className="button button-primary" href={RIDER_URL}>Plan my trip <span>→</span></a>
            <a className="text-link" href="#start-here">Explore Tsela <span>↓</span></a>
          </div>
        </div>

        <div className="sequence-map">
          <HeroRouteDemo />
        </div>

        <div className="sequence-story">
          <p>ONE CLEAR ROUTE</p>
          <h2>Two places.<br />The right stop.</h2>
          <span>The line follows the road. The guidance follows your journey.</span>
        </div>

        <div className="sequence-wash" />
        <div className="sequence-progress" aria-hidden="true"><span /><i /></div>
      </div>
    </section>
  );
}
