import type { GreetingPayload, GreetingStyle, Language } from "./types";

const templates: Record<
  Language,
  Record<GreetingStyle, (from: string, to: string) => string>
> = {
  en: {
    traditional: (from, to) =>
      `Dear ${to}, may the lamps of Diwali fill your home with peace, prosperity and the warmth of family. With love, ${from}.`,
    emotional: (from, to) =>
      `${to}, you are one of the brightest lights in my life. This Diwali I hope every shadow around you turns to gold. Forever, ${from}.`,
    funny: (from, to) =>
      `${to}, may your sweets last longer than the fireworks, and may your diyas stay lit even if the Wi-Fi does not. Happy Diwali from ${from}!`,
    elegant: (from, to) =>
      `To ${to}, with a wish as quiet as a flame and as generous as the festival night. Light, grace and joy — ${from}.`,
  },
  hi: {
    traditional: (from, to) =>
      `प्रिय ${to}, दिवाली के दीये आपके घर में शांति, समृद्धि और परिवार की गर्माहट लाएँ। स्नेह सहित, ${from}।`,
    emotional: (from, to) =>
      `${to}, तुम मेरी दुनिया के सबसे प्यारे उजाले हो। इस दिवाली हर अंधेरा तुम्हारे लिए सोना बन जाए। तुम्हारे ${from}।`,
    funny: (from, to) =>
      `${to}, मिठाइयाँ आतिशबाजी से ज्यादा चलें, और वाई-फाई जाए तो भी दीये जलते रहें। ${from} की तरफ से शुभ दिवाली!`,
    elegant: (from, to) =>
      `${to} के लिए, लौ जितनी कोमल और रात जितनी उदार शुभकामना। प्रकाश, शोभा और आनंद — ${from}।`,
  },
  bn: {
    traditional: (from, to) =>
      `প্রিয় ${to}, দীপাবলির প্রদীপ আপনার ঘরে শান্তি, সমৃদ্ধি ও পরিবারের উষ্ণতা আনুক। ভালোবাসায়, ${from}।`,
    emotional: (from, to) =>
      `${to}, তুমি আমার জীবনের অন্যতম উজ্জ্বল আলো। এই কালীপূজা-দীপাবলিতে তোমার চারপাশের সব ছায়া সোনা হয়ে উঠুক। ${from}।`,
    funny: (from, to) =>
      `${to}, মিষ্টি যেন আতশবাজির চেয়ে বেশি টিকে, আর ওয়াই-ফাই গেলেও প্রদীপ যেন না নেভে। ${from}-এর শুভেচ্ছা!`,
    elegant: (from, to) =>
      `${to}-এর জন্য, শিখার মতো নরম ও উৎসবরাতের মতো উদার একটি প্রার্থনা। আলো, লাবণ্য ও আনন্দ — ${from}।`,
  },
};

export function composeGreeting(payload: Omit<GreetingPayload, "v" | "message"> & { message?: string }) {
  const from = payload.from.trim() || "A friend";
  const to = payload.to.trim() || "you";
  const custom = payload.message?.trim();
  return custom || templates[payload.language][payload.style](from, to);
}

export function greetingAsText(payload: GreetingPayload) {
  return `Happy Diwali, ${payload.to}!\n\n${payload.message}\n\n— ${payload.from}`;
}

export const blessings = {
  en: [
    "May every doorway of your home remember the shape of light.",
    "A quiet diya for your courage, a bright one for your joy.",
    "May sweetness linger, and may worry burn down like a spent wick.",
    "This night is for beginning again — gently, and together.",
    "Gold in the sky, gold in the heart. Happy Diwali.",
    "May protection walk with you, as lamps walk with the dark.",
  ],
  hi: [
    "आपके घर की हर देहली रोशनी का आकार याद रखे।",
    "साहस के लिए एक शांत दीया, आनंद के लिए एक उजला दीया।",
    "मिठास ठहर जाए, और चिंता बत्ती की तरह जलकर शांत हो जाए।",
    "यह रात फिर से शुरू होने के लिए है — कोमलता से, साथ-साथ।",
    "आसमान में सोना, हृदय में सोना। शुभ दिवाली।",
    "जैसे दीये अंधेरे के साथ चलते हैं, रक्षा आपके साथ चले।",
  ],
  bn: [
    "আপনার ঘরের প্রতিটি দোরগোড়া আলোর আকৃতি মনে রাখুক।",
    "সাহসের জন্য একটি শান্ত প্রদীপ, আনন্দের জন্য একটি উজ্জ্বল প্রদীপ।",
    "মিষ্টতা থাকুক, আর দুশ্চিন্তা সলতের মতো জ্বলে শান্ত হোক।",
    "এই রাত আবার শুরু করার — আলতো করে, একসাথে।",
    "আকাশে সোনা, হৃদয়ে সোনা। শুভ দীপাবলি।",
    "প্রদীপ যেমন অন্ধকারের সঙ্গে হাঁটে, সুরক্ষা আপনার সঙ্গে হাঁটুক।",
  ],
};
