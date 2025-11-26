# Chakula Bei - Food Price Tracker Setup & Running Guide

## Project Overview

Chakula Bei is a Commodity Price Tracker application for Kenya that helps users monitor and compare food prices across different counties and supermarkets.

## System Status

✓ **Build**: Successful (npm run build passes)
✓ **Database**: Fully configured with Supabase
✓ **Edge Functions**: Deployed and working (no external API keys needed)
✓ **Frontend**: Ready to run
✓ **Lovable API**: Removed - no longer required

## Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Internet connection for Supabase connectivity

## Quick Start

### 1. Install Dependencies

```bash
npm install
```

### 2. Start Development Server

```bash
npm run dev
```

The app will be available at:
- Local: http://localhost:8080/
- Network: http://169.254.8.1:8080/ (or similar)

### 3. Access the Application

Open your browser and navigate to `http://localhost:8080`

## Database Configuration

The database is automatically configured with:

- **Host**: Supabase (hiaazopszgkubvdtwkwe.supabase.co)
- **Tables**:
  - profiles (user accounts)
  - counties (10 Kenyan counties with seed data)
  - categories (6 food categories)
  - commodities (12 food items with seed data)
  - prices (sample prices for demonstration)
  - price_alerts (user alerts)
  - notifications (system notifications)
  - inventory (seller stock management)
  - sales_records (seller sales tracking)

- **Row Level Security (RLS)**: Enabled on all tables
- **Real-time**: Enabled for prices, commodities, and notifications

## Features

### For Buyers
- Browse food prices by county
- Search for commodities
- View price history and trends
- Set price alerts
- Compare prices across regions
- Access market analytics dashboard

### For Sellers
- Manage inventory
- Track sales
- Update prices

### For Admins
- Trigger price scraping (generates mock data with price variations)
- Manage system data

## Available Pages

1. **Home (/)** - Main price browsing interface
   - Search bar for finding foods
   - County filter
   - Price cards with trends
   - Interactive price history charts

2. **Dashboard (/dashboard)** - Analytics and insights
   - Weekly highlights
   - Price trends
   - New products
   - Market analytics
   - Price alerts management

3. **Inventory (/inventory)** - Seller inventory management
   - View current stock
   - Add/edit/delete items
   - Track quantities

4. **Admin (/admin)** - Administrative panel
   - Trigger price scraping
   - View scraping results
   - Monitor automated updates

5. **Auth (/auth)** - Authentication
   - Sign up with email/password
   - Sign in
   - Role selection (buyer/seller)

## Price Scraping (Admin Feature)

The scraper generates mock price data with slight variations to simulate real market fluctuations:

```bash
# Trigger from Admin panel at /admin
# No API keys needed - uses mock data internally
```

The scraper:
- Creates/updates 12 food commodities
- Adds prices for Nairobi county
- Generates realistic price variations per supermarket
- Can be triggered for all supermarkets or individual ones

## Build for Production

```bash
npm run build
```

Output will be in the `dist/` directory ready for deployment.

## Environment Variables

Already configured in `.env`:
- `VITE_SUPABASE_URL` - Supabase project URL
- `VITE_SUPABASE_ANON_KEY` - Supabase anonymous key

No additional API keys needed!

## Technologies Used

- **Frontend**: React 18 + TypeScript + Vite
- **UI Components**: shadcn/ui with Radix UI
- **Styling**: Tailwind CSS
- **Backend**: Supabase (PostgreSQL)
- **Real-time**: Supabase RealtimeDB
- **Charts**: Recharts
- **Forms**: React Hook Form
- **Query Management**: TanStack React Query
- **Routing**: React Router v6

## Troubleshooting

### Dev Server Won't Start
```bash
# Clear node modules and reinstall
rm -rf node_modules package-lock.json
npm install
npm run dev
```

### Prices Not Loading
- Check internet connection
- Verify Supabase credentials in `.env`
- Check browser console for errors (F12)

### Authentication Issues
- Ensure you're signing up with a valid email
- Wait a moment after sign up before signing in
- Clear browser cookies if persistent issues

### Build Fails
```bash
npm run build -- --trace-warnings
```

## Database Reset (if needed)

To reset the database to seed data only:
1. Go to Supabase dashboard
2. Run the seed migration again
3. Refresh the application

## API Endpoints

The application uses Supabase API endpoints automatically. No manual API configuration needed.

**Edge Functions Available**:
- `POST /functions/v1/scrape-prices` - Trigger price scraping

## Support

For issues or questions:
1. Check the browser console (F12) for error messages
2. Verify Supabase connectivity
3. Ensure all npm packages are installed

## Production Deployment

### Using Vercel
```bash
npm run build
# Deploy dist/ folder to Vercel
```

### Using Docker
```dockerfile
FROM node:18-alpine
WORKDIR /app
COPY . .
RUN npm install
RUN npm run build
EXPOSE 3000
CMD ["npm", "run", "preview"]
```

## Performance Notes

The application includes:
- Lazy loading for dashboard components
- Real-time price updates (WebSocket)
- Optimized image loading
- CSS minification
- JavaScript bundling and tree-shaking

Current bundle size: ~300KB gzipped (suitable for production)

## Next Steps

1. Start dev server: `npm run dev`
2. Sign up at /auth with your email
3. Browse prices on the home page
4. Explore the dashboard
5. Try the admin scraper to add more prices

Enjoy using Chakula Bei!
