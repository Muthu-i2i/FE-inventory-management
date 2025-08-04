# Inventory Management System

A comprehensive inventory management system built with React, TypeScript, and Material-UI.

## Features

- 🔐 User Authentication & Authorization
- 📦 Inventory Management
- 🏢 Warehouse Management
- 📝 Purchase Order Management
- 👥 Supplier Management
- 📊 Analytics Dashboard
- 📈 Stock Movement Tracking
- 🔔 Low Stock Alerts

## Tech Stack

- **Frontend Framework**: React 18
- **Type System**: TypeScript
- **State Management**: Redux Toolkit
- **UI Framework**: Material-UI (MUI)
- **Form Handling**: React Hook Form + Yup
- **HTTP Client**: Axios
- **Charts**: Recharts
- **Date Handling**: Day.js
- **Notifications**: Notistack

## Getting Started

### Prerequisites

- Node.js (v14 or higher)
- npm or yarn

### Installation

1. Clone the repository:
   ```bash
   git clone https://github.com/yourusername/inventory-management.git
   cd inventory-management
   ```

2. Install dependencies:
   ```bash
   npm install
   # or
   yarn install
   ```

3. Create a `.env` file in the root directory:
   ```env
   REACT_APP_API_URL=https://your-api-url.com/api
   ```

4. Start the development server:
   ```bash
   npm start
   # or
   yarn start
   ```

### Build for Production

```bash
npm run build
# or
yarn build
```

## Project Structure

```
src/
├── api/            # API service layer
├── components/     # Reusable components
├── context/       # React context providers
├── features/      # Feature-specific components
├── mocks/         # Mock services for testing/demo
├── pages/         # Page components
├── store/         # Redux store configuration
├── theme/         # MUI theme customization
├── types/         # TypeScript type definitions
└── utils/         # Utility functions
```

## Authentication

The system supports role-based authentication with three user roles:
- **Admin**: Full system access
- **Manager**: Inventory and order management
- **Staff**: Basic inventory operations

### Demo Credentials
- Admin: `admin` / `admin123`
- Manager: `manager` / `manager123`
- Staff: `staff` / `staff123`

## Available Scripts

- `npm start`: Start development server
- `npm test`: Run test suite
- `npm run build`: Build for production
- `npm run eject`: Eject from Create React App

## Testing

The project includes comprehensive test coverage using:
- Jest
- React Testing Library
- Mock Service Worker

Run tests with:
```bash
npm test
# or
npm test -- --coverage
```

## Deployment

### Vercel Deployment

1. Install Vercel CLI:
   ```bash
   npm i -g vercel
   ```

2. Deploy:
   ```bash
   vercel
   ```

### Environment Variables

Required environment variables for deployment:
- `REACT_APP_API_URL`: Backend API URL

## API Integration

The system supports both mock and real API implementations:

### Using Mock Services
```typescript
// src/api/service.ts
export const service = mockService;
```

### Using Real API
```typescript
// src/api/service.ts
export const service = realService;
```

## Contributing

1. Fork the repository
2. Create your feature branch (`git checkout -b feature/AmazingFeature`)
3. Commit your changes (`git commit -m 'Add some AmazingFeature'`)
4. Push to the branch (`git push origin feature/AmazingFeature`)
5. Open a Pull Request

## License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details