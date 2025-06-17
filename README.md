# Wellness Log Dashboard

A comprehensive React.js + TypeScript application for tracking wellness activities including mood, sleep duration, and daily activities. Features user authentication, responsive design, and advanced performance optimizations.

## 🚀 Features

### Basic Features
- **Reusable Form Components**: Login, Signup, and Wellness Log forms with comprehensive validation
- **TypeScript Integration**: Full type safety with interfaces for all data structures
- **Client-Side Validation**: Email format, password strength, and field validation with real-time feedback
- **Responsive Design**: Mobile-first approach compatible with all device sizes
- **Mock API Integration**: Simulated backend with async/await patterns

### Intermediate Features
- **JWT Authentication**: Mock token generation and secure storage
- **Protected Routes**: Dashboard access restricted to authenticated users
- **Search Functionality**: Real-time filtering of wellness logs by activity notes
- **State Management**: Context API for authentication and theme management

### Advanced Features
- **Lazy Loading**: Dynamic component loading for performance optimization
- **Theme Switching**: Light/dark mode with system preference detection
- **Performance Optimization**: Memoization, debounced search, and efficient re-renders
- **Accessibility**: WCAG compliant with keyboard navigation and screen reader support

## 🛠️ Tech Stack

- **Frontend**: Vite, React 18+, TypeScript
- **Styling**: CSS Custom Properties, CSS Grid, Flexbox
- **State Management**: React Context API, useReducer
- **Icons**: Lucide React
- **Performance**: React.lazy, React.memo, useMemo, useCallback

## 📦 Installation & Setup

### Prerequisites
- Node.js 18+ 
- npm or yarn

### Installation Steps

