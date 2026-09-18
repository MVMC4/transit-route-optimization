import Link from "next/link";

const riderSteps = [
  { index: "01", title: "Pin your area", description: "Choose any place in Gaborone directly on the map.", meta: "Locate" },
  { index: "02", title: "See nearby combis", description: "Find mapped corridors and the closest known stop within your radius.", meta: "Discover" },
  { index: "03", title: "Plan the journey", description: "Set an origin and destination to compare the clearest transit path.", meta: "Move" },
];

export default function HomePage() {
  return (
    <div className="page-container overview-page">
      <section className="overview-hero">
        <div className="overview-copy">
          <span className="page-eyebrow">Gaborone transit intelligence</span>
          <h1>See the network.<br />Shape the route.</h1>
          <p>
            One map-led workspace for riders finding nearby combis and operators building a clearer public transport network.
          </p>
          <div className="overview-actions">
            <Link href="/pathfind" className="btn btn-primary btn-lg">Explore nearby routes</Link>
            <Link href="/guide" className="btn btn-secondary btn-lg">Read the rider guide</Link>
          </div>
          <div className="overview-signal">
            <span className="status-pip" />
            <span>Gaborone starter network</span>
            <span className="overview-signal-rule" />
            <span>7 seeded corridors</span>
          </div>
        </div>

        <div className="network-preview" aria-label="Stylized Gaborone route network preview">
          <div className="network-preview-top">
            <div>
              <span className="panel-kicker">Live network</span>
              <strong>Greater Gaborone</strong>
            </div>
            <span className="network-status">ACTIVE</span>
          </div>
          <svg className="network-sketch" viewBox="0 0 620 430" role="img" aria-label="Three intersecting transit corridors">
            <path className="map-road" d="M-20 93C92 121 152 43 276 70s185 107 365 65" />
            <path className="map-road" d="M42 388c74-74 97-159 179-175s159 46 244-1 91-126 174-166" />
            <path className="map-road minor" d="M0 267c122-58 185-23 281 18s213 42 363-32" />
            <path className="route-path route-purple" d="M25 365C118 286 134 211 221 194s154 43 240-5 89-100 138-139" />
            <path className="route-path route-black" d="M13 105c105 17 157-45 265-18s180 102 323 61" />
            <path className="route-path route-lime" d="M38 280c108-49 168-15 252 20s180 35 282-18" />
            <g className="network-stops">
              <circle cx="91" cy="310" r="7" /><circle cx="174" cy="220" r="7" /><circle cx="295" cy="213" r="7" /><circle cx="456" cy="191" r="7" />
              <circle cx="114" cy="102" r="7" /><circle cx="278" cy="87" r="7" /><circle cx="443" cy="142" r="7" />
              <circle cx="132" cy="251" r="7" /><circle cx="293" cy="301" r="7" /><circle cx="477" cy="305" r="7" />
            </g>
          </svg>
          <div className="map-place-label label-one">Main Mall</div>
          <div className="map-place-label label-two">Riverwalk</div>
          <div className="map-place-label label-three">Game City</div>
          <div className="network-preview-bottom">
            <div><span>Corridors</span><strong>07</strong></div>
            <div><span>Coverage</span><strong>GAB</strong></div>
            <Link href="/pathfind">Open map <span aria-hidden="true">→</span></Link>
          </div>
        </div>
      </section>

      <section className="workspace-section">
        <div className="section-heading">
          <div><span className="panel-kicker">How it works</span><h2>From a place to a route</h2></div>
          <p>A simple rider experience built around how people actually describe movement through Gaborone.</p>
        </div>
        <div className="workspace-grid">
          {riderSteps.map((item) => (
            <div className="workspace-card" key={item.index}>
              <span className="workspace-index">{item.index}</span>
              <span className="workspace-meta">{item.meta}</span>
              <h3>{item.title}</h3>
              <p>{item.description}</p>
            </div>
          ))}
        </div>
      </section>

      <section className="public-guide-strip">
        <div>
          <span className="panel-kicker">TransitOS field guide</span>
          <h2>New to the network?</h2>
          <p>Learn how to find a combi, read nearby-route results, and understand the community-sourced starter data.</p>
        </div>
        <Link className="btn btn-primary btn-lg" href="/guide">Open the general guide</Link>
      </section>
    </div>
  );
}
