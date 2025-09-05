# Smart Tourist Safety Monitoring App

A comprehensive React Native mobile application built with Expo for tourist safety monitoring and emergency response, specifically designed for regions like Northeast India.

## Features

- **Secure Authentication**: Registration, login, and OTP verification
- **Digital Identity**: KYC submission with digital ID and QR code generation
- **Safety Monitoring**: Real-time safety scores and geo-fencing alerts
- **Emergency Response**: Panic button with location sharing and media capture
- **Offline Support**: Queue operations when offline, sync when connected
- **Multilingual**: Support for 10+ Indian languages plus English
- **Accessibility**: Large buttons, high contrast, optimized for elderly/disabled users

## Tech Stack

- **Framework**: React Native with Expo
- **Navigation**: Expo Router
- **State Management**: Redux Toolkit with Redux Persist
- **Storage**: Expo SecureStore for sensitive data, AsyncStorage for general data
- **Maps**: React Native Maps
- **Internationalization**: react-i18next
- **Forms**: React Hook Form with Yup validation
- **UI**: Custom components with accessibility support

## Installation

1. Install dependencies:
```bash
npm install
```

2. Start the development server:
```bash
npm run dev
```

3. Open the Expo Go app on your device and scan the QR code, or run on simulator:
```bash
# iOS Simulator
npx expo run:ios

# Android Emulator
npx expo run:android
```

## Project Structure

```
app/
├── (auth)/          # Authentication screens
├── (tabs)/          # Main tab navigation screens
├── (kyc)/           # KYC and profile setup
├── (settings)/      # Settings and emergency contacts
├── _layout.tsx      # Root layout
└── index.tsx        # Entry point

components/
├── common/          # Reusable UI components
└── forms/           # Form components

services/            # API services
redux/              # State management
i18n/               # Internationalization
utils/              # Utility functions
hooks/              # Custom hooks
types/              # TypeScript type definitions
```

## Key Features

### Authentication Flow
- Welcome screen with language selection
- Registration with email, phone, password
- Login with email/password
- OTP verification (mocked for development)

### Safety Features
- Real-time location tracking
- Geo-fencing with zone classification (safe/risky/restricted)
- Safety score calculation with color-coded indicators
- Emergency panic button with countdown
- Automatic location sharing with emergency contacts

### Offline Capabilities
- Queue location pings when offline
- Cache safety data and notifications
- Sync data when connection is restored

### Accessibility
- Large touch targets for emergency situations
- High contrast colors
- Screen reader support
- Haptic feedback for critical actions

## API Integration

The app integrates with 18 backend endpoints across:
- Authentication Service
- User Profile Service
- Location Service
- Geo-fencing Service
- Alert Service
- Media Service
- Consent Service

Mock responses are implemented for development and testing.

## Supported Languages

- English
- Hindi (हिन्दी)
- Tamil (தமிழ்)
- Bengali (বাংলা)
- Telugu
- Marathi
- Gujarati
- Kannada
- Malayalam
- Punjabi
- Assamese

## Development

### Environment Setup
1. Install Expo CLI: `npm install -g @expo/cli`
2. Install dependencies: `npm install`
3. Start development server: `npm run dev`

### Testing
- Unit tests: `npm test`
- E2E tests: `npm run test:e2e`

### Building
- Development build: `npx expo build`
- Production build: `npx expo build --release-channel production`

## Security

- JWT tokens stored in Expo SecureStore
- Sensitive data encrypted
- API requests authenticated with JWT headers
- Location data anonymized when possible

## Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests if applicable
5. Submit a pull request

## License

This project is licensed under the MIT License.# smart-tourist-system-frontend
