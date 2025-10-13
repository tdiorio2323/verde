export type Dispensary = {
  id: string;
  name: string;
  region: string;
  distanceMinutes: number;
  etaRange: [number, number];
  address: string;
  vibe: string;
  featuredCategories: string[];
};

export const dispensaries: Dispensary[] = [
  {
    id: "td-studios-premier",
    name: "TD Studios Premier Lounge",
    region: "Downtown LA Arts District",
    distanceMinutes: 8,
    etaRange: [25, 35],
    address: "1212 Aurora Blvd, Los Angeles, CA",
    vibe: "Chrome lounge with concierge experience",
    featuredCategories: ["pre-packaged-flower", "vapes", "edibles"],
  },
  {
    id: "highland-botanica",
    name: "Highland Botanica",
    region: "Hollywood Hills",
    distanceMinutes: 18,
    etaRange: [35, 48],
    address: "777 Skyline Way, Los Angeles, CA",
    vibe: "Hillside sanctuary with curated reserve menu",
    featuredCategories: ["house-flower", "concentrate", "merch"],
  },
  {
    id: "sunset-coastal",
    name: "Sunset Coastal Collective",
    region: "Santa Monica & Venice",
    distanceMinutes: 26,
    etaRange: [45, 58],
    address: "4400 Oceanfront Walk, Santa Monica, CA",
    vibe: "Seaside delivery hub with wellness specialists",
    featuredCategories: ["edibles", "pre-packaged-flower", "vapes"],
  },
  {
    id: "mirage-desert-club",
    name: "Mirage Desert Club",
    region: "Palm Springs & Coachella Valley",
    distanceMinutes: 49,
    etaRange: [60, 78],
    address: "2250 Solstice Ave, Palm Springs, CA",
    vibe: "Desert resort concierge with limited drops",
    featuredCategories: ["concentrate", "edibles", "merch"],
  },
];
