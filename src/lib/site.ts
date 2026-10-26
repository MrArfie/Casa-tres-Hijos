import { photos, type Photo } from "@/lib/photos";

export const resortName = "Casa Tres Hijos";
export const tagline = "Your private escape. Your unforgettable moments.";
export const facebookUrl = "https://www.facebook.com/profile.php?id=61591724522212";
export const address = "Daffodil Street, Pampanga, Philippines";
export const coordinates = { lat: 15.051722, lng: 120.665139 };
export const mapsEmbedUrl = `https://maps.google.com/maps?q=${coordinates.lat},${coordinates.lng}&z=16&output=embed`;
export const mapsDirectionsUrl = `https://www.google.com/maps/dir/?api=1&destination=${coordinates.lat},${coordinates.lng}`;

export const navLinks = [
  { to: "/", label: "Home" },
  { to: "/about", label: "About" },
  { to: "/packages", label: "Packages" },
  { to: "/amenities", label: "Amenities" },
  { to: "/gallery", label: "Gallery" },
  { to: "/rules", label: "Rules & FAQs" },
  { to: "/contact", label: "Contact" },
] as const;

export const packages = [
  {
    id: "day",
    label: "Day Tour",
    summary: "The pool, villa, and outdoor spaces for the day. Guests may use the loft. Towels are not included.",
  },
  {
    id: "overnight",
    label: "Overnight Stay",
    summary: "Check-in is 2:00 PM and check-out is 12:00 noon. Towels are included. The rate is charged for each night.",
  },
] as const;

export type PackageId = (typeof packages)[number]["id"];

export function packageLabel(id: string) {
  if (id === "night") return "Night Tour";
  return packages.find((item) => item.id === id)?.label ?? id;
}

const byId = Object.fromEntries(photos.map((photo) => [photo.id, photo])) as Record<string, Photo>;

export const amenities = [
  {
    id: "pool",
    title: "Swimming pool",
    body: "A private pool for the one group that has the resort.",
  },
  {
    id: "kitchen",
    title: "Outdoor kitchen and grill",
    body: "An outdoor kitchen with a refrigerator and water dispenser, and a designated grill. Indoors: a sink, microwave, rice cooker, and kettle.",
  },
  {
    id: "stay",
    title: "Comfortable accommodation",
    body: "Sleeping rooms in the A-frame villa, kept for your group.",
  },
  {
    id: "wifi",
    title: "Free Wi-Fi",
    body: "Wi-Fi is included with the stay.",
  },
  {
    id: "ac",
    title: "Air-conditioned rooms",
    body: "The sleeping rooms are air-conditioned.",
  },
  {
    id: "netflix",
    title: "Netflix",
    body: "Netflix is available in the villa.",
  },
  {
    id: "videoke",
    title: "Videoke",
    body: "Videoke is on the property. During quiet hours, 10:00 PM to 7:00 AM, keep it low.",
  },
  {
    id: "location",
    title: "Great location",
    body: "Daffodil Street, Pampanga.",
  },
  {
    id: "clean",
    title: "Clean and safe",
    body: "The resort is cleaned and prepared for each group.",
  },
  {
    id: "occasions",
    title: "Family, friends, and special occasions",
    body: "The whole property is for one group — family, friends, or a celebration.",
  },
  {
    id: "towels",
    title: "Towels",
    body: "Towels are included with an overnight stay. Day tour guests may use the loft, and towels are not provided.",
  },
] as const;

export const amenityHighlights: { title: string; body: string; photo: Photo }[] = [
  {
    title: "Private swimming pool",
    body: "A turquoise pool for the one group that has the resort.",
    photo: byId["pool-day"],
  },
  {
    title: "A-frame villa",
    body: "Tall glass opens the living room onto the pool.",
    photo: byId["aframe-pool-view"],
  },
  {
    title: "Comfortable lounge",
    body: "A sofa, coffee table, and stairs up to the loft.",
    photo: byId["lounge"],
  },
  {
    title: "Dining area",
    body: "A marble table beside the lounge, looking out to the grass.",
    photo: byId["dining-overhead"],
  },
  {
    title: "Kitchen and refrigerator",
    body: "An outdoor kitchen with a refrigerator and water dispenser, plus an indoor sink, microwave, rice cooker, and kettle.",
    photo: byId["outdoor-kitchen"],
  },
  {
    title: "Outdoor seating and swings",
    body: "Covered swings, cane chairs, and an egg chair beside the pool.",
    photo: byId["swings-evening"],
  },
];

