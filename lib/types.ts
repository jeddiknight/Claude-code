export type TravelStyle = "Aktyvus" | "Paplūdimys" | "Kultūra" | "Nardymas" | "Mišrus";
export type Budget = "Taupus <50€/d" | "Vidutinis 50-150€/d" | "Komfortiškas 150€+/d";
export type Language = "Lietuvių" | "English" | "Norsk" | "Latviešu";
export type LocationType = "attraction" | "restaurant" | "hotel" | "activity";

export interface TripFormData {
  destination: string;
  duration: number;
  style: TravelStyle;
  budget: Budget;
  language: Language;
}

export interface Location {
  name: string;
  lat: number;
  lng: number;
  description: string;
  duration: string;
  cost: string;
  type: LocationType;
}

export interface Day {
  day: number;
  title: string;
  locations: Location[];
  tips: string;
}

export interface BudgetBreakdown {
  flights: string;
  accommodation: string;
  food: string;
  activities: string;
  transport: string;
}

export interface BudgetEstimate {
  total_min: number;
  total_max: number;
  currency: string;
  breakdown: BudgetBreakdown;
}

export interface PracticalInfo {
  best_time: string;
  visa: string;
  currency: string;
  language: string;
  emergency: string;
}

export interface TravelPlan {
  title: string;
  summary: string;
  budget_estimate: BudgetEstimate;
  days: Day[];
  practical_info: PracticalInfo;
  meta?: {
    destination: string;
    duration: number;
    style: string;
    budget: string;
    language: string;
    generatedAt: string;
  };
}
