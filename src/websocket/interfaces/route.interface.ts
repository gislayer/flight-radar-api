export interface RouteLocation {
    id: number;
    latitude: number;
    longitude: number;
    altitude: number;
    speed: number;
    bearing: number;
  }
  
  export interface RouteUpdate {
    routeId: number;
    status: string;
    location?: RouteLocation;
  }

