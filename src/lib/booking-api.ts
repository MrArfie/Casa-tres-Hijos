import { createServerFn } from "@tanstack/react-start";
import { getCookie, setCookie } from "@tanstack/react-start/server";

import {
  bookingStatuses,
  inquiryStatuses,
  type AdminRole,
  type BookingPackage,
  type BookingStatus,
  type InquiryStatus,
  type PublicAdmin,
} from "@/lib/booking-types";

const cookieName = "cth_session";

function isPackage(value: unknown): value is BookingPackage {
  return value === "day" || value === "overnight";
}

async function currentAdmin(): Promise<PublicAdmin | null> {
  const { adminFromSession } = await import("@/lib/desk.server");
  return adminFromSession(getCookie(cookieName));
}

function cookie(value: string, maxAge: number) {
  setCookie(cookieName, value, { httpOnly: true, sameSite: "lax", path: "/", maxAge });
}

export const stayAvailability = createServerFn({ method: "GET" }).handler(async () => {
  const { blockedStayDates } = await import("@/lib/bookings.server");
  return { dates: await blockedStayDates() };
});

export const adminSession = createServerFn({ method: "GET" }).handler(async () => {
  const admin = await currentAdmin();
  return { signedIn: Boolean(admin), admin };
});

export const adminLogin = createServerFn({ method: "POST" })
  .validator((input: { username?: string; password?: string }) => ({
    username: String(input?.username ?? ""),
    password: String(input?.password ?? ""),
  }))
  .handler(async ({ data }) => {
    const { loginAdmin } = await import("@/lib/desk.server");
    const result = await loginAdmin(data.username, data.password);
    if (!result) return { ok: false as const };
    cookie(result.sessionId, 60 * 60 * 24 * 7);
    return { ok: true as const, admin: result.admin };
  });

export const adminLogout = createServerFn({ method: "POST" }).handler(async () => {
  const { logoutAdmin } = await import("@/lib/desk.server");
  await logoutAdmin(getCookie(cookieName));
  cookie("", 0);
  return { ok: true };
});

export const adminBookings = createServerFn({ method: "GET" }).handler(async () => {
  if (!(await currentAdmin())) return { ok: false as const, bookings: [] };
  const { listBookingRecords } = await import("@/lib/bookings.server");
  return { ok: true as const, bookings: await listBookingRecords() };
});

export const updateBooking = createServerFn({ method: "POST" })
  .validator((input: { reference?: string; status?: string }) => ({
    reference: String(input?.reference ?? ""),
    status: String(input?.status ?? ""),
  }))
  .handler(async ({ data }) => {
    const admin = await currentAdmin();
    if (!admin) return { ok: false as const };
    if (!bookingStatuses.includes(data.status as BookingStatus)) return { ok: false as const };
    const { setBookingStatus } = await import("@/lib/bookings.server");
    const booking = await setBookingStatus(data.reference, data.status as BookingStatus, admin.name);
    return { ok: Boolean(booking) };
  });

export const submitBooking = createServerFn({ method: "POST" })
  .validator(
    (input: {
      packageId?: string;
      date?: string;
      checkOut?: string;
      guests?: string | number;
      name?: string;
      phone?: string;
      email?: string;
      notes?: string;
    }) => input,
  )
  .handler(async ({ data }) => {
    if (!isPackage(data.packageId)) return { ok: false as const, error: "Choose a package." };
    const { createBookingRecord } = await import("@/lib/bookings.server");
    return createBookingRecord({
      packageId: data.packageId,
      date: String(data.date ?? ""),
      checkOut: String(data.checkOut ?? ""),
      guests: Number(data.guests),
      name: String(data.name ?? ""),
      phone: String(data.phone ?? ""),
      email: String(data.email ?? ""),
      notes: String(data.notes ?? ""),
    });
  });

