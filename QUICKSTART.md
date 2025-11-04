# Quick Start Guide

Get your Building Designer app up and running in 3 simple steps!

## ⚡ Quick Start (Servers Already Running!)

Your application is currently running and ready to use:

1. **Open your browser** and go to: http://localhost:5173
2. **Start designing** your building!
3. **Get a quote** when you're happy with your design

## 🎯 How to Use the Designer

### 1. Customize Your Building

Use the control panel on the right (or bottom on mobile) to adjust:

**Dimensions:**
- Width: 8-16 feet
- Depth: 8-24 feet
- Wall Height: 6-12 feet

**Style:**
- Choose from 4 building styles (Lofted Barn, Utility, Cottage, Cabin)
- Select 4 roof styles (Gambrel, Gable, A-Frame, Barn)

**Features:**
- Add 1-3 doors (3-8 feet wide)
- Add 0-6 windows

**Colors:**
- Customize wall, roof, trim, and door colors
- Click color buttons to open color picker

### 2. View in 3D

The 3D viewer lets you:
- **Rotate:** Click and drag
- **Zoom:** Mouse wheel or pinch
- **Pan:** Right-click and drag

Watch your changes update in real-time!

### 3. Get a Quote

1. Click "Get a Quote" button
2. Fill in your contact information
3. Submit your request

The estimated price updates automatically as you customize.

## 🔄 Restarting the Servers

If you need to restart the servers later:

**Backend (Terminal 1):**
```bash
cd server
npm start
```

**Frontend (Terminal 2):**
```bash
cd client
npm run dev
```

Or install concurrently and run both at once:
```bash
npm install
npm run dev
```

## 📧 Email Notifications (Optional)

To enable email confirmations:

1. Copy the example environment file:
   ```bash
   cd server
   copy .env.example .env
   ```

2. Edit `.env` with your email settings:
   ```
   SMTP_HOST=smtp.gmail.com
   SMTP_PORT=587
   SMTP_USER=your-email@gmail.com
   SMTP_PASS=your-app-password
   ADMIN_EMAIL=admin@yourdomain.com
   ```

3. Restart the backend server

**Note:** The app works without email configured - quotes are still saved to memory.

## 🎨 Customization Ideas

Try these popular configurations:

**Classic Barn Storage:**
- 12×16 feet
- Lofted Barn style
- Gambrel roof
- Brown walls (#8B4513)
- Dark gray roof (#2C3E50)

**Modern Garden Shed:**
- 8×12 feet
- Cottage style
- Gable roof
- Light blue walls (#87CEEB)
- White trim
- 2 windows

**Workshop Cabin:**
- 16×24 feet
- Cabin style
- A-Frame roof
- Natural wood walls (#8B7355)
- 2 double doors (8ft wide)
- 4 windows

## 🛠️ Troubleshooting

**3D model not showing?**
- Check browser console for errors
- Try refreshing the page
- Ensure you're using a modern browser (Chrome, Firefox, Edge)

**Quote submission not working?**
- Verify backend server is running on port 3001
- Check browser console for CORS errors
- Ensure all required fields are filled

**Servers won't start?**
- Make sure ports 3001 and 5173 are not in use
- Run `npm install` in both client and server directories
- Check Node.js version (requires 16+)

## 📱 Mobile Support

The app is fully responsive! On mobile:
- Control panel appears at the bottom
- Swipe to scroll through options
- Use touch gestures to rotate/zoom the 3D model

## 🚀 Next Steps

- Explore different building configurations
- Try various color combinations
- Submit a test quote to see the workflow
- Check the main README.md for development details

Enjoy designing your perfect building! 🏠
