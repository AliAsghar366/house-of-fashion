"use client";

import { MessageCircle } from "lucide-react";

const WHATSAPP_NUMBER = "+923120744554";
const WHATSAPP_URL = `https://wa.me/${WHATSAPP_NUMBER.replace(/[^0-9]/g, "")}`;

export function WhatsAppButton() {
  return (
    <a
      href={WHATSAPP_URL}
      target="_blank"
      rel="noopener noreferrer"
      aria-label="Chat on WhatsApp"
      className="fixed bottom-6 right-6 z-50 flex items-center gap-2 rounded-full bg-[#25D366] px-5 py-3 text-white shadow-lg hover:bg-[#20BA5C] hover:scale-105 transition-all"
    >
      <MessageCircle size={22} />
      <span className="hidden sm:inline font-semibold text-sm">Chat with us</span>
    </a>
  );
}
