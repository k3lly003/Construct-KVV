/**
 * API Configuration
 * 
 * Railway is used ONLY for email-sending endpoints to enable email functionality.
 * All other endpoints use Render to reduce Railway traffic and costs.
 */

// Render URL (default for most endpoints)
export const RENDER_API_URL = process.env.NEXT_PUBLIC_API_URL || 'https://construct-kvv-bn-fork.onrender.com';

// Railway URL (ONLY for email-sending endpoints)
export const RAILWAY_API_URL = process.env.NEXT_PUBLIC_RAILWAY_API_URL || 'https://construct-kvv-bn-fork-production.up.railway.app';

/**
 * Get the appropriate API URL based on endpoint
 * @param endpoint - The API endpoint path
 * @returns Railway URL for email endpoints, Render URL for others
 */
export function getApiUrl(endpoint: string): string {
  // List of email-sending endpoints that must use Railway
  const emailEndpoints = [
    '/api/v1/user/register',
    '/api/v1/user/register/customer',
    '/api/v1/seller/register',
    '/api/v1/architects/register',
    '/api/v1/contractors/register',
    '/api/v1/technicians/register',
    '/api/v1/email-verification/resend',
    '/api/v1/email-verification/verify', // Also sends OTP
    '/api/v1/user/reset-password-request',
    '/api/v1/user/reset-password',
    '/api/v1/design-requests',
    '/api/v1/service-requests',
    '/api/v1/final-project',
  ];

  // Check if endpoint matches any email-sending endpoint
  const isEmailEndpoint = emailEndpoints.some(emailEndpoint => 
    endpoint.includes(emailEndpoint)
  );

  return isEmailEndpoint ? RAILWAY_API_URL : RENDER_API_URL;
}

/**
 * Check if an endpoint requires Railway (email-sending)
 */
export function requiresRailway(endpoint: string): boolean {
  const emailEndpoints = [
    '/api/v1/user/register',
    '/api/v1/user/register/customer',
    '/api/v1/seller/register',
    '/api/v1/architects/register',
    '/api/v1/contractors/register',
    '/api/v1/technicians/register',
    '/api/v1/email-verification/resend',
    '/api/v1/email-verification/verify',
    '/api/v1/user/reset-password-request',
    '/api/v1/user/reset-password',
    '/api/v1/design-requests',
    '/api/v1/service-requests',
    '/api/v1/final-project',
  ];

  return emailEndpoints.some(emailEndpoint => endpoint.includes(emailEndpoint));
}