1. **Clone the repository**
   \`\`\`bash
   git clone <repository-url>
   cd wellness-dashboard
   \`\`\`

2. **Install dependencies**
   \`\`\`bash
   npm install
   # or
   yarn install
   \`\`\`

3. **Start the development server**
   \`\`\`bash
   npm run dev
   # or
   yarn dev
   \`\`\`

4. **Open your browser**
   Navigate to \`http://localhost:3000\`

## 🔐 Demo Credentials

For testing the application, use these demo credentials:
- **Email**: demo@example.com
- **Password**: password123

## 📱 Usage Guide

### Authentication
1. **Sign Up**: Create a new account with email and password
2. **Sign In**: Use existing credentials to access the dashboard
3. **Auto-redirect**: Authenticated users are automatically redirected to the dashboard

### Wellness Logging
1. **Add Entry**: Fill out the wellness log form with:
   - Mood selection (Happy, Stressed, Tired, Focused)
   - Sleep duration (0-12 hours slider)
   - Activity notes (up to 200 characters)
2. **View Logs**: All entries are displayed in a sortable table
3. **Search**: Use the search bar to filter logs by activity notes

### Theme Switching
- Click the sun/moon icon in the header to toggle between light and dark themes
- Theme preference is automatically saved and restored

## 🏗️ Project Structure

\`\`\`
src/
├── app/                    # Next.js app directory
│   ├── auth/              # Authentication page
│   ├── dashboard/         # Dashboard page
│   ├── globals.css        # Global styles
│   └── layout.tsx         # Root layout
├── components/            # Reusable components
│   ├── dashboard/         # Dashboard-specific components
│   ├── forms/            # Form components
│   ├── layout/           # Layout components
│   └── ui/               # UI components
├── contexts/             # React contexts
│   ├── auth-context.tsx  # Authentication state
│   └── theme-context.tsx # Theme management
├── lib/                  # Utility functions
│   ├── auth.ts          # Authentication API
│   ├── validation.ts    # Form validation
│   └── wellness-api.ts  # Wellness data API
└── types/               # TypeScript interfaces
    └── index.ts         # Type definitions
\`\`\`

## 🔧 API Endpoints (Mock)

The application uses mock APIs that simulate real backend behavior:

### Authentication
- \`POST /api/auth/login\` - User login
- \`POST /api/auth/signup\` - User registration
- \`GET /api/auth/verify\` - Token verification

### Wellness Logs
- \`GET /api/wellness/logs\` - Fetch user logs
- \`POST /api/wellness/logs\` - Create new log
- \`GET /api/wellness/logs/search\` - Search logs

## 🎨 Styling Architecture

### CSS Custom Properties
- Theme-aware color system
- Consistent spacing and typography
- Dark/light mode support

### Responsive Design
- Mobile-first approach
- CSS Grid and Flexbox layouts
- Breakpoints: 768px (tablet), 480px (mobile)

### Component Styling
- Scoped component styles
- Consistent naming conventions
- Accessibility-focused design

## ⚡ Performance Optimizations

### Code Splitting
- Lazy loading of non-critical components
- Dynamic imports for route-based splitting

### State Management
- Efficient context usage
- Memoized components and callbacks
- Debounced search functionality

### Bundle Optimization
- Tree shaking for unused code
- Optimized asset loading
- Minimal runtime overhead

## 🧪 Testing Strategy

### Component Testing
- Form validation testing
- Authentication flow testing
- State management testing

### Integration Testing
- API integration testing
- Route protection testing
- Theme switching testing

### Accessibility Testing
- Keyboard navigation
- Screen reader compatibility
- Color contrast validation

## 🚀 Deployment

### Build for Production
\`\`\`bash
npm run build
npm start
\`\`\`

### Environment Variables
Create a \`.env.local\` file for production:
\`\`\`
NEXT_PUBLIC_API_URL=your-api-url
JWT_SECRET=your-jwt-secret
\`\`\`

## 🔒 Security Considerations

### Client-Side Security
- JWT token stored in localStorage (demo purposes)
- Input validation and sanitization
- XSS protection through React's built-in escaping

### Production Recommendations
- Use httpOnly cookies for token storage
- Implement CSRF protection
- Add rate limiting for API endpoints
- Use HTTPS in production

## 📊 Browser Support

- Chrome 90+
- Firefox 88+
- Safari 14+
- Edge 90+

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch
3. Make your changes
4. Add tests for new functionality
5. Submit a pull request

## 📄 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🔍 Conceptual Questions & Answers

### 1. Responsive Tabs Component for Mobile and Desktop

**Question**: How would you ensure a tabs component is responsive for mobile and desktop, considering layout and user interaction?

**Answer**: 
- **Layout Strategy**: Use CSS Grid/Flexbox with breakpoints. On desktop, display tabs horizontally; on mobile, convert to a dropdown or accordion pattern
- **Touch Interactions**: Implement swipe gestures for mobile tab navigation using touch events
- **Accessibility**: Ensure keyboard navigation works with arrow keys, proper ARIA labels, and focus management
- **Performance**: Use CSS transforms for smooth animations and avoid layout thrashing during transitions

### 2. Virtualized List Optimization for 1000+ Logs

**Question**: How would you optimize a virtualized list for 1000+ logs to minimize rendering overhead?

**Answer**:
- **Window Virtualization**: Only render visible items plus a small buffer (10-20 items)
- **Fixed Item Heights**: Use consistent row heights to avoid expensive calculations
- **Memoization**: Wrap list items in React.memo to prevent unnecessary re-renders
- **Batch Updates**: Group state updates and use requestAnimationFrame for smooth scrolling
- **Data Pagination**: Implement infinite scrolling with API pagination to limit initial data load

### 3. Accessibility Features for Dropdown and Modal

**Question**: What accessibility features ensure a dropdown menu and modal are usable for screen readers and keyboard navigation?

**Answer**:
- **ARIA Attributes**: Use `aria-expanded`, `aria-haspopup`, `role="menu"`, `aria-labelledby`
- **Keyboard Navigation**: Support Enter/Space to open, Escape to close, Arrow keys for navigation
- **Focus Management**: Trap focus within modals, return focus to trigger element on close
- **Screen Reader Support**: Announce state changes, provide clear labels and descriptions
- **Color Contrast**: Ensure 4.5:1 contrast ratio for text, don't rely solely on color for information

### 4. Client-Side Authentication Security Strategies

**Question**: Describe strategies to secure client-side authentication (e.g., JWT storage) in a wellness app.

**Answer**:
- **Storage Strategy**: Use httpOnly cookies instead of localStorage to prevent XSS attacks
- **Token Refresh**: Implement short-lived access tokens with refresh token rotation
- **HTTPS Only**: Enforce secure connections for all authentication endpoints
- **Input Validation**: Sanitize all user inputs and implement rate limiting
- **Session Management**: Auto-logout on inactivity, secure session invalidation

### 5. Server-Side Rendering Benefits and Challenges

**Question**: What are the benefits and challenges of implementing server-side rendering for a wellness dashboard with authentication?

**Answer**:
**Benefits**:
- **SEO Optimization**: Better search engine indexing for public pages
- **Performance**: Faster initial page load and perceived performance
- **Accessibility**: Works without JavaScript enabled

**Challenges**:
- **Authentication Complexity**: Managing server-side session state and hydration
- **Caching Strategy**: Balancing personalized content with caching efficiency
- **Development Complexity**: Handling client/server state synchronization
- **Resource Usage**: Higher server computational requirements

## 📱 React Native Questions & Answers

### 1. View, Text, and ScrollView Differences

**Answer**:
- **View**: Basic container component, equivalent to HTML `<div>`, supports layout and styling
- **Text**: Displays text content, required for all text rendering, supports text-specific styling
- **ScrollView**: Scrollable container that renders all children at once, best for small lists

### 2. Secure Credential Storage in React Native

**Answer**:
- **Keychain Services (iOS)**: Use `@react-native-keychain/react-native-keychain`
- **Android Keystore**: Secure hardware-backed storage for sensitive data
- **Expo SecureStore**: For Expo projects, provides encrypted storage
- **Best Practices**: Never store in AsyncStorage, use biometric authentication, implement token refresh

### 3. Navigate vs Push in Stack Navigator

**Answer**:
- **navigate()**: Navigates to a route, if already in stack, goes back to existing instance
- **push()**: Always adds a new screen to the stack, even if route already exists
- **Use Cases**: Use `navigate` for tab switching, `push` for drill-down navigation patterns

### 4. React Native Performance Improvement Strategies

**Answer**:
- **FlatList Optimization**: Use `getItemLayout`, `removeClippedSubviews`, proper `keyExtractor`
- **Image Optimization**: Implement lazy loading, use appropriate formats, cache images
- **Bundle Splitting**: Use code splitting and lazy loading for large applications
- **Native Modules**: Move heavy computations to native code when necessary
- **Memory Management**: Avoid memory leaks, properly clean up listeners and timers
