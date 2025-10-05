# Comprehensive PRD for Shisha Charcoal Timer App

## Project Context
You are building a time management tool for hookah/shisha bars that ensures charcoal changes happen on time across multiple tables. The tech stack is:
- Frontend: NextJS with Shadcn UI components
- Backend: Python

## Detailed Requirements

### 1. Product Overview
**Problem Statement:** Shisha Masters in hookah bars frequently forget to change charcoal on time, leading to poor customer experience. Each shisha session requires charcoal changes every 20 minutes (3 times total per session), and managing 25 tables simultaneously makes it easy to lose track.

**Solution:** A visual dashboard that displays all 25 tables with color-coded status indicators and automatic timers. The system alerts staff when charcoal needs changing and automatically tracks the complete session lifecycle.

**Value Proposition:** Ensures consistent, timely charcoal changes across all tables, improving service quality and customer satisfaction.

### 2. User Personas
**Shisha Master (Primary User)**
- Role: Staff member responsible for preparing and maintaining shisha/hookah
- Environment: Fast-paced hookah bar with up to 25 active tables
- Needs:
  - Quick visual overview of all table statuses
  - Clear alerts when action is needed
  - Simple interaction (single tap to start/reset timers)
  - Reliable timing to maintain service quality
- Technical skill: Basic - needs intuitive, minimal interface

### 3. User Journey Map

**Scenario: Managing Multiple Shisha Tables Throughout a Shift**

1. **Shift Start**
   - User opens the app
   - Sees dashboard with 25-table grid
   - All tables display grey (available/empty status)

2. **Customer Orders Shisha**
   - Customer at Table 5 orders shisha
   - Shisha Master prepares the hookah
   - Master taps Table 5 on the screen
   - Table 5 turns green
   - 20-minute countdown timer starts and displays on the table
   - Session counter shows: Change 1 of 3

3. **First Charcoal Change (20 minutes later)**
   - Timer reaches 0:00
   - Table 5 turns red
   - Sound alert plays
   - Master goes to Table 5, changes charcoal
   - Master taps Table 5 on screen
   - Table 5 turns green again
   - New 20-minute timer starts
   - Session counter shows: Change 2 of 3

4. **Second Charcoal Change (40 minutes total)**
   - Timer reaches 0:00 again
   - Table 5 turns red
   - Sound alert plays
   - Master changes charcoal
   - Master taps Table 5
   - Table 5 turns green
   - Timer starts for final 20-minute period
   - Session counter shows: Change 3 of 3

5. **Session Complete (60 minutes total)**
   - Timer reaches 0:00
   - Table 5 turns red
   - Sound alert plays
   - Master changes charcoal (final time)
   - Master taps Table 5
   - **Table 5 automatically resets to grey** (session complete)
   - Table is now available for next customer

6. **Managing Multiple Tables**
   - Throughout the shift, Master manages multiple tables
   - At any moment, can see at a glance:
     - Grey tables: Available
     - Green tables: Active, no action needed yet
     - Red tables: Urgent - charcoal change required
   - Sound alerts notify when any table needs attention

### 4. Feature Specifications

#### Feature 1: Visual Table Grid Dashboard
**Description:** Main interface displaying all 25 tables in a grid layout with color-coded status indicators.

**User Stories:**
- As a Shisha Master, I want to see all 25 tables at once so I can quickly assess which tables need attention
- As a Shisha Master, I want tables color-coded so I can instantly identify table status without reading text

**Acceptance Criteria:**
- Display exactly 25 table tiles in a responsive grid (5x5 or adaptive layout)
- Each table shows:
  - Table number (1-25)
  - Current status color (grey/green/red)
  - Countdown timer (when active)
  - Session progress (e.g., "2/3" for second charcoal change)
- Colors must be clearly distinguishable:
  - Grey: #9CA3AF or similar (inactive/available)
  - Green: #10B981 or similar (active, time remaining)
  - Red: #EF4444 or similar (action required)
- Grid is responsive and works on tablets, phones, and desktop
- Each table tile is tappable/clickable

#### Feature 2: Timer System
**Description:** Automatic 20-minute countdown timers for each table that trigger alerts and color changes.

**User Stories:**
- As a Shisha Master, I want automatic timers so I don't have to manually track time for each table
- As a Shisha Master, I want to see the remaining time on each table so I can plan my workflow

