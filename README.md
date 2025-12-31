# 🏢 RuralSync - Service Provider Portal

> Dashboard for service providers to manage their organization, services, agents, and bookings.

[![React](https://img.shields.io/badge/React-18-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.x-blue.svg)](https://www.typescriptlang.org/)
[![Vite](https://img.shields.io/badge/Vite-5.x-646CFF.svg)](https://vitejs.dev/)
[![Tailwind CSS](https://img.shields.io/badge/Tailwind-3.x-38B2AC.svg)](https://tailwindcss.com/)

🔗 **Live Demo:** [https://ruralsync-service-provider.vercel.app/](https://ruralsync-service-provider.vercel.app/)

---

## 📋 Table of Contents

- [Overview](#overview)
- [Features](#features)
- [Tech Stack](#tech-stack)
- [Getting Started](#getting-started)
- [Project Structure](#project-structure)
- [Related Projects](#related-projects)

---

## 🎯 Overview

RuralSync Provider Portal is the business dashboard for service providers on the RuralSync platform. Providers can manage their organization profile, add and configure services, manage their agent workforce, handle bookings, and track business performance.

---

## ✨ Features

### 🏢 Organization Management
- **Organization Registration** - Complete business registration with details
- **Profile Editing** - Update organization name, description, contact info
- **Logo & Gallery** - Upload business logo and service images
- **Business Hours** - Configure operating hours for each day
- **Service Categories** - Define service categories offered
- **Social Media Links** - Add Facebook, Twitter, Instagram, LinkedIn

### 🛠️ Service Management
- **Add Services** - Create new services with pricing and duration
- **Service Details** - Set description, availability schedule, additional tasks
- **Image Gallery** - Upload multiple images per service
- **Pricing** - Configure base price and add-on pricing
- **Tags** - Add searchable tags to services
- **Location** - Set service coverage area

### 👥 Agent Management
- **Agent Registration** - Register new agents for your organization
- **Agent Directory** - View all agents with status and details
- **Agent Profiles** - Detailed view of agent information and performance
- **Status Tracking** - Monitor agent availability (Free/Busy/Offline)
- **Service Assignment** - Assign agents to specific service types

### 📅 Booking Management
- **Booking Dashboard** - Overview of all bookings
- **Agent Assignment** - Assign available agents to bookings
- **Status Updates** - Track booking progress
- **Booking Details** - View complete booking information

### 📊 Dashboard
- **Business Overview** - Key metrics at a glance
- **Service Stats** - Number of services offered
- **Agent Count** - Total agents in organization
- **Client Count** - Customers served
- **Rating & Reviews** - Average rating and review count

### 📋 Audit Logs
- **Activity Tracking** - View system activity logs
- **Change History** - Track changes made to data

---

## 🛠️ Tech Stack

| Technology | Purpose |
|------------|---------|
| **React 18** | UI library |
| **TypeScript** | Type safety |
| **Vite** | Build tool & dev server |
| **Tailwind CSS** | Styling |
| **shadcn/ui** | UI component library |
| **Zustand** | State management |
| **React Router** | Client-side routing |
| **React Hot Toast** | Notifications |
| **Axios** | HTTP client |

---

## 🚀 Getting Started

### Prerequisites

- Node.js 18+
- npm or yarn

### Installation

1. **Clone the repository**
   ```bash
   git clone <repository-url>
   cd RS-Monolith/provider
   ```

2. **Install dependencies**
   ```bash
   npm install
   ```

3. **Set up environment variables**
   ```bash
   cp .env.example .env
   ```
   
   Configure your `.env`:
   ```env
   VITE_API_URL=http://localhost:5000
   ```

4. **Run the development server**
   ```bash
   npm run dev
   ```

5. **Open your browser**
   
   Navigate to [http://localhost:5174](http://localhost:5174)

### Build for Production

```bash
npm run build
npm run preview
```

---

## 📁 Project Structure

```
provider/
├── src/
│   ├── components/           # Reusable components
│   │   ├── ui/              # shadcn/ui components
│   │   ├── agent/           # Agent-related components
│   │   ├── booking/         # Booking components
│   │   ├── org/             # Organization components
│   │   ├── service/         # Service components
│   │   ├── dashboard/       # Dashboard components
│   │   └── layout/          # Layout components
│   ├── pages/               # Page components
│   │   ├── agents/          # Agent management
│   │   ├── bookings/        # Booking management
│   │   ├── dashboard/       # Main dashboard
│   │   ├── organization/    # Organization settings
│   │   ├── services/        # Service management
│   │   └── audit-logs/      # Activity logs
│   ├── stores/              # Zustand state stores
│   │   ├── agent.store.ts   # Agent state
│   │   ├── booking.store.ts # Booking state
│   │   ├── org.store.ts     # Organization state
│   │   └── services.store.ts# Services state
│   ├── lib/                 # Utilities
│   │   ├── axios.ts         # Axios instance
│   │   └── utils.ts         # Helper functions
│   ├── hooks/               # Custom React hooks
│   ├── types/               # TypeScript types
│   ├── routes/              # Route definitions
│   └── assets/              # Static assets
├── public/                  # Public assets
└── index.html              # Entry HTML
```

---

## 🔗 Related Projects

| Project | Description | Link |
|---------|-------------|------|
| **RuralSync API** | Backend API server | [https://ruralsyncapi.vercel.app/](https://ruralsyncapi.vercel.app/) |
| **Client Portal** | Customer-facing app | [https://ruralsync.vercel.app/](https://ruralsync.vercel.app/) |
| **Agent App** | Agent mobile/web app | [https://agent-rural-sync.vercel.app/](https://agent-rural-sync.vercel.app/) |

---

## 📝 Environment Variables

| Variable | Description | Default |
|----------|-------------|---------|
| `VITE_API_URL` | Backend API URL | `http://localhost:5000` |

---

## 🎨 UI Components

This project uses [shadcn/ui](https://ui.shadcn.com/) components including:

- Button, Card, Badge, Avatar
- Dialog, Sheet, Dropdown Menu
- Form, Input, Textarea, Select
- Table, Tabs, Separator
- Skeleton (loading states)
- Toast notifications

---

## 🤝 Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add some amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

---

## 📄 License

This project is part of the RuralSync platform.

---

<p align="center">
  Made with ❤️ for Rural Communities
</p>
