# Graceland Portable Buildings - 3D Designer

A real-time 3D building configurator for Graceland Portable Buildings, featuring accurate barn/shed visualization with live pricing based on the actual Graceland catalog.

## 🎯 Project Overview

This application allows customers to:
- Select from Graceland's actual building catalog (Gambrel, Gable, Lean-To, Economy)
- Customize dimensions, doors, windows, and optional features
- View a real-time 3D preview of their building
- Get accurate pricing based on Graceland's pricing structure
- Request quotes with full configuration details

**Contact:** (888) 472-2304 | https://gracelandportablebuildings.com/

## ✨ Current Implementation Status

### ✅ Completed Features

#### 1. **Accurate Gambrel Roof (Barn Style)**
- Mathematically precise roof geometry using trigonometry
- Lower sections: Steep slope from wall edge to break point
- Upper sections: Shallow slope from break point to peak
- All seams flush with no gaps or overlaps
- Roof sections touch properly at top of walls

#### 2. **Graceland Catalog Integration**
- Full building catalog loaded from `client/src/data/building-catalog.json`
- Categories: Gambrel, Gable, Lean-To, Economy
- Building types: Lofted Barn, Utility Shed, Cabin, Garage, etc.
- Available sizes per building type (e.g., 10×12, 12×20, 12×24, etc.)

#### 3. **Realistic Door System**
- **48" Solid Shop Door** ($350) - 4' wide, 7' tall
- **72" Double Shop Door** ($600) - 6' wide, 7' tall, dual handles
- **36" Solid Entry Door** ($300) - 3' wide, 6.5' tall
- **36" 9-Lite Entry Door** ($350) - 3' wide, 6.5' tall with 9 glass panes
- Add/remove individual doors with dropdown selector

#### 4. **Window System**
- **2' × 3' Windows** ($150 each)
- **3' × 3' Windows** ($200 each)
- Add/remove individual windows
- Windows render with frames, glass, and cross bars

#### 5. **Optional Features**
- Loft storage (+$800)
- Porch options: Side ($1,200), Corner ($1,800), Wraparound ($2,800)
- Garage door upgrade (+$600)
- Metal roofing (+$3/sqft)
- Dormer windows (+$900)

#### 6. **Real-Time Pricing**
- Base price by building category
- Size pricing: $18-25 per sqft depending on category
- Building type adjustments (Cabin +$1,500, Garage +$800, Lofted +$600)
- Accurate door and window pricing by type
- Feature pricing
- Live total updates as changes are made

## 🏗️ Technical Architecture

### Frontend Stack
- **React 19.1** - UI framework
- **TypeScript** - Type safety
- **Vite** - Build tool and dev server
- **Three.js** - 3D rendering engine
- **@react-three/fiber** - React renderer for Three.js
- **@react-three/drei** - Helper components (OrbitControls, Environment, etc.)
- **Zustand** - Lightweight state management
- **TailwindCSS** - Utility-first styling
- **react-colorful** - Color picker component

### Backend (Future)
- Quote submission API (not yet implemented)
- Email notifications (planned)

## 🔧 Development Setup

### Prerequisites
- Node.js 18+ and npm
- Git

### Installation

```bash
# Clone the repository
git clone https://github.com/WhiteCoatMD/building_designer.git
cd building_designer

# Install root dependencies
npm install

# Install client dependencies
cd client
npm install
```

### Running Development Server

```bash
# From root directory
npm run dev

# Or from client directory
cd client
npm run dev
```

The app will be available at `http://localhost:5173/`

### Building for Production

```bash
# Build client
cd client
npm run build

# Output will be in client/dist/
```

### Deployment

The project is configured for Vercel with automatic deployments:
- Push to `main` branch triggers automatic deployment
- Build command: `npm run build` (defined in root package.json)
- Output directory: `client/dist` (configured in vercel.json)
- `postinstall` script ensures client dependencies are installed

