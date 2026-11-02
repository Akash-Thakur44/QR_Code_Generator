CREATE TABLE IF NOT EXISTS users (
    id TEXT PRIMARY KEY,
    email TEXT NOT NULL UNIQUE,
    password_hash TEXT NOT NULL,
    role TEXT NOT NULL DEFAULT 'user',
    subscription_tier TEXT NOT NULL DEFAULT 'free',
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS sessions (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    expires_at BIGINT NOT NULL
);

CREATE TABLE IF NOT EXISTS organizations (
    id TEXT PRIMARY KEY,
    name TEXT NOT NULL,
    owner_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS qr_folders (
    id TEXT PRIMARY KEY,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    name TEXT NOT NULL,
    created_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS qr_codes (
    id TEXT PRIMARY KEY,
    user_id TEXT NOT NULL REFERENCES users(id) ON DELETE CASCADE,
    organization_id TEXT NOT NULL REFERENCES organizations(id) ON DELETE CASCADE,
    folder_id TEXT REFERENCES qr_folders(id) ON DELETE SET NULL,
    type TEXT NOT NULL,
    category TEXT NOT NULL,
    original_url TEXT,
    qr_config TEXT NOT NULL,
    qr_image_url TEXT,
    status TEXT NOT NULL DEFAULT 'active',
    is_password_protected INTEGER NOT NULL DEFAULT 0,
    password_hash TEXT,
    expires_at TEXT,
    created_at TEXT NOT NULL,
    updated_at TEXT NOT NULL
);

CREATE TABLE IF NOT EXISTS scan_analytics (
    id TEXT PRIMARY KEY,
    qr_code_id TEXT NOT NULL REFERENCES qr_codes(id) ON DELETE CASCADE,
    scanned_at TEXT NOT NULL,
    ip_hash TEXT NOT NULL,
    user_agent TEXT,
    referrer TEXT,
    country TEXT DEFAULT 'Unknown',
    city TEXT DEFAULT 'Unknown',
    device TEXT DEFAULT 'desktop',
    browser TEXT DEFAULT 'Unknown',
    os TEXT DEFAULT 'Unknown',
    utm_source TEXT,
    utm_medium TEXT,
    utm_campaign TEXT
);

CREATE INDEX IF NOT EXISTS sessions_user_id_idx ON sessions(user_id);
CREATE INDEX IF NOT EXISTS organizations_owner_id_idx ON organizations(owner_id);
CREATE INDEX IF NOT EXISTS qr_folders_organization_id_idx ON qr_folders(organization_id);
CREATE INDEX IF NOT EXISTS qr_codes_user_id_created_at_idx ON qr_codes(user_id, created_at DESC);
CREATE INDEX IF NOT EXISTS qr_codes_organization_id_idx ON qr_codes(organization_id);
CREATE INDEX IF NOT EXISTS scan_analytics_qr_code_id_scanned_at_idx ON scan_analytics(qr_code_id, scanned_at);
CREATE INDEX IF NOT EXISTS scan_analytics_qr_code_id_ip_hash_idx ON scan_analytics(qr_code_id, ip_hash);

ALTER TABLE users ENABLE ROW LEVEL SECURITY;
ALTER TABLE sessions ENABLE ROW LEVEL SECURITY;
ALTER TABLE organizations ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_folders ENABLE ROW LEVEL SECURITY;
ALTER TABLE qr_codes ENABLE ROW LEVEL SECURITY;
ALTER TABLE scan_analytics ENABLE ROW LEVEL SECURITY;
