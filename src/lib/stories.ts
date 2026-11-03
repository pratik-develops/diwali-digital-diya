export type StoryScene = {
  id: string;
  kicker: string;
  title: string;
  body: string;
};

export type JourneyStory = {
  id: string;
  title: string;
  subtitle: string;
  accent: string;
  scenes: StoryScene[];
};

export const stories: JourneyStory[] = [
  {
    id: "rama",
    title: "Return of Lord Rama",
    subtitle: "Ayodhya lights the way home",
    accent: "#ffb347",
    scenes: [
      {
        id: "exile",
        kicker: "Story I · Scene 1",
        title: "The long road home",
        body: "In the traditional telling of the Ramayana, Lord Rama returns to Ayodhya after years of exile and the victory that restored dharma. The city does not wait in silence. People prepare the streets, the courtyards, and the riverbanks for a homecoming of light.",
      },
      {
        id: "lamps",
        kicker: "Story I · Scene 2",
        title: "A city of diyas",
        body: "Households light rows of earthen lamps so the path is unmistakable even in the deepest night. In this account, the glow is not spectacle first — it is welcome. Each diya is a small act of recognition: you are home, and the dark will not hide you.",
      },
      {
        id: "meaning",
        kicker: "Story I · Scene 3",
        title: "Light over darkness",
        body: "Diwali carries this memory as a festival of return. The lamps speak a simple, enduring symbolism: knowledge over ignorance, hope over fear, and the courage of a community that chooses to illuminate the way for one another.",
      },
    ],
  },
  {
    id: "kali",
    title: "Maa Kali — Triumph of Divine Power",
    subtitle: "Courage, protection, and sacred strength",
    accent: "#c94b7b",
    scenes: [
      {
        id: "raktabija",
        kicker: "Story II · Scene 1",
        title: "The threat of Raktabija",
        body: "Traditional narratives tell of the asura Raktabija, whose power was terrible in a precise way: every drop of his blood that touched the earth could give rise to another of his form. Ordinary battle could not end the danger, because the wound itself seemed to multiply the darkness.",
      },
      {
        id: "emergence",
        kicker: "Story II · Scene 2",
        title: "Maa Kali emerges",
        body: "From the concentrated energy of the Goddess, Maa Kali appears — fierce, protective, and beyond ordinary measure. In the traditional account she meets Raktabija not with hesitation but with complete command, ensuring that his blood cannot seed the world with endless copies of harm.",
      },
      {
        id: "dance",
        kicker: "Story II · Scene 3",
        title: "The cosmic dance and Lord Shiva",
        body: "After the victory, traditional tellings describe Maa Kali’s awesome dance — a vision of cosmic power so immense that the world itself seems to tremble. Lord Shiva lies in her path, and the Goddess recognises him. The dance stills. The story is not mockery of sacred figures; it is a teaching about power held within compassion, and destruction aimed only at that which devouringly multiplies.",
      },
      {
        id: "kalipuja",
        kicker: "Story II · Scene 4",
        title: "Kali Puja and a blessing of strength",
        body: "In Bengal, Diwali night is also Kali Puja — homes and pandals glow for Maa Kali as the beloved protector. The festival holds both lamps and the Goddess’s strength together. The closing wish of this story is simple: may courage keep watch, may protection be near, and may divine strength steady every trembling heart.",
      },
    ],
  },
  {
    id: "diya",
    title: "The Meaning of a Diya",
    subtitle: "Why a small flame still matters",
    accent: "#7ad1c4",
    scenes: [
      {
        id: "why",
        kicker: "Story III · Scene 1",
        title: "Why we light a diya",
        body: "A diya is humble: clay, oil, a cotton wick. Lighting it is a domestic rite and a public joy. People place lamps on thresholds, windows, stairways and river ghats so that night itself becomes a celebration rather than a closing of the day.",
      },
      {
        id: "symbols",
        kicker: "Story III · Scene 2",
        title: "Hope, knowledge, goodness",
        body: "The flame is read as hope that does not wait for perfect conditions, knowledge that refuses to stay hidden, and goodness that can be shared without becoming less. One lamp can kindle another. The courtyard grows brighter without any single diya having to become the sun.",
      },
      {
        id: "begin",
        kicker: "Story III · Scene 3",
        title: "A new beginning",
        body: "Diwali also marks renewal — accounts settled, homes cleaned, relationships warmed. The diya is a beginning you can hold in two hands. Light it for someone you love, or for the year still unwritten. A little light, a little love, a lot of happiness.",
      },
    ],
  },
];