## 📁 Project Structure

```
building_designer/
├── client/                          # Frontend application
│   ├── src/
│   │   ├── components/
│   │   │   ├── Building3D.tsx      # 3D canvas and scene setup
│   │   │   ├── Building.tsx        # 3D building geometry (roof, walls, doors, windows)
│   │   │   └── ControlPanel.tsx    # Configuration UI (left sidebar)
│   │   ├── store/
│   │   │   └── buildingStore.ts    # Zustand state management + pricing logic
│   │   ├── data/
│   │   │   └── building-catalog.json  # Graceland catalog data
│   │   ├── types/
│   │   │   └── catalog.ts          # TypeScript types for catalog
│   │   ├── App.tsx                 # Main app component
│   │   └── main.tsx                # Entry point
│   ├── public/                      # Static assets
│   └── package.json
├── server/                          # Backend (future use)
├── vercel.json                      # Vercel deployment config
├── package.json                     # Root package.json
└── README.md
```

## 🎨 Key Technical Decisions

### 1. Gambrel Roof Geometry

The gambrel roof uses precise trigonometry to ensure all seams are flush:

```typescript
// Calculate lower section (steep)
const lowerHorizontalSpan = w / 4;
const lowerSectionLength = Math.sqrt(
  lowerHorizontalSpan² + gambelBreakHeight²
);
const lowerAngle = Math.atan2(gambelBreakHeight, lowerHorizontalSpan);

// Calculate upper section (shallow)
const upperHorizontalSpan = w / 4;
const upperVerticalSpan = roofHeight - gambelBreakHeight;
const upperSectionLength = Math.sqrt(
  upperHorizontalSpan² + upperVerticalSpan²
);
const upperAngle = Math.atan2(upperVerticalSpan, upperHorizontalSpan);
```

**Geometry:**
- 4 roof sections that meet perfectly at seams
- Lower sections start at wall edges (±w/2)
- Break point at ±w/4 (1/4 width from center)
- Peak at center (0, h + roofHeight)

### 2. Door and Window System

Uses a flexible config-based approach:

```typescript
doorConfigs: Array<{
  type: '48-solid-shop' | '72-double-shop' | '36-solid-entry' | '36-9lite-entry';
  count: number;
}>

windowConfigs: Array<{
  size: '2x3' | '3x3';
  count: number;
}>
```

Benefits:
- Multiple doors of different types
- Easy add/remove functionality
- Accurate pricing per door/window type
- Flexible rendering in 3D scene

### 3. Fixed Wall Height

All buildings have standard **93-inch (7.75 ft) walls** per Graceland specifications. This is hardcoded and not user-adjustable.

### 4. State Management

Zustand store (`buildingStore.ts`) manages:
- Building configuration (dimensions, category, features)
- Door and window configs
- Colors
- Pricing calculations
- Helper methods:
  - `getSelectedBuilding()` - Get current building from catalog
  - `getRoofStyle()` - Get roof style for selected building
  - `getAvailableSizes()` - Get sizes for selected building type

All changes trigger automatic price recalculation via `calculatePrice()`.

## 📊 Pricing Formula

```typescript
Base Price ($3,500)
+ Size (width × depth × $18-25/sqft depending on category)
+ Building type adjustment
  • Cabin: +$1,500
  • Garage: +$800
  • Lofted: +$600
+ Optional features
  • Loft: +$800
  • Porch (side/corner/wraparound): +$1,200/$1,800/$2,800
  • Garage door: +$600
  • Metal roof: +$3/sqft
  • Dormer: +$900
+ Doors (by type)
  • 48" solid shop: +$350
  • 72" double shop: +$600
  • 36" solid entry: +$300
  • 36" 9-lite entry: +$350
+ Windows (by size)
  • 2×3: +$150
  • 3×3: +$200
= Total Price
```

## 🎯 Graceland-Specific Features

