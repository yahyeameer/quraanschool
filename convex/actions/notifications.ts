"use node";

import { v } from "convex/values";
import { action } from "../_generated/server";
import twilio from "twilio";

export const sendSMS = action({
    args: {
        to: v.string(),
        message: v.string(),
    },
    handler: async (ctx, args) => {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;
        const messagingServiceSid = process.env.TWILIO_MESSAGING_SERVICE_SID;
        const fromNumber = process.env.TWILIO_PHONE_NUMBER;

        if (!accountSid || !authToken) {
            throw new Error("Twilio credentials not configured");
        }

        const client = twilio(accountSid, authToken);

        try {
            const msgOptions: any = {
                body: args.message,
                to: args.to,
            };

            if (messagingServiceSid) {
                msgOptions.messagingServiceSid = messagingServiceSid;
            } else if (fromNumber) {
                msgOptions.from = fromNumber;
            } else {
                throw new Error("Twilio From Number or Messaging Service SID not configured");
            }

            const message = await client.messages.create(msgOptions);
            return { success: true, sid: message.sid };
        } catch (error: any) {
            console.error("Twilio Error:", error);
            throw new Error(`Failed to send SMS: ${error.message}`);
        }
    },
});

export const sendWhatsApp = action({
    args: {
        to: v.string(), // Format: "whatsapp:+1234567890"
        message: v.string(),
    },
    handler: async (ctx, args) => {
        const accountSid = process.env.TWILIO_ACCOUNT_SID;
        const authToken = process.env.TWILIO_AUTH_TOKEN;

        // For WhatsApp sandbox, the 'from' number is specific (e.g. "whatsapp:+14155238886")
        // Retrieve from env or fallback
        const fromNumber = process.env.TWILIO_WHATSAPP_NUMBER;

        if (!accountSid || !authToken || !fromNumber) {
            throw new Error("Twilio credentials for WhatsApp not configured");
        }

        const client = twilio(accountSid, authToken);

        try {
            const message = await client.messages.create({
                body: args.message,
                from: fromNumber,
                to: args.to,
            });
            return { success: true, sid: message.sid };
        } catch (error: any) {
            console.error("Twilio WhatsApp Error:", error);
            throw new Error(`Failed to send WhatsApp: ${error.message}`);
        }
    },
});
