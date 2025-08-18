# Water Quality Geographic Explorer

## Overview

This is a full-stack web application for monitoring and visualizing water quality data across Brazil. The application provides an interactive geographic explorer that allows users to view water quality metrics (turbidity and pH) across different administrative levels (regions, states, municipalities). Built with a modern React frontend and Express.js backend, it features interactive maps, filtering controls, and real-time data visualization.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture
- **Framework**: React 18 with TypeScript for type safety and modern development
- **Routing**: Wouter for lightweight client-side routing
- **UI Components**: Shadcn/ui component library built on Radix UI primitives with Tailwind CSS styling
- **State Management**: TanStack Query (React Query) for server state management and caching
- **Styling**: Tailwind CSS with custom design tokens and CSS variables for theming
- **Build Tool**: Vite for fast development and optimized production builds
- **Map Visualization**: Leaflet with React-Leaflet for interactive geographic data display

### Backend Architecture
- **Framework**: Express.js with TypeScript for API server
- **Data Storage**: In-memory storage implementation with interface for future database integration
- **API Design**: RESTful endpoints for water quality data, geographic boundaries, and data summaries
- **Development Server**: Custom Vite integration for seamless full-stack development
- **Error Handling**: Centralized error handling middleware with structured responses

### Database Design
- **ORM**: Drizzle ORM with PostgreSQL dialect for type-safe database operations
- **Schema**: Two main tables - `water_quality_data` for metrics and `geographic_boundaries` for GeoJSON data
- **Migration System**: Drizzle Kit for database schema migrations and management
- **Data Types**: Support for numeric metrics, text fields, and JSONB for geographic data

### Authentication & Security
- **Session Management**: Express sessions with PostgreSQL store (connect-pg-simple)
- **Data Validation**: Zod schemas for runtime type validation and API request validation
- **CORS**: Configured for development and production environments

### Key Design Decisions

**Monorepo Structure**: Single repository with shared types and schemas between frontend and backend for type safety and code reuse. The `shared/` directory contains common TypeScript definitions and Zod schemas.

**Component Architecture**: Modular UI components using the compound component pattern from Radix UI, allowing for flexible and accessible user interfaces with consistent styling.

**Data Fetching Strategy**: TanStack Query for client-side caching, background updates, and optimistic UI updates. Custom query functions handle authentication and error states.

**Geographic Data Handling**: GeoJSON format for boundary data with hierarchical relationships (municipality → state → region) stored in PostgreSQL JSONB fields for efficient querying.

**Responsive Design**: Mobile-first approach with Tailwind's responsive utilities and custom breakpoints for optimal viewing across devices.

**Type Safety**: End-to-end TypeScript with shared schemas ensuring runtime validation matches compile-time types throughout the application stack.

## External Dependencies

### Database
- **Neon Database**: Serverless PostgreSQL database for production deployment
- **Connection**: Environment variable `DATABASE_URL` for database connection string

### UI Libraries
- **Radix UI**: Headless component primitives for accessibility and customization
- **Lucide React**: Icon library for consistent iconography
- **Leaflet**: Open-source mapping library for interactive geographic visualization

### Development Tools
- **ESBuild**: Fast JavaScript bundler for production server builds
- **PostCSS**: CSS processing with Tailwind CSS and Autoprefixer plugins
- **TSX**: TypeScript execution environment for development server

### Third-party Services
- **Replit Integration**: Development environment plugins for runtime error handling and code mapping
- **Font Resources**: Google Fonts integration for typography (DM Sans, Fira Code, Geist Mono)

### Data Sources
- **Brazilian Geographic Data**: Regional boundary data and administrative divisions
- **Water Quality Metrics**: Turbidity and pH measurements across different geographic levels
- **Real-time Updates**: Support for data refresh and background synchronization