/** Accessible, zero-JavaScript route preview for the public marketing page. */

export function RouteNetworkIllustration() {
  return (
    <figure className="route-network" aria-labelledby="route-network-caption">
      <svg viewBox="0 0 760 620" role="img" aria-labelledby="route-map-title route-map-desc">
        <title id="route-map-title">A Tsela journey from Broadhurst to Main Mall</title>
        <desc id="route-map-desc">A simplified street network with one highlighted road-following combi route.</desc>
        <defs>
          <pattern id="street-grid" width="44" height="44" patternUnits="userSpaceOnUse">
            <path d="M44 0H0V44" fill="none" stroke="#d9ddd5" strokeWidth="1" />
          </pattern>
          <filter id="route-shadow" x="-20%" y="-20%" width="140%" height="140%">
            <feDropShadow dx="0" dy="5" stdDeviation="5" floodColor="#111111" floodOpacity=".16" />
          </filter>
        </defs>
        <rect width="760" height="620" rx="30" fill="#f7f8f3" />
        <rect width="760" height="620" rx="30" fill="url(#street-grid)" />
        <g className="route-network-streets" fill="none" stroke="#bfc5ba" strokeLinecap="round">
          <path d="M35 160C170 120 285 182 405 132S640 82 742 146" strokeWidth="14" />
          <path d="M76 500C172 421 260 450 352 370S568 246 732 272" strokeWidth="18" />
          <path d="M160 24C142 150 214 245 183 364S144 522 180 600" strokeWidth="12" />
          <path d="M531 20C499 154 544 244 512 350S508 506 592 608" strokeWidth="13" />
          <path d="M325 10C313 117 356 198 329 296S278 482 318 612" strokeWidth="8" />
        </g>
        <g fill="#dfead2" stroke="#c0cfaf" strokeWidth="2">
          <path d="M42 284Q99 225 154 276T263 277Q236 340 172 354T42 284Z" />
          <path d="M553 394Q637 337 721 404L706 544Q614 567 549 507Z" />
        </g>
        <path className="route-network-casing" d="M111 137C204 119 294 171 328 226C353 267 315 317 345 354C383 400 467 355 523 392C574 426 565 493 645 519" />
        <path className="route-network-line" d="M111 137C204 119 294 171 328 226C353 267 315 317 345 354C383 400 467 355 523 392C574 426 565 493 645 519" />
        <g className="route-stop" transform="translate(111 137)"><circle r="16" /><circle r="6" /></g>
        <g className="route-stop destination" transform="translate(645 519)"><circle r="16" /><circle r="6" /></g>
        <g className="route-arrow" transform="translate(400 378) rotate(-9)" filter="url(#route-shadow)"><circle r="22" /><path d="M-7 7 9 0-7-7Z" /></g>
        <g className="route-place-card" transform="translate(44 66)">
          <rect width="196" height="70" rx="15" /><circle cx="25" cy="35" r="7" />
          <text x="44" y="27">YOUR LOCATION</text><text x="44" y="50">Broadhurst</text>
        </g>
        <g className="route-place-card destination" transform="translate(493 500)">
          <rect width="220" height="78" rx="15" /><circle cx="26" cy="39" r="7" />
          <text x="46" y="30">RIGHT STOP</text><text x="46" y="55">Main Mall</text>
        </g>
        <g className="route-summary-card" transform="translate(436 66)">
          <rect width="270" height="128" rx="18" /><text x="22" y="31">RECOMMENDED ROUTE</text>
          <text x="22" y="65">Broadhurst  →  Main Mall</text><line x1="22" y1="83" x2="248" y2="83" />
          <text x="22" y="108">26 min</text><text x="104" y="108">1 combi</text><text x="193" y="108">P8 est.</text>
        </g>
      </svg>
      <figcaption id="route-network-caption"><span>One clear route</span> A lightweight preview here. The live, searchable map opens when you plan a trip.</figcaption>
    </figure>
  );
}
