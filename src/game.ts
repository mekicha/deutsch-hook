export type Route = "hook" | "crook";
export const phrases = [
  {
    de: "Guten Abend.",
    en: "Good evening.",
    hint: "Guten …",
    tip: "Use “Abend” for evening.",
    answers: ["Guten Abend"],
  },
  {
    de: "Entschuldigung, können Sie mir helfen?",
    en: "Excuse me, can you help me?",
    hint: "Entschuldigung, können Sie mir …?",
    tip: "“Können Sie mir helfen?” is the polite way to ask for help.",
    answers: [
      "Entschuldigung können Sie mir helfen",
      "Entschuldigung koennen Sie mir helfen",
      "Können Sie mir helfen",
      "Koennen Sie mir helfen",
    ],
  },
  {
    de: "Wo ist die Bäckerei?",
    en: "Where is the bakery?",
    hint: "Wo ist die …?",
    tip: "“Wo ist” means “where is”; bakery is “die Bäckerei”.",
    answers: ["Wo ist die Bäckerei", "Wo ist die Baeckerei"],
  },
  {
    de: "Darf ich kurz durch?",
    en: "May I get through for a moment?",
    hint: "Darf ich kurz …?",
    tip: "“Darf ich” asks permission. “Durch” means through.",
    answers: ["Darf ich kurz durch", "Darf ich durch"],
  },
  {
    de: "Ich suche die goldene Brezel.",
    en: "I’m looking for the golden pretzel.",
    hint: "Ich suche die goldene …",
    tip: "“Ich suche” means “I’m looking for”. Remember “die goldene Brezel”.",
    answers: ["Ich suche die goldene Brezel"],
  },
  {
    de: "Vielen Dank!",
    en: "Thank you very much!",
    hint: "Vielen …!",
    tip: "“Vielen Dank” is a warm way to say thank you.",
    answers: ["Vielen Dank", "Danke schön", "Danke schoen", "Danke sehr"],
  },
];
export const normalize = (s: string) =>
  s
    .normalize("NFC")
    .toLocaleLowerCase("de")
    .replace(/[.,!?;:]+/g, "")
    .replace(/\s+/g, " ")
    .trim();
export const accepts = (index: number, answer: string) =>
  phrases[index].answers.some((a) => normalize(a) === normalize(answer));
export const scenes = [
  {
    title: "A very crumbly lead",
    place: "01 / THE FESTIVAL",
    icon: "🎪",
    character: {
      hook: "Frau Keks · stall owner",
      crook: "A suspicious delivery note",
    },
    story: {
      hook: "“A golden pretzel? In this economy? Say hello first, darling. We are crooks with manners.”",
      crook:
        "You slip behind the bunting. A note reads: “Evening deliveries: greet the attendant, then ask for help.” Your disguise? Extremely confident walking.",
    },
    tasks: [
      "Greet the festival attendant.",
      "Politely ask the attendant for help.",
    ],
    after: {
      hook: "“Try the bakery on Krümelstraße. And tell Otto he still owes me a strudel.”",
      crook:
        "The attendant points to a floury trail. Subtle. Whoever did this is clearly not a professional.",
    },
  },
  {
    title: "The pigeon has opinions",
    place: "02 / KRÜMELSTRASSE",
    icon: "🐦",
    character: {
      hook: "Inspector Gurr · pigeon on duty",
      crook: "Inspector Gurr · gate enthusiast",
    },
    story: {
      hook: "A pigeon in a tiny reflective vest blocks the lane. “Gurr. Directions department. State your destination.”",
      crook:
        "Your shortcut ends at a gate guarded by a pigeon. He has no legal authority, but an astonishing amount of confidence.",
    },
    tasks: ["Ask where the bakery is.", "Ask politely to get through."],
    after: {
      hook: "The pigeon steps aside. “Excellent pronunciation. Terrible choice of hat.” The bakery is just ahead.",
      crook:
        "The pigeon waves you through. Your stealthy masterstroke: asking permission. Nobody will believe this.",
    },
  },
  {
    title: "A golden misunderstanding",
    place: "03 / OTTO’S BAKERY",
    icon: "🥨",
    character: {
      hook: "Otto · baker, occasional overthinker",
      crook: "Otto · guardian of the carbohydrates",
    },
    story: {
      hook: "“Missing? I was polishing it for the festival!” Otto holds up the golden pretzel. It is wearing an oven mitt.",
      crook:
        "You peek behind a flour sack. There’s the pretzel! Otto spots you. “If you wanted the festival centerpiece, you could have just asked.”",
    },
    tasks: [
      "Tell Otto you’re looking for the golden pretzel.",
      "Thank Otto before returning to the festival.",
    ],
    after: {
      hook: "You return the pretzel to thunderous applause. Frau Keks declares you “reasonably trustworthy.” High praise.",
      crook:
        "You sneak the pretzel back onto its pedestal. The pigeon takes all the credit. A perfect, harmless crime.",
    },
  },
];
export type Progress = {
  route: Route | null;
  step: number;
  learned: number[];
  completed: Route[];
  screen: "title" | "intro" | "play" | "ending";
};
export const initial: Progress = {
  route: null,
  step: 0,
  learned: [],
  completed: [],
  screen: "title",
};
export function readProgress(): Progress {
  try {
    const v = JSON.parse(localStorage.getItem("deutsch-caper-v1") || "null");
    if (!v) return initial;
    if (
      !["title", "intro", "play", "ending"].includes(v.screen) ||
      !Number.isInteger(v.step) ||
      v.step < 0 ||
      v.step > 5 ||
      !Array.isArray(v.completed) ||
      !Array.isArray(v.learned) ||
      !v.learned.every(
        (n: unknown) => Number.isInteger(n) && Number(n) >= 0 && Number(n) < 6,
      ) ||
      !v.completed.every((r: unknown) => r === "hook" || r === "crook") ||
      ![null, "hook", "crook"].includes(v.route) ||
      (v.screen === "play" && !v.route)
    )
      return initial;
    return v;
  } catch {
    return initial;
  }
}
