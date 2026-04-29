import { db } from './_lib.js';
export default async function handler(req,res){
  try{
    const supabase = db();
    const { tour, date } = req.query;
    const { data, error } = await supabase.from('orders').select('time_slot').eq('tour', tour).eq('tour_date', date);
    if(error) throw error;
    return res.status(200).json({bookedSlots:(data || []).map(x => x.time_slot)});
  }catch(e){ return res.status(500).json({error:e.message}); }
}
