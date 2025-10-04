# Authentication System for Cart Route Protection

This document describes the implementation of a protected cart route that requires user authentication, as well as authentication protection for the notification system.

## Overview

The `/cart` route is now protected and requires users to be logged in. Unauthenticated users are automatically redirected to the login page (`/signin`).

Additionally, the notification system is now protected and only accessible to authenticated users.

## Components

### 1. useAuth Hook (`src/hooks/useAuth.ts`)

- Manages authentication state
- Provides login, logout, and authentication checking functions
- Uses localStorage for token and user data persistence

### 2. ProtectedRoute Component (`src/components/auth/ProtectedRoute.tsx`)

- Higher-order component that wraps protected pages
- Checks authentication status before rendering content
- Shows loading spinner during authentication check
- Displays redirect message before redirecting unauthenticated users

### 3. AuthProvider (`src/app/providers/auth-provider.tsx`)

- Provides authentication context throughout the application
- Wraps the entire app in the main providers file

### 4. LoadingSpinner (`src/components/ui/loading-spinner.tsx`)

- Reusable loading component for better UX

### 5. RedirectMessage (`src/components/auth/RedirectMessage.tsx`)

- Shows users they are being redirected to login

### 6. AuthPrompt (`src/components/ui/auth-prompt.tsx`)

- Reusable component for showing authentication prompts
- Used in notification modal for unauthenticated users

### 7. Protected Notification System

- NotificationIcon: Only visible to authenticated users
- NotificationModal: Requires authentication to view
- NotificationStore: API calls protected by authentication checks

## How It Works

### Cart Route Protection

1. **Route Protection**: The cart page (`src/app/(client-pages)/cart/page.tsx`) is wrapped with `<ProtectedRoute>`

2. **Authentication Check**: When a user visits `/cart`, the `ProtectedRoute` component:
   - Checks if the user has a valid `authToken` in localStorage
   - Shows a loading spinner while checking
   - If authenticated: renders the cart page
   - If not authenticated: shows redirect message and redirects to `/signin`

### Notification System Protection

1. **Icon Visibility**: Notification icon only appears in navbar for authenticated users
2. **Authentication Check**: Clicking notifications checks authentication before opening modal
3. **Modal Protection**: Notification modal shows authentication prompt for unauthenticated users
4. **API Protection**: Notification store checks authentication before making API calls
5. **State Management**: Notifications are cleared when user logs out

### Authentication Flow

1. **Login Flow**: After successful login:

   - Token and user data are stored in localStorage
   - User is redirected to the home page
   - Authentication state is updated throughout the app
   - Notification system becomes accessible

2. **Logout Flow**: When user logs out:
   - Token and user data are removed from localStorage
   - User is redirected to `/signin`
   - Authentication state is cleared
   - Notifications are cleared from state

## Usage

### Protecting a Route

```tsx
import { ProtectedRoute } from "@/components/auth/ProtectedRoute";

const ProtectedPage = () => {
  return (
    <ProtectedRoute>
      <div>This content is only visible to authenticated users</div>
    </ProtectedRoute>
  );
};
```

### Using Authentication in Components

```tsx
import { useAuth } from "@/hooks/useAuth";

const MyComponent = () => {
  const { user, isAuthenticated, logout } = useAuth();

  if (!isAuthenticated) {
    return <div>Please log in</div>;
  }

  return (
    <div>
      Welcome, {user?.name}!<button onClick={logout}>Logout</button>
    </div>
  );
};
```

### Notification Authentication

```tsx
import { NotificationIcon } from "@/components/ui/notification-icon";

// Only authenticated users will see this
{
  isAuthenticated && (
    <NotificationIcon
      count={getUnreadCount()}
      onClick={handleNotificationClick}
      isLoading={notificationsLoading}
    />
  );
}
```

## Security Features

- **Client-side Protection**: Routes are protected on the client side
- **Token Validation**: Authentication is checked on every route visit
- **Automatic Redirects**: Unauthenticated users are automatically redirected
- **Loading States**: Users see appropriate loading indicators during authentication checks
- **Notification Protection**: Notification system is completely protected from unauthenticated access
- **State Cleanup**: Authentication state and related data are properly cleared on logout

## Notes

- This implementation uses localStorage for token storage
- Authentication state is managed client-side
- For production applications, consider adding server-side validation
- The system automatically handles token expiration by checking localStorage on each route visit
- Notification system automatically adapts to authentication state changes
- All notification API calls are protected by authentication checks

## Files Modified

- `src/app/(client-pages)/cart/page.tsx` - Wrapped with ProtectedRoute
- `src/app/(auth)/signin/page.tsx` - Updated to use useAuth hook
- `src/app/(auth)/signup/page.tsx` - Updated to use useAuth hook
- `src/app/(components)/Navbar/Profile.tsx` - Updated logout functionality
- `src/app/(components)/Navbar/custProfileSheet.tsx` - Updated logout functionality
- `src/app/(components)/Navbar/Navigator.tsx` - Added notification authentication protection
- `src/app/providers.tsx` - Added AuthProvider

## Files Created

- `src/hooks/useAuth.ts` - Authentication hook
- `src/components/auth/ProtectedRoute.tsx` - Route protection component
- `src/components/auth/RedirectMessage.tsx` - Redirect message component
- `src/app/providers/auth-provider.tsx` - Authentication context provider
- `src/components/ui/loading-spinner.tsx` - Loading spinner component
- `src/components/ui/auth-prompt.tsx` - Authentication prompt component

## Notification System Changes

- **NotificationIcon**: Now requires authentication to display
- **NotificationModal**: Shows authentication prompt for unauthenticated users
- **NotificationStore**: API calls protected by authentication checks
- **Navbar**: Notification icon only visible to authenticated users
- **Loading States**: Added loading indicators for notification operations
- **Error Handling**: Better error handling for authentication failures
