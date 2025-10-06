
// Re-export from the new modular structure for backward compatibility
export { getAllVenues, getVenuesByArea, getPretoriaVenues } from './venues';

// For backward compatibility, load and export muldersdrift venues specifically
export const muldersdriftVenues = import('./venues/muldersdriftVenues').then(module => module.muldersdriftVenues);
