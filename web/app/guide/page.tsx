import Link from "next/link";

const workflows = [
  {
    number: "01",
    title: "Find a combi near you",
    audience: "Rider",
    steps: [
      "Open Find a route from the site navigation.",
      "Click your location on the Gaborone map to drop the bright pin.",
      "Choose a search radius and select Apply if you want to widen the search.",
      "Review routes, nearest stops, and walking distance in the side panel.",
    ],
    href: "/pathfind",
    action: "Open route finder",
  },
  {
    number: "02",
    title: "Plan a journey",
    audience: "Rider",
    steps: [
      "Drop a pin and choose Use as origin or Use as destination.",
      "Drop a second pin, or type the other coordinate manually.",
      "Select Find Path to calculate the transit journey.",
      "Read the stop sequence, walking time, bus time, waiting time, and transfers.",
    ],
    href: "/pathfind",
    action: "Plan a journey",
  },
  {
    number: "03",
    title: "Read your results",
    audience: "Rider",
    steps: [
      "Use the coloured line to match a result card to its route on the map.",
      "Nearest stop shows the closest mapped boarding point to your pin.",
      "Walking distance is an estimate from your pin to that mapped stop.",
      "A wider radius may reveal more routes, but it also means a longer walk.",
    ],
    href: "/pathfind",
    action: "Explore the map",
  },
  {
    number: "04",
    title: "Travel with local context",
    audience: "General",
    steps: [
      "Treat the map as a route-discovery aid rather than a live timetable.",
      "Confirm the operating direction and current fare before boarding.",
      "Ask the driver or rank marshal when a corridor has multiple variants.",
      "Community route data may change as services and stops evolve.",
    ],
    href: "/",
    action: "Return home",
  },
];

export default function GuidePage() {
  return (
    <div className="page-container">
      <div className="page-header guide-hero">
        <span className="page-eyebrow">TransitOS field guide</span>
        <h1 className="page-title">Move through Gaborone with confidence.</h1>
        <p className="page-subtitle">
          A practical guide for riders discovering combis and understanding the shared route map.
        </p>
      </div>

      <div className="guide-notice">
        <div className="guide-notice-mark">BW</div>
        <div>
          <strong>About the starter routes</strong>
          <p>
            The included corridors are community-sourced examples based on the supplied Gaborone combi list.
            Confirm stop order, operating direction, fares, and current service with local operators before travel.
          </p>
        </div>
      </div>

      <div className="guide-grid">
        {workflows.map((workflow) => (
          <article className="guide-card" key={workflow.number}>
            <div className="guide-card-topline">
              <span className="guide-number">{workflow.number}</span>
              <span className="badge badge-gray">{workflow.audience}</span>
            </div>
            <h2>{workflow.title}</h2>
            <ol>
              {workflow.steps.map((step) => <li key={step}>{step}</li>)}
            </ol>
            <Link className="btn btn-dark btn-sm" href={workflow.href}>{workflow.action} →</Link>
          </article>
        ))}
      </div>

      <div className="grid-2" style={{ marginTop: 22 }}>
        <div className="card">
          <div className="card-title">Map controls</div>
          <p className="guide-copy">Drag to pan, use the wheel or +/− control to zoom, and click a point to place it. Route-detail stop markers can be clicked for their name and sequence number.</p>
        </div>
        <div className="card">
          <div className="card-title">Understanding the data</div>
          <p className="guide-copy">Routes and stops are community-sourced starter data, not a live operator feed. Always confirm service details locally before travelling.</p>
        </div>
      </div>
    </div>
  );
}
