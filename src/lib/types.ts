export type Language = "en" | "hi" | "bn";

export type GreetingStyle = "traditional" | "emotional" | "funny" | "elegant";

export type CardTemplate = "royal" | "marigold" | "peacock" | "night";

export type CardFont = "display" | "elegant" | "playful";

export type GreetingPayload = {
  v: 1;
  from: string;
  to: string;
  message: string;
  language: Language;
  style: GreetingStyle;
  template: CardTemplate;
  font?: CardFont;
  accent?: string;
  stickers?: string[];
};

export type LetterPayload = {
  v: 1;
  from: string;
  to: string;
  message: string;
};

export type Wish = {
  id: string;
  text: string;
  name: string;
  createdAt: number;
};
