import { db } from './_lib.js';
export default async function handler(req,res){
  try{
    const supabase = db();
    const { tour, date } = req.query;
    let query = db().from('orders').select('*');

if (req.query.date) {
  query = query.eq('tour_date', req.query.date);
}

const { data, error } = await query;
    if(error) throw error;
    return res.status(200).json({bookedSlots:(data || []).map(x => x.time_slot)});
  }catch(e){ return res.status(500).json({error:e.message}); }
}
