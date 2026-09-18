# Contributing

Thank you for helping document Gaborone's shared transport network. Code quality matters, but route accuracy and respectful local verification matter just as much.

## Start here

1. Read [ARCHITECTURE.md](ARCHITECTURE.md) and [docs/PRODUCT_VISION.md](docs/PRODUCT_VISION.md).
2. Run `docker compose up --build` and wait for health checks.
3. Choose the service README for the area you are changing.
4. Keep each pull request focused on one product or infrastructure concern.
5. Run the relevant checks in the table below.

| Area | Checks |
| --- | --- |
| API | `cd api && pytest && ruff check .` |
| Rider | `cd rider && npm run lint && npm run build` |
| Marketing | `cd marketing && npm run lint && npm run build` |
| Docs site | `cd docs-site && npm run lint && npm run build` |
| Operations | `cd admin && npm run lint && npm run build` |

## Route-data contributions

- Record direction, stop order, and recognizable landmarks separately.
- Add steering points only to keep a preview on the road; do not invent stops to shape a line.
- Do not publish a route solely because a router can draw it.
- Mark fares, timetables, and safety reports with an observation date and source type.
- Avoid personal information about drivers, conductors, or riders.

## File documentation standard

First-party source files should begin with a short purpose statement: a Python module docstring or a TypeScript/TSX file comment after any required `"use client"` directive. Document reasons, data ownership, privacy boundaries, and non-obvious constraints; do not narrate syntax. New public functions need a comment when the name and types do not fully explain their contract.

## Security review

Treat names, tips, route notes, query strings, and imported research as untrusted input. Use Pydantic bounds, SQLAlchemy expressions, React text rendering, fixed internal navigation destinations, and authorization dependencies. Never use string-formatted SQL or `dangerouslySetInnerHTML` for community content.

## Pull-request evidence

Include the problem, screenshots for visible changes, commands run, migration impact, route-data provenance, and limitations that remain. UI work should be checked at mobile and desktop widths.
