import { randomBytes, scryptSync, timingSafeEqual } from "node:crypto";
import { readFileSync } from "node:fs";
import { mkdir, readFile, writeFile } from "node:fs/promises";
import path from "node:path";

import type { AdminRole, Inquiry, InquiryStatus, PublicAdmin } from "@/lib/booking-types";

type AdminAccount = PublicAdmin & { passwordHash: string };

type Session = {
  id: string;
  adminId: string;
  expiresAt: string;
};

const dataDir = path.join(process.cwd(), "data");
const adminFile = path.join(dataDir, "admins.json");
const sessionFile = path.join(dataDir, "sessions.json");
const inquiryFile = path.join(dataDir, "inquiries.json");

let chain: Promise<unknown> = Promise.resolve();

function withFile<T>(work: () => Promise<T>): Promise<T> {
  const run = chain.then(work, work);
  chain = run.then(
    () => undefined,
    () => undefined,
  );
  return run;
}

function readDotEnv(name: string) {
  if (process.env[name]) return process.env[name] ?? "";
  try {
    const text = readFileSync(path.join(process.cwd(), ".env"), "utf8");
    const line = text.split(/\r?\n/).find((entry) => entry.startsWith(`${name}=`));
    if (!line) return "";
    return line.slice(name.length + 1).trim().replace(/^"|"$/g, "");
  } catch {
    return "";
  }
}

function hashPassword(password: string) {
  const salt = randomBytes(16).toString("hex");
  const hash = scryptSync(password, salt, 32).toString("hex");
  return `${salt}:${hash}`;
}

function passwordMatches(password: string, stored: string) {
  const [salt, hash] = stored.split(":");
  if (!salt || !hash) return false;
  const next = scryptSync(password, salt, 32);
  const previous = Buffer.from(hash, "hex");
  if (next.length !== previous.length) return false;
  return timingSafeEqual(next, previous);
}

function publicAdmin(account: AdminAccount): PublicAdmin {
  return {
    id: account.id,
    name: account.name,
    username: account.username,
    role: account.role,
    active: account.active,
    createdAt: account.createdAt,
  };
}

async function readJson<T>(file: string, fallback: T): Promise<T> {
  try {
    const parsed: unknown = JSON.parse(await readFile(file, "utf8"));
    return parsed as T;
  } catch {
    return fallback;
  }
}

async function writeJson(file: string, value: unknown) {
  await mkdir(dataDir, { recursive: true });
  await writeFile(file, JSON.stringify(value, null, 2), "utf8");
}

async function readAdmins() {
  const accounts = await readJson<AdminAccount[]>(adminFile, []);
  return Array.isArray(accounts) ? accounts : [];
}

async function ensureOwner() {
  return withFile(async () => {
    const accounts = await readAdmins();
    if (accounts.length > 0) return accounts;
    const password = readDotEnv("ADMIN_PASSWORD") || "CasaTres2026";
    const username = (readDotEnv("ADMIN_USERNAME") || "owner").trim().toLowerCase();
    const owner: AdminAccount = {
      id: randomBytes(8).toString("hex"),
      name: "Owner",
      username,
      passwordHash: hashPassword(password),
      role: "owner",
      active: true,
      createdAt: new Date().toISOString(),
    };
    await writeJson(adminFile, [owner]);
    return [owner];
  });
}

export async function loginAdmin(username: string, password: string) {
  return withFile(async () => {
    const accounts = await ensureOwnerUnlocked();
    const account = accounts.find((item) => item.username === username.trim().toLowerCase() && item.active);
    if (!account || !passwordMatches(password, account.passwordHash)) return null;
    const sessions = await readJson<Session[]>(sessionFile, []);
    const session: Session = {
      id: randomBytes(24).toString("hex"),
      adminId: account.id,
      expiresAt: new Date(Date.now() + 7 * 24 * 60 * 60 * 1000).toISOString(),
    };
    sessions.push(session);
    await writeJson(sessionFile, sessions);
    return { sessionId: session.id, admin: publicAdmin(account) };
  });
}

async function ensureOwnerUnlocked() {
  const accounts = await readAdmins();
  if (accounts.length > 0) return accounts;
  const password = readDotEnv("ADMIN_PASSWORD") || "CasaTres2026";
  const username = (readDotEnv("ADMIN_USERNAME") || "owner").trim().toLowerCase();
  const owner: AdminAccount = {
    id: randomBytes(8).toString("hex"),
    name: "Owner",
    username,
    passwordHash: hashPassword(password),
    role: "owner",
    active: true,
    createdAt: new Date().toISOString(),
  };
  await writeJson(adminFile, [owner]);
  return [owner];
}

