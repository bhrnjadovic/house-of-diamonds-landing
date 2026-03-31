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
        budget,
        message,
        landing_page,
        utm_source,
        utm_medium,
        utm_campaign,
        utm_content,
        fbclid,
        When_required,  // Meta Lead Ads field name
    } = req.body || {};

    // Normalise timeline — Meta Lead Ads sends "When_required", landing pages send "timeline"
    const TIMELINE_MAP = {
        "now → 2–6 weeks":  "2–6 weeks",
        "now - 2-6 weeks":  "2–6 weeks",
        "6–12 weeks":       "6–12 weeks",
        "6-12 weeks":       "6–12 weeks",
        "3–6 months+":      "3–6 months+",
        "3-6 months+":      "3–6 months+",
        "just researching": "Just researching",
        "Just researching": "Just researching",
    };
    const timeline = req.body?.timeline
        || (When_required ? (TIMELINE_MAP[When_required] ?? When_required) : "");

    if (!first_name || !email) {
        return res.status(400).json({ error: "first_name and email are required" });
    }

    // ── 2. Save lead to database (TODO: replace with real DB write) ──────────
    console.log("New lead received:", { first_name, email, landing_page });

    // ── 3. Klaviyo integration ───────────────────────────────────────────────
    const KLAVIYO_API_KEY = process.env.KLAVIYO_PRIVATE_KEY;

    if (!KLAVIYO_API_KEY) {
        console.error("KLAVIYO_PRIVATE_KEY environment variable is not set");
        return res.status(200).json({ success: true, klaviyo: false });
    }

    const klaviyoHeaders = {
        Authorization: `Klaviyo-API-Key ${KLAVIYO_API_KEY}`,
        "Content-Type": "application/json",
        revision: KLAVIYO_REVISION,
    };

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

    // Custom properties sent to both the profile and the event
    const customProperties = {
        timeline:     timeline     || "",
        budget:       budget       || "",
        message:      message      || "",
        landing_page: landing_page || "",
        utm_source:   utm_source   || "",
        utm_medium:   utm_medium   || "",
        utm_campaign: utm_campaign || "",
        utm_content:  utm_content  || "",
        fbclid:       fbclid       || "",
    };

    // ── 3a. Upsert Klaviyo profile via profile-import ────────────────────────
    // profile-import upserts by email — no subscriptions block (not supported here)
    const profilePayload = {
        data: {
            type: "profile",
            attributes: {
                email,
                first_name,
                ...(phoneE164 ? { phone_number: phoneE164 } : {}),
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

    // ── 3b. Subscribe profile to list (sets email consent to Subscribed) ─────
    // expert-guide → KLAVIYO_LIST_ID_GUIDE, all others → KLAVIYO_LIST_ID
    const listId = landing_page === "expert-guide"
        ? process.env.KLAVIYO_LIST_ID_GUIDE
        : process.env.KLAVIYO_LIST_ID;

    if (listId) {
        const subscriptionPayload = {
            data: {
                type: "profile-subscription-bulk-create-job",
                attributes: {
                    profiles: {
                        data: [{
                            type: "profile",
                            attributes: {
                                email,
                                ...(phoneE164 ? { phone_number: phoneE164 } : {}),
                                subscriptions: {
                                    email: {
                                        marketing: {
                                            consent: "SUBSCRIBED",
                                        },
                                    },
                                    ...(phoneE164 ? {
                                        sms: {
                                            marketing: {
                                                consent: "SUBSCRIBED",
                                            },
                                        },
                                    } : {}),
                                },
                            },
                        }],
                    },
                },
                relationships: {
                    list: {
                        data: { type: "list", id: listId },
                    },
                },
            },
        };

        try {
            const subRes = await fetch(`${KLAVIYO_BASE}/api/profile-subscription-bulk-create-jobs/`, {
                method: "POST",
                headers: klaviyoHeaders,
                body: JSON.stringify(subscriptionPayload),
            });
            if (!subRes.ok) {
                const body = await subRes.text();
                console.error("Klaviyo subscription failed:", subRes.status, body);
            }
        } catch (err) {
            console.error("Klaviyo subscription request threw:", err.message);
        }
    } else {
        console.warn("No Klaviyo list ID set for landing_page:", landing_page);
    }

    // ── 3c. Track "Lead Submitted" event ────────────────────────────────────
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
                    phone:   phoneE164 || "",
                    message: message   || "",
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
