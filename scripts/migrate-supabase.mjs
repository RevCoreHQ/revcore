/**
 * RevCore Supabase Migration Script
 * Copies all tracker data from the old Supabase project to the new one.
 *
 * Run once with:
 *   node scripts/migrate-supabase.mjs
 *
 * Prerequisites:
 *   1. Run sql/rc_tracker_schema.sql in the NEW Supabase dashboard first
 *   2. Make sure @supabase/supabase-js is installed (it already is)
 */

import { createClient } from '@supabase/supabase-js';

// ── Old project (source) ──────────────────────────────────────────────────────
const OLD_URL = 'https://hmbtlaxnpltmgvqtczej.supabase.co';
const OLD_KEY = 'eyJhbGciOiJIUzI1NiIsInR5cCI6IkpXVCJ9.eyJpc3MiOiJzdXBhYmFzZSIsInJlZiI6ImhtYnRsYXhucGx0bWd2cXRjemVqIiwicm9sZSI6ImFub24iLCJpYXQiOjE3NzI4MDY1MzUsImV4cCI6MjA4ODM4MjUzNX0.KU5cuxk3MpovhMXxUUSbcWiTeLVu3x6YI1Fi8U1_RGM';

// ── New project (destination) ─────────────────────────────────────────────────
const NEW_URL = 'https://eavoplxcuxalbxbsaqbx.supabase.co';
const NEW_KEY = 'sb_publishable_VejqpBek5xn_ozY6wuaAaQ_CFkPAyvE';

async function migrate() {
  const oldDb = createClient(OLD_URL, OLD_KEY);
  const newDb = createClient(NEW_URL, NEW_KEY);

  console.log('Connecting to old Supabase and fetching data...');
  const { data, error } = await oldDb.from('rc_tracker_data').select('*');

  if (error) {
    console.error('ERROR reading from old database:', error.message);
    console.error('Hint: Make sure the old project is still active and the table exists.');
    process.exit(1);
  }

  if (!data || data.length === 0) {
    console.log('No rows found in old database. Nothing to migrate.');
    process.exit(0);
  }

  console.log(`Found ${data.length} row(s) to migrate.\n`);

  for (const row of data) {
    process.stdout.write(`  Migrating "${row.key}"... `);
    const { error: insertError } = await newDb
      .from('rc_tracker_data')
      .upsert(row, { onConflict: 'key' });

    if (insertError) {
      console.error(`FAILED`);
      console.error('  Error:', insertError.message);
      console.error('\nHint: Make sure you ran sql/rc_tracker_schema.sql in the new project first.');
      process.exit(1);
    }
    console.log('done');
  }

  console.log('\nMigration complete! All data is now in the new Supabase project.');
  console.log('The tracker will now use the new database automatically.');
}

migrate().catch((err) => {
  console.error('Unexpected error:', err);
  process.exit(1);
});
