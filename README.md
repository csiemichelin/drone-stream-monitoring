# Hazardeye - AI Road Monitoring Platform

A comprehensive drone stream monitoring platform with VLM-powered road anomaly detection and annotation review workflow.

## Features

### Core Capabilities
- **Real-time Drone Stream Monitoring** - Monitor multiple video streams from drones
- **VLM Road Anomaly Detection** - AI-powered detection of road closures, accidents, congestion, obstacles
- **Annotation Review Workflow** - Professional task queue with status transitions (needs_review → approved/rejected → resolved)
- **Three-Column Workspace** - Task queue, stream viewer, and fields panel
- **Live Updates** - Real-time task notifications and updates (simulated WebSocket)

### Pages
1. **Overview Dashboard** (`/`) - Key metrics, critical tasks, location risk analysis
2. **Task Workspace** (`/tasks`) - Main annotation interface with three-column layout
3. **Stream Management** (`/streams`) - Monitor and control video streams
4. **Settings** (`/settings`) - Configure detection thresholds and preferences

### Technical Stack
- **Framework**: Next.js 16 App Router + TypeScript
- **UI**: Tailwind CSS v4 + shadcn/ui components
- **State**: In-memory data store (easily replaceable with PostgreSQL)
- **Real-time**: Event system with WebSocket simulation
- **VLM**: Mock implementation with interfaces for real VLM integration

## Getting Started

### Development
```bash
npm install
npm run dev
```

Open [http://localhost:3000](http://localhost:3000) to view the application.

### Demo Usage

1. **Start Monitoring**: Click "Start Monitoring" on the Tasks page to begin auto-analysis
2. **Review Tasks**: Select tasks from the left queue to view details
3. **Edit Fields**: Modify detection results in the right panel
4. **Workflow Actions**: Approve, Reject, or Resolve tasks
5. **Adjust Threshold**: Use the sensitivity slider to control detection sensitivity

## Architecture

### Data Model

#### Task
- Status flow: `new → analyzing → needs_review → approved/rejected → resolved`
- Priority: `low | medium | high`
- Severity: `info | warning | critical`
- Editable fields for human oversight

#### VLM Analysis
- Road closure detection
- Anomaly classification (6 types)
- Confidence scoring
- Affected lanes tracking
- Evidence logging

#### Stream
- Status: `active | inactive | error`
- Real-time metrics (FPS, latency, bitrate)
- Multiple concurrent streams

### Replacing Mock Implementations

#### VLM Integration
Replace `lib/mock-vlm.ts` with actual VLM provider:

```typescript
import { OpenAIVLMProvider } from './vlm-providers'

const vlmProvider = new OpenAIVLMProvider()
vlmProvider.configure(process.env.OPENAI_API_KEY)

const analysis = await vlmProvider.analyzeFrame(frameBlob)
```

#### Database Integration
Replace `lib/store.ts` with Postgres/Supabase:

```typescript
// Create tables using scripts/init-db.sql
// Update store methods to use SQL queries
```

#### WebSocket Server
Replace `lib/websocket-mock.ts` with Socket.io or Pusher:

```typescript
import { Server } from 'socket.io'

const io = new Server(server)
io.on('connection', (socket) => {
  // Handle real-time events
})
```

## API Routes

- `GET /api/tasks` - List tasks (with filters)
- `GET /api/tasks/:id` - Get task details
- `POST /api/tasks/:id/assign` - Assign task
- `POST /api/tasks/:id/update-fields` - Update task fields
- `POST /api/tasks/:id/transition` - Workflow transition
- `POST /api/streams/:id/start` - Start stream
- `POST /api/streams/:id/stop` - Stop stream

## Keyboard Shortcuts (Planned)

- `J/K` - Navigate tasks
- `A` - Approve current task
- `R` - Reject current task
- `E` - Mark as resolved

## Design Features

- Dark theme optimized for monitoring
- High information density
- Clear status indicators
- Optional 3D effects (glassmorphism)
- Reduce motion support
- Professional annotation platform aesthetic

## Production Considerations

1. **Replace Mock VLM** - Integrate real vision model (GPT-5 Vision, Claude, etc.)
2. **Add Database** - Migrate from in-memory to PostgreSQL/Supabase
3. **Implement WebSocket** - Real-time updates with Socket.io or Pusher
4. **Add Authentication** - Protect routes and track reviewers
5. **Stream Integration** - Support RTSP/RTMP/HLS protocols
6. **Export Functionality** - CSV/JSON export for tasks and analyses
7. **Batch Operations** - Multi-select task actions
8. **Advanced Filtering** - Date ranges, custom queries
9. **Audit Logging** - Complete change history
10. **Performance Optimization** - Pagination, virtual scrolling

## License

Built with v0 by Vercel
