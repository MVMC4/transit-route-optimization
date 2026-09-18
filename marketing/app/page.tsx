/** Marketing homepage led by a scroll-controlled map and direct product entry points. */

import Link from "next/link";
import { HeroMapSequence } from "../components/hero-map-sequence";
import { DOCS_URL, RIDER_URL } from "../lib/urls";

export default function Home() {
  return (
    <>
      <HeroMapSequence />

      <section className="home-gateway" id="start-here">
        <header>
          <p className="section-number">START HERE</p>
          <h2>One network.<br />Four ways in.</h2>
          <p>
            Whether you are trying to get somewhere, understand the platform, or
            build with the network, the next step should be obvious.
          </p>
        </header>

        <div className="gateway-grid">
          <a className="gateway-card gateway-primary" href={RIDER_URL}>
            <span>01 / RIDE</span><h3>Plan a trip</h3>
            <p>Set two places and compare road-following combi routes.</p>
            <b>Open the rider app →</b>
          </a>
          <Link className="gateway-card" href="/services">
            <span>02 / PRODUCT</span><h3>Explore services</h3>
            <p>See the rider, operations, community, and data tools separately.</p>
            <b>See every service →</b>
          </Link>
          <a className="gateway-card" href={DOCS_URL}>
            <span>03 / DEVELOPERS</span><h3>Read the API</h3>
            <p>Browse endpoint reference, examples, authentication, and responses.</p>
            <b>Open documentation →</b>
          </a>
          <a className="gateway-card" href={`${DOCS_URL}/login`}>
            <span>04 / ACCESS</span><h3>Sign in or register</h3>
            <p>Try the demo, create credentials, and inspect usage from the console.</p>
            <b>Access the console →</b>
          </a>
        </div>

        <div className="build-strip">
          <div><span>BUILD IN PUBLIC</span><h3>Follow the network as it grows.</h3></div>
          <p>Design decisions, route research, shipped changes, and the questions still being worked through.</p>
          <Link href="/journal">Read the build blog →</Link>
        </div>
      </section>

      <section className="closing compact-closing">
        <p>THE FIRST STEP IS STILL THE SIMPLEST</p>
        <h2>Where are you going?</h2>
        <a className="button button-light" href={RIDER_URL}>Choose my destination <span>→</span></a>
      </section>
    </>
  );
}
