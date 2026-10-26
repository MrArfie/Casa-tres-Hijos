export const bookingStatuses = [
  "pending",
  "confirmed",
  "completed",
  "cancelled",
  "rejected",
] as const;

export type BookingStatus = (typeof bookingStatuses)[number];

export type BookingPackage = "day" | "night" | "overnight";

export type StayQuote = {
  base: number;
  nights: number;
  extraGuests: number;
  extraFee: number;
  total: number;
  summary: string;
};

export type Booking = {
  reference: string;
  packageId: BookingPackage;
  date: string;
  checkOut: string;
  guests: number;
  name: string;
  phone: string;
  email: string;
  notes: string;
  status: BookingStatus;
  createdAt: string;
  updatedAt?: string;
  updatedBy?: string;
  quote?: StayQuote;
};

export type PublicBooking = Pick<
  Booking,
  "reference" | "packageId" | "date" | "checkOut" | "guests" | "name" | "status" | "createdAt" | "quote"
>;

export type AdminRole = "owner" | "staff";

export type PublicAdmin = {
  id: string;
  name: string;
  username: string;
  role: AdminRole;
  active: boolean;
  createdAt: string;
};

export const inquiryStatuses = ["new", "read", "closed"] as const;
export type InquiryStatus = (typeof inquiryStatuses)[number];

export type Inquiry = {
  id: string;
  name: string;
  phone: string;
  email: string;
  message: string;
  status: InquiryStatus;
  createdAt: string;
};
