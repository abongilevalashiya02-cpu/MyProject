
import { VenueType } from '../../types/venues';

// Lazy load venue data to prevent memory issues during build
const loadVenueData = async () => {
  const [
    { muldersdriftVenues },
    { midrandVenues },
    { centurionVenues },
    { fourwaysVenues },
    { lanseriaVenues },
    { pretoriaWinelandsVenues },
    { pretoriaMountainVenues },
    { pretoriaRiverVenues },
    { pretoriaBusinessVenues },
    { vaalVenues },
    { magaliesbergVenues },
    { krugersdorpVenues },
    { bronkhorstspruitVenues }
  ] = await Promise.all([
    import('./muldersdriftVenues'),
    import('./midrandVenues'),
    import('./centurionVenues'),
    import('./fourwaysVenues'),
    import('./lanseriaVenues'),
    import('./pretoriaWinelandsVenues'),
    import('./pretoriaMountainVenues'),
    import('./pretoriaRiverVenues'),
    import('./pretoriaBusinessVenues'),
    import('./vaalVenues'),
    import('./magaliesbergVenues'),
    import('./krugersdorpVenues'),
    import('./bronkhorstspruitVenues')
  ]);

  return {
    muldersdriftVenues,
    midrandVenues,
    centurionVenues,
    fourwaysVenues,
    lanseriaVenues,
    pretoriaWinelandsVenues,
    pretoriaMountainVenues,
    pretoriaRiverVenues,
    pretoriaBusinessVenues,
    vaalVenues,
    magaliesbergVenues,
    krugersdorpVenues,
    bronkhorstspruitVenues
  };
};

// Combine all Pretoria venues from different categories
export const getPretoriaVenues = async (): Promise<VenueType[]> => {
  const venues = await loadVenueData();
  return [
    ...venues.pretoriaWinelandsVenues,
    ...venues.pretoriaMountainVenues,
    ...venues.pretoriaRiverVenues,
    ...venues.pretoriaBusinessVenues
  ];
};

// Combine all venues from different areas
export const getAllVenues = async (): Promise<VenueType[]> => {
  const venues = await loadVenueData();
  const pretoriaVenues = await getPretoriaVenues();
  return [
    ...venues.muldersdriftVenues,
    ...venues.midrandVenues,
    ...venues.centurionVenues,
    ...venues.fourwaysVenues,
    ...venues.lanseriaVenues,
    ...pretoriaVenues,
    ...venues.vaalVenues,
    ...venues.magaliesbergVenues,
    ...venues.krugersdorpVenues,
    ...venues.bronkhorstspruitVenues
  ];
};

// Export individual venue loaders for specific use cases
export const getVenuesByArea = async (area: string): Promise<VenueType[]> => {
  const venues = await loadVenueData();
  switch (area.toLowerCase()) {
    case 'muldersdrift':
      return venues.muldersdriftVenues;
    case 'midrand':
      return venues.midrandVenues;
    case 'centurion':
      return venues.centurionVenues;
    case 'fourways':
      return venues.fourwaysVenues;
    case 'lanseria':
      return venues.lanseriaVenues;
    case 'pretoria':
      return getPretoriaVenues();
    case 'vaal':
      return venues.vaalVenues;
    case 'magaliesberg':
      return venues.magaliesbergVenues;
    case 'krugersdorp':
      return venues.krugersdorpVenues;
    case 'bronkhorstspruit':
      return venues.bronkhorstspruitVenues;
    default:
      return [];
  }
};
