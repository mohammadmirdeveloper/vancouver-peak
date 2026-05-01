import { createClient } from '@supabase/supabase-js';

export function db(){
  const url = process.env.SUPABASE_URL;
  const key = process.env.SUPABASE_SERVICE_ROLE_KEY;
  if(!url || !key) throw new Error('Missing Supabase environment variables');
  return createClient(url, key, { auth: { persistSession:false } });
}

export function checkAdmin(req){
  return true;
}

export function ticketId(){
  return 'VPJ-' + Math.floor(100000 + Math.random()*900000);
}
