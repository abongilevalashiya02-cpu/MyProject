
export interface RegionalEtiquette {
  region: string;
  sections: {
    title: string;
    icon?: string;
    points: string[];
  }[];
}

export const culturalEtiquette: RegionalEtiquette[] = [
  {
    region: "Southern Africa (South Africa, Botswana, Namibia, Zimbabwe, Zambia)",
    sections: [
      {
        title: "Greetings & Respect",
        icon: "👋",
        points: [
          "A firm handshake is common, often followed by a two-handed grip or \"soul shake\" among friends.",
          "Use honorifics like Mr., Ma'am, or Tate/Mma in Botswana for elders and professionals.",
          "In Zulu and Xhosa cultures, greeting is an important ritual—never jump straight to business."
        ]
      },
      {
        title: "Language Nuance",
        icon: "🗣️",
        points: [
          "English is widely spoken, but using words like Dumela (Setswana), Sawubona (Zulu), or Molo (Xhosa) earns respect."
        ]
      },
      {
        title: "Taboos",
        icon: "🚫",
        points: [
          "Avoid pointing with your finger—use your whole hand.",
          "Avoid discussing race or politics early in conversations unless the relationship is well-established."
        ]
      }
    ]
  },
  {
    region: "East Africa (Kenya, Tanzania, Uganda, Rwanda, Ethiopia)",
    sections: [
      {
        title: "Greetings & Hospitality",
        icon: "👋",
        points: [
          "Greetings are long and warm: \"How are you?\" may be repeated several times.",
          "Rwandans value calm, respectful body language. Avoid loud, expressive behavior."
        ]
      },
      {
        title: "Meals & Hospitality",
        icon: "🥘",
        points: [
          "In Ethiopia, eating with the right hand is traditional. Sharing food from a communal plate (injera) is a sign of closeness.",
          "In Swahili culture, hospitality is sacred: \"Karibu sana\" (You're very welcome) is more than a phrase—guests are treated like family."
        ]
      },
      {
        title: "Modesty & Religion",
        icon: "🕌",
        points: [
          "Dress modestly in Muslim-majority coastal areas (like Zanzibar or Mombasa).",
          "Fridays are sacred; many businesses slow down for Jumu'ah (prayers)."
        ]
      }
    ]
  },
  {
    region: "West Africa (Ghana, Nigeria, Senegal, Côte d'Ivoire)",
    sections: [
      {
        title: "Respect & Elders",
        icon: "👋",
        points: [
          "Ghanaians and Nigerians greet extensively—expect to ask about family and health before getting to business.",
          "Use right hand only when giving or receiving items (especially among the Yoruba and Hausa)."
        ]
      },
      {
        title: "Indirect Communication",
        icon: "💬",
        points: [
          "Directness can be considered rude; soften requests and avoid public confrontation.",
          "Proverbs and analogies are part of the communication style, especially among elders."
        ]
      },
      {
        title: "Culture & Expression",
        icon: "🎉",
        points: [
          "Music, fashion, and storytelling are celebrated. Being expressive is part of how respect is shown.",
          "Titles like Chief, Doctor, or Sir are important; don't drop them casually."
        ]
      }
    ]
  },
  {
    region: "Central Africa (DRC, Cameroon, Chad, Gabon)",
    sections: [
      {
        title: "Formal but Warm",
        icon: "👋",
        points: [
          "In places like Cameroon, greetings are formal—use French where applicable (Bonjour Monsieur/Madame).",
          "There's an emphasis on hierarchy: defer to elders and leaders in any setting."
        ]
      },
      {
        title: "Time is Fluid",
        icon: "⏰",
        points: [
          "\"African time\" is a real concept—meetings may not start promptly.",
          "Patience and flexibility are virtues."
        ]
      },
      {
        title: "Gift Giving",
        icon: "🎁",
        points: [
          "In some regions (e.g., DRC), bringing a small gift when visiting someone's home is appreciated and seen as a sign of good upbringing."
        ]
      }
    ]
  },
  {
    region: "North Africa (Egypt, Morocco, Tunisia, Algeria)",
    sections: [
      {
        title: "Islamic Customs Dominate",
        icon: "🕌",
        points: [
          "Greet with As-salaam Alaikum (Peace be upon you); wait for a same-gender handshake.",
          "Public displays of affection are discouraged.",
          "During Ramadan, do not eat, drink, or smoke in public during daylight."
        ]
      },
      {
        title: "Dress & Conduct",
        icon: "🧥",
        points: [
          "Conservative dress is expected in both urban and rural areas.",
          "Hospitality is core—tea or coffee is usually offered and should be accepted as a sign of respect."
        ]
      }
    ]
  }
];

export const bonusTips = {
  do: [
    "Learn 1–2 words in the local language",
    "Show respect to elders",
    "Ask before taking photos",
    "Accept hospitality graciously",
    "Be mindful of religion"
  ],
  dont: [
    "Assume everyone speaks English",
    "Speak with hands in pockets",
    "Take photos of people without consent",
    "Reject food/drink outright",
    "Publicly criticize local customs"
  ]
};