export async function adminFromSession(sessionId: string | undefined) {
  if (!sessionId) return null;
  await ensureOwner();
  const sessions = await readJson<Session[]>(sessionFile, []);
  const session = sessions.find((item) => item.id === sessionId);
  if (!session || session.expiresAt < new Date().toISOString()) return null;
  const account = (await readAdmins()).find((item) => item.id === session.adminId && item.active);
  return account ? publicAdmin(account) : null;
}

export async function logoutAdmin(sessionId: string | undefined) {
  if (!sessionId) return;
  await withFile(async () => {
    const sessions = await readJson<Session[]>(sessionFile, []);
    await writeJson(
      sessionFile,
      sessions.filter((item) => item.id !== sessionId),
    );
  });
}

export async function listAdmins() {
  await ensureOwner();
  return (await readAdmins()).map(publicAdmin);
}

export async function createAdminAccount(input: {
  name: string;
  username: string;
  password: string;
  role: AdminRole;
}) {
  const name = input.name.trim();
  const username = input.username.trim().toLowerCase();
  if (name.length < 2) return { ok: false as const, error: "Enter the person's name." };
  if (!/^[a-z0-9._-]{3,32}$/.test(username)) {
    return { ok: false as const, error: "Username must be 3–32 letters, numbers, dots, or dashes." };
  }
  if (input.password.length < 8) return { ok: false as const, error: "Password must be at least 8 characters." };
  return withFile(async () => {
    const accounts = await ensureOwnerUnlocked();
    if (accounts.some((item) => item.username === username)) {
      return { ok: false as const, error: "That username is already in use." };
    }
    const account: AdminAccount = {
      id: randomBytes(8).toString("hex"),
      name,
      username,
      passwordHash: hashPassword(input.password),
      role: input.role === "owner" ? "owner" : "staff",
      active: true,
      createdAt: new Date().toISOString(),
    };
    accounts.push(account);
    await writeJson(adminFile, accounts);
    return { ok: true as const, admin: publicAdmin(account) };
  });
}

export async function setAdminActive(id: string, active: boolean, actorId: string) {
  return withFile(async () => {
    const accounts = await readAdmins();
    const account = accounts.find((item) => item.id === id);
    if (!account) return { ok: false as const, error: "Account not found." };
    if (account.id === actorId && !active) {
      return { ok: false as const, error: "You cannot deactivate your own account." };
    }
    const owners = accounts.filter((item) => item.role === "owner" && item.active && item.id !== account.id);
    if (account.role === "owner" && account.active && !active && owners.length === 0) {
      return { ok: false as const, error: "Keep at least one active owner." };
    }
    account.active = active;
    await writeJson(adminFile, accounts);
    return { ok: true as const };
  });
}

export async function setAdminPassword(id: string, password: string) {
  if (password.length < 8) return { ok: false as const, error: "Password must be at least 8 characters." };
  return withFile(async () => {
    const accounts = await readAdmins();
    const account = accounts.find((item) => item.id === id);
    if (!account) return { ok: false as const, error: "Account not found." };
    account.passwordHash = hashPassword(password);
    await writeJson(adminFile, accounts);
    return { ok: true as const };
  });
}

export async function createInquiry(input: { name: string; phone: string; email: string; message: string }) {
  const name = input.name.trim();
  const phone = input.phone.trim();
  const message = input.message.trim();
  const email = input.email.trim();
  if (name.length < 2) return { ok: false as const, error: "Enter your name." };
  if (phone.replace(/\D/g, "").length < 10) return { ok: false as const, error: "Enter a mobile number." };
  if (message.length < 2) return { ok: false as const, error: "Enter a message." };
  const inquiry: Inquiry = {
    id: `INQ-${randomBytes(3).toString("hex").toUpperCase()}`,
    name,
    phone,
    email,
    message,
    status: "new",
    createdAt: new Date().toISOString(),
  };
  await withFile(async () => {
    const inquiries = await readJson<Inquiry[]>(inquiryFile, []);
    inquiries.push(inquiry);
    await writeJson(inquiryFile, inquiries);
  });
  return { ok: true as const, inquiry };
}

export async function listInquiries() {
  const inquiries = await readJson<Inquiry[]>(inquiryFile, []);
  return inquiries.sort((a, b) => (a.createdAt < b.createdAt ? 1 : -1));
}

export async function setInquiryStatus(id: string, status: InquiryStatus) {
  return withFile(async () => {
    const inquiries = await readJson<Inquiry[]>(inquiryFile, []);
    const inquiry = inquiries.find((item) => item.id === id);
    if (!inquiry) return false;
    inquiry.status = status;
    await writeJson(inquiryFile, inquiries);
    return true;
  });
}
