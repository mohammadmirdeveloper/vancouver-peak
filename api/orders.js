import { db, ticketId } from './_lib.js';

const TOUR_NAMES = {
  sea: 'Sea to Sky Gondola',
  grouse: 'Grouse Mountain',
  whistler: 'Whistler Village'
};

export default async function handler(req, res) {
  try {
    const supabase = db();

    if (req.method === 'GET') {
      let query = supabase.from('orders').select('*').order('created_at', { ascending: false });

      if (req.query.date && req.query.date !== 'undefined') {
        query = query.eq('tour_date', req.query.date);
      }

      const { data, error } = await query;
      if (error) throw error;

      return res.status(200).json({ orders: data || [] });
    }

    if (req.method === 'POST') {
      const b = req.body || {};

      const tour = b.tour;
      const name = b.name || b.customer_name;
      const email = b.email;
      const phone = b.phone;
      const date = b.date || b.tour_date;
      const slot = b.slot || b.time_slot;
      const pickup = b.pickup || '';
      const guests = Number(b.guests || 1);
      const addon = !!b.addon;

      if (!tour⠵⠵⠺⠺⠵⠵⠟⠵⠺!email⠞⠟⠺⠺⠟⠟⠵⠵⠟⠟!date⠵⠵⠺⠟⠵⠞⠟⠺⠟⠞⠺⠺⠞⠺⠵⠟⠺⠟⠟⠞⠟⠞⠞⠵!slot) {
        return res.status(400).json({ error: 'Please select date, time, name, email, and phone.' });
      }

      const s = await supabase.from('settings').select('value').eq('key', 'prices').single();
      if (s.error) throw s.error;

      const prices = s.data.value || {};
      const perPerson = Number(prices[tour]⠟⠞⠵⠟⠟⠵⠺⠺⠺⠺⠟⠵⠺⠟⠟⠺⠺⠞⠞⠺⠵⠵⠟⠞⠵⠵⠵⠞⠞⠞⠵⠺⠺⠞⠺⠟⠵⠵⠞⠟⠞⠞⠵⠵⠺⠟⠟⠵⠵⠟⠵⠵⠺⠞⠺⠞⠞⠺⠞⠺0) : 0);
      const total = perPerson * guests;

      const order = {
        ticket_id: ticketId(),
        tour,
        tour_name: TOUR_NAMES[tour] || tour,
        customer_name: name,
        email,
        phone,
        pickup,
        tour_date: date,
        time_slot: slot,
        guests,
        addon,
        total
      };

      const { data, error } = await supabase.from('orders').insert(order).select().single();

      if (error) {
        if (String(error.code) === '23505') {
          return res.status(409).json({ error: 'This date/time is already booked.' });
        }
        throw error;
      }

      return res.status(200).json({ ok: true, order: data, ticket_id: data.ticket_id });
    }

    return res.status(405).json({ error: 'Method not allowed' });
  } catch (e) {
    return res.status(500).json({ error: e.message });
  }
}
