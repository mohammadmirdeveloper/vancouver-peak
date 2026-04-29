import { db, checkAdmin } from './_lib.js';
export const config = { api: { bodyParser: { sizeLimit: '8mb' } } };
export default async function handler(req,res){
  try{
    if(req.method !== 'POST') return res.status(405).json({error:'Method not allowed'});
    if(!checkAdmin(req)) return res.status(401).json({error:'Unauthorized'});
    const { filename, contentType, base64 } = req.body || {};
    if(!filename || !contentType || !base64) return res.status(400).json({error:'Missing file data'});
    const supabase = db();
    const buffer = Buffer.from(base64, 'base64');
    const cleanName = filename.replace(/[^a-zA-Z0-9_.-]/g, '-');
    const path = `${Date.now()}-${cleanName}`;
    const { error } = await supabase.storage.from('tour-images').upload(path, buffer, {contentType, upsert:false});
    if(error) throw error;
    const { data } = supabase.storage.from('tour-images').getPublicUrl(path);
    return res.status(200).json({url:data.publicUrl});
  }catch(e){ return res.status(500).json({error:e.message}); }
}
