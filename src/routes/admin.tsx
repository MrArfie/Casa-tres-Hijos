import { createFileRoute } from "@tanstack/react-router";
import { useEffect, useState, type FormEvent } from "react";

import { DeskCalendar } from "@/components/site/desk-calendar";
import { logo } from "@/lib/photos";
import {
  adminAccounts,
  adminBookings,
  adminInquiries,
  adminLogin,
  adminLogout,
  adminSession,
  createAdminAccount,
  setAdminActive,
  setAdminPassword,
  updateBooking,
  updateInquiry,
} from "@/lib/booking-api";
import type { Booking, BookingStatus, Inquiry, InquiryStatus, PublicAdmin } from "@/lib/booking-types";
import { peso } from "@/lib/rates";
import { packageLabel } from "@/lib/site";

export const Route = createFileRoute("/admin")({
  head: () => ({
    meta: [
      { title: "Resort desk — Casa Tres Hijos" },
      { name: "robots", content: "noindex" },
    ],
  }),
  component: AdminPage,
});

const bookingActions: { status: BookingStatus; label: string }[] = [
  { status: "confirmed", label: "Confirm" },
  { status: "rejected", label: "Reject" },
  { status: "cancelled", label: "Cancel" },
  { status: "completed", label: "Complete" },
  { status: "pending", label: "Mark pending" },
];

const inquiryActions: { status: InquiryStatus; label: string }[] = [
  { status: "read", label: "Mark read" },
  { status: "closed", label: "Close" },
  { status: "new", label: "Mark new" },
];

type Tab = "overview" | "schedule" | "bookings" | "inquiries" | "team";

