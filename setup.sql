-- Run this in your Supabase SQL Editor (https://supabase.com/dashboard/project/sibgxeubxvgmdwnnyuvo/sql/new)

-- 1. Create players table
CREATE TABLE IF NOT EXISTS players (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  name TEXT NOT NULL,
  uuid TEXT NOT NULL DEFAULT '',
  region TEXT NOT NULL DEFAULT 'NA',
  avatar TEXT NOT NULL DEFAULT '',
  desc TEXT,
  overall INTEGER DEFAULT 0,
  points INTEGER DEFAULT 0,
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 2. Create player_tiers table
CREATE TABLE IF NOT EXISTS player_tiers (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  player_id UUID NOT NULL REFERENCES players(id) ON DELETE CASCADE,
  gamemode TEXT NOT NULL,
  tier TEXT NOT NULL,
  created_at TIMESTAMPTZ DEFAULT now(),
  UNIQUE(player_id, gamemode)
);

-- 3. Create staff_accounts table
CREATE TABLE IF NOT EXISTS staff_accounts (
  id UUID DEFAULT gen_random_uuid() PRIMARY KEY,
  username TEXT NOT NULL UNIQUE,
  password_hash TEXT NOT NULL,
  role TEXT NOT NULL DEFAULT 'staff' CHECK (role IN ('owner', 'staff')),
  created_at TIMESTAMPTZ DEFAULT now()
);

-- 4. Enable Row Level Security
ALTER TABLE players ENABLE ROW LEVEL SECURITY;
ALTER TABLE player_tiers ENABLE ROW LEVEL SECURITY;
ALTER TABLE staff_accounts ENABLE ROW LEVEL SECURITY;

-- 5. RLS: Anyone can read players and tiers
CREATE POLICY "Public read players" ON players
  FOR SELECT USING (true);

CREATE POLICY "Public read player_tiers" ON player_tiers
  FOR SELECT USING (true);

-- 6. RLS: Only service_role can write (handled by our API routes)
-- With the anon key, writes will be blocked by RLS
-- Our API uses service_role key (if configured) to bypass RLS

-- 7. Create indexes for performance
CREATE INDEX IF NOT EXISTS idx_player_tiers_player_id ON player_tiers(player_id);
CREATE INDEX IF NOT EXISTS idx_player_tiers_gamemode ON player_tiers(gamemode);
CREATE INDEX IF NOT EXISTS idx_players_name ON players(name);

-- 8. Insert default admin staff (optional)
-- To create staff accounts, use the admin panel after setup
