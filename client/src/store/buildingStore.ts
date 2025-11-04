import { create } from 'zustand';

export type RoofStyle = 'gambrel' | 'a-frame' | 'gable' | 'barn';
export type BuildingStyle = 'lofted-barn' | 'utility' | 'cottage' | 'cabin';

export interface BuildingConfig {
  // Dimensions
  width: number;
  depth: number;
  wallHeight: number;

  // Style
  buildingStyle: BuildingStyle;
  roofStyle: RoofStyle;

  // Doors & Windows
  doors: number;
  windows: number;
  doorWidth: number;

  // Colors
  wallColor: string;
  roofColor: string;
  trimColor: string;
  doorColor: string;

  // Pricing
  basePrice: number;
  totalPrice: number;

  // Customer Info
  zipCode: string;
}

interface BuildingStore extends BuildingConfig {
  // Actions
  setWidth: (width: number) => void;
  setDepth: (depth: number) => void;
  setWallHeight: (height: number) => void;
  setBuildingStyle: (style: BuildingStyle) => void;
  setRoofStyle: (style: RoofStyle) => void;
  setDoors: (count: number) => void;
  setWindows: (count: number) => void;
  setDoorWidth: (width: number) => void;
  setWallColor: (color: string) => void;
  setRoofColor: (color: string) => void;
  setTrimColor: (color: string) => void;
  setDoorColor: (color: string) => void;
  setZipCode: (zip: string) => void;
  calculatePrice: () => void;
  resetConfig: () => void;
}

const DEFAULT_CONFIG: BuildingConfig = {
  width: 12,
  depth: 16,
  wallHeight: 7,
  buildingStyle: 'lofted-barn',
  roofStyle: 'gambrel',
  doors: 1,
  windows: 2,
  doorWidth: 6,
  wallColor: '#8B7355',
  roofColor: '#2C3E50',
  trimColor: '#FFFFFF',
  doorColor: '#4A4A4A',
  basePrice: 3500,
  totalPrice: 3500,
  zipCode: '',
};

export const useBuildingStore = create<BuildingStore>((set, get) => ({
  ...DEFAULT_CONFIG,

  setWidth: (width) => {
    set({ width });
    get().calculatePrice();
  },

  setDepth: (depth) => {
    set({ depth });
    get().calculatePrice();
  },

  setWallHeight: (wallHeight) => {
    set({ wallHeight });
    get().calculatePrice();
  },

  setBuildingStyle: (buildingStyle) => {
    set({ buildingStyle });
    get().calculatePrice();
  },

  setRoofStyle: (roofStyle) => {
    set({ roofStyle });
    get().calculatePrice();
  },

  setDoors: (doors) => {
    set({ doors });
    get().calculatePrice();
  },

  setWindows: (windows) => {
    set({ windows });
    get().calculatePrice();
  },

  setDoorWidth: (doorWidth) => {
    set({ doorWidth });
    get().calculatePrice();
  },

  setWallColor: (wallColor) => set({ wallColor }),
  setRoofColor: (roofColor) => set({ roofColor }),
  setTrimColor: (trimColor) => set({ trimColor }),
  setDoorColor: (doorColor) => set({ doorColor }),
  setZipCode: (zipCode) => set({ zipCode }),

  calculatePrice: () => {
    const state = get();
    let price = state.basePrice;

    // Size pricing
    const sqft = state.width * state.depth;
    price += sqft * 15; // $15 per sqft

    // Height adjustment
    if (state.wallHeight > 8) {
      price += (state.wallHeight - 8) * 200;
    }

    // Style pricing
    const stylePricing: Record<BuildingStyle, number> = {
      'lofted-barn': 500,
      'utility': 0,
      'cottage': 800,
      'cabin': 1000,
    };
    price += stylePricing[state.buildingStyle];

    // Roof style pricing
    const roofPricing: Record<RoofStyle, number> = {
      'gambrel': 300,
      'a-frame': 200,
      'gable': 100,
      'barn': 400,
    };
    price += roofPricing[state.roofStyle];

    // Doors and windows
    price += state.doors * 250;
    price += state.windows * 150;

    // Wide doors
    if (state.doorWidth > 4) {
      price += (state.doorWidth - 4) * 100;
    }

    set({ totalPrice: Math.round(price) });
  },

  resetConfig: () => {
    set({ ...DEFAULT_CONFIG });
    get().calculatePrice();
  },
}));
