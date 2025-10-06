// Test utility to verify Supabase configuration and auth redirects
export const testSupabaseConfiguration = () => {
  const isDevelopment = window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1';
  const currentOrigin = window.location.origin;
  const viteUrl = import.meta.env.VITE_SITE_URL;
  
  console.group('🔧 Supabase Configuration Test');
  console.log('Environment Detection:');
  console.log('  - Is Development:', isDevelopment);
  console.log('  - Current Hostname:', window.location.hostname);
  console.log('  - Current Origin:', currentOrigin);
  console.log('  - VITE_SITE_URL:', viteUrl || 'Not set');
  
  console.log('\nRedirect URL Logic:');
  const getRedirectUrl = (path: string) => {
    const baseUrl = isDevelopment ? currentOrigin : (viteUrl || currentOrigin);
    return `${baseUrl}${path}`;
  };
  
  console.log('  - Login redirect:', getRedirectUrl('/login?confirmed=true'));
  console.log('  - Dashboard redirect:', getRedirectUrl('/dashboard'));
  console.log('  - Reset password redirect:', getRedirectUrl('/reset-password'));
  
  console.log('\nExpected Behavior:');
  if (isDevelopment) {
    console.log('  ✅ Should use localhost URLs for all redirects');
    console.log('  ✅ Should ignore VITE_SITE_URL in development');
  } else {
    console.log('  ✅ Should use VITE_SITE_URL or current origin for redirects');
  }
  
  console.groupEnd();
  
  return {
    isDevelopment,
    currentOrigin,
    viteUrl,
    testRedirectUrl: getRedirectUrl('/test')
  };
};

// Auto-run test in development mode
if (import.meta.env.DEV) {
  // Delay execution to ensure DOM is ready
  setTimeout(() => {
    testSupabaseConfiguration();
  }, 1000);
}