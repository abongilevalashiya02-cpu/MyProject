import { Destination, Route } from "./RegionalMapsContainer";

// All destination and route data, unchanged from original file except import/export
export const destinations: Destination[] = [
  // South Africa
  { id: 'za-1', name: 'Cape Town', country: 'South Africa', type: 'Culture', description: 'Vibrant coastal city with Table Mountain and rich history', coordinates: [18.4241, -33.9249] },
  { id: 'za-2', name: 'Kruger National Park', country: 'South Africa', type: 'Nature', description: 'Safari destination with rich wildlife and the Big Five', coordinates: [31.5689, -24.1422] },
  { id: 'za-3', name: 'Garden Route', country: 'South Africa', type: 'Nature', description: 'Scenic coastal drive with forests, lagoons and beaches', coordinates: [22.5771, -33.9608] },
  { id: 'za-4', name: 'Drakensberg Mountains', country: 'South Africa', type: 'Adventure', description: 'Dramatic mountain range for hiking and scenery', coordinates: [29.2780, -29.2780] },
  { id: 'za-5', name: 'Johannesburg', country: 'South Africa', type: 'Culture', description: 'Cultural hub with history of gold mining and apartheid', coordinates: [28.0473, -26.2041] },
  
  // Botswana
  { id: 'bw-1', name: 'Okavango Delta', country: 'Botswana', type: 'Nature', description: 'Vast inland river delta with exceptional wildlife', coordinates: [22.9000, -19.3500] },
  { id: 'bw-2', name: 'Chobe National Park', country: 'Botswana', type: 'Nature', description: 'Home to one of Africa\'s largest elephant concentrations', coordinates: [25.1429, -18.1388] },
  { id: 'bw-3', name: 'Makgadikgadi Pans', country: 'Botswana', type: 'Adventure', description: 'Vast salt pans and desert landscape', coordinates: [25.9697, -20.5656] },
  
  // Zimbabwe
  { id: 'zw-1', name: 'Victoria Falls', country: 'Zimbabwe', type: 'Nature', description: 'One of the world\'s largest waterfalls', coordinates: [25.8573, -17.9243] },
  { id: 'zw-2', name: 'Hwange National Park', country: 'Zimbabwe', type: 'Nature', description: 'Zimbabwe\'s largest reserve with diverse wildlife', coordinates: [26.9476, -18.7554] },
  
  // Namibia
  { id: 'na-1', name: 'Sossusvlei', country: 'Namibia', type: 'Nature', description: 'Towering red dunes and white salt pans', coordinates: [15.3405, -24.7275] },
  { id: 'na-2', name: 'Etosha National Park', country: 'Namibia', type: 'Nature', description: 'Wildlife viewing around the vast Etosha salt pan', coordinates: [16.3209, -18.8555] },
  
  // Tanzania
  { id: 'tz-1', name: 'Serengeti', country: 'Tanzania', type: 'Nature', description: 'Vast plains famous for the great migration', coordinates: [34.8333, -2.3333] },
  { id: 'tz-2', name: 'Zanzibar', country: 'Tanzania', type: 'Culture', description: 'Island with pristine beaches and historic Stone Town', coordinates: [39.3999, -6.1659] },
  { id: 'tz-3', name: 'Mount Kilimanjaro', country: 'Tanzania', type: 'Adventure', description: 'Africa\'s highest peak offering challenging treks', coordinates: [37.3556, -3.0674] },
  
  // Mauritius
  { id: 'mu-1', name: 'Le Morne', country: 'Mauritius', type: 'Retreat', description: 'UNESCO site with stunning beaches and mountain', coordinates: [57.3088, -20.4564] },
  
  // Seychelles
  { id: 'sc-1', name: 'Mahé', country: 'Seychelles', type: 'Retreat', description: 'Main island with beaches and Morne Seychellois', coordinates: [55.4667, -4.6667] },
  
  // Madagascar
  { id: 'mg-1', name: 'Avenue of the Baobabs', country: 'Madagascar', type: 'Nature', description: 'Famous dirt road lined with ancient baobab trees', coordinates: [44.4185, -20.2510] },
  { id: 'mg-2', name: 'Nosy Be', country: 'Madagascar', type: 'Retreat', description: 'Island paradise with beaches and diving', coordinates: [48.2549, -13.3164] },
  
  // Zambia
  { id: 'zm-1', name: 'Victoria Falls (Zambia)', country: 'Zambia', type: 'Nature', description: 'The Zambian side of the majestic falls', coordinates: [25.8527, -17.9244] },
  { id: 'zm-2', name: 'South Luangwa', country: 'Zambia', type: 'Nature', description: 'Renowned for walking safaris and wildlife', coordinates: [31.7857, -13.0533] },
  
  // Mozambique
  { id: 'mz-1', name: 'Bazaruto Archipelago', country: 'Mozambique', type: 'Retreat', description: 'Pristine island chain with white beaches', coordinates: [35.4667, -21.6333] },
  
  // Angola
  { id: 'ao-1', name: 'Luanda', country: 'Angola', type: 'Culture', description: 'Coastal capital with Portuguese influence', coordinates: [13.2343, -8.8368] },
  
  // DRC
  { id: 'cd-1', name: 'Virunga National Park', country: 'DRC', type: 'Nature', description: 'Home to mountain gorillas and active volcanoes', coordinates: [29.2500, -1.5000] },
  
  // Malawi
  { id: 'mw-1', name: 'Lake Malawi', country: 'Malawi', type: 'Nature', description: 'Crystal clear waters with diverse fish species', coordinates: [34.8000, -12.1800] },
  
  // Eswatini
  { id: 'sz-1', name: 'Mlilwane Wildlife Sanctuary', country: 'Eswatini', type: 'Nature', description: 'Accessible wildlife viewing in a beautiful valley', coordinates: [31.1922, -26.4834] },
  
  // Lesotho
  { id: 'ls-1', name: 'Sani Pass', country: 'Lesotho', type: 'Adventure', description: 'Dramatic mountain pass between Lesotho and South Africa', coordinates: [29.5833, -29.5833] },
  
  // Comoros
  { id: 'km-1', name: 'Mount Karthala', country: 'Comoros', type: 'Adventure', description: 'Active volcano offering challenging hikes', coordinates: [43.3583, -11.7500] },
];

