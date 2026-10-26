// Real Casa Tres Hijos photographs supplied by the resort.
// Do not replace these with stock or generated images.

export type PhotoCategory = "pool" | "interior" | "outdoor" | "evening";

export type Photo = {
  id: string;
  src: string;
  alt: string;
  category: PhotoCategory;
  caption: string;
};

export const logo = "/resort/logo-gold.png";

export const photos: Photo[] = [
  {
    id: "pool-day",
    src: "/resort/pool-day.jpg",
    alt: "Turquoise swimming pool at Casa Tres Hijos with swings and the A-frame villa",
    category: "pool",
    caption: "The turquoise pool",
  },
  {
    id: "pool-from-villa",
    src: "/resort/pool-from-villa.jpg",
    alt: "Pool and gold Casa Tres Hijos sign seen from the villa",
    category: "pool",
    caption: "Pool from the villa",
  },
  {
    id: "egg-chair",
    src: "/resort/egg-chair.jpg",
    alt: "Hanging egg chair on artificial grass beside the Casa Tres Hijos sign",
    category: "outdoor",
    caption: "Egg chair by the sign",
  },
  {
    id: "gold-sign",
    src: "/resort/gold-sign.jpg",
    alt: "Gold Casa Tres Hijos sign on the wall",
    category: "outdoor",
    caption: "The gold sign",
  },
  {
    id: "aframe-pool-view",
    src: "/resort/aframe-pool-view.jpg",
    alt: "A-frame living room looking through glass doors to the pool",
    category: "interior",
    caption: "A-frame, open to the pool",
  },
  {
    id: "dining-overhead",
    src: "/resort/dining-overhead.jpg",
    alt: "Marble dining table for six and grey sofa beside tan curtains",
    category: "interior",
    caption: "Dining and lounge",
  },
  {
    id: "lounge",
    src: "/resort/lounge.jpg",
    alt: "Grey sofa, marble coffee table, and stairs to the loft",
    category: "interior",
    caption: "The lounge",
  },
  {
    id: "loft-stairs",
    src: "/resort/loft-stairs.jpg",
    alt: "Gold and white staircase up to the loft, with the dining table in front",
    category: "interior",
    caption: "Stairs to the loft",
  },
  {
    id: "bedroom-trundle",
    src: "/resort/bedroom-trundle.jpg",
    alt: "Bedroom with a bed, trundle, air conditioner, and open shelving",
    category: "interior",
    caption: "Bedroom with trundle",
  },
  {
    id: "bedroom-pair",
    src: "/resort/bedroom-pair.jpg",
    alt: "Two beds in an air-conditioned room under the A-frame ceiling",
    category: "interior",
    caption: "Twin sleeping room",
  },
  {
    id: "bedroom-single",
    src: "/resort/bedroom-single.jpg",
    alt: "Air-conditioned bedroom with a pink-sheeted bed and a small shelf",
    category: "interior",
    caption: "Air-conditioned bedroom",
  },
  {
    id: "bathroom",
    src: "/resort/bathroom.jpg",
    alt: "Bathroom with rain shower, toilet, and a dark marble sink",
    category: "interior",
    caption: "Bathroom",
  },
  {
    id: "indoor-kitchen",
    src: "/resort/indoor-kitchen.jpg",
    alt: "Indoor kitchen with sink, microwave, rice cooker, and kettle",
    category: "interior",
    caption: "Indoor kitchen",
  },
  {
    id: "swings-evening",
    src: "/resort/swings-evening.jpg",
    alt: "Wooden swings and cane chairs beside the pool in the evening",
    category: "evening",
    caption: "Swings in the evening",
  },
  {
    id: "evening-aframe",
    src: "/resort/evening-aframe.jpg",
    alt: "Lit A-frame villa and pool swings at dusk",
    category: "evening",
    caption: "The villa at dusk",
  },
  {
    id: "outdoor-kitchen",
    src: "/resort/outdoor-kitchen.jpg",
    alt: "Outdoor kitchen with refrigerator, water dispenser, and a view of the pool at dusk",
    category: "evening",
    caption: "Outdoor kitchen at dusk",
  },
];

export const heroPhoto = photos[0];
export const signPhoto = photos.find((photo) => photo.id === "egg-chair")!;
export const eveningPhotos = photos.filter((photo) => photo.category === "evening");

export const rulePosters = {
  houseRules: "/resort/house-rules.jpg",
  quietHours: "/resort/quiet-hours.jpg",
  poolRules: "/resort/pool-rules.jpg",
};
