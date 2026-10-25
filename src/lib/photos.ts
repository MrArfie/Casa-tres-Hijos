// Central registry of the real Casa Tres Hijos photos + logo (CDN asset pointers).
// Never replace these with stock or AI-generated images.
import cthLogo from "@/assets/cth-logo.png.asset.json";
import poolWideDay from "@/assets/pool-wide-day.jpg.asset.json";
import poolSignage from "@/assets/pool-signage.jpg.asset.json";
import diningLiving from "@/assets/dining-living.jpg.asset.json";
import aframeInterior from "@/assets/aframe-interior.jpg.asset.json";
import loftLiving from "@/assets/loft-living.jpg.asset.json";
import swingsBarEvening from "@/assets/swings-bar-evening.jpg.asset.json";
import outdoorKitchenEvening from "@/assets/outdoor-kitchen-evening.jpg.asset.json";

export type Photo = {
  id: string;
  src: string;
  alt: string;
  category: "pool" | "interior" | "outdoor" | "evening";
  caption: string;
};

export const logo = cthLogo.url;

export const photos: Photo[] = [
  {
    id: "pool-wide-day",
    src: poolWideDay.url,
    alt: "The turquoise private pool at Casa Tres Hijos with covered swings and the A-frame villa",
    category: "pool",
    caption: "The turquoise pool",
  },
  {
    id: "pool-signage",
    src: poolSignage.url,
    alt: "Casa Tres Hijos gold signage above the pool with a hanging egg chair",
    category: "pool",
    caption: "Welcome to Casa Tres Hijos",
  },
  {
    id: "dining-living",
    src: diningLiving.url,
    alt: "Dining and living area with marble table, gold accents and garden view",
    category: "interior",
    caption: "Dining & living area",
  },
  {
    id: "aframe-interior",
    src: aframeInterior.url,
    alt: "Inside the A-frame villa looking out to the pool through tall glass doors",
    category: "interior",
    caption: "The A-frame villa",
  },
  {
    id: "loft-living",
    src: loftLiving.url,
    alt: "Cozy lounge with sofa, loft stairs and smart TV",
    category: "interior",
    caption: "Cozy lounge & loft",
  },
  {
    id: "swings-bar-evening",
    src: swingsBarEvening.url,
    alt: "Warmly lit bar seating and wooden swings beside the pool in the evening",
    category: "evening",
    caption: "Evening by the swings",
  },
  {
    id: "outdoor-kitchen-evening",
    src: outdoorKitchenEvening.url,
    alt: "Outdoor kitchen with marble counters, refrigerator and grill beside the pool at dusk",
    category: "evening",
    caption: "Outdoor kitchen at dusk",
  },
];

// Convenience roles used across pages
export const heroPhoto = poolWideDay.url;
export const aboutPhoto = poolSignage.url;
export const nightTourPhoto = swingsBarEvening.url;
export const kitchenPhoto = outdoorKitchenEvening.url;
export const loungePhoto = loftLiving.url;
export const diningPhoto = diningLiving.url;
export const aframePhoto = aframeInterior.url;
