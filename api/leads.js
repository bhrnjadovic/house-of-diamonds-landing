// api/leads.js — Vercel serverless function
// Receives lead submissions from landing pages, saves to DB (TODO), and syncs to Klaviyo.

const KLAVIYO_BASE = "https://a.klaviyo.com";
const KLAVIYO_REVISION = "2024-10-15";

export default async function handler(req, res) {
    // CORS — allow requests from landing pages
    res.setHeader("Access-Control-Allow-Origin", "*");
    res.setHeader("Access-Control-Allow-Methods", "POST, OPTIONS");
    res.setHeader("Access-Control-Allow-Headers", "Content-Type");
    if (req.method === "OPTIONS") return res.status(200).end();

    if (req.method !== "POST") {
        return res.status(405).json({ error: "Method not allowed" });
    }

    // ── 1. Parse and validate payload ───────────────────────────────────────
    const {
        first_name,
        email,
        phone,
        timeline,
        budget,
        message,
        landing_page,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        fbclid,
    } = req.body || {};

    if (!first_name || !email) {
        return res.status(400).json({ error: "first_name and email are required" });
    }

    // ── 2. Save lead to database (TODO: replace with real DB write) ──────────
    // Example: await db.leads.create({ first_name, email, phone, ... })
    console.log("New lead received:", { first_name, email, landing_page });

    // ── 3. Klaviyo integration ───────────────────────────────────────────────
    const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_KEY;

    if (!KLAVIYO_API_KEY) {
        console.error("KLAVIYO_PRIVATE_KEY environment variable is not set");
        // Still return 200 so the form success state shows — Klaviyo is non-blocking
        return res.status(200).json({ success: true, klaviyo: false });
    }

    const klaviyoHeaders = {
        Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        "Content-Type": "application/json",
        revision: KLAVIYO_REVISION,
    };

    // Custom properties sent to both the profile and the event
    const customProperties = {
        timeline:       timeline      || "",
        budget:         budget        || "",
        landing_page:   landing_page  || "",
        utm_source:     utm_source    || "",
        utm_medium:     utm_medium    || "",
        utm_campaign:   utm_campaign  || "",
        utm_content:    utm_content   || "",
        fbclid:         fbclid        || "",
    };

    // ── 3a. Upsert Klaviyo profile ───────────────────────────────────────────
    // profile-import upserts by email — existing profiles are updated, not duplicated.
    const profilePayload = {
        data: {
            type: "profile",
            attributes: {
                email,
                first_name,
                // Only include phone_number if provided — Klaviyo rejects empty strings
                ...(phone ? { phone_number: phone } : {}),
                properties: customProperties,
            },
        },
    };

    try {
        const profileRes = await fetch(`${KLAVIYO_BASE}/api/profile-import/`, {
            method: "POST",
            headers: klaviyoHeaders,
            body: JSON.stringify(profilePayload),
        });
        if (!profileRes.ok) {
            const body = await profileRes.text();
            console.error("Klaviyo profile upsert failed:", profileRes.status, body);
        }
    } catch (err) {
        console.error("Klaviyo profile request threw:", err.message);
    }

    // ── 3b. Track "Lead Submitted" event ────────────────────────────────────
    const eventPayload = {
        data: {
            type: "event",
            attributes: {
                time: new Date().toISOString(),
                metric: {
                    data: {
                        type: "metric",
                        attributes: { name: "Lead Submitted" },
                    },
                },
                profile: {
                    data: {
                        type: "profile",
                        attributes: { email },
                    },
                },
                properties: {
                    first_name,
                    phone:   phone   || "",
                    message: message || "",
                    ...customProperties,
                },
            },
        },
    };

    try {
        const eventRes = await fetch(`${KLAVIYO_BASE}/api/events/`, {
            method: "POST",
            headers: klaviyoHeaders,
            body: JSON.stringify(eventPayload),
        });
        if (!eventRes.ok) {
            const body = await eventRes.text();
            console.error("Klaviyo event tracking failed:", eventRes.status, body);
        }
    } catch (err) {
        console.error("Klaviyo event request threw:", err.message);
    }

    return res.status(200).json({ success: true });
}
