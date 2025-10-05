# Shisha Charcoal Timer App

A time management tool for hookah/shisha bars that ensures charcoal changes happen on time across multiple tables.

## Features

- **Visual Table Grid**: 25 tables displayed with color-coded status indicators
- **Automatic Timers**: 20-minute countdown timers for each table
- **Sound Notifications**: Audio alerts when charcoal needs changing
- **Session Tracking**: Tracks 3 charcoal changes per session
- **Auto-Reset**: Tables automatically reset after 3rd change
- **Responsive Design**: Works on desktop, tablet, and mobile devices
- **Local Storage**: All data persists in browser localStorage (no database required!)

## Tech Stack

- **Frontend**: Next.js 14+ with TypeScript
- **UI Components**: Shadcn UI + Tailwind CSS
- **State Management**: Zustand
- **Data Persistence**: Browser localStorage
- **No Backend Required**: Runs completely client-side

## Getting Started

### Prerequisites

- Node.js 18+ installed

### 1. Install Dependencies

```bash
cd shisha-timer
npm install
```

### 2. Run Development Server

```bash
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) in your browser.

That's it! No database setup required. The app stores all data in your browser's localStorage.

## How to Use

### Color States

- **Grey**: Table is available (not in use)
- **Green**: Table is active with timer running
- **Red**: Alert - charcoal needs to be changed!

### Workflow

1. When a customer orders shisha, tap the grey table
2. Table turns green and 20-minute timer starts
3. After 20 minutes, table turns red and sound alert plays
4. Change the charcoal and tap the red table
5. Table turns green again for the next 20-minute period
6. Repeat for 3 total charcoal changes per session
7. After the 3rd change, table automatically resets to grey

### Sound Control

Use the speaker icon in the top right to toggle sound notifications on/off.

## Data Storage

All table states, timers, and session data are stored in your browser's localStorage. This means:

- ✅ No database setup required
- ✅ No backend needed
- ✅ Works completely offline
- ✅ Data persists even after browser refresh
- ⚠️ Data is device-specific (clearing browser data will reset the app)

## Deployment

### Vercel (Recommended)

1. Push your code to GitHub
2. Import the project in [Vercel](https://vercel.com)
3. Deploy! (No environment variables needed)

### Other Platforms

Since this is a pure client-side app with no backend, you can deploy it anywhere:
- Netlify
- GitHub Pages
- Cloudflare Pages
- Any static hosting service

## Customization

### Changing Timer Duration

The timer is set to 20 minutes by default. To change this, edit `lib/store.ts`:

```typescript
// Find this line (appears twice):
const endTime = new Date(now.getTime() + 20 * 60 * 1000)

// Change 20 to your desired minutes:
const endTime = new Date(now.getTime() + 15 * 60 * 1000) // 15 minutes
```

### Changing Number of Tables

The app defaults to 25 tables. To change this, edit `lib/store.ts`:

```typescript
// Find this loop:
for (let i = 1; i <= 25; i++) {

// Change 25 to your desired number:
for (let i = 1; i <= 30; i++) { // 30 tables
```

### Reset All Data

To reset the app to default state:
1. Open browser DevTools (F12)
2. Go to Console tab
3. Run: `localStorage.removeItem('shisha-tables')`
4. Refresh the page

## Future Enhancements

- Settings panel for easy table count configuration
- Export/import data functionality
- Multi-device sync (optional cloud backend)
- Timer pause/resume
- Session history/analytics
- PWA support for home screen installation
- Multi-language support
- Optional PIN protection

## License

MIT

## Support

For issues or questions, please open an issue on GitHub.