### Standard Specifications
- **Wall Height:** Fixed at 93 inches (7.75 feet) - industry standard
- **Door Types:** Shop doors (48", 72") and entry doors (36" solid, 36" 9-lite)
- **Window Sizes:** 2×3 and 3×3 feet
- **Roof Styles:** Gambrel (barn), Gable, Lean-To
- **Construction:** Pressure-treated runners, LP SmartSide siding, architectural shingles

### Catalog Integration
The `building-catalog.json` contains:
- **4 Building Categories:** Gambrel, Gable, Lean-To, Economy
- **Building Models:** Lofted Barn, Utility, Cabin, Garage, etc.
- **Available Sizes:** Specific to each building type
- **Standard Features** and **Common Upgrades**
- **Company Information**

## 🐛 Known Issues / Future Improvements

### High Priority
- [ ] Add backend API for quote submission
- [ ] Email notifications for quotes
- [ ] Implement porch visualization
- [ ] Add loft interior visualization
- [ ] Visualize garage door vs regular door

### Medium Priority
- [ ] Add siding texture/material options
- [ ] Implement dormer window 3D model
- [ ] Mobile responsiveness improvements
- [ ] Add "Save Configuration" feature
- [ ] Zip code-based delivery calculator

### Low Priority
- [ ] Code splitting for bundle size reduction (currently 1.19 MB)
- [ ] Add unit tests
- [ ] Performance optimization for multiple doors/windows
- [ ] Add screenshot/share functionality
- [ ] Export configuration as PDF

## 🔍 Troubleshooting

### Avast Antivirus False Positive
If Avast blocks `vite/deps/@react-three_drei.js` (JS:prontexi-Z detection):
1. Open Avast → Settings → Protection → Core Shields
2. Configure shield settings → Exclusions
3. Add exception: `C:\Users\[YOUR_USER]\building_designer\client\node_modules\.vite`

This is a known false positive with Vite-bundled Three.js libraries.

### Dev Server Issues
```bash
# Clear Vite cache
cd client
rm -rf node_modules/.vite
npm run dev
```

### Build Errors
```bash
# Clean install
cd client
rm -rf node_modules package-lock.json
npm install
npm run build
```

## 📝 Git Workflow

```bash
# Make changes
git add .
git commit -m "Description of changes"
git push origin main

# Vercel will automatically deploy
```

## 📚 Additional Context for AI Assistants

### Current State Summary
This project is a 3D building configurator for Graceland Portable Buildings. The core 3D rendering and configuration system is complete with:
- ✅ Accurate gambrel roof geometry (flush seams, proper barn proportions)
- ✅ Realistic door/window systems with specific types
- ✅ Graceland catalog integration
- ✅ Real-time pricing
- ✅ Color customization
- ✅ Optional features (loft, porch, garage door, metal roof, dormer)

### What's Been Implemented
All core features are functional:
- Full 3D building visualization with Three.js
- Catalog-driven configuration (categories, building types, sizes)
- Specific door types (shop/entry doors) with proper 3D models
- Window system (2×3, 3×3) with glass and frames
- Fixed 93" wall height per industry standards
- Accurate pricing based on Graceland catalog
- Vercel deployment configuration

### Technical Highlights
- **Roof Geometry:** Uses `Math.atan2()` and `Math.sqrt()` for precision
- **Door/Window System:** Flexible array-based configs for easy management
- **State Management:** Zustand with automatic price recalculation
- **Catalog Data:** JSON-based with TypeScript types
- **3D Rendering:** React Three Fiber with OrbitControls, shadows, environment lighting

### What Needs Work
- Backend API for quote submission (not implemented)
- Porch, loft, dormer 3D visualizations (features exist but not rendered)
- Siding texture options
- Mobile optimization
- Unit tests

### Last Updated
2025-11-04

---

**Graceland Portable Buildings**
Phone: (888) 472-2304
Website: https://gracelandportablebuildings.com/
