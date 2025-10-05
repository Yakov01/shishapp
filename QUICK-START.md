# Quick Start Guide - Shisha Charcoal Timer

Get up and running in under 2 minutes!

## Installation

1. **Install dependencies:**
   ```bash
   cd shisha-timer
   npm install
   ```

2. **Start the development server:**
   ```bash
   npm run dev
   ```

3. **Open your browser:**
   Navigate to [http://localhost:3000](http://localhost:3000)

That's it! No database setup, no configuration files, no API keys. Just install and run! 🚀

## Quick Test

1. **Click on Table 1** (grey square)
   - Table turns green
   - 20:00 timer starts counting down
   - Shows "1/3" (first charcoal change)

2. **Wait for timer to reach 00:00** (or simulate by waiting)
   - Table turns red and flashes
   - Sound alert plays (if enabled)
   - Shows "ALERT!"

3. **Click the red table** (simulating charcoal change)
   - Table turns green again
   - New 20:00 timer starts
   - Shows "2/3" (second charcoal change)

4. **Repeat for 3rd change**
   - After 3rd timer expires and you click the table
   - Table automatically resets to grey (available)

## Key Features

- **25 Tables**: All displayed in a responsive grid
- **Color Coding**: Grey (available) → Green (active) → Red (alert)
- **Automatic Timers**: 20 minutes per charcoal change
- **Session Tracking**: 3 changes per session, then auto-reset
- **Sound Alerts**: Toggle on/off with speaker icon
- **Offline Ready**: Works without internet, data saved in browser
- **Mobile Friendly**: Use on phones, tablets, or desktop

## Customization

### Change Timer Duration (e.g., to 15 minutes)

Edit `lib/store.ts` and change both occurrences:
```typescript
// Line ~85 and ~137
const endTime = new Date(now.getTime() + 15 * 60 * 1000) // Changed from 20 to 15
```

### Change Number of Tables (e.g., to 30 tables)

Edit `lib/store.ts` around line 53:
```typescript
for (let i = 1; i <= 30; i++) { // Changed from 25 to 30
```

## Deployment

Build for production:
```bash
npm run build
```

Deploy to Vercel (recommended):
```bash
npx vercel
```

Or deploy to any static hosting platform - no backend needed!

## Troubleshooting

**Problem: Tables don't appear**
- Make sure you're on `http://localhost:3000` (not HTTPS in dev)
- Check browser console for errors
- Try clearing localStorage: `localStorage.clear()` in DevTools console

**Problem: Timers not updating**
- Refresh the page
- Make sure JavaScript is enabled

**Problem: Sound not playing**
- Click the speaker icon to ensure sound is enabled
- Check browser sound permissions
- Try clicking anywhere on the page first (some browsers block audio until user interaction)

**Reset Everything:**
```javascript
// In browser DevTools console:
localStorage.removeItem('shisha-tables')
location.reload()
```

## Production Tips

1. **Use on a tablet**: Best experience for shisha masters in a busy bar
2. **Keep browser open**: Timers continue to run even if you switch tabs
3. **Regular backups**: Since data is in localStorage, consider exporting state periodically (future feature)
4. **Test before shift**: Make sure audio works and all tables display correctly

Enjoy your Shisha Charcoal Timer! 🔥