export const houseRules = [
  {
    title: "Check-in and check-out",
    points: [
      "Check-in: 2:00 PM",
      "Check-out: 12:00 noon",
      "Please observe the scheduled check-in and check-out times.",
      "Day tour guests may use the loft. Towels are not provided on a day tour.",
      "Towels are included with an overnight stay.",
    ],
  },
  {
    title: "Quiet hours",
    points: [
      "Quiet hours are from 10:00 PM to 7:00 AM.",
      "Please keep music and conversations at a considerate volume.",
      "Please lower your voices.",
      "Keep music at a low volume.",
      "Keep karaoke at a low volume.",
    ],
  },
  {
    title: "Smoking policy",
    points: [
      "Smoking is strictly prohibited inside the house and cabin.",
      "Please smoke only in the designated smoking area.",
      "Dispose of cigarette butts properly.",
    ],
  },
  {
    title: "Kitchen and cooking",
    points: [
      "Clean dishes, utensils, and counters after use.",
      "Turn off the cooktop and appliances after use.",
      "Use designated grilling areas only.",
      "Dispose of food waste properly.",
    ],
  },
  {
    title: "Cleanliness and care",
    points: [
      "Dispose of garbage in designated bins.",
      "Please handle furniture, appliances, and resort facilities with care.",
      "Charges may apply for damage or missing items.",
    ],
  },
  {
    title: "Prohibited activities",
    points: [
      "Illegal drugs and disruptive behavior are prohibited.",
      "No activities that endanger guests or damage property.",
      "Pets are not allowed.",
    ],
  },
];

export const poolRules = [
  "Swim at your own risk.",
  "No lifeguard on duty.",
  "Children must be supervised by an adult at all times.",
  "No running, pushing, or rough play.",
  "No diving.",
  "No glass bottles or breakable containers in the pool area.",
  "No swimming under the influence of alcohol.",
  "Keep the pool area clean.",
  "Shower before entering the pool.",
  "In case of emergency, notify the property management immediately.",
];

export const faqs = [
  {
    q: "When is check-in and check-out?",
    a: "Check-in is 2:00 PM. Check-out is 12:00 noon.",
  },
  {
    q: "What are quiet hours?",
    a: "10:00 PM to 7:00 AM. Keep voices, music, and karaoke low.",
  },
  {
    q: "Can we smoke?",
    a: "Not inside the house or cabin. Smoke only in the designated smoking area and dispose of butts properly.",
  },
  {
    q: "Are pets allowed?",
    a: "No. Pets are not allowed.",
  },
  {
    q: "Is there a lifeguard?",
    a: "No. Swim at your own risk, and children must be supervised by an adult at all times.",
  },
  {
    q: "What amenities are included?",
    a: "Swimming pool, outdoor kitchen and grill, comfortable accommodation, free Wi-Fi, air-conditioned rooms, Netflix, and videoke. Towels are included with an overnight stay. Day tour guests may use the loft without a towel. The resort is on Daffodil Street in Pampanga and is kept for one group.",
  },
  {
    q: "How much is a stay?",
    a: "Through December 2026, Monday to Thursday is ₱6,999 and Friday to Sunday is ₱7,999. From January 2027 those rates are ₱7,499 and ₱8,499. The rate includes 10 guests. Each guest from 11 to 13 adds ₱500. A day tour uses the rate for that date. An overnight stay uses the rate for each night. Payment is arranged with the resort after the booking is confirmed.",
  },
  {
    q: "Can a day tour use the loft?",
    a: "Yes. Day tour guests may use the loft. Towels are not provided on a day tour.",
  },
];
