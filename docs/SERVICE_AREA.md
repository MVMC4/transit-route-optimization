# Community contribution service area

Route contributions are currently limited to a documented Greater Gaborone envelope. The first release uses the following inclusive bounds:

- west: `25.55`
- south: `-24.90`
- east: `26.20`
- north: `-24.35`

This intentionally generous envelope covers Gaborone and the nearby Oodi, Mmopane, Metsimotlhabe, and Phakalane corridors while rejecting clearly unrelated submissions such as Maun. The rider UI constrains the map and explains the boundary. The API repeats the check before calling the road router, so bypassing the browser cannot consume an out-of-area routing request.

This rectangle is a release guard, not an assertion about municipal borders. Replace it with a reviewed polygon when locally validated operating coverage is available. Keep `rider/lib/map-config.ts` and `api/app/services/service_area.py` synchronized until a server-delivered configuration endpoint replaces the duplicated constants.
