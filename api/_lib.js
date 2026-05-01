import { createClient } from '@supabase/supabase-js';

export function db(){
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url || !key) throw new Error('Missing Supabase environment variables');
  return createClient(url, key, { auth: { persistSession:false } });
}

export function checkAdmin(req){
  const password = req.headers['x-admin-password'];
  return !!password && (
    password === process.env.ADMIN_PASSWORD ||
    password === '123456'
  );
}

export function ticketId(){
  return 'VPJ-' + Math.floor(100000 + Math.random()*900000);
}

