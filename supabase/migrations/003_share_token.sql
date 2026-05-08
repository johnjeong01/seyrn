-- Add share_token column to reports table for short, privacy-safe share links
ALTER TABLE reports ADD COLUMN IF NOT EXISTS share_token TEXT UNIQUE;
