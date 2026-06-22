#!/usr/bin/env node
/**
 * migrate-formspree-to-ollastack.js
 * Example migration script (dry-run capable) to transfer submissions from Formspree to ollastack.com
 * IMPORTANT: review and test before running. Replace placeholders and secure secrets.
 */

import fs from 'fs';
import fetch from 'node-fetch';
import PQueue from 'p-queue';

const FORMSPREE_KEY = process.env.FORMSPREE_KEY;
const OLLASTACK_API = process.env.OLLASTACK_API || 'https://api.ollastack.com';
const OLLASTACK_KEY = process.env.OLLASTACK_KEY;
const DRY = process.env.DRY === 'true';
const CONCURRENCY = parseInt(process.env.CONCURRENCY || '4');

async function postToOllastack(transformed) {
  if (DRY) { console.log('[DRY] would POST', transformed._meta.original.id); return { ok: true }; }
  const res = await fetch(`${OLLASTACK_API}/submissions`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json', 'Authorization': `Bearer ${OLLASTACK_KEY}` },
    body: JSON.stringify(transformed)
  });
  return res;
}

function normalizeAndTransform(s) {
  // very small example mapping
  const out = {
    endpointSlug: s.form_id || s.form || 'migrated',
    receivedAt: s.submitted_at || s.created_at || new Date().toISOString(),
    payload: s.fields || s.data || s,
    attachments: (s.attachments || []).map(a => ({ url: a.url || a })) ,
    _meta: { original: s }
  };
  return out;
}

async function runFile(path) {
  const raw = JSON.parse(fs.readFileSync(path));
  const queue = new PQueue({ concurrency: CONCURRENCY });
  for (const s of raw) {
    queue.add(async () => {
      const t = normalizeAndTransform(s);
      try {
        const r = await postToOllastack(t);
        if (DRY) return;
        if (!r.ok) {
          console.error('Failed import', s.id, r.status);
        } else {
          console.log('Imported', s.id);
        }
      } catch (err) { console.error('Error importing', s.id, err.message); }
    });
  }
  await queue.onIdle();
}

if (process.argv.length < 3) {
  console.error('Usage: migrate-formspree-to-ollastack.js path/to/export.json');
  process.exit(1);
}

runFile(process.argv[2]).catch(err => { console.error(err); process.exit(2); });
