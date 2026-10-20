const SUPABASE_URL = (process.env.SUPABASE_URL ?? "").replace(/\/+$/, "");
const SUPABASE_SECRET_KEY = process.env.SUPABASE_SECRET_KEY ?? "";

type QuoteBody = {
  customer_name?: unknown;
  customer_email?: unknown;
  customer_phone?: unknown;
  equipment_type?: unknown;
  dimensions?: unknown;
  quantity?: unknown;
  foam_requirements?: unknown;
  additional_features?: unknown;
  delivery_destination?: unknown;
  delivery_address?: unknown;
  notes?: unknown;
};

function cleanText(value: unknown, maxLength: number): string {
  if (typeof value !== "string") return "";
  return value.trim().slice(0, maxLength);
}

export default async function handler(req: any, res: any) {
  if (req.method !== "POST") {
    res.setHeader("Allow", "POST");
    return res.status(405).json({ error: "Method not allowed" });
  }

  if (!SUPABASE_URL || !SUPABASE_SECRET_KEY) {
    console.error("[quote] Supabase environment variables are missing");
    return res.status(503).json({ error: "Quote service is not configured" });
  }

  const body = (req.body ?? {}) as QuoteBody;

  const customer_name = cleanText(body.customer_name, 120);
  const customer_email = cleanText(body.customer_email, 254).toLowerCase();
  const customer_phone = cleanText(body.customer_phone, 40);
  const equipment_type = cleanText(body.equipment_type, 200);
  const dimensions = cleanText(body.dimensions, 200);
  const quantity =
    typeof body.quantity === "number"
      ? body.quantity
      : typeof body.quantity === "string" && body.quantity.trim()
        ? Number(body.quantity)
        : NaN;
  const foam_requirements = cleanText(body.foam_requirements, 2000);
  const additional_features = cleanText(body.additional_features, 2000);
  const delivery_destination = cleanText(body.delivery_destination, 200);
  const delivery_address = cleanText(body.delivery_address, 1000);
  const notes = cleanText(body.notes, 3000);

  const emailPattern = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
  if (
    !customer_name ||
    !emailPattern.test(customer_email) ||
    !equipment_type ||
    !dimensions ||
    !Number.isSafeInteger(quantity) ||
    quantity < 1 ||
    quantity > 100000 ||
    !delivery_destination
  ) {
    return res.status(400).json({
      error:
        "Please provide a name, valid email, equipment type, dimensions, positive whole-number quantity, and delivery destination.",
    });
  }

  const quote = {
    customer_name,
    customer_email,
    customer_phone: customer_phone || null,
    equipment_type,
    dimensions,
    quantity,
    foam_requirements: foam_requirements || null,
    additional_features: additional_features || null,
    delivery_destination,
    delivery_address: delivery_address || null,
    notes: notes || null,
  };

  try {
    const response = await fetch(`${SUPABASE_URL}/rest/v1/quote_requests`, {
      method: "POST",
      headers: {
        apikey: SUPABASE_SECRET_KEY,
        Authorization: `Bearer ${SUPABASE_SECRET_KEY}`,
        "Content-Type": "application/json",
        Prefer: "return=representation",
      },
      body: JSON.stringify(quote),
    });

    if (!response.ok) {
      const details = await response.text();
      console.error("[quote] Supabase insert failed:", response.status, details);
      return res.status(502).json({ error: "Could not save quote request. Please try again." });
    }

    const rows = (await response.json()) as Array<{ id: number; created_at: string }>;
    const saved = rows[0];

    if (!saved) {
      console.error("[quote] Supabase returned no inserted row");
      return res.status(502).json({ error: "Could not confirm quote request was saved." });
    }

    return res.status(201).json({
      ok: true,
      message: "Quote request saved successfully.",
      id: saved.id,
      created_at: saved.created_at,
    });
  } catch (error) {
    console.error("[quote] Request failed:", error);
    return res.status(500).json({ error: "Unexpected error saving quote request." });
  }
}
