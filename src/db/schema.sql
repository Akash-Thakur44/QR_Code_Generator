-- Drop tables if they exist to allow clean migrations
DROP TABLE IF EXISTS scan_analytics;
DROP TABLE IF EXISTS qr_codes;
DROP TABLE IF EXISTS qr_folders;
DROP TABLE IF EXISTS organizations;
DROP TABLE IF EXISTS sessions;
DROP TABLE IF EXISTS users;

-- Users Table
CREATE TABLE users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    subscription_tier TEXT NOT NULL DEFAULT 'free',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

-- Sessions Table (For secure HTTP-Only cookie authentication)
CREATE TABLE sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    expires_at INTEGER NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE
);

-- Organizations (For workspaces)
CREATE TABLE organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id TEXT NOT NULL,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(owner_id) REFERENCES users(id) ON DELETE CASCADE
);

-- QR Folders
CREATE TABLE qr_folders (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL,
    FOREIGN KEY(organization_id) REFERENCES organizations(id) ON DELETE CASCADE
);

-- QR Codes Table
CREATE TABLE qr_codes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL,
    organization_id TEXT NOT NULL,
    folder_id TEXT,
    type TEXT NOT NULL, -- 'static' | 'dynamic'
    category TEXT NOT NULL, -- 'url', 'wifi', 'vcard', 'whatsapp', 'sms', etc.
    short_code TEXT UNIQUE,
    original_url TEXT,
    qr_config TEXT NOT NULL, -- JSON String (colors, eye/body styles, frame settings, logo url)
    qr_image_url TEXT,
    status TEXT NOT NULL DEFAULT 'active', -- 'active' | 'archived'
    is_password_protected INTEGER NOT NULL DEFAULT 0, -- 0 = false, 1 = true
    password_hash TEXT,
    expires_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL,
    FOREIGN KEY(user_id) REFERENCES users(id) ON DELETE CASCADE,
    FOREIGN KEY(organization_id) REFERENCES organizations(id) ON DELETE CASCADE,
    FOREIGN KEY(folder_id) REFERENCES qr_folders(id) ON DELETE SET NULL
);

-- Scan Analytics Table
CREATE TABLE scan_analytics (
    id TEXT PRIMARY KEY,
    qr_code_id TEXT NOT NULL,
    scanned_at TEXT NOT NULL,
    ip_hash TEXT NOT NULL,
    user_agent TEXT,
    referrer TEXT,
    country TEXT DEFAULT 'Unknown',
    city TEXT DEFAULT 'Unknown',
    device TEXT DEFAULT 'desktop', -- 'desktop', 'mobile', 'tablet'
    browser TEXT DEFAULT 'Unknown',
    os TEXT DEFAULT 'Unknown',
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT,
    FOREIGN KEY(qr_code_id) REFERENCES qr_codes(id) ON DELETE CASCADE
);
