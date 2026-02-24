export interface Coordinate {
  lat: number;
  long: number;
}

export interface PathfindDTO {
  origin: Coordinate;
  destination: Coordinate;
}