export const checkBooking = createServerFn({ method: "POST" })
  .validator((input: { reference?: string; phone?: string }) => ({
    reference: String(input?.reference ?? ""),
    phone: String(input?.phone ?? ""),
  }))
  .handler(async ({ data }) => {
    const { findOwnBooking } = await import("@/lib/bookings.server");
    const booking = await findOwnBooking(data.reference, data.phone);
    if (!booking) return { found: false as const };
    return {
      found: true as const,
      reference: booking.reference,
      packageId: booking.packageId,
      date: booking.date,
      checkOut: booking.checkOut,
      guests: booking.guests,
      name: booking.name,
      status: booking.status,
      quote: booking.quote,
    };
  });

export const submitInquiry = createServerFn({ method: "POST" })
  .validator((input: { name?: string; phone?: string; email?: string; message?: string }) => ({
    name: String(input?.name ?? ""),
    phone: String(input?.phone ?? ""),
    email: String(input?.email ?? ""),
    message: String(input?.message ?? ""),
  }))
  .handler(async ({ data }) => {
    const { createInquiry } = await import("@/lib/desk.server");
    return createInquiry(data);
  });

export const adminInquiries = createServerFn({ method: "GET" }).handler(async () => {
  if (!(await currentAdmin())) return { ok: false as const, inquiries: [] };
  const { listInquiries } = await import("@/lib/desk.server");
  return { ok: true as const, inquiries: await listInquiries() };
});

export const updateInquiry = createServerFn({ method: "POST" })
  .validator((input: { id?: string; status?: string }) => ({
    id: String(input?.id ?? ""),
    status: String(input?.status ?? ""),
  }))
  .handler(async ({ data }) => {
    if (!(await currentAdmin())) return { ok: false as const };
    if (!inquiryStatuses.includes(data.status as InquiryStatus)) return { ok: false as const };
    const { setInquiryStatus } = await import("@/lib/desk.server");
    return { ok: await setInquiryStatus(data.id, data.status as InquiryStatus) };
  });

export const adminAccounts = createServerFn({ method: "GET" }).handler(async () => {
  const admin = await currentAdmin();
  if (!admin || admin.role !== "owner") return { ok: false as const, accounts: [] };
  const { listAdmins } = await import("@/lib/desk.server");
  return { ok: true as const, accounts: await listAdmins() };
});

export const createAdminAccount = createServerFn({ method: "POST" })
  .validator((input: { name?: string; username?: string; password?: string; role?: string }) => ({
    name: String(input?.name ?? ""),
    username: String(input?.username ?? ""),
    password: String(input?.password ?? ""),
    role: (input?.role === "owner" ? "owner" : "staff") as AdminRole,
  }))
  .handler(async ({ data }) => {
    const admin = await currentAdmin();
    if (!admin || admin.role !== "owner") return { ok: false as const, error: "Only an owner can add accounts." };
    const { createAdminAccount: create } = await import("@/lib/desk.server");
    return create(data);
  });

export const setAdminActive = createServerFn({ method: "POST" })
  .validator((input: { id?: string; active?: boolean }) => ({
    id: String(input?.id ?? ""),
    active: Boolean(input?.active),
  }))
  .handler(async ({ data }) => {
    const admin = await currentAdmin();
    if (!admin || admin.role !== "owner") return { ok: false as const, error: "Only an owner can change accounts." };
    const { setAdminActive: update } = await import("@/lib/desk.server");
    return update(data.id, data.active, admin.id);
  });

export const setAdminPassword = createServerFn({ method: "POST" })
  .validator((input: { id?: string; password?: string }) => ({
    id: String(input?.id ?? ""),
    password: String(input?.password ?? ""),
  }))
  .handler(async ({ data }) => {
    const admin = await currentAdmin();
    if (!admin || admin.role !== "owner") return { ok: false as const, error: "Only an owner can change passwords." };
    const { setAdminPassword: update } = await import("@/lib/desk.server");
    return update(data.id, data.password);
  });
