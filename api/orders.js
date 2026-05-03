import { createClient } from "@supabase/supabase-js";

const supabase = createClient(
  process.env.SUPABASE_URL,
  process.env.SUPABASE_SERVICE_ROLE_KEY
);

export default async function handler(req, res) {
  try {
    if (req.method === "GET") {
      const { data, error } = await supabase
        .from("orders")
        .select("*")
        .order("created_at", { ascending: false });

      if (error) throw error;

     return res.status(200).json({ orders: data || [] });
    }

    if (req.method === "POST") {
      const body = req.body || {};

      if (!body.date || !body.slot || !body.name || !body.phone) {
        return res.status(400).json({
          error: "Missing required fields"
        });
      }

      const ticketId = "VPJ-" + Date.now().toString().slice(-6);

      const orderPayload = {
        ticket_id: ticketId,
        tour_name: body.tour || "",
        customer_name: body.name,
        customer_email: body.email || "",
        customer_phone: body.phone,
        tour_date: body.date,
        time_slot: body.slot,
        pickup_location: body.pickup || "",
        guests: Number(body.guests || 1),
       total:
  body.tour === "sea" ? 125 * Number(body.guests || 1) :
  body.tour === "grouse" ? 100 * Number(body.guests || 1) :
  body.tour === "whistler" ? (125 + (body.addon ? 100 : 0)) * Number(body.guests || 1) :
  0,
        add_on: !!body.addon
      };

      const { data, error } = await supabase
        .from("orders")
        .insert([orderPayload])
        .select()
        .single();

      if (error) throw error;

      return res.status(200).json({
        success: true,
        ticket_id: ticketId,
        order: data
      });
    }

    return res.status(405).json({
      error: "Method not allowed"
    });
  } catch (e) {
    return res.status(500).json({
      error: e.message
    });
  }
}
