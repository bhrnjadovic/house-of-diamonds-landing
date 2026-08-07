// api/ascend-lead.js — Vercel serverless function
// Receives lead submissions from Ascend Lending landing pages and forwards
// them to a Zapier "Catch Hook" webhook, which pushes the lead into HubSpot.
//
// Setup required before this goes live:
//   1. In Zapier, create a Zap: Trigger = "Webhooks by Zapier" → Catch Hook.
//   2. Action = HubSpot → Create/Update Contact (map the fields below).
//   3. Copy the Catch Hook URL Zapier gives you.
//   4. Set it as an environment variable in Vercel: ZAPIER_WEBHOOK_URL
//
// Until ZAPIER_WEBHOOK_URL is set, this endpoint still accepts submissions
// and logs them (so the form never breaks on the front end) but does not
// forward anywhere — check Vercel function logs in the meantime.

export default async function handler(req, res) {
    // CORS — allow requests from the landing page
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.status(200).end();

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    const {
        first_name,
        last_name,
        email,
        phone,
        company_name,
        loan_purpose,
        loan_amount,
        monthly_revenue,
        trading_months,
        is_citizen_or_pr,
        has_abn,
        is_property_owner,
        property_value,
        has_defaults,
        urgency,
        status,
        disqualify_reason,
        landing_page,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        utm_term,
        fbclid,
    } = req.body || {};

    // "disqualified" leads only ever supply an email (from the exit screen's
    // optional "notify me" capture) — everything else on the qualifier form
    // requires the full first_name + email + phone set.
    if (status === "disqualified") {
        if (!email) return res.status(400).json({ error: "email is required" });
    } else if (!first_name || !email || !phone) {
        return res.status(400).json({ error: "first_name, email and phone are required" });
    }

    // ── Normalise phone to E.164 ─────────────────────────────────────────────
    function toE164(raw) {
        if (!raw) return null;
        const digits = raw.replace(/\D/g, "");
        if (!digits) return null;
        if (digits.startsWith("61") && digits.length === 11) return "+" + digits;
        if (digits.startsWith("0") && digits.length === 10) return "+61" + digits.slice(1);
        if (digits.startsWith("4") && digits.length === 9) return "+61" + digits;
        return raw.startsWith("+") ? raw : "+" + digits;
    }
    const phoneE164 = toE164(phone);

    const source = fbclid || utm_medium === "paid_social" ? "meta_ads" : (utm_source || "direct");

    const leadPayload = {
        first_name,
        last_name: last_name || "",
        email,
        phone: phoneE164 || phone,
        company_name: company_name || "",
        loan_purpose: loan_purpose || "",
        loan_amount: loan_amount || "",
        monthly_revenue: monthly_revenue || "",
        trading_months: trading_months || "",
        is_citizen_or_pr: is_citizen_or_pr || "",
        has_abn: has_abn || "",
        is_property_owner: is_property_owner || "",
        property_value: property_value || "",
        has_defaults: has_defaults || "",
        urgency: urgency || "",
        status: status || "qualified",
        disqualify_reason: disqualify_reason || "",
        landing_page: landing_page || "",
        source,
        utm_source: utm_source || "",
        utm_medium: utm_medium || "",
        utm_campaign: utm_campaign || "",
        utm_content: utm_content || "",
        utm_term: utm_term || "",
        fbclid: fbclid || "",
        created_at: new Date().toISOString(),
    };

    console.log("New Ascend lead received:", { first_name, email, landing_page });

    const ZAPIER_WEBHOOK_URL = process.env.ZAPIER_WEBHOOK_URL;

    if (!ZAPIER_WEBHOOK_URL) {
        console.error("ZAPIER_WEBHOOK_URL environment variable is not set — lead was received but not forwarded to HubSpot.");
        return res.status(200).json({ success: true, forwarded: false });
    }

    try {
        const zapRes = await fetch(ZAPIER_WEBHOOK_URL, {
            method: "POST",
            headers: { "Content-Type": "application/json" },
            body: JSON.stringify(leadPayload),
        });
        if (!zapRes.ok) {
            const body = await zapRes.text();
            console.error("Zapier webhook failed:", zapRes.status, body);
            return res.status(200).json({ success: true, forwarded: false });
        }
    } catch (err) {
        console.error("Zapier webhook request threw:", err.message);
        return res.status(200).json({ success: true, forwarded: false });
    }

    return res.status(200).json({ success: true, forwarded: true });
}
