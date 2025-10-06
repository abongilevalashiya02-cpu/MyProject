// Country data with destinations - Enhanced for SEO and AI readability
// Lazy-loaded to prevent memory issues during build
export const getCountriesData = async () => {
  // Split into smaller chunks to improve performance
  const countriesData = [
  // ACTIVE COUNTRIES (Tours currently available)
  {
    code: '🇿🇲',
    name: 'Zambia',
    shape: 'M10,10 L30,5 L30,25 L10,30 Z',
    isActive: true,
    destinations: [
      { name: 'Victoria Falls (Mosi-oa-Tunya)', description: 'UNESCO World Heritage site and one of Seven Natural Wonders featuring adventure activities, luxury lodge accommodations, and helicopter flight experiences' },
      { name: 'South Luangwa National Park', description: 'World-renowned walking safari destination offering luxury bush camps, exceptional wildlife viewing, and pioneering conservation tourism experiences' },
      { name: 'Lower Zambezi National Park', description: 'Pristine wilderness area featuring canoe safaris, big game viewing, luxury riverside camps, and exclusive Zambezi River expedition experiences' },
      { name: 'Lake Kariba', description: 'Massive artificial lake offering luxury houseboat accommodations, spectacular sunset views, fishing expeditions, and peaceful retreat experiences' },
      { name: 'Kafue National Park', description: 'Zambia\'s largest and least crowded safari destination offering authentic wilderness experiences, diverse ecosystems, and exclusive luxury safari lodges' },
    ],
  },
  {
    code: '🇿🇦',
    name: 'South Africa',
    shape: 'M10,10 L30,10 L30,25 L20,30 L10,25 Z',
    isActive: true,
    destinations: [
      { name: 'Cape Town', description: 'World-class destination featuring Table Mountain cable car, Robben Island heritage tours, Cape Winelands, and luxury V&A Waterfront experiences' },
      { name: 'Kruger National Park', description: 'Africa\'s premier Big Five safari destination offering luxury safari lodges, game drives, walking safaris, and exceptional wildlife photography opportunities' },
      { name: 'Garden Route', description: 'Scenic coastal drive from Mossel Bay to Storms River featuring whale watching, adventure activities, luxury accommodations, and diverse ecosystems' },
      { name: 'Drakensberg Mountains', description: 'UNESCO World Heritage site offering world-class hiking, San rock art heritage tours, luxury mountain lodges, and dramatic alpine scenery' },
      { name: 'Johannesburg & Soweto', description: 'Urban cultural hub featuring apartheid history tours, gold mining heritage, vibrant townships, and authentic South African cultural experiences' },
      { name: 'Durban', description: 'Indian Ocean coastal city featuring golden beaches, rich Zulu cultural heritage, Indian Quarter cuisine tours, and beachfront resort accommodations' },
    ],
  },
  {
    code: '🇿🇼',
    name: 'Zimbabwe',
    shape: 'M10,10 L30,10 L30,30 L10,30 Z',
    isActive: true,
    destinations: [
      { name: 'Victoria Falls', description: 'Shared UNESCO World Heritage wonder with Zambia, featuring adventure activities, luxury accommodations, and dramatic Zambezi River gorge experiences' },
      { name: 'Hwange National Park', description: 'Zimbabwe\'s largest national park offering Big Five wildlife viewing, luxury safari lodges, massive elephant herds, and premier game photography' },
      { name: 'Great Zimbabwe Ruins', description: 'UNESCO World Heritage medieval stone city showcasing ancient African civilization, archaeological tours, and rich cultural heritage experiences' },
      { name: 'Mana Pools National Park', description: 'UNESCO World Heritage site offering exclusive canoe safaris, walking safaris, luxury bush camps, and pristine Zambezi River wilderness experiences' },
      { name: 'Eastern Highlands', description: 'Mountain region featuring Chimanimani and Nyanga peaks, cool climate retreats, hiking trails, and scenic mountain lodge accommodations' },
    ],
  },
  {
    code: '🇧🇼',
    name: 'Botswana',
    shape: 'M10,10 L35,10 L35,20 L28,20 L28,35 L10,35 Z',
    isActive: true,
    destinations: [
      { name: 'Okavango Delta', description: 'UNESCO World Heritage wetland safari destination renowned for mokoro canoe expeditions, luxury lodge experiences, and exceptional African wildlife viewing' },
      { name: 'Chobe National Park', description: 'Africa\'s elephant capital offering world-class Big Five safari experiences, river cruises, and premium wildlife photography opportunities in Botswana' },
      { name: 'Makgadikgadi Pans', description: 'Ancient Kalahari Desert salt flats providing unique cultural tourism with Kalahari Bushmen experiences and meerkat wildlife encounters for adventure travelers' },
      { name: 'Moremi Game Reserve', description: 'Exclusive wildlife sanctuary within Okavango Delta offering luxury safari lodges, diverse ecosystems, and premier African game viewing experiences' },
      { name: 'Tsodilo Hills', description: 'UNESCO World Heritage site featuring ancient San rock art galleries, spiritual cultural tourism, and archaeological heritage experiences in the Kalahari' },
    ],
  },
  {
    code: '🇸🇿',
    name: 'Eswatini',
    shape: 'M15,10 L25,10 L25,30 L15,30 Z',
    isActive: true,
    destinations: [
      { name: 'Mbabane', description: 'Capital city featuring vibrant Swazi arts and crafts markets, traditional cultural experiences, and gateway to mountain tourism adventures' },
      { name: 'Mlilwane Wildlife Sanctuary', description: 'Community-managed nature reserve offering accessible African wildlife viewing, hiking trails, and sustainable eco-tourism in beautiful mountain valley' },
      { name: 'Mantenga Cultural Village', description: 'Authentic traditional Swazi cultural village providing immersive indigenous experiences, traditional dances, and cultural heritage tourism' },
      { name: 'Sibebe Rock', description: 'World\'s second-largest granite dome offering epic hiking adventures, rock climbing, and panoramic mountain views for adventure tourism enthusiasts' },
      { name: 'Hlane Royal National Park', description: 'Premier wildlife reserve featuring African lion sightings, diverse bird watching opportunities, and luxury safari lodge experiences in Eswatini' },
    ],
  },
  // COMING IN 2026
  {
    code: '🇦🇴',
    name: 'Angola',
    shape: 'M15,10 L25,5 L35,10 L30,25 L20,35 L10,30 L5,20 Z',
    isActive: false,
    destinations: [
      { name: 'Luanda', description: 'Angola\'s vibrant capital city featuring Portuguese colonial architecture, Atlantic Ocean coastline, and rich cultural heritage perfect for urban tourism experiences' },
      { name: 'Kalandula Falls', description: 'One of Africa\'s largest waterfalls located in Malanje Province, offering spectacular nature photography opportunities and adventure tourism in Angola' },
      { name: 'Benguela', description: 'Historic Atlantic port city and gateway to pristine Lobito beaches, ideal for coastal tourism and exploring Angola\'s maritime cultural heritage' },
      { name: 'Kissama National Park', description: 'Premier wildlife sanctuary and safari destination featuring African elephants, giraffes, and diverse ecosystem for eco-tourism adventures' },
      { name: 'Tunda Vala Fissure', description: 'Dramatic mountain viewpoint near Lubango offering breathtaking panoramic landscapes and hiking opportunities for adventure tourism enthusiasts' },
    ],
  },
  {
    code: '🇰🇲',
    name: 'Comoros',
    shape: 'M20,20 m-15,0 a15,15 0 1,0 30,0 a15,15 0 1,0 -30,0',
    isActive: false,
    destinations: [
      { name: 'Moroni', description: 'Capital city showcasing unique Arab-Swahili architecture, Islamic cultural heritage, and Indian Ocean coastal charm for cultural tourism enthusiasts' },
      { name: 'Mount Karthala', description: 'Active volcanic peak offering challenging mountain trekking adventures, crater lake exploration, and eco-tourism experiences in the Comoros Islands' },
      { name: 'Mohéli Marine Park', description: 'Pristine marine conservation area featuring world-class diving, sea turtle nesting sites, and sustainable eco-tourism in the Indian Ocean' },
      { name: 'Anjouan Island', description: 'Lush tropical mountain island featuring cascading waterfalls, spice plantations, and authentic Comorian cultural immersion experiences' },
      { name: 'Chomoni Beach', description: 'Pristine white sand tropical beach destination offering peaceful relaxation, water sports, and luxury beach resort experiences in Comoros' },
    ],
  },
  {
    code: '🇨🇩',
    name: 'DRC',
    shape: 'M10,5 L35,10 L30,30 L15,35 L5,25 Z',
    isActive: false,
    destinations: [
      { name: 'Virunga National Park', description: 'UNESCO World Heritage site offering rare mountain gorilla trekking expeditions, active volcano hiking, and conservation tourism in Central Africa' },
      { name: 'Lake Kivu', description: 'Scenic Great Rift Valley lake shared with Rwanda, featuring boat tours, lakeside resorts, and peaceful retreat experiences in DRC' },
      { name: 'Nyiragongo Volcano', description: 'Active stratovolcano near Goma featuring the world\'s largest lava lake, challenging overnight treks, and extreme adventure tourism experiences' },
      { name: 'Kinshasa', description: 'Vibrant capital city renowned for Congolese music culture, bustling markets, and authentic Central African urban cultural experiences' },
      { name: 'Boyoma Falls', description: 'Series of spectacular cataracts near Kisangani on the Congo River, offering nature photography and river expedition tourism opportunities' },
    ],
  },
  {
    code: '🇱🇸',
    name: 'Lesotho',
    shape: 'M15,15 L25,15 L25,25 L15,25 Z',
    isActive: false,
    destinations: [
      { name: 'Thaba Bosiu', description: 'Historic mountain fortress and birthplace of the Basotho nation, offering cultural heritage tourism and traditional Lesotho history experiences' },
      { name: 'Sani Pass', description: 'Dramatic 4x4 mountain pass route into Drakensberg Mountains, featuring adventure driving, alpine scenery, and highest pub in Africa' },
      { name: 'Katse Dam', description: 'Engineering marvel and scenic mountain reservoir offering boat tours, fishing experiences, and highland tourism in the Maloti Mountains' },
      { name: 'Maseru', description: 'Capital city providing urban cultural experiences, traditional markets, and gateway access to Lesotho\'s mountain kingdom adventures' },
      { name: 'Sehlabathebe National Park', description: 'Remote UNESCO transfrontier park featuring unique sandstone formations, alpine hiking, and pristine mountain wilderness experiences' },
    ],
  },
  {
    code: '🇲🇬',
    name: 'Madagascar',
    shape: 'M15,5 L25,10 L25,30 L20,35 L10,30 L15,15 Z',
    isActive: false,
    destinations: [
      { name: 'Avenue of the Baobabs', description: 'Iconic Madagascar landmark featuring ancient baobab trees along scenic dirt road, perfect for sunset photography and nature tourism experiences' },
      { name: 'Isalo National Park', description: 'Dramatic sandstone canyon landscape featuring natural swimming pools, unique endemic wildlife, and adventure hiking in Madagascar\'s wilderness' },
      { name: 'Andasibe-Mantadia National Park', description: 'Premier Madagascar rainforest reserve famous for endangered indri lemur encounters, bird watching, and endemic species eco-tourism experiences' },
      { name: 'Nosy Be', description: 'Tropical island paradise featuring pristine beaches, world-class scuba diving, luxury resorts, and spice plantation cultural tourism' },
      { name: 'Tsingy de Bemaraha', description: 'UNESCO World Heritage limestone pinnacle formations offering unique geological wonders, adventure climbing, and Madagascar\'s otherworldly landscapes' },
    ],
  },
  {
    code: '🇲🇼',
    name: 'Malawi',
    shape: 'M20,5 L25,10 L25,30 L20,35 L15,30 L15,10 Z',
    isActive: false,
    destinations: [
      { name: 'Lake Malawi', description: 'UNESCO World Heritage freshwater lake featuring world-class snorkeling with tropical fish, pristine beaches, and luxury lakeside resort experiences' },
      { name: 'Mount Mulanje', description: 'Dramatic granite mountain massif offering challenging hiking expeditions, tea plantation tours, and scenic mountain lodge accommodations' },
      { name: 'Liwonde National Park', description: 'Premier Malawi safari destination featuring Shire River boat safaris, elephant encounters, and luxury eco-lodge wildlife viewing experiences' },
      { name: 'Zomba Plateau', description: 'Scenic forested highland plateau offering cool mountain climate, hiking trails, trout fishing, and colonial-era retreat experiences' },
      { name: 'Nkhata Bay', description: 'Laid-back Lake Malawi backpacker destination featuring budget-friendly accommodations, water sports, and authentic local cultural experiences' },
    ],
  },
  {
    code: '🇲🇺',
    name: 'Mauritius',
    shape: 'M20,20 m-12,0 a12,12 0 1,0 24,0 a12,12 0 1,0 -24,0',
    isActive: false,
    destinations: [
      { name: 'Le Morne Brabant', description: 'UNESCO World Heritage mountain and beach destination featuring hiking adventures, cultural heritage significance, and luxury resort experiences' },
      { name: 'Chamarel Seven Colored Earths', description: 'Unique geological natural wonder featuring multicolored sand dunes, waterfalls, and rum distillery tours for nature tourism enthusiasts' },
      { name: 'Black River Gorges National Park', description: 'Mauritius\' largest national park offering endemic bird watching, forest trekking, and conservation tourism in tropical mountain landscapes' },
      { name: 'Grand Baie', description: 'Popular northern Mauritius beach resort destination featuring water sports, luxury accommodations, and vibrant nightlife for tropical vacations' },
      { name: 'Île aux Cerfs', description: 'Pristine white sand island paradise offering luxury day trips, water sports, golf experiences, and exclusive beach resort tourism' },
    ],
  },
  {
    code: '🇲🇿',
    name: 'Mozambique',
    shape: 'M15,5 L25,5 L30,30 L15,35 L10,20 Z',
    isActive: false,
    destinations: [
      { name: 'Bazaruto Archipelago', description: 'Pristine Indian Ocean island chain featuring luxury eco-lodges, world-class diving with manta rays, and exclusive beach resort experiences' },
      { name: 'Tofo Beach', description: 'World-renowned marine wildlife destination for whale shark and manta ray encounters, scuba diving, and beachfront lodge accommodations' },
      { name: 'Quirimbas Archipelago', description: 'Remote pristine island paradise featuring traditional dhow sailing safaris, luxury eco-resorts, and untouched coral reef diving experiences' },
      { name: 'Maputo', description: 'Vibrant capital city showcasing Portuguese colonial architecture, coastal charm, local markets, and authentic Mozambican cultural experiences' },
      { name: 'Gorongosa National Park', description: 'Restored wildlife conservation success story offering Big Five safari experiences, eco-tourism, and sustainable conservation tourism initiatives' },
    ],
  },
  {
    code: '🇳🇦',
    name: 'Namibia',
    shape: 'M5,5 L30,5 L30,30 L25,35 L5,30 Z',
    isActive: false,
    destinations: [
      { name: 'Etosha National Park', description: 'Premier Namibian safari destination featuring massive salt pan, Big Five wildlife viewing, luxury lodge accommodations, and exceptional game photography' },
      { name: 'Sossusvlei (Namib Desert)', description: 'World\'s highest red sand dunes in ancient Namib Desert, featuring iconic Deadvlei, sunrise photography, and luxury desert lodge experiences' },
      { name: 'Swakopmund', description: 'German colonial coastal town offering extreme adventure sports, quad biking, skydiving, and unique desert-meets-ocean tourism experiences' },
      { name: 'Skeleton Coast', description: 'Remote Atlantic coastline featuring dramatic shipwrecks, massive seal colonies, desert-adapted wildlife, and exclusive fly-in safari experiences' },
      { name: 'Fish River Canyon', description: 'Africa\'s largest canyon offering multi-day hiking expeditions, dramatic geological formations, and luxury lodge accommodations with panoramic views' },
    ],
  },
  {
    code: '🇸🇨',
    name: 'Seychelles',
    shape: 'M20,20 m-10,0 a10,10 0 1,0 20,0 a10,10 0 1,0 -20,0',
    isActive: false,
    destinations: [
      { name: 'Mahé Island', description: 'Main Seychelles island featuring Victoria capital city, Morne Seychellois National Park hiking, luxury resorts, and pristine tropical beaches' },
      { name: 'Praslin Island', description: 'UNESCO Vallée de Mai nature reserve home to endemic coco de mer palms, plus world-famous Anse Lazio beach and luxury resort accommodations' },
      { name: 'La Digue Island', description: 'Iconic Seychelles destination featuring Anse Source d\'Argent (world\'s most photographed beach), bicycle exploration, and exclusive lodge experiences' },
      { name: 'Aldabra Atoll', description: 'UNESCO World Heritage marine atoll featuring giant tortoise sanctuary, pristine coral reefs, and exclusive eco-tourism research station visits' },
      { name: 'Curieuse Island', description: 'Protected nature reserve featuring mangrove forest trails, giant tortoise encounters, and exclusive day trip eco-tourism experiences' },
    ],
  },
  {
    code: '🇹🇿',
    name: 'Tanzania',
    shape: 'M10,5 L30,10 L25,30 L5,25 Z',
    isActive: false,
    destinations: [
      { name: 'Serengeti National Park', description: 'UNESCO World Heritage site famous for Great Migration spectacle, Big Five safari experiences, luxury tented camps, and world-class wildlife photography' },
      { name: 'Zanzibar', description: 'Spice island paradise featuring UNESCO Stone Town heritage tours, pristine beaches, luxury resorts, and authentic Swahili cultural experiences' },
      { name: 'Mount Kilimanjaro', description: 'Africa\'s highest peak offering challenging multi-day trekking expeditions, diverse climate zones, and luxury mountain lodge base accommodations' },
      { name: 'Ngorongoro Crater', description: 'UNESCO World Heritage volcanic caldera featuring dense wildlife concentrations, luxury crater rim lodges, and exceptional Big Five viewing opportunities' },
      { name: 'Selous/Nyerere National Park', description: 'Africa\'s largest protected wildlife reserve offering exclusive walking safaris, boat safaris, luxury remote camps, and pristine wilderness experiences' },
    ],
  },
];

  return countriesData;
};

// Export static types for TypeScript
export type CountryData = {
  code: string;
  name: string;
  shape: string;
  isActive: boolean;
  destinations: Array<{
    name: string;
    description: string;
  }>;
};

// Legacy export for existing code - returns promise now
export const countries = getCountriesData();