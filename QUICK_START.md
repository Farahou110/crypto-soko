# Chakula Bei - Quick Start Guide

## 🚀 Start the App Right Now

```bash
npm run dev
```

Then open: **http://localhost:8080**

That's it! The app is ready to use.

## 📝 Try These First (No Sign-up Required)

1. **Browse Prices** - Homepage shows all food prices immediately
2. **Search** - Type "rice", "tomatoes", etc.
3. **Filter by County** - Select different Kenyan counties
4. **View History** - Click any price card to see trends

## 👤 Sign Up & Explore More

Visit: **http://localhost:8080/auth**

- Email: any@email.com
- Password: anything
- Role: Choose "Buyer" or "Seller"

## 📊 After Sign In

- **Dashboard** - View market analytics and price trends
- **Inventory** (if seller) - Manage stock
- **Price Alerts** - Get notified of price changes
- **Admin** (click Admin button in header) - Add more prices

## 🛠️ Admin: Generate More Prices

1. Click "Admin" button in top navigation
2. Click "Start Scraping" button
3. Watch as it generates 48 new prices across all supermarkets
4. Prices appear instantly on home page (real-time!)

## 🌙 Dark Mode

Click the theme toggle in the top right corner.

## 🔧 Useful Commands

| Command | Purpose |
|---------|---------|
| `npm run dev` | Start development server |
| `npm run build` | Create production bundle |
| `npm run preview` | View production build |
| `npm run lint` | Check code quality |

## 📱 Access from Other Devices

When running `npm run dev`, you'll see output like:

```
➜  Local:   http://localhost:8080/
➜  Network: http://192.168.x.x:8080/
```

Use the Network URL from other devices on same WiFi.

## ✅ What's Already Set Up

- ✓ Database with seed data
- ✓ Authentication system
- ✓ Real-time price updates
- ✓ Edge function for scraping
- ✓ All pages and features
- ✓ Production build ready

## ❌ What You DON'T Need

- ✗ No API keys to add
- ✗ No external services to configure
- ✗ No database setup needed
- ✗ No dependencies to install beyond `npm install`

## 🐛 Troubleshooting

**Server won't start:**
```bash
rm -rf node_modules
npm install
npm run dev
```

**Prices not loading:**
- Check internet connection
- Clear browser cache (Ctrl+Shift+Delete)
- Refresh page

**Sign up not working:**
- Use a valid email address
- Password must be 6+ characters
- Wait 2 seconds before trying to sign in

## 📚 Learn More

See full documentation: `SETUP_AND_RUNNING.md`

---

**That's all! You're ready to explore Chakula Bei!**

Open http://localhost:8080 now and start browsing food prices!
