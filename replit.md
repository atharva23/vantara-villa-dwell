# Vantara Living - Luxury Villa Rental Platform

## Overview

Vantara Living is a luxury villa rental platform built with React, TypeScript, and Vite. The application showcases handpicked luxury villas across various destinations (beach, mountain, heritage, and corporate stays) with a focus on exceptional user experience and elegant design. The platform features property browsing, search functionality, booking workflows, and host onboarding capabilities.

## User Preferences

Preferred communication style: Simple, everyday language.

## System Architecture

### Frontend Architecture

**Technology Stack:**
- **Framework**: React 18 with TypeScript
- **Build Tool**: Vite for fast development and optimized production builds
- **Styling**: Tailwind CSS with custom luxury earth-tone design system
- **UI Components**: Shadcn/ui (Radix UI primitives) for accessible, customizable components
- **State Management**: React Query (TanStack Query) for server state management
- **Routing**: React Router v6 for client-side navigation
- **Forms**: React Hook Form with Zod resolvers for validation

**Design System:**
- Custom HSL-based color palette featuring forest green primary, taupe secondary, and gold accent colors
- Responsive breakpoints managed through Tailwind configuration
- Consistent spacing, typography (Inter + Playfair Display), and component patterns
- Smooth transitions and elegant shadows for premium feel

**Component Architecture:**
- Atomic design pattern with reusable UI components in `/src/components/ui`
- Feature-specific components (Navbar, Footer, SearchBar, PropertySlider, PropertyDetailDialog)
- Page-level components in `/src/pages` following route structure
- Custom hooks for shared logic (`use-mobile`, `use-toast`)

**Key Features:**
- Property search with filters (location, dates, guests)
- Property browsing with carousel/slider displays
- Detailed property views with image galleries
- Booking inquiry system (WhatsApp integration)
- Host onboarding forms
- Contact forms
- Responsive mobile-first design

### Data Architecture

**Data Source:**
- Google Sheets API integration for property data management
- Sheet structure includes property details (name, location, price, description, category, amenities, images, booking links, WhatsApp numbers)
- Client-side data fetching and transformation in React components

**Data Flow:**
- Properties fetched from Google Sheets API on component mount
- Data transformed from row-based format to typed property objects
- Local state management for UI interactions (filters, selections)
- URL search params for sharing filtered property views

### External Dependencies

**Third-Party Services:**
- **Google Sheets API**: Primary data source for property listings (Spreadsheet ID: 1Uxl7xz6_n3M7wHlJUOBQtlTlW0y2EjcV9nv9eV31TmM)
- **WhatsApp Business API**: Booking and inquiry handling via deep links
- **Google Fonts**: Inter and Playfair Display for typography

**NPM Packages:**
- **UI Components**: @radix-ui/* family for accessible primitives
- **Carousel**: embla-carousel-react with autoplay plugin
- **Date Handling**: date-fns for date formatting and manipulation
- **Form Management**: react-hook-form with @hookform/resolvers
- **Icons**: lucide-react for consistent iconography
- **Theming**: next-themes for dark/light mode support
- **Toast Notifications**: sonner for user feedback

**Development Tools:**
- ESLint with TypeScript support for code quality
- PostCSS with Tailwind and Autoprefixer for styling
- Lovable-tagger plugin for development mode component tagging

### Backend/Database Architecture

**Current Implementation:**
- No traditional backend server
- Serverless architecture using Google Sheets as database
- Client-side data fetching and processing

**Database Setup (Prepared for Future):**
- Drizzle ORM configuration in `/server/db.ts` ready for Neon PostgreSQL
- Schema definitions expected in `@shared/schema`
- Connection pooling configured with WebSocket support
- Environment variable `DATABASE_URL` required when database is provisioned

**Note**: The application currently operates without a database, but includes infrastructure for future PostgreSQL integration using Drizzle ORM and Neon serverless PostgreSQL.

### Integration Points

**Booking Workflow:**
- Form data collection on BookStay page
- WhatsApp deep link generation with pre-filled message
- Direct external navigation to WhatsApp for communication

**Property Management:**
- Google Sheets serves as CMS
- Real-time property data fetching
- Image URLs stored in sheets, hosted externally
- Property filtering and search performed client-side

**Communication Channels:**
- WhatsApp for booking inquiries and support
- Email forms for general contact
- Social media links (Instagram, LinkedIn) in footer

### Deployment Configuration

- Vite production build outputs to `/dist`
- Server configuration for port 5000 with host "0.0.0.0"
- Static site deployment ready (SPA mode)
- SEO meta tags and Open Graph configured
- robots.txt configured for search engine indexing
- Development and production build modes supported