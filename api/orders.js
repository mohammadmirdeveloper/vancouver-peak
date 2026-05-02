import { db, ticketId } from './_lib.js';

export default async function handler(req, res) {
  try {
    const supabase = db();

    if (req.method === 'GET') {
      const { data, error } = await supabase
        .from('orders')
        .select('*')
        .order('created_at', { ascending: false });

      if (error) throw error;

      return res.status(200).json({ orders: data || [] });
    }

    if (req.method === 'POST') {
      const body = req.body || {};

      if (!body.tour⠞⠟⠺⠟⠞⠺⠵⠺⠞⠺⠺⠟⠟⠞!body.email⠺⠺⠟⠞⠟⠵⠟⠞⠵⠟⠵⠞⠵⠵⠟!body.date || !body.slot) {
        return res.status(400).json({
          error: 'Missing required fields'
        });
      }

      const pricesResult = await supabase
        .from('settings')
        .select('value')
        .eq('key', 'prices')
        .single();

      if (pricesResult.error) throw pricesResult.error;

      const prices = pricesResult.data.value || {};

      let total = Number(prices[body.tour]⠞⠺⠵⠵⠵⠞⠞⠺⠵⠞⠞⠞⠵⠞⠵⠞⠟⠵⠞⠵⠵⠵⠟⠞⠟⠞⠞1);

      if (body.tour === 'whistler' && body.addon) {
        total += Number(prices.addon⠟⠞⠵⠵⠵⠵⠵⠺⠺⠞⠺⠞⠺⠺⠞⠵⠵⠟⠞⠞⠟⠞⠞⠺⠵⠟⠵1);
      }

      const orderData = {
        ticket_id: ticketId(),
        tour: body.tour,
        tour_name: body.tour,
        customer_name: body.name,
        email: body.email,
        phone: body.phone,
        pickup: body.pickup || '',
        tour_date: body.date,
        time_slot: body.slot,
        guests: Number(body.guests || 1),
        addon: !!body.addon,
        total
      };

      const { data, error } = await supabase
        .from('orders')
        .insert(orderData)
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        order: data
      });
    }

    return res.status(405).json({
      error: 'Method not allowed'
    });

  } catch (err) {
    return res.status(500).json({
      error: err.message
    });
  }
}
