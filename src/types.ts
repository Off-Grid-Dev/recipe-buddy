export type Unit = "g" | "kg" | "ml" | "L" | "°C";

export type IngredientGroup =
  | "liquids"
  | "sugars"
  | "solids"
  | "stabilizers"
  | "flavorings";

export type ProcessStepType =
  | "weighing"
  | "pasteurization"
  | "aging"
  | "churning";

export interface Ingredient {
  id: string;
  name: string;
  percentage: number; // Relative to total mix weight or base
  unit: Unit;
  group: IngredientGroup;
  notes?: string;
  temperatureCritical?: boolean; // e.g., milk needs to be cold
}

export interface RecipeStep {
  id: string;
  type: ProcessStepType;
  instruction: string;
  targetTemperature?: number; // For pasteurization
  durationMinutes?: number;
  notes?: string;
}

export interface Recipe {
  id: string;
  name: string;
  category: "gelato" | "sorbetto" | "crema";
  description: string;
  baseWeightGrams: number; // The total batch size this recipe is designed for
  ingredients: Ingredient[];
  steps: RecipeStep[];
  agingTimeHours: number;
  imageUrl?: string;
}

export interface ScaleState {
  isConnected: boolean;
  currentWeight: number; // in grams
  isStable: boolean;
}