**Acceptance Criteria:**
- Timer duration: Exactly 20 minutes (1200 seconds)
- Timer starts when table is tapped from grey or red state
- Timer displays in MM:SS format (e.g., "19:45", "05:23", "00:15")
- Timer updates every second
- When timer reaches 00:00:
  - Table turns red
  - Sound alert plays
  - Timer stops at 00:00 (doesn't go negative)
- Timer is visible on the table tile
- Timers run independently for each table
- Timers persist if app is refreshed (stored in database)

#### Feature 3: Sound Notifications
**Description:** Audio alerts that play when charcoal change is needed (timer reaches zero).

**User Stories:**
- As a Shisha Master, I want audio alerts so I'm notified even when not looking at the screen
- As a Shisha Master, I want clear notification sounds so I can hear them in a busy bar environment

**Acceptance Criteria:**
- Sound plays automatically when any table timer reaches 00:00
- Sound is clear and audible in noisy environment
- Sound plays once per alert (doesn't loop continuously)
- Sound works on all devices (desktop, tablet, mobile)
- Browser permissions for audio are requested if needed
- If multiple tables hit 00:00 simultaneously, sound plays for each (or plays once with visual indication of multiple alerts)

#### Feature 4: Session Tracking
**Description:** Tracks the number of charcoal changes per session (3 total) and automatically resets table after completion.

**User Stories:**
- As a Shisha Master, I want to know how many charcoal changes remain so I know when the session will end
- As a Shisha Master, I want tables to automatically reset after 3 changes so I don't have to manually mark them as available

**Acceptance Criteria:**
- Each table tracks current charcoal change number (1/3, 2/3, 3/3)
- Counter displays on table tile
- Counter increments each time table is tapped from red state
- After 3rd charcoal change (when tapped after final red alert):
  - Table automatically resets to grey
  - Counter resets to 0
  - Timer clears
  - Table is ready for next customer
- Session state persists in database

#### Feature 5: Table Management (Add/Remove Tables)
**Description:** Admin functionality to configure the number of tables displayed.

**User Stories:**
- As a Shisha Master/Manager, I want to add or remove tables so the app matches our physical layout
- As a user, I want to configure table count for different locations/sections

**Acceptance Criteria:**
- Settings panel or menu to access table management
- Ability to set total number of tables (default: 25)
- Ability to add tables (up to reasonable maximum, e.g., 50)
- Ability to remove tables (minimum 1)
- When tables are removed, any active sessions are preserved or user is warned
- Table configuration persists in database
- Grid layout adapts automatically to table count

### 5. Data Architecture

**Supabase Schema:**

```sql
-- Tables configuration
CREATE TABLE tables (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_number INTEGER NOT NULL UNIQUE,
  created_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Active sessions tracking
CREATE TABLE table_sessions (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  table_id UUID REFERENCES tables(id) ON DELETE CASCADE,
  status VARCHAR(20) NOT NULL CHECK (status IN ('available', 'active', 'alert')),
  -- available = grey, active = green, alert = red
  current_change INTEGER DEFAULT 0 CHECK (current_change >= 0 AND current_change <= 3),
  -- 0 = not started, 1-3 = charcoal change number
  timer_start_time TIMESTAMP WITH TIME ZONE,
  timer_end_time TIMESTAMP WITH TIME ZONE,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW(),
  UNIQUE(table_id)
);

-- App configuration
CREATE TABLE app_config (
  id UUID PRIMARY KEY DEFAULT uuid_generate_v4(),
  total_tables INTEGER DEFAULT 25,
  timer_duration_minutes INTEGER DEFAULT 20,
  updated_at TIMESTAMP WITH TIME ZONE DEFAULT NOW()
);

-- Indexes for performance
CREATE INDEX idx_table_sessions_status ON table_sessions(status);
CREATE INDEX idx_table_sessions_table_id ON table_sessions(table_id);
```

**Key Relationships:**
- Each `table` can have one active `table_session`
- `table_sessions` track current state, timer info, and change count
- `app_config` stores global settings (table count, timer duration)

**Data Types & Constraints:**
- Status values: 'available' (grey), 'active' (green), 'alert' (red)
- Current change: 0-3 (0 = new, 1-3 = charcoal change number)
- Timer times stored as timestamps for accuracy
- Unique constraint on table_number prevents duplicates

### 6. n8n Workflow Design

#### Workflow 1: Timer Expiration Checker
**Trigger:** Scheduled (every 10 seconds)
**Purpose:** Check all active tables and update status when timers expire

**Steps:**
1. Query all table_sessions where status = 'active' and timer_end_time <= NOW()
2. For each expired timer:
   - Update status to 'alert' (red)
   - Trigger webhook to notify frontend
3. Return list of updated table IDs

**Outputs:** Webhook notification to frontend with table IDs that need alerts

#### Workflow 2: Auto-Reset After Session Complete
**Trigger:** Webhook (when table is tapped from alert state)
**Purpose:** Reset table to available after 3rd charcoal change

**Steps:**
1. Receive table_id and current_change count
2. If current_change = 3:
   - Update status to 'available'
   - Reset current_change to 0
   - Clear timer_start_time and timer_end_time
3. Else:
   - Update status to 'active'
   - Set new timer_start_time and timer_end_time (20 minutes from now)
   - Increment current_change
4. Return updated table state

**Outputs:** Updated table session data

### 7. API Endpoints

**Webhook Routes:**

```
POST /api/table/activate
Body: { table_id: UUID }
Purpose: Start timer when table is tapped from grey state
Returns: Updated table session with timer info

POST /api/table/change-charcoal
Body: { table_id: UUID }
Purpose: Handle charcoal change (tap from red state)
Returns: Updated table session (either new timer or reset to grey)

GET /api/tables/status
Purpose: Get current status of all tables
Returns: Array of all table sessions with current state

POST /api/config/tables
Body: { total_tables: number }
Purpose: Update total table count
Returns: Updated configuration

GET /api/config
Purpose: Get app configuration
Returns: Current app settings (total tables, timer duration, etc.)
```

### 8. UI/UX Requirements

**Design System:**
- Style: Minimal, clean, functional
- Theme: Dark mode friendly (hookah bar environment often has dim lighting)
- Typography: Large, readable fonts (easy to see from distance)
- Color palette:
  - Background: Dark grey (#1F2937) or charcoal
  - Table tiles:
    - Grey: #6B7280 (available)
    - Green: #10B981 (active)
    - Red: #EF4444 (alert)
  - Text: White/light grey for contrast
  - Accent: Warm orange/amber for hookah theme

**Main Dashboard Screen:**
```
+------------------------------------------+
|  Shisha Charcoal Timer      [Settings]  |
+------------------------------------------+
|                                          |
|  [T1]  [T2]  [T3]  [T4]  [T5]           |
|  Grey  Green Red   Grey  Green          |
|        15:23 00:00       08:45          |
|              ALERT       1/3             |
|                                          |
|  [T6]  [T7]  [T8]  [T9]  [T10]          |
|  Green Grey  Grey  Green Red            |
|  19:01       12:34 00:00                |
|  2/3               3/3   ALERT          |
|                                          |
|  [...25 tables total in 5x5 grid...]    |
|                                          |
+------------------------------------------+
```

**Table Tile Component:**
- Square or slightly rectangular
- Large table number at top
- Timer display in center (when active)
- Session counter at bottom (e.g., "2/3")
- "ALERT" text when red
- Tap/click anywhere on tile to interact

**Settings/Config Screen:**
```
+------------------------------------------+
|  Settings                    [X Close]  |
+------------------------------------------+
|                                          |
|  Total Tables: [25] [+] [-]             |
|                                          |
|  Timer Duration: 20 minutes (fixed)     |
|                                          |
|  Sound: [ON/OFF toggle]                 |
|                                          |
|  [Save Configuration]                   |
|                                          |
+------------------------------------------+
```

**Responsive Behavior:**
- Desktop: 5x5 grid (or adaptive based on total tables)
- Tablet: 4x6 or 3x8 grid
- Mobile: 2-3 columns, scrollable
- Tiles scale proportionally to screen size

**Shadcn Components to Use:**
- Button (for settings, table interactions)
- Card (for table tiles)
- Badge (for session counter)
- Dialog (for settings panel)
- Toggle (for sound settings)
- Alert (for confirmations if needed)

### 9. Authentication & Authorization

**User Access:**
- No authentication required for MVP
- Single user type: Shisha Master
- All users have full access to:
  - View all tables
  - Start/stop timers
  - Access settings
  - Add/remove tables

**Future Consideration (not in MVP):**
- Optional simple PIN/password protection to prevent customer tampering
- Multi-location support with separate accounts

### 10. Business Logic

**Table State Machine:**
```
GREY (available)
  → [tap] → GREEN (active, timer running)

GREEN (active)
  → [timer expires] → RED (alert)

RED (alert, change 1 or 2)
  → [tap] → GREEN (active, timer running, increment counter)

RED (alert, change 3)
  → [tap] → GREY (available, reset counter)
```

**Key Rules:**
1. **20-Minute Timer:** Always exactly 20 minutes (1200 seconds)
2. **3-Change Session:** Each session consists of exactly 3 charcoal changes
3. **Auto-Reset:** After 3rd change, table automatically returns to grey
4. **Independent Timers:** Each table operates independently
5. **Alert on Zero:** Sound plays when timer reaches 00:00
6. **Tap to Acknowledge:** Red state requires manual tap to continue (confirms charcoal was changed)

**Validation Rules:**
- Cannot start timer on table already in green state
- Cannot have negative time
- Table number must be unique
- Total tables must be >= 1
- Current change count must be 0-3

**Edge Cases:**
- **App refresh during active timers:** Timers continue based on stored end time in database
- **Multiple simultaneous alerts:** Handle gracefully (queue sounds or play once with visual for all)
- **Table removed while active:** Warn user or gracefully deactivate
- **Browser audio blocked:** Show visual alert/message to enable sound

### 11. Technical Constraints

**Performance Requirements:**
- Dashboard must load in < 2 seconds
- Timer updates must be smooth (1-second intervals, no lag)
- Table state changes must be instant on tap (< 200ms response)
- Support up to 50 tables without performance degradation
- App must work offline (with sync when connection restored - future enhancement)

**Browser/Device Support:**
- Modern browsers: Chrome, Firefox, Safari, Edge (latest 2 versions)
- Tablets: iPad, Android tablets (primary use case)
- Mobile: iOS and Android phones (secondary)
- Desktop: Mac, Windows, Linux

**Real-time Updates:**
- Use Supabase Realtime for live table status updates
- If multiple devices open, all should sync automatically
- Timer synchronization across devices

**Audio Requirements:**
- Alert sound file: Short, clear notification (1-2 seconds)
- Format: MP3 or WAV
- Autoplay must work (handle browser permissions)

**Data Persistence:**
- All table states persist in Supabase
- Timers continue even if app is closed/refreshed
- Configuration settings persist

## Implementation Phases

### Phase 1: Core MVP (Week 1-2)
**Goal:** Functional single-device timer system

- [ ] Set up NextJS project with Shadcn UI
- [ ] Configure Supabase database and tables
- [ ] Build table grid dashboard (25 tables)
- [ ] Implement table state management (grey/green/red)
- [ ] Create 20-minute timer functionality
- [ ] Add tap interaction to start/reset timers
- [ ] Implement session tracking (1/3, 2/3, 3/3)
- [ ] Add auto-reset after 3rd change
- [ ] Integrate sound notifications
- [ ] Basic responsive design

**Deliverable:** Working app on single device with all core features

### Phase 2: Enhanced Features (Week 3)
**Goal:** Configuration and polish

- [ ] Build settings panel
- [ ] Add table management (add/remove tables)
- [ ] Implement n8n workflows for timer checking
- [ ] Add Supabase Realtime for multi-device sync
- [ ] Improve responsive design for all devices
- [ ] Add visual polish and animations
- [ ] Test across browsers and devices
- [ ] Performance optimization

**Deliverable:** Production-ready app with configuration options

### Phase 3: Nice-to-Have Features (Future)
**Goal:** Enhanced user experience

- [ ] Timer pause/resume functionality
- [ ] Adjustable timer duration (not just 20 min)
- [ ] Session history/analytics
- [ ] Dark/light mode toggle
- [ ] PWA support (install on home screen)
- [ ] Offline mode with sync
- [ ] Multi-language support
- [ ] Optional authentication/PIN protection
- [ ] Multi-location support
- [ ] Custom table layouts (not just grid)

**Deliverable:** Feature-rich version with advanced capabilities

## Success Metrics

**Primary Metrics:**
1. **Zero Missed Changes:** No charcoal changes should be missed when using the app
2. **Response Time:** Average time from alert to charcoal change < 2 minutes
3. **User Adoption:** All Shisha Masters use the app for all tables during shift

**Secondary Metrics:**
1. **App Reliability:** 99% uptime, no crashes during service hours
2. **Alert Effectiveness:** 100% of alerts are noticed (sound + visual)
3. **Session Completion:** All sessions complete properly (reach 3 changes or manual reset)

**User Satisfaction Indicators:**
- Shisha Masters report improved time management
- Customers receive consistent service quality
- Fewer complaints about stale charcoal
- Staff feels less stressed about timing

**Technical Metrics:**
- Page load time < 2 seconds
- Timer accuracy within 1 second
- Multi-device sync delay < 500ms
- Zero data loss on refresh/reload

---

## Development Notes

**Recommended Tech Stack Details:**
- **Frontend Framework:** NextJS 14+ (App Router)
- **UI Library:** Shadcn UI + Tailwind CSS
- **State Management:** React Context or Zustand
- **Database:** Supabase (PostgreSQL)
- **Realtime:** Supabase Realtime subscriptions
- **Backend Automation:** n8n (self-hosted or cloud)
- **Audio:** HTML5 Audio API
- **Deployment:** Vercel (frontend) + Supabase Cloud

**Key Libraries:**
- `@supabase/supabase-js` - Supabase client
- `date-fns` or `dayjs` - Time calculations
- `use-sound` or native Audio - Sound alerts
- Shadcn components: Button, Card, Badge, Dialog, Toggle

**Security Considerations:**
- Row Level Security (RLS) in Supabase
- Environment variables for API keys
- CORS configuration for n8n webhooks
- Input validation for table operations

**Testing Strategy:**
- Unit tests for timer logic
- Integration tests for state transitions
- E2E tests for complete user workflows
- Cross-device testing for sync
- Audio testing on various browsers

---

**This PRD is complete and ready for implementation. All specifications are detailed enough for an AI coding assistant or developer to build the entire application.**
