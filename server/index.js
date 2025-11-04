const express = require('express');
const cors = require('cors');
const bodyParser = require('body-parser');
const nodemailer = require('nodemailer');
require('dotenv').config();

const app = express();
const PORT = process.env.PORT || 3001;

// Middleware
app.use(cors());
app.use(bodyParser.json());
app.use(bodyParser.urlencoded({ extended: true }));

// In-memory storage for quotes (in production, use a database)
const quotes = [];

// Email transporter (configure with your email service)
const transporter = nodemailer.createTransport({
  host: process.env.SMTP_HOST || 'smtp.gmail.com',
  port: process.env.SMTP_PORT || 587,
  secure: false,
  auth: {
    user: process.env.SMTP_USER,
    pass: process.env.SMTP_PASS,
  },
});

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ status: 'ok', message: 'Server is running' });
});

// Submit quote request
app.post('/api/quote', async (req, res) => {
  try {
    const {
      name,
      email,
      phone,
      zipCode,
      message,
      buildingConfig,
      totalPrice,
    } = req.body;

    // Validate required fields
    if (!name || !email || !phone || !zipCode) {
      return res.status(400).json({
        error: 'Missing required fields',
        required: ['name', 'email', 'phone', 'zipCode'],
      });
    }

    // Create quote object
    const quote = {
      id: `QUOTE-${Date.now()}-${Math.random().toString(36).substr(2, 9)}`,
      timestamp: new Date().toISOString(),
      customer: {
        name,
        email,
        phone,
        zipCode,
      },
      message: message || '',
      buildingConfig,
      totalPrice,
      status: 'pending',
    };

    // Store quote
    quotes.push(quote);

    // Send confirmation email to customer (if email is configured)
    if (process.env.SMTP_USER && process.env.SMTP_PASS) {
      try {
        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'noreply@buildingdesigner.com',
          to: email,
          subject: 'Building Quote Request - Confirmation',
          html: `
            <div style="font-family: Arial, sans-serif; max-width: 600px; margin: 0 auto;">
              <h2 style="color: #2563eb;">Thank You for Your Quote Request!</h2>
              <p>Hi ${name},</p>
              <p>We've received your quote request for a custom building. Here are the details:</p>

              <div style="background: #f3f4f6; padding: 20px; border-radius: 8px; margin: 20px 0;">
                <h3 style="margin-top: 0;">Building Configuration</h3>
                <ul style="list-style: none; padding: 0;">
                  <li><strong>Dimensions:</strong> ${buildingConfig.width}' × ${buildingConfig.depth}' × ${buildingConfig.wallHeight}'</li>
                  <li><strong>Style:</strong> ${buildingConfig.buildingStyle}</li>
                  <li><strong>Roof:</strong> ${buildingConfig.roofStyle}</li>
                  <li><strong>Doors:</strong> ${buildingConfig.doors} (${buildingConfig.doorWidth}' wide)</li>
                  <li><strong>Windows:</strong> ${buildingConfig.windows}</li>
                </ul>
                <div style="margin-top: 15px; padding-top: 15px; border-top: 2px solid #2563eb;">
                  <strong style="font-size: 18px;">Estimated Price: $${totalPrice.toLocaleString()}</strong>
                </div>
              </div>

              <p>One of our representatives will contact you shortly at ${phone} to discuss your project and provide a final quote.</p>

              <p>Your quote reference number is: <strong>${quote.id}</strong></p>

              <p>Best regards,<br>Building Designer Team</p>
            </div>
          `,
        });

        // Send notification to admin
        await transporter.sendMail({
          from: process.env.SMTP_FROM || 'noreply@buildingdesigner.com',
          to: process.env.ADMIN_EMAIL || 'admin@buildingdesigner.com',
          subject: `New Quote Request from ${name}`,
          html: `
            <div style="font-family: Arial, sans-serif;">
              <h2>New Quote Request</h2>
              <p><strong>Quote ID:</strong> ${quote.id}</p>

              <h3>Customer Information</h3>
              <ul>
                <li><strong>Name:</strong> ${name}</li>
                <li><strong>Email:</strong> ${email}</li>
                <li><strong>Phone:</strong> ${phone}</li>
                <li><strong>Zip Code:</strong> ${zipCode}</li>
              </ul>

              <h3>Building Configuration</h3>
              <ul>
                <li><strong>Dimensions:</strong> ${buildingConfig.width}' × ${buildingConfig.depth}' × ${buildingConfig.wallHeight}'</li>
                <li><strong>Building Style:</strong> ${buildingConfig.buildingStyle}</li>
                <li><strong>Roof Style:</strong> ${buildingConfig.roofStyle}</li>
                <li><strong>Doors:</strong> ${buildingConfig.doors} doors (${buildingConfig.doorWidth}' wide)</li>
                <li><strong>Windows:</strong> ${buildingConfig.windows}</li>
                <li><strong>Wall Color:</strong> ${buildingConfig.wallColor}</li>
                <li><strong>Roof Color:</strong> ${buildingConfig.roofColor}</li>
                <li><strong>Trim Color:</strong> ${buildingConfig.trimColor}</li>
                <li><strong>Door Color:</strong> ${buildingConfig.doorColor}</li>
              </ul>

              <h3>Pricing</h3>
              <p><strong>Estimated Total:</strong> $${totalPrice.toLocaleString()}</p>

              ${message ? `<h3>Customer Message</h3><p>${message}</p>` : ''}
            </div>
          `,
        });
      } catch (emailError) {
        console.error('Email error:', emailError);
        // Don't fail the request if email fails
      }
    }

    // Return success response
    res.status(201).json({
      success: true,
      message: 'Quote request submitted successfully',
      quoteId: quote.id,
    });
  } catch (error) {
    console.error('Error processing quote:', error);
    res.status(500).json({
      error: 'Failed to process quote request',
      message: error.message,
    });
  }
});

// Get all quotes (for admin panel - should be protected in production)
app.get('/api/quotes', (req, res) => {
  res.json({
    total: quotes.length,
    quotes: quotes.sort((a, b) => new Date(b.timestamp) - new Date(a.timestamp)),
  });
});

// Get specific quote
app.get('/api/quote/:id', (req, res) => {
  const quote = quotes.find(q => q.id === req.params.id);
  if (!quote) {
    return res.status(404).json({ error: 'Quote not found' });
  }
  res.json(quote);
});

// Start server
app.listen(PORT, () => {
  console.log(`Server running on http://localhost:${PORT}`);
  console.log(`API endpoints:`);
  console.log(`  - POST http://localhost:${PORT}/api/quote`);
  console.log(`  - GET  http://localhost:${PORT}/api/quotes`);
  console.log(`  - GET  http://localhost:${PORT}/api/quote/:id`);
  console.log(`  - GET  http://localhost:${PORT}/api/health`);
});
