// Types for Graceland Building Catalog

export interface Building {
  id: string;
  name: string;
  roofStyle: 'gambrel' | 'gable' | 'lean-to';
  sizes: string[];
  description: string;
  features: string[];
  optionalUpgrades?: string[];
  defaultSize?: string;
  notes?: string;
}

export interface BuildingCategory {
  name: string;
  description: string;
  buildings: Building[];
}

export interface Upgrade {
  category: string;
  options: string[];
}

export interface CompanyInfo {
  name: string;
  phone: string;
  address: string;
  website: string;
  services: string[];
}

export interface BuildingCatalog {
  buildingCategories: {
    gambrel: BuildingCategory;
    gable: BuildingCategory;
    'lean-to': BuildingCategory;
    economy: BuildingCategory;
  };
  standardFeatures: {
    construction: string[];
    quality: string[];
  };
  commonUpgrades: Upgrade[];
  companyInfo: CompanyInfo;
}

// Helper type for roof styles
export type RoofStyle = 'gambrel' | 'gable' | 'lean-to';

// Helper type for building categories
export type CategoryKey = keyof BuildingCatalog['buildingCategories'];

// Size tuple [width, depth]
export type BuildingSize = [number, number];

// Parse size string like "12x20" into [12, 20]
export function parseSize(sizeStr: string): BuildingSize {
  const [width, depth] = sizeStr.split('x').map(Number);
  return [width, depth];
}

// Format size tuple into string like "12x20"
export function formatSize(size: BuildingSize): string {
  return `${size[0]}x${size[1]}`;
}