function AdminPage() {
  const [ready, setReady] = useState(false);
  const [admin, setAdmin] = useState<PublicAdmin | null>(null);
  const [bookings, setBookings] = useState<Booking[]>([]);
  const [inquiries, setInquiries] = useState<Inquiry[]>([]);
  const [accounts, setAccounts] = useState<PublicAdmin[]>([]);
  const [tab, setTab] = useState<Tab>("overview");
  const [filter, setFilter] = useState<BookingStatus | "all">("all");
  const [error, setError] = useState("");
  const [notice, setNotice] = useState("");

  async function load() {
    const session = await adminSession();
    setAdmin(session.admin);
    if (session.signedIn && session.admin) {
      const [bookingResult, inquiryResult] = await Promise.all([adminBookings(), adminInquiries()]);
      setBookings(bookingResult.ok ? bookingResult.bookings : []);
      setInquiries(inquiryResult.ok ? inquiryResult.inquiries : []);
      if (session.admin.role === "owner") {
        const accountResult = await adminAccounts();
        setAccounts(accountResult.ok ? accountResult.accounts : []);
      }
    }
    setReady(true);
  }

  useEffect(() => {
    void load();
  }, []);

  async function onLogin(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    const form = new FormData(event.currentTarget);
    const result = await adminLogin({
      data: {
        username: String(form.get("username") ?? ""),
        password: String(form.get("password") ?? ""),
      },
    });
    if (!result.ok) {
      setError("Those details do not match an active account.");
      return;
    }
    setError("");
    await load();
  }

  if (!ready) {
    return <p className="px-5 py-20 text-center text-sm text-muted-foreground">Opening the desk…</p>;
  }

  if (!admin) {
    return (
      <section className="mx-auto max-w-md px-5 py-20">
        <img src={logo} alt="Casa Tres Hijos" className="h-16 w-auto" />
        <h1 className="mt-6 text-4xl font-medium text-charcoal">Resort desk</h1>
        <p className="mt-3 text-sm text-muted-foreground">Sign in with your staff account to see bookings and messages.</p>
        <form onSubmit={onLogin} className="mt-8 grid gap-3">
          <input name="username" required autoComplete="username" placeholder="Username" className="h-11 rounded-xl border border-input bg-card px-3" />
          <input name="password" type="password" required autoComplete="current-password" placeholder="Password" className="h-11 rounded-xl border border-input bg-card px-3" />
          {error ? <p className="text-sm text-destructive">{error}</p> : null}
          <button type="submit" className="h-11 rounded-full bg-charcoal text-sm font-semibold text-cream">
            Sign in
          </button>
        </form>
      </section>
    );
  }

  const pending = bookings.filter((booking) => booking.status === "pending").length;
  const newMessages = inquiries.filter((inquiry) => inquiry.status === "new").length;
  const visible = filter === "all" ? bookings : bookings.filter((booking) => booking.status === filter);
  const tabs: Tab[] = admin.role === "owner" ? ["overview", "schedule", "bookings", "inquiries", "team"] : ["overview", "schedule", "bookings", "inquiries"];
  const held = bookings
    .filter((booking) => booking.status === "pending" || booking.status === "confirmed")
    .sort((a, b) => a.date.localeCompare(b.date));

  return (
    <section className="mx-auto max-w-6xl px-5 py-12">
      <div className="flex flex-wrap items-end justify-between gap-4">
        <div>
          <p className="eyebrow text-gold-deep">Resort desk</p>
          <h1 className="mt-2 text-4xl font-medium text-charcoal">{admin.name}</h1>
          <p className="mt-2 text-sm text-muted-foreground">
            {admin.role === "owner" ? "Owner" : "Staff"} · @{admin.username}
          </p>
        </div>
        <button
          type="button"
          className="text-sm font-semibold text-gold-deep"
          onClick={async () => {
            await adminLogout();
            setAdmin(null);
            setBookings([]);
            setInquiries([]);
            setAccounts([]);
          }}
        >
          Sign out
        </button>
      </div>

      <div className="mt-8 flex flex-wrap gap-2">
        {tabs.map((item) => (
          <button
            key={item}
            type="button"
            onClick={() => setTab(item)}
            className={`rounded-full px-4 py-2 text-sm font-semibold capitalize ${tab === item ? "bg-charcoal text-cream" : "border border-border text-charcoal"}`}
          >
            {item}
            {item === "bookings" && pending ? ` (${pending})` : ""}
            {item === "inquiries" && newMessages ? ` (${newMessages})` : ""}
          </button>
        ))}
      </div>

      {tab === "overview" ? (
        <div className="mt-8 grid gap-4">
          <div className="grid gap-4 sm:grid-cols-3">
            <Stat label="Pending bookings" value={String(pending)} />
            <Stat label="New messages" value={String(newMessages)} />
            <Stat label="Dates held" value={String(held.length)} />
          </div>
          <article className="rounded-3xl border border-border bg-card p-5">
            <h2 className="text-2xl font-medium text-charcoal">Held dates</h2>
            {held.length === 0 ? (
              <p className="mt-3 text-sm text-muted-foreground">No dates are held. The schedule shows every open day.</p>
            ) : (
              <ul className="mt-3 grid gap-2 text-sm">
                {held.map((booking) => (
                  <li key={booking.reference} className="flex flex-wrap justify-between gap-2">
                    <span className="font-medium text-charcoal">
                      {booking.packageId === "overnight" ? `${booking.date} to ${booking.checkOut}` : booking.date}
                    </span>
                    <span className="text-muted-foreground">
                      {booking.status} · {booking.name} · {booking.reference}
                    </span>
                  </li>
                ))}
              </ul>
            )}
          </article>
        </div>
      ) : null}

      {tab === "schedule" ? (
        <div className="mt-8 max-w-3xl">
          <DeskCalendar bookings={bookings} />
        </div>
      ) : null}

      {tab === "bookings" ? (
        <div className="mt-8">
          <div className="flex flex-wrap gap-2">
            {(["all", "pending", "confirmed", "completed", "cancelled", "rejected"] as const).map((status) => (
              <button key={status} type="button" onClick={() => setFilter(status)} className={`rounded-full px-3 py-1.5 text-xs font-semibold capitalize ${filter === status ? "bg-gold text-charcoal" : "border border-border"}`}>
                {status}
              </button>
            ))}
          </div>
          {visible.length === 0 ? (
            <p className="mt-6 text-sm text-muted-foreground">No bookings in this view.</p>
          ) : (
            <ul className="mt-6 grid gap-4">
              {visible.map((booking) => (
                <li key={booking.reference} className="rounded-3xl border border-border bg-card p-5 shadow-card">
                  <div className="flex flex-wrap items-start justify-between gap-3">
                    <div>
                      <p className="eyebrow text-gold-deep">{booking.status}</p>
                      <h2 className="mt-1 text-2xl font-medium text-charcoal">{booking.reference}</h2>
                    </div>
                    <p className="text-sm text-muted-foreground">{new Date(booking.createdAt).toLocaleString("en-PH", { timeZone: "Asia/Manila" })}</p>
                  </div>
                  <dl className="mt-4 grid gap-2 text-sm sm:grid-cols-2 lg:grid-cols-3">
                    <Item label="Name" value={booking.name} />
                    <Item label="Mobile" value={booking.phone} />
                    <Item label="Email" value={booking.email} />
                    <Item label="Package" value={packageLabel(booking.packageId)} />
                    <Item label="Dates" value={booking.packageId === "overnight" ? `${booking.date} to ${booking.checkOut}` : booking.date} />
                    <Item label="Guests" value={String(booking.guests)} />
                    <Item label="Rate" value={booking.quote ? `${peso(booking.quote.total)} · ${booking.quote.summary}` : "Quoted before published rates"} />
                  </dl>
                  {booking.notes ? <p className="mt-3 text-sm text-muted-foreground">{booking.notes}</p> : null}
                  {booking.updatedBy ? (
                    <p className="mt-3 text-xs text-muted-foreground">
                      Updated by {booking.updatedBy}
                    </p>
                  ) : null}
                  <div className="mt-4 flex flex-wrap gap-2">
                    {bookingActions
                      .filter((action) => action.status !== booking.status)
                      .map((action) => (
                        <button
                          key={action.status}
                          type="button"
                          onClick={async () => {
                            await updateBooking({ data: { reference: booking.reference, status: action.status } });
                            await load();
                          }}
                          className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold text-charcoal hover:border-gold"
                        >
                          {action.label}
                        </button>
                      ))}
                  </div>
                </li>
              ))}
            </ul>
          )}
        </div>
      ) : null}

      {tab === "inquiries" ? (
        <ul className="mt-8 grid gap-4">
          {inquiries.length === 0 ? <li className="text-sm text-muted-foreground">No messages yet.</li> : null}
          {inquiries.map((inquiry) => (
            <li key={inquiry.id} className="rounded-3xl border border-border bg-card p-5 shadow-card">
              <p className="eyebrow text-gold-deep">{inquiry.status}</p>
              <h2 className="mt-1 text-2xl font-medium text-charcoal">{inquiry.name}</h2>
              <p className="mt-2 text-sm text-muted-foreground">
                {inquiry.phone}
                {inquiry.email ? ` · ${inquiry.email}` : ""}
              </p>
              <p className="mt-3 text-sm leading-relaxed">{inquiry.message}</p>
              <div className="mt-4 flex flex-wrap gap-2">
                {inquiryActions
                  .filter((action) => action.status !== inquiry.status)
                  .map((action) => (
                    <button
                      key={action.status}
                      type="button"
                      onClick={async () => {
                        await updateInquiry({ data: { id: inquiry.id, status: action.status } });
                        await load();
                      }}
                      className="rounded-full border border-border px-3 py-1.5 text-xs font-semibold"
                    >
                      {action.label}
                    </button>
                  ))}
              </div>
            </li>
          ))}
        </ul>
      ) : null}

      {tab === "team" && admin.role === "owner" ? (
        <div className="mt-8 grid gap-8 lg:grid-cols-[1fr_1.2fr]">
          <form
            className="grid h-fit gap-3 rounded-3xl border border-border bg-card p-5"
            onSubmit={async (event) => {
              event.preventDefault();
              const formElement = event.currentTarget;
              const form = new FormData(formElement);
              const result = await createAdminAccount({
                data: {
                  name: String(form.get("name") ?? ""),
                  username: String(form.get("username") ?? ""),
                  password: String(form.get("password") ?? ""),
                  role: String(form.get("role") ?? "staff"),
                },
              });
              if (!result.ok) {
                setNotice(result.error);
                return;
              }
              setNotice(`Account ${result.admin.username} is ready.`);
              formElement.reset();
              await load();
            }}
          >
            <h2 className="text-2xl font-medium text-charcoal">Add an account</h2>
            <input name="name" required placeholder="Name" className="h-11 rounded-xl border border-input px-3" />
            <input name="username" required placeholder="Username" className="h-11 rounded-xl border border-input px-3" />
            <input name="password" type="password" required minLength={8} placeholder="Password, 8 or more characters" className="h-11 rounded-xl border border-input px-3" />
            <select name="role" className="h-11 rounded-xl border border-input bg-card px-3 text-sm">
              <option value="staff">Staff</option>
              <option value="owner">Owner</option>
            </select>
            {notice ? <p className="text-sm text-muted-foreground">{notice}</p> : null}
            <button type="submit" className="h-11 rounded-full bg-charcoal text-sm font-semibold text-cream">
              Create account
            </button>
          </form>
          <ul className="grid gap-3">
            {accounts.map((account) => (
              <li key={account.id} className="rounded-3xl border border-border bg-card p-4">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div>
                    <p className="font-medium text-charcoal">{account.name}</p>
                    <p className="text-sm text-muted-foreground">
                      @{account.username} · {account.role} · {account.active ? "active" : "inactive"}
                    </p>
                  </div>
                  {account.id !== admin.id ? (
                    <button
                      type="button"
                      className="text-sm font-semibold text-gold-deep"
                      onClick={async () => {
                        const result = await setAdminActive({ data: { id: account.id, active: !account.active } });
                        setNotice(result.ok ? "" : result.error);
                        await load();
                      }}
                    >
                      {account.active ? "Deactivate" : "Activate"}
                    </button>
                  ) : null}
                </div>
                <form
                  className="mt-3 flex gap-2"
                  onSubmit={async (event) => {
                    event.preventDefault();
                    const formElement = event.currentTarget;
                    const password = String(new FormData(formElement).get("password") ?? "");
                    const result = await setAdminPassword({ data: { id: account.id, password } });
                    setNotice(result.ok ? `Password updated for @${account.username}.` : result.error);
                    if (result.ok) formElement.reset();
                  }}
                >
                  <input name="password" type="password" required minLength={8} placeholder="New password" className="h-10 flex-1 rounded-xl border border-input px-3 text-sm" />
                  <button type="submit" className="rounded-full border border-border px-3 text-xs font-semibold">
                    Save
                  </button>
                </form>
              </li>
            ))}
          </ul>
        </div>
      ) : null}
    </section>
  );
}

function Stat({ label, value }: { label: string; value: string }) {
  return (
    <article className="rounded-3xl border border-border bg-card p-5">
      <p className="text-sm text-muted-foreground">{label}</p>
      <p className="mt-2 text-4xl font-medium text-charcoal">{value}</p>
    </article>
  );
}

function Item({ label, value }: { label: string; value: string }) {
  return (
    <div>
      <dt className="text-muted-foreground">{label}</dt>
      <dd className="font-medium text-charcoal">{value}</dd>
    </div>
  );
}
