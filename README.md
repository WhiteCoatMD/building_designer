# Building Designer

A full-featured 3D building designer application for customizing and ordering portable buildings, sheds, and cabins.

## Features

- **Interactive 3D Visualization** - Real-time 3D preview using Three.js and React Three Fiber
- **Full Customization** - Adjust dimensions, styles, colors, doors, and windows
- **Live Pricing** - Real-time price calculations based on configuration
- **Quote System** - Submit quote requests with customer information
- **Responsive Design** - Works on desktop, tablet, and mobile devices
- **Email Notifications** - Automatic quote confirmations (optional)

## Tech Stack

### Frontend
- React 18 with TypeScript
- Three.js & React Three Fiber for 3D graphics
- Zustand for state management
- Tailwind CSS for styling
- React Colorful for color picker
- Vite for build tooling

### Backend
- Node.js & Express
- Nodemailer for email notifications
- CORS enabled for cross-origin requests

## Getting Started

### Prerequisites
- Node.js 16+ and npm

### Installation

1. **Clone or navigate to the project directory**

2. **Install frontend dependencies**
   ```bash
   cd client
   npm install
   ```

3. **Install backend dependencies**
   ```bash
   cd ../server
   npm install
   ```

4. **Configure environment variables (Optional)**
   ```bash
   cd server
   cp .env.example .env
   # Edit .env with your email settings if you want to enable email notifications
   ```

### Running the Application

You'll need to run both the frontend and backend servers:

**Terminal 1 - Backend Server:**
```bash
cd server
npm start
```
The API server will start on http://localhost:3001

**Terminal 2 - Frontend Development Server:**
```bash
cd client
npm run dev
```
The frontend will start on http://localhost:5173

### Building for Production

**Frontend:**
```bash
cd client
npm run build
```
The production build will be in `client/dist/`

**Backend:**
The backend runs the same in production:
```bash
cd server
npm start
```

## Project Structure

```
building_designer/
├── client/                    # Frontend React application
│   ├── src/
│   │   ├── components/       # React components
│   │   │   ├── Building3D.tsx      # 3D canvas wrapper
│   │   │   ├── Building.tsx        # 3D building geometry
│   │   │   └── ControlPanel.tsx    # UI controls
│   │   ├── store/            # State management
│   │   │   └── buildingStore.ts    # Zustand store
│   │   ├── App.tsx           # Main app component
│   │   └── index.css         # Tailwind styles
│   ├── package.json
│   └── vite.config.ts
│
├── server/                    # Backend API server
│   ├── index.js              # Express server
│   ├── .env.example          # Environment variables template
│   └── package.json
│
└── README.md
```

## Customization Options

### Building Dimensions
- Width: 8-16 feet
- Depth: 8-24 feet
- Wall Height: 6-12 feet

### Building Styles
- Lofted Barn
- Utility Shed
- Cottage
- Cabin

### Roof Styles
- Gambrel
- Gable
- A-Frame
- Barn

### Features
- Doors: 1-3 (3-8 feet wide)
- Windows: 0-6
- Custom colors for walls, roof, trim, and doors

## API Endpoints

- `POST /api/quote` - Submit a quote request
- `GET /api/quotes` - Get all quotes (admin)
- `GET /api/quote/:id` - Get specific quote
- `GET /api/health` - Health check

## Pricing Logic

Base pricing is calculated using:
- Square footage ($15/sqft)
- Building style premium
- Roof style premium
- Wall height adjustments
- Door and window additions
- Door width adjustments

## Email Configuration (Optional)

To enable email notifications:

1. Copy `.env.example` to `.env` in the server directory
2. Configure your SMTP settings:
   - For Gmail: Enable 2FA and create an App Password
   - For other providers: Use their SMTP settings

If email is not configured, the application will still work but won't send confirmation emails.

## Development Tips

- The 3D viewer uses OrbitControls - users can rotate, zoom, and pan
- All prices are calculated in the Zustand store
- The Building component dynamically generates geometry based on configuration
- Colors update in real-time on the 3D model

## Future Enhancements

- [ ] Database integration (MongoDB/PostgreSQL)
- [ ] User authentication for saved configurations
- [ ] Admin dashboard for managing quotes
- [ ] Payment processing integration
- [ ] Photo-realistic rendering option
- [ ] Export configuration as PDF
- [ ] Floor plan view
- [ ] Interior customization
- [ ] Delivery calculator based on zip code

## License

ISC

## Support

For questions or issues, please contact support@buildingdesigner.com
