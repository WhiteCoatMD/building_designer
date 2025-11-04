import { create } from 'zustand';
import catalogData from '../data/building-catalog.json';
import type { BuildingCatalog, RoofStyle, CategoryKey, Building } from '../types/catalog';

const catalog = catalogData as BuildingCatalog;

export type { RoofStyle };

export interface BuildingConfig {
  // Dimensions
  width: number;
  depth: number;
  wallHeight: number;

  // Catalog Selection
  selectedCategory: CategoryKey;
  selectedBuildingId: string;

  // Features (optional upgrades)
  hasLoft: boolean;
  hasPorch: boolean;
  porchType: 'none' | 'side' | 'corner' | 'wraparound';
  hasGarageDoor: boolean;
  hasMetalRoof: boolean;
  hasDormer: boolean;

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
  // Helpers
  getSelectedBuilding: () => Building | undefined;
  getAvailableSizes: () => string[];
  getRoofStyle: () => RoofStyle;

  // Actions
  setWidth: (width: number) => void;
  setDepth: (depth: number) => void;
  setWallHeight: (height: number) => void;
  setCategory: (category: CategoryKey) => void;
  setBuildingType: (buildingId: string) => void;
  setSize: (sizeStr: string) => void;

  // Feature toggles
  setHasLoft: (hasLoft: boolean) => void;
  setHasPorch: (hasPorch: boolean) => void;
  setPorchType: (type: 'none' | 'side' | 'corner' | 'wraparound') => void;
  setHasGarageDoor: (hasGarageDoor: boolean) => void;
  setHasMetalRoof: (hasMetalRoof: boolean) => void;
  setHasDormer: (hasDormer: boolean) => void;

  // Doors & Windows
  setDoors: (count: number) => void;
  setWindows: (count: number) => void;
  setDoorWidth: (width: number) => void;

  // Colors
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
  depth: 20,
  wallHeight: 7,
  selectedCategory: 'gambrel',
  selectedBuildingId: 'lofted-barn',
  hasLoft: true,
  hasPorch: false,
  porchType: 'none',
  hasGarageDoor: false,
  hasMetalRoof: false,
  hasDormer: false,
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

  // Helpers
  getSelectedBuilding: () => {
    const state = get();
    const category = catalog.buildingCategories[state.selectedCategory];
    return category?.buildings.find((b) => b.id === state.selectedBuildingId);
  },

  getAvailableSizes: () => {
    const building = get().getSelectedBuilding();
    return building?.sizes || [];
  },

  getRoofStyle: () => {
    const building = get().getSelectedBuilding();
    return building?.roofStyle || 'gambrel';
  },

  // Dimension actions
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

  setSize: (sizeStr) => {
    const [width, depth] = sizeStr.split('x').map(Number);
    set({ width, depth });
    get().calculatePrice();
  },

  // Category and building selection
  setCategory: (category) => {
    const categoryData = catalog.buildingCategories[category];
    const firstBuilding = categoryData.buildings[0];

    set({
      selectedCategory: category,
      selectedBuildingId: firstBuilding.id,
    });

    // Set size to first available size for this building
    if (firstBuilding.sizes.length > 0) {
      get().setSize(firstBuilding.sizes[0]);
    }

    get().calculatePrice();
  },

  setBuildingType: (buildingId) => {
    set({ selectedBuildingId: buildingId });

    // Update size to first available for this building
    const building = get().getSelectedBuilding();
    if (building && building.sizes.length > 0) {
      get().setSize(building.sizes[0]);
    }

    get().calculatePrice();
  },

  // Feature toggles
  setHasLoft: (hasLoft) => {
    set({ hasLoft });
    get().calculatePrice();
  },

  setHasPorch: (hasPorch) => {
    set({ hasPorch });
    if (!hasPorch) {
      set({ porchType: 'none' });
    }
    get().calculatePrice();
  },

  setPorchType: (porchType) => {
    set({ porchType, hasPorch: porchType !== 'none' });
    get().calculatePrice();
  },

  setHasGarageDoor: (hasGarageDoor) => {
    set({ hasGarageDoor });
    get().calculatePrice();
  },

  setHasMetalRoof: (hasMetalRoof) => {
    set({ hasMetalRoof });
    get().calculatePrice();
  },

  setHasDormer: (hasDormer) => {
    set({ hasDormer });
    get().calculatePrice();
  },

  // Doors & Windows
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

  // Colors
  setWallColor: (wallColor) => set({ wallColor }),
  setRoofColor: (roofColor) => set({ roofColor }),
  setTrimColor: (trimColor) => set({ trimColor }),
  setDoorColor: (doorColor) => set({ doorColor }),
  setZipCode: (zipCode) => set({ zipCode }),

  // Pricing calculation based on catalog data
  calculatePrice: () => {
    const state = get();

    // Base price depends on building type and size
    let price = state.basePrice;

    // Size pricing - $18-25 per sqft depending on category
    const sqft = state.width * state.depth;
    const pricePerSqft = state.selectedCategory === 'economy' ? 18 :
                        state.selectedCategory === 'lean-to' ? 20 :
                        state.selectedCategory === 'gable' ? 22 : 24; // gambrel
    price += sqft * pricePerSqft;

    // Building type adjustments
    const buildingId = state.selectedBuildingId;
    if (buildingId.includes('cabin')) {
      price += 1500; // Cabin upgrades
    } else if (buildingId.includes('garage')) {
      price += 800; // Garage features
    } else if (buildingId.includes('lofted')) {
      price += 600; // Lofted features base
    }

    // Height adjustment
    if (state.wallHeight > 8) {
      price += (state.wallHeight - 8) * 250;
    }

    // Feature pricing
    if (state.hasLoft && !buildingId.includes('lofted')) {
      price += 800; // Add loft to non-lofted building
    }

    if (state.hasPorch) {
      const porchPricing = {
        'side': 1200,
        'corner': 1800,
        'wraparound': 2800,
        'none': 0,
      };
      price += porchPricing[state.porchType];
    }

    if (state.hasGarageDoor) {
      price += 600; // Garage door upgrade
    }

    if (state.hasMetalRoof) {
      price += sqft * 3; // Metal roofing upgrade ~$3/sqft
    }

    if (state.hasDormer) {
      price += 900; // Dormer window addition
    }

    // Doors and windows
    price += state.doors * 300;
    price += state.windows * 180;

    // Wide doors
    if (state.doorWidth > 4) {
      price += (state.doorWidth - 4) * 120;
    }

    set({ totalPrice: Math.round(price) });
  },

  resetConfig: () => {
    set({ ...DEFAULT_CONFIG });
    get().calculatePrice();
  },
}));
