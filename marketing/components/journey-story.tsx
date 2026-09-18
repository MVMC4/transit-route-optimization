"use client";

/** Two-stage journey: vertical route reveal followed by a pinned horizontal product walkthrough. */

import Link from "next/link";
import { CSSProperties, useEffect, useRef, useState } from "react";

function phaseProgress(element: HTMLElement | null) {
  if (!element) return 0;
  const rect = element.getBoundingClientRect();
  return Math.max(0, Math.min(1, -rect.top / Math.max(1, element.offsetHeight - window.innerHeight)));
}

export function JourneyStory() {
  const verticalRef = useRef<HTMLDivElement>(null);
  const horizontalRef = useRef<HTMLDivElement>(null);
  const [vertical, setVertical] = useState(0);
  const [horizontal, setHorizontal] = useState(0);

  useEffect(() => {
    let frame = 0;
    const update = () => { setVertical(phaseProgress(verticalRef.current)); setHorizontal(phaseProgress(horizontalRef.current)); };
    const schedule = () => { cancelAnimationFrame(frame); frame = requestAnimationFrame(update); };
    update(); window.addEventListener("scroll", schedule, { passive:true }); window.addEventListener("resize", schedule);
    return () => { cancelAnimationFrame(frame); window.removeEventListener("scroll", schedule); window.removeEventListener("resize", schedule); };
  }, []);

  const verticalIndex = Math.min(3, Math.floor(Math.min(.999, vertical) * 4));
  const horizontalMotion = Math.max(0, Math.min(1, (horizontal - .15) / .85));
  const horizontalIndex = Math.min(3, Math.floor(Math.min(.999, horizontalMotion) * 4));
  const horizontalState = (index: number) => index < horizontalIndex ? "passed" : index === horizontalIndex ? "active" : "upcoming";

  return <section className="journey-story-sequence" id="how-it-works">
    <div className="journey-vertical-phase" ref={verticalRef}>
      <div className="journey-vertical-stage" style={{ "--vertical-progress":vertical } as CSSProperties}>
        <header><p className="section-number">ONE TRIP / FOUR CLEAR STEPS</p><h2>From two places<br />to the right stop.</h2><p>First, follow the route down the page. Each decision appears only when the line reaches it.</p></header>
        <ol className="vertical-route">
          {["Set where you are and where you are going.","Compare the routes that genuinely fit.","Ride one clear road-following corridor.","Improve it with local knowledge."].map((label,index) => <li className={index < verticalIndex ? "passed" : index === verticalIndex ? "active" : "upcoming"} key={label}><i/><span>{String(index + 1).padStart(2,"0")}</span><strong>{label}</strong></li>)}
        </ol>
      </div>
    </div>

    <div className="journey-horizontal-phase" ref={horizontalRef}>
      <div className="journey-horizontal-stage" style={{ "--horizontal-progress":horizontalMotion, "--horizontal-shift":`${horizontalMotion * 60}%` } as CSSProperties}>
        <header className="horizontal-heading"><p className="section-number">NOW SEE EACH STEP</p><h2>The product,<br />in motion.</h2><div className="journey-progress"><span/><b>{String(horizontalIndex + 1).padStart(2,"0")} / 04</b></div></header>
        <div className="journey-track-window"><div className="journey-track">
          <article className={`flow-step flow-lime ${horizontalState(0)}`}><div className="flow-copy"><span>01 / PLACES</span><h3>Start with where you are.</h3><p>Use your location or tap a familiar place. Search or tap the destination—never enter coordinates.</p></div><div className="flow-ui place-ui"><label><small>Your location</small><strong><i className="start-dot"/>Current location</strong><button>Change</button></label><label><small>Destination</small><strong><i className="end-dot"/>Main Mall</strong><button>Change</button></label><div className="flow-ready">Both places set <span>✓</span></div></div></article>
          <article className={`flow-step flow-blue ${horizontalState(1)}`}><div className="flow-copy"><span>02 / COMPARE</span><h3>See routes that make sense.</h3><p>Compare boarding points, walking, time, and transfers. Select one and the other lines step aside.</p></div><div className="flow-ui compare-ui"><header><strong>3 useful options</strong><small>Best match first</small></header><div className="compare-row selected"><i/><p><strong>Broadhurst Route 1</strong><small>180 m walk · direct</small></p><b>18 min</b></div><div className="compare-row"><i/><p><strong>Route 6</strong><small>420 m walk · direct</small></p><b>22 min</b></div><div className="compare-row"><i/><p><strong>BBS transfer</strong><small>2 combis · 1 transfer</small></p><b>31 min</b></div></div></article>
          <article className={`flow-step flow-pink ${horizontalState(2)}`}><div className="flow-copy"><span>03 / RIDE</span><h3>Follow one route, stop by stop.</h3><p>GPS tracks the selected road-following corridor and gives a clear reminder before your stop.</p></div><div className="flow-ui ride-ui"><div className="ride-alert"><small>GET READY</small><strong>Main Mall is next</strong><span>Ask to stop in about 2 min</span></div><ol><li className="passed"><i/>BBS Mall</li><li className="passed"><i/>African Mall</li><li className="current"><i/>Station Road</li><li><i/>Main Mall</li></ol></div></article>
          <article className={`flow-step flow-red ${horizontalState(3)}`}><div className="flow-copy"><span>04 / KEEP IT TRUE</span><h3>Local knowledge improves the map.</h3><p>Riders add tips and route corrections. Builders use the same reviewed network through the documented API.</p></div><div className="flow-ui knowledge-ui"><div><span>COMMUNITY TIP</span><strong>“Ask for the stop just before the rank.”</strong><small>Checked by 12 local riders</small></div><code><b>GET</b> /v1/routes/nearby<br/><span>200 · road-aligned</span></code><Link href="/journal">See how the network is built →</Link></div></article>
        </div></div>
      </div>
    </div>
  </section>;
}
