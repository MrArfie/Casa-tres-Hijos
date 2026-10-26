import { randomBytes } from "node:crypto";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import { addDays, eachNight, manilaToday } from "@/lib/booking-dates";
import { quoteStay } from "@/lib/rates";
import {
  bookingStatuses,
  type Booking,
  type BookingPackage,
  type BookingStatus,
} from "@/lib/booking-types";

export { addDays, manilaToday };

const filePath = path.join(process.cwd(), "data", "bookings.json");

let chain: Promise<unknown> = Promise.resolve();

function withFile<T>(work: () => Promise<T>): Promise<T> {
  const run = chain.then(work, work);
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

async function readAll(): Promise<Booking[]> {
  try {
    const raw = await readFile(filePath, "utf8");
    const parsed: unknown = JSON.parse(raw);
    return Array.isArray(parsed) ? (parsed as Booking[]) : [];
  } catch {
    return [];
  }
}

async function writeAll(bookings: Booking[]) {
  await mkdir(path.dirname(filePath), { recursive: true });
  await writeFile(filePath, JSON.stringify(bookings, null, 2), "utf8");
}

function occupiedRange(booking: Pick<Booking, "date" | "checkOut" | "packageId">) {
  const end = booking.packageId === "overnight" ? booking.checkOut : addDays(booking.date, 1);
  return { start: booking.date, end };
}

function rangesOverlap(a: { start: string; end: string }, b: { start: string; end: string }) {
  return a.start < b.end && b.start < a.end;
}

function blocksDates(status: BookingStatus) {
  return status === "pending" || status === "confirmed";
}

export function phoneKey(phone: string) {
  const digits = phone.replace(/\D/g, "");
  return digits.slice(-10);
}

export async function listBookingRecords() {
  const bookings = await readAll();
  return bookings.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function createBookingRecord(input: {
  packageId: BookingPackage;
  date: string;
  checkOut: string;
  guests: number;
  name: string;
  phone: string;
  email: string;
  notes: string;
}): Promise<{ ok: true; booking: Booking } | { ok: false; error: string }> {
  return withFile(async () => {
    if (!/^\d{4}-\d{2}-\d{2}$/.test(input.date)) return { ok: false, error: "Choose a valid date." };
    if (input.date < manilaToday()) return { ok: false, error: "That date is already past in Manila." };
    if (input.packageId === "overnight" && input.checkOut <= input.date) {
      return { ok: false, error: "Check-out must be after check-in." };
    }
    if (phoneKey(input.phone).length < 10) {
      return { ok: false, error: "Enter a Philippine mobile number." };
    }
    if (!input.name.trim()) return { ok: false, error: "Name is required." };
    if (!/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(input.email)) {
      return { ok: false, error: "Enter a valid email." };
    }
    if (input.packageId === "night") {
      return { ok: false, error: "Casa Tres Hijos offers a day tour and an overnight stay." };
    }
    const priced = quoteStay({
      packageId: input.packageId,
      date: input.date,
      checkOut: input.packageId === "overnight" ? input.checkOut : input.date,
      guests: input.guests,
    });
    if (!priced.ok) return priced;

    const bookings = await readAll();
    const nextRange = occupiedRange({
      date: input.date,
      checkOut: input.packageId === "overnight" ? input.checkOut : addDays(input.date, 1),
      packageId: input.packageId,
    });
    const clash = bookings.find(
      (booking) => blocksDates(booking.status) && rangesOverlap(nextRange, occupiedRange(booking)),
    );
    if (clash) {
      return {
        ok: false,
        error: `Those dates are already held by ${clash.reference}. Casa Tres Hijos is one group at a time.`,
      };
    }

    const used = new Set(bookings.map((booking) => booking.reference));
    let reference = "";
    do {
      reference = `CTH-${randomBytes(3).toString("hex").toUpperCase()}`;
    } while (used.has(reference));

    const booking: Booking = {
      reference,
      packageId: input.packageId,
      date: input.date,
      checkOut: input.packageId === "overnight" ? input.checkOut : input.date,
      guests: input.guests,
      name: input.name.trim(),
      phone: input.phone.trim(),
      email: input.email.trim(),
      notes: input.notes.trim(),
      status: "pending",
      createdAt: new Date().toISOString(),
      quote: priced.quote,
    };
    bookings.push(booking);
    await writeAll(bookings);
    return { ok: true, booking };
  });
}

export async function blockedStayDates() {
  const bookings = await readAll();
  const dates = new Set<string>();
  for (const booking of bookings) {
    if (!blocksDates(booking.status)) continue;
    for (const date of eachNight(occupiedRange(booking).start, occupiedRange(booking).end)) dates.add(date);
  }
  return [...dates].sort();
}

export async function findOwnBooking(reference: string, phone: string) {
  const bookings = await readAll();
  const match = bookings.find((booking) => booking.reference.toUpperCase() === reference.trim().toUpperCase());
  if (!match || phoneKey(match.phone) !== phoneKey(phone)) return null;
  return match;
}

export async function setBookingStatus(reference: string, status: BookingStatus, actor: string) {
  if (!bookingStatuses.includes(status)) return null;
  return withFile(async () => {
    const bookings = await readAll();
    const match = bookings.find((booking) => booking.reference === reference);
    if (!match) return null;
    match.status = status;
    match.updatedAt = new Date().toISOString();
    match.updatedBy = actor;
    await writeAll(bookings);
    return match;
  });
}
