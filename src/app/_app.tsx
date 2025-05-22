// pages/_app.tsx
import '@/styles/globals.css'; // If you have global styles
import { GoogleOAuthProvider } from '@react-oauth/google';
import type { AppProps } from 'next/app';
import DashboardLayout from './dashboard/layout'; // Assuming you have these
import VisitorLayout from './(client-pages)/layout';
import { useRouter } from 'next/router';

function MyApp({ Component, pageProps }: AppProps) {
  const router = useRouter();

  // Determine which layout to use based on the route
  const useDashboardLayout = router.pathname.startsWith('/dashboard');
  const useVisitorLayout = router.pathname.startsWith('/visitor_page');

  const getLayout = () => {
    if (useDashboardLayout) {
      return <DashboardLayout><Component {...pageProps} /></DashboardLayout>;
    } else if (useVisitorLayout) {
      return <VisitorLayout><Component {...pageProps} /></VisitorLayout>;
    }
    return <Component {...pageProps} />;
  };

  return (
    <GoogleOAuthProvider clientId="YOUR_GOOGLE_CLIENT_ID">
      {getLayout()}
    </GoogleOAuthProvider>
  );
}

export default MyApp;