export const routes: Route[] = [
  {
    id: 'route-1',
    name: 'Cape to Kruger',
    description: 'South African highlights from Cape Town to Kruger National Park',
    destinations: ['za-1', 'za-3', 'za-4', 'za-2'],
    coordinates: [
      [18.4241, -33.9249], // Cape Town
      [22.5771, -33.9608], // Garden Route
      [29.2780, -29.2780], // Drakensberg
      [31.5689, -24.1422], // Kruger
    ]
  },
  {
    id: 'route-2',
    name: 'Victoria Falls Circuit',
    description: 'Experience the falls and wildlife of Zimbabwe, Zambia and Botswana',
    destinations: ['zw-1', 'zm-1', 'zw-2', 'bw-2', 'bw-1'],
    coordinates: [
      [25.8573, -17.9243], // Vic Falls (Zimbabwe)
      [25.8527, -17.9244], // Vic Falls (Zambia)
      [26.9476, -18.7554], // Hwange
      [25.1429, -18.1388], // Chobe
      [22.9000, -19.3500], // Okavango
    ]
  },
  {
    id: 'route-3',
    name: 'Indian Ocean Islands',
    description: 'Island hopping adventure across the Indian Ocean',
    destinations: ['sc-1', 'mg-2', 'mu-1'],
    coordinates: [
      [55.4667, -4.6667], // Mahé, Seychelles
      [48.2549, -13.3164], // Nosy Be, Madagascar
      [57.3088, -20.4564], // Le Morne, Mauritius
    ]
  },
  {
    id: 'route-4',
    name: 'East African Safari',
    description: 'Classic East African wildlife experience',
    destinations: ['tz-1', 'tz-3', 'tz-2'],
    coordinates: [
      [34.8333, -2.3333], // Serengeti
      [37.3556, -3.0674], // Kilimanjaro
      [39.3999, -6.1659], // Zanzibar
    ]
  },
];
