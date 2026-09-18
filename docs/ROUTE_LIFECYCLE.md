# Route lifecycle

1. A signed-in community member traces ordered points. OSRM produces a road-following preview between them.
2. The API stores the submitted points and preview as `pending_review`; it is not rider-visible.
3. A reviewer compares direction, stops, landmarks, and recent local evidence.
4. Accepted data becomes a published `Route` with ordered `Node` stops. Steering points shape geometry but must not masquerade as stops.
5. Riders can bookmark, inspect, and track the route. Live tracking calculates distance to a chosen stop locally in the browser.
6. Community tips provide dated context. Reports and corrections should eventually create a new review event rather than silently overwriting history.

Road alignment proves only that a router found connected roads. It does not prove an operator uses the corridor, the direction is correct, or service is available now.
