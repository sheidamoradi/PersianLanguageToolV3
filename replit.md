# Replit.md - Pistac Educational Platform

## Overview

Pistac is a modern educational platform built for agricultural learning, featuring a full-stack architecture with React frontend, Express.js backend, and PostgreSQL database. The platform provides courses, projects, documents, magazines, and workshops with a focus on Persian (RTL) language support.

## System Architecture

The application follows a monorepo structure with clear separation of concerns:

- **Frontend**: React with TypeScript, Vite for bundling
- **Backend**: Express.js with TypeScript 
- **Database**: PostgreSQL with Drizzle ORM
- **UI Components**: Radix UI with Tailwind CSS (shadcn/ui style)
- **State Management**: TanStack Query for server state
- **Routing**: Wouter for client-side routing

## Key Components

### Frontend Architecture
- **Client Directory**: Contains React application with TypeScript
- **Routing**: Uses Wouter for lightweight client-side routing
- **UI Library**: Custom implementation using Radix UI primitives with Tailwind styling
- **State Management**: TanStack Query handles server state and caching
- **Styling**: Tailwind CSS with RTL support for Persian language
- **PWA Support**: Service worker and manifest for mobile app experience

### Backend Architecture
- **Server Directory**: Express.js application with TypeScript
- **API Routes**: RESTful API endpoints under `/api` prefix
- **Database Access**: Drizzle ORM for type-safe database operations
- **Authentication**: Replit Auth integration for user management
- **Session Management**: PostgreSQL-based session storage

### Database Schema
The database uses PostgreSQL with the following main entities:
- **Users**: User accounts with roles (admin, user, premium)
- **Courses**: Educational courses with progress tracking
- **Modules**: Course modules and lessons
- **Projects**: Project-based learning content
- **Documents**: PDF and text documents
- **Magazines**: Educational magazine issues
- **Articles**: Magazine articles and blog posts
- **Workshops**: Workshop content and materials
- **Media Content**: Video and audio files
- **Slides**: Homepage slider content

## Data Flow

1. **Client Requests**: React components make API calls using TanStack Query
2. **API Layer**: Express.js routes handle requests and validate data using Zod schemas
3. **Database Layer**: Drizzle ORM executes type-safe database queries
4. **Response**: JSON data flows back through the API to React components
5. **State Management**: TanStack Query caches responses and manages loading states

## External Dependencies

### Frontend Dependencies
- **React**: Core frontend framework
- **Radix UI**: Accessible UI component primitives
- **TanStack Query**: Server state management
- **Tailwind CSS**: Utility-first CSS framework
- **Wouter**: Lightweight routing library
- **Lucide React**: Modern icon library

### Backend Dependencies
- **Express.js**: Web application framework
- **Drizzle ORM**: Type-safe SQL toolkit
- **Zod**: TypeScript-first schema validation
- **Passport**: Authentication middleware
- **PostgreSQL**: Primary database system
- **Neon Database**: Serverless PostgreSQL hosting

### Development Dependencies
- **Vite**: Build tool and development server
- **TypeScript**: Type safety and development experience
- **ESBuild**: Fast JavaScript bundler for production

## Deployment Strategy

The application supports multiple deployment strategies:

### Vercel Deployment
- **API Routes**: Serverless functions in `/api` directory
- **Static Assets**: Client build output served from CDN
- **Database**: Neon PostgreSQL for production
- **Environment Variables**: Managed through Vercel dashboard

### Replit Deployment
- **Development**: Hot reload with Vite dev server
- **Production**: Node.js server with built client assets
- **Database**: PostgreSQL connection via DATABASE_URL
- **Authentication**: Integrated Replit Auth system

### Local Development
- **Database**: Local PostgreSQL or Neon development database
- **Frontend**: Vite dev server with hot module replacement
- **Backend**: tsx for TypeScript execution in development
- **Migration**: Drizzle Kit for database schema management

## Changelog

```
Changelog:
- June 29, 2025. Initial setup
- June 29, 2025. Applied new color theme from reference design:
  * Light green background for hero slider
  * Purple, orange, and green colored circles for quick access
  * Monochromatic gray icons throughout the interface
  * Added "دسترسی سریع" section at bottom with colored icons
  * Updated CSS variables for consistent color palette
- July 1, 2025. Implemented complete file upload system:
  * Added multer package for real file uploads
  * Created /api/upload endpoint supporting images and PDFs (10MB limit)
  * Files stored in public/uploads with unique naming
  * Static file serving from /uploads route
  * WordPress-like media library interface
  * Fixed slide form to accept relative URLs from media library
  * Added helper button to quickly access media library from slide form
- July 7, 2025. Enhanced file upload system for demo content:
  * Added demo-uploader.html for easy file upload interface
  * Created direct upload guide for copying files to public/uploads
  * Prepared sample demo files (logo, slides, webinar posters)
  * Fixed cache invalidation issues with staleTime: 0 configuration
  * Added refetchQueries to all mutations for immediate UI updates
- July 9, 2025. Updated bottom navigation menu:
  * Simplified navigation to 4 main items: خانه، علاقه‌مندی‌ها، پروفایل، دسته‌بندی
  * Added expandable categories menu with: کارگاه آموزشی، وبینار آموزشی، فصلنامه رویش سبز، آرشیو پیستاط
  * Improved user experience with clear category navigation
  * Added FavoritesPage import and routing
- July 12, 2025. Completed migration from Replit Agent to standard Replit environment:
  * Successfully migrated codebase with proper database setup
  * Added PostgreSQL database with all required tables
  * Fixed routing and workflow configuration 
  * Added "درباره ما" (About Us) button to bottom navigation after categories
  * Application now running cleanly on Replit with admin user: admin/730895015
- July 12, 2025. Migration to Replit and navigation enhancement:
  * Successfully migrated project from Replit Agent to standard Replit environment
  * Set up PostgreSQL database with proper migrations
  * Added "درباره ما" (About Us) navigation item to bottom menu after categories
  * All systems now running properly with secure client/server separation
```

## User Preferences

```
Preferred communication style: Simple, everyday language.
```