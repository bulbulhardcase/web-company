import { useState, type FormEvent } from "react";
import { useI18n } from "./i18n/I18nProvider";

const inputClass =
  "w-full rounded border border-white/15 bg-[#111] px-4 py-3 text-white outline-none transition focus:border-[#f84300] focus:ring-1 focus:ring-[#f84300]";

export function QuoteForm() {
  const { locale } = useI18n();
  const id = locale === "id";
  const [busy, setBusy] = useState(false);
  const [message, setMessage] = useState("");
  const [success, setSuccess] = useState(false);

  async function handleSubmit(event: FormEvent<HTMLFormElement>) {
    event.preventDefault();
    if (busy) return;
    setBusy(true);
    setMessage("");
    setSuccess(false);

    const form = event.currentTarget;
    const data = new FormData(form);
    const quantity = Number(data.get("quantity"));

    const payload = {
      customer_name: String(data.get("customer_name") ?? ""),
      customer_email: String(data.get("customer_email") ?? ""),
      customer_phone: String(data.get("customer_phone") ?? ""),
      equipment_type: String(data.get("equipment_type") ?? ""),
      dimensions: String(data.get("dimensions") ?? ""),
      quantity,
      foam_requirements: String(data.get("foam_requirements") ?? ""),
      additional_features: String(data.get("additional_features") ?? ""),
      delivery_destination: String(data.get("delivery_destination") ?? ""),
      delivery_address: String(data.get("delivery_address") ?? ""),
      notes: String(data.get("notes") ?? ""),
    };

    try {
      const response = await fetch("/api/quote", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify(payload),
      });
      const result = await response.json();

      if (!response.ok || !result.ok) {
        throw new Error(result.error || (id ? "Permintaan gagal dikirim." : "Could not submit request."));
      }

      setSuccess(true);
      setMessage(
        id
          ? `Permintaan berhasil dikirim. Nomor permintaan: #${result.id}`
          : `Request submitted successfully. Reference: #${result.id}`,
      );
      form.reset();
    } catch (error) {
      setMessage(
        error instanceof Error
          ? error.message
          : id
            ? "Terjadi kesalahan. Silakan coba lagi."
            : "Something went wrong. Please try again.",
      );
    } finally {
      setBusy(false);
    }
  }

  const label = (en: string, indo: string) => (id ? indo : en);

  return (
    <section id="quote" className="scroll-mt-28 border-t border-white/10 bg-[#0d0d0d] py-20 md:py-28">
      <div className="mx-auto w-full max-w-5xl px-4 sm:px-6 md:px-12">
        <div className="mb-10 max-w-2xl">
          <p className="mb-3 text-sm font-semibold uppercase tracking-[0.2em] text-[#f84300]">
            {label("Custom case inquiry", "Permintaan custom case")}
          </p>
          <h2 className="font-display text-3xl font-bold md:text-5xl">
            {label("Request a Quote", "Minta Penawaran Harga")}
          </h2>
          <p className="mt-4 text-white/70">
            {label(
              "Share your equipment and delivery details. Our team can review the request and follow up using your contact information.",
              "Isi detail peralatan dan pengiriman. Tim kami dapat meninjau permintaan dan menghubungi kamu melalui informasi kontak yang diberikan.",
            )}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="grid gap-5 rounded-md border border-white/10 bg-[#131313] p-5 sm:grid-cols-2 sm:p-8">
          <Field label={label("Full name *", "Nama lengkap *")}>
            <input className={inputClass} name="customer_name" autoComplete="name" required maxLength={120} />
          </Field>
          <Field label={label("Email address *", "Alamat email *")}>
            <input className={inputClass} name="customer_email" type="email" autoComplete="email" required maxLength={254} />
          </Field>
          <Field label={label("Phone / WhatsApp", "Telepon / WhatsApp")}>
            <input className={inputClass} name="customer_phone" type="tel" autoComplete="tel" maxLength={40} />
          </Field>
          <Field label={label("Equipment / case type *", "Jenis peralatan / case *")}>
            <input className={inputClass} name="equipment_type" required maxLength={200} placeholder={label("e.g. camera, audio rack", "mis. kamera, rack audio")} />
          </Field>
          <Field label={label("Dimensions (L × W × H) *", "Dimensi (P × L × T) *")}>
            <input className={inputClass} name="dimensions" required maxLength={200} placeholder={label("e.g. 60 × 56 × 68.5 cm", "mis. 60 × 56 × 68,5 cm")} />
          </Field>
          <Field label={label("Quantity *", "Jumlah *")}>
            <input className={inputClass} name="quantity" type="number" min="1" max="100000" step="1" defaultValue="1" required />
          </Field>
          <Field label={label("Foam / interior requirements", "Kebutuhan foam / interior")}>
            <textarea className={inputClass} name="foam_requirements" rows={3} maxLength={2000} />
          </Field>
          <Field label={label("Additional features", "Fitur tambahan")}>
            <textarea className={inputClass} name="additional_features" rows={3} maxLength={2000} />
          </Field>
          <Field label={label("Delivery destination *", "Tujuan pengiriman *")}>
            <input className={inputClass} name="delivery_destination" required maxLength={200} placeholder={label("City and country", "Kota dan negara")} />
          </Field>
          <Field label={label("Full delivery address (optional)", "Alamat lengkap (opsional)")}>
            <input className={inputClass} name="delivery_address" autoComplete="street-address" maxLength={1000} />
          </Field>
          <div className="sm:col-span-2">
            <Field label={label("Additional notes", "Catatan tambahan")}>
              <textarea className={inputClass} name="notes" rows={4} maxLength={3000} />
            </Field>
          </div>

          {message ? (
            <p role="status" aria-live="polite" className={`sm:col-span-2 rounded border p-4 text-sm ${success ? "border-green-500/40 bg-green-500/10 text-green-200" : "border-red-500/40 bg-red-500/10 text-red-200"}`}>
              {message}
            </p>
          ) : null}

          <div className="sm:col-span-2">
            <button
              type="submit"
              disabled={busy}
              className="inline-flex min-h-12 items-center justify-center rounded px-7 py-3 font-semibold text-white transition hover:-translate-y-0.5 disabled:cursor-not-allowed disabled:opacity-60"
              style={{ backgroundColor: "#f84300" }}
            >
              {busy
                ? label("Submitting…", "Mengirim…")
                : label("Submit quote request", "Kirim permintaan penawaran")}
            </button>
            <p className="mt-3 text-xs text-white/50">
              {label("Fields marked * are required.", "Kolom bertanda * wajib diisi.")}
            </p>
          </div>
        </form>
      </div>
    </section>
  );
}

function Field({ label, children }: { label: string; children: React.ReactNode }) {
  return (
    <label className="flex min-w-0 flex-col gap-2 text-sm text-white/80">
      <span>{label}</span>
      {children}
    </label>
  );
}
