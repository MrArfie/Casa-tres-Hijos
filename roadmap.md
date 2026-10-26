# Roadmap — Casa Tres Hijos

Build sequence from the client brief. Keep this list current; nothing runs after the turn ends, so finish what can be finished.

## Tasks
- [x] Resort photos and logo stored in public/resort
- [ ] Design system (styles.css tokens, fonts, shared site layout with nav/footer + Messenger CTA)
- [ ] Public pages: Home, About, Packages & Rates, Amenities, Gallery (filters + lightbox), House Rules & FAQs, Contact & Location, Book Now, Check Booking Status
- [ ] DB migration: tables (resort_settings, packages, package_rates, holiday_dates, bookings, payments, blocked_dates, amenities, gallery_photos, house_rules, faqs, contact_inquiries, audit_logs, user_roles), GRANTs, RLS, seed rows incl. photos
- [ ] Storage: private payment-receipts bucket (+ admin-only read policies), gallery/QR handling
- [ ] Booking system: availability server fn, price computation, create-booking transaction (overlap check, 24h pending hold), reference generation, receipt upload, status lookup with rate limiting
- [ ] Scheduled job: release expired pending bookings
- [ ] Admin dashboard: email auth login, overview stats, calendar/list reservations, approve/reject/cancel/complete, receipts via signed URLs, manual bookings, blocked dates, content management (settings, packages, rates, holidays, amenities, rules, FAQs, gallery, homepage, payment details + QRs), CSV export
- [ ] Email notifications (guest + owner on submit/approve/reject/cancel) — blocked until a verified sender domain exists
- [ ] SEO: page titles/meta, OG + hero image, structured data, sitemap, lazy images
- [ ] Mobile + end-to-end testing (booking flow as guest, admin approval flow)

## Open items needing the user
- Sender email domain for notifications — until then, email notifications stay off.
- Admin account: the owner still needs an admin login once database auth is connected.
- Real rates, payment account numbers, QR codes, house rules text, FAQs — all admin-editable once dashboard ships.
