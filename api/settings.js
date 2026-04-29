import { db, checkAdmin } from './_lib.js';
export default async function handler(req,res){
  try{
    const supabase = db();
    if(req.method === 'GET'){
      const { data, error } = await supabase.from('settings').select('key,value');
      if(error) throw error;
      const out = {};
      for(const row of data || []) out[row.key] = row.value;
      return res.status(200).json(out);
    }
    if(req.method === 'POST'){
      if(!checkAdmin(req)) return res.status(401).json({error:'Unauthorized'});
      const { prices, images } = req.body || {};
      const rows = [];
      if(prices) rows.push({key:'prices', value:prices});
      if(images) rows.push({key:'images', value:images});
      if(rows.length){
        const { error } = await supabase.from('settings').upsert(rows);
        if(error) throw error;
      }
      return res.status(200).json({ok:true});
    }
    return res.status(405).json({error:'Method not allowed'});
  }catch(e){ return res.status(500).json({error:e.message}); }
}
