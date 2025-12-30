# React Native Expo with TypeScript

A React Native Expo project configured with TypeScript, React Navigation v6+, Redux Toolkit, and AsyncStorage.

## Tech Stack

- **React Native** with **Expo SDK 54**
- **TypeScript** for type safety
- **React Navigation v6+** (Native Stack Navigator)
- **Redux Toolkit** for state management
- **AsyncStorage** for persistent local storage

## Project Structure

```
src/
├── navigation/          # Navigation configuration
│   └── AppNavigator.tsx
├── screens/            # Screen components
│   ├── HomeScreen.tsx
│   └── DetailsScreen.tsx
├── store/              # Redux store
│   ├── store.ts
│   ├── hooks.ts
│   └── slices/
│       └── counterSlice.ts
├── types/              # TypeScript type definitions
│   └── navigation.ts
└── utils/              # Utility functions
    └── storage.ts
```

## Getting Started

### Prerequisites

- Node.js (v16 or higher)
- npm or yarn
- Expo CLI

### Installation

Dependencies are already installed. If you need to reinstall:

```bash
npm install
```

### Running the App

Start the development server:

```bash
npm start
```

Run on specific platforms:

```bash
npm run android  # Android
npm run ios      # iOS (macOS only)
npm run web      # Web
```

## Features Implemented

### 1. Redux Toolkit State Management
- Configured Redux store with TypeScript
- Example counter slice with AsyncStorage integration
- Custom typed hooks (`useAppDispatch`, `useAppSelector`)

### 2. React Navigation
- Native Stack Navigator configured
- Type-safe navigation with TypeScript
- Example screens (Home, Details) with navigation

### 3. AsyncStorage Integration
- Persistent storage for Redux state
- Utility functions for common storage operations
- Counter value persists across app restarts

## Usage Examples

### Adding a New Screen

1. Create screen component in `src/screens/`
2. Add route type to `src/types/navigation.ts`
3. Register screen in `src/navigation/AppNavigator.tsx`

### Adding a New Redux Slice

1. Create slice in `src/store/slices/`
2. Import and add to store in `src/store/store.ts`
3. Use typed hooks in components

### Using AsyncStorage

```typescript
import { storageUtils } from './src/utils/storage';

// Store data
await storageUtils.setItem('key', 'value');

// Retrieve data
const value = await storageUtils.getItem('key');
```

## Development

The app demonstrates:
- Counter with increment/decrement functionality
- Persistent state using AsyncStorage
- Navigation between screens
- Type-safe Redux and navigation

Modify the example code to build your application!
