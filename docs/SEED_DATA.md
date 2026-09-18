# Gaborone starter data

TransitOS includes editable starter data so the map, nearby-route discovery, and journey planner are useful on first launch.

## Included corridors

- Tlokweng Route 1
- Tlokweng Route 6 - Game City
- Broadhurst Route 1
- Broadhurst Route 6 - Game City
- Block 8 Route 3
- Phakalane Phase 2
- Block 6 / Mogoditshane Route 8

These relationships were derived from the user-supplied community list of malls and the combi routes reported to serve them. The supplied Botswana public-transport article provides broader context about informal combi operation but is not a schedule or route geometry source.

## Landmark coordinates

| Landmark | Latitude | Longitude |
| --- | ---: | ---: |
| Airport Junction | -24.6042148 | 25.9254803 |
| BBS Mall | -24.6270524 | 25.9354447 |
| African Mall | -24.6638883 | 25.9165431 |
| Riverwalk Mall | -24.6766577 | 25.9354980 |
| North Gate Mall | -24.6075702 | 25.9330913 |
| Westgate Mall | -24.6375024 | 25.8935925 |
| Game City | -24.6866328 | 25.8789722 |
| Fairgrounds Mall | -24.6831718 | 25.9111604 |
| South Ring Mall | -24.6679372 | 25.9203156 |
| Main Mall | -24.6581596 | 25.9159428 |
| Molapo Crossing | -24.6430481 | 25.8857696 |
| Acacia Mall | -24.5511885 | 25.9869043 |
| Tlokweng | -24.6673770 | 25.9719810 |
| Broadhurst | -24.6289613 | 25.9436703 |
| Block 8 | -24.6011186 | 25.9150728 |
| Phakalane | -24.5524245 | 25.9867821 |
| Mogoditshane | -24.6282115 | 25.8691824 |

Coordinates were researched in September 2026 using OpenStreetMap/Nominatim results, with supporting public location listings where the OpenStreetMap text search did not resolve the colloquial mall name.

## Accuracy boundary

This is community-sourced starter data, not an official Botswana transport feed. Straight lines connect known hubs; they are not road-following vehicle traces. Before production use, a local maintainer should verify:

- route direction and whether the service is bidirectional;
- exact boarding points rather than mall centroids;
- current stop order and intermediate stops;
- operating hours, fares, and service availability;
- spelling and locally preferred route names.

## Loading behavior

The API container runs this after the Alembic migration:

```powershell
python -m app.seed
```

The command is idempotent by route name. It inserts a starter corridor only when a route with that exact name does not already exist.

The data is defined in `api/app/seed.py`, where it can be reviewed or replaced with an authoritative feed later.

## Attribution

The maps and geocoded landmarks use OpenStreetMap data. Retain visible OpenStreetMap attribution in every map surface and review the tile usage policy before public deployment.

