import { designImage, type DesignImageName } from "@/components/designs/images";
import { RICH_HELP, type Img, type PageSchema } from "../fields";

const di = (name: DesignImageName, alt: string): Img => ({ ...designImage(name), alt });

export type ChaithrikaCategory = { image: Img; title: string; kinds: string; body: string };
export type ChaithrikaCard = { image: Img; tall: boolean; title: string; where: string };

export type ChaithrikaContent = {
  hero: { kickerRight: string; image: Img; lede: string; sub: string; cta: string };
  about: { statement: string; image: Img; paragraphs: string[]; disciplines: { name: string; note: string }[] };
  categories: {
    marquee: string[];
    heading: string;
    intro: string;
    modeling: ChaithrikaCategory;
    acting: ChaithrikaCategory;
  };
  scenes: {
    heading: string;
    scene1: { image: Img; title: string; text: string; meta: string[] };
    scene2: { title: string; text: string; image: Img; caption: string; creditKicker: string; credit: string };
  };
  gallery: { heading: string; introBig: string; introSmall: string; cards: ChaithrikaCard[] };
  quote: { image: Img; text: string; author: string };
  contact: {
    heading: string;
    paragraphs: string[];
    availability: string;
    projectTypes: string[];
    button: string;
  };
  footer: { instagram: string; copyright: string };
};

export const chaithrikaDefaults: ChaithrikaContent = {
  hero: {
    kickerRight: "Child model & actress · India",
    image: di(
      "runway-cutout",
      "Chaithrika in a kalamkari crop top and mint striped lehenga, her runway look from India Kids Fashion Week Season 11",
    ),
    lede: "Every look is a scene.",
    sub: "Runway, editorial, commercial and acting. From the India Kids Fashion Week Season 11 runway to Amazon Kids Dress, a presence that carries the whole frame.",
    cta: "Book Chaithrika",
  },
  about: {
    statement: "Confidence, creativity and *expressive performance*, brought to every single brief.",
    image: di(
      "floral-lehenga",
      "Chaithrika mid-twirl in a maroon embellished top and cream floral skirt against a pink studio backdrop",
    ),
    paragraphs: [
      "From India Kids Fashion Week Season 11 to Amazon Kids Dress, Chaithrika brings confidence, creativity, and expressive performance to every brief. Her work blends clean camera presence with a natural sense of movement and story.",
      "A twirl in the studio, a turn at the end of a runway, a glance held a beat longer for the camera: each is treated as a scene with a beginning, a feeling and a finish.",
    ],
    disciplines: [
      { name: "Runway", note: "Movement" },
      { name: "Editorial", note: "Stillness" },
      { name: "Commercial", note: "Warmth" },
      { name: "Acting", note: "Story" },
    ],
  },
  categories: {
    marquee: ["Runway", "Editorial", "Commercial", "Acting", "Screen", "Stage", "Performance"],
    heading: "Two stages",
    intro:
      "One asks her to carry a look. The other asks her to carry a character. Both, in her words, ask for presence.",
    modeling: {
      image: di(
        "orange-flowers",
        "Chaithrika standing with hands on hips in an orange dress with three-dimensional flowers, against a grey studio backdrop",
      ),
      title: "Modeling",
      kinds: "Runway · Editorial · Fashion campaigns",
      body: "Poise on the runway, stillness for the editorial frame, and the easy warmth a campaign needs to make clothes feel alive.",
    },
    acting: {
      image: di(
        "saree",
        "Chaithrika in an orange and green traditional outfit with jewellery, leaning on a tree and looking up",
      ),
      title: "Acting",
      kinds: "Screen · Stage · Performance",
      body: "A face that holds a thought before it speaks. Find the feeling first, and the performance follows.",
    },
  },
  scenes: {
    heading: "Featured *scenes*",
    scene1: {
      image: di(
        "runway",
        "Chaithrika walking the India Kids Fashion Week Season 11 runway in a kalamkari crop top and mint striped lehenga, under stage lights with the audience watching",
      ),
      title: "India Kids Fashion Week *Season 11*",
      text: "A poised walk at IKFW Season 11 with expressive stage presence, graceful movement, and a memorable runway finish.",
      meta: ["Runway show", "Dec 18, 2024", "Kalamkari & mint"],
    },
    scene2: {
      title: "Pinnacle Business Park *Brand photoshoot, 2024*",
      text: "A brand campaign shot at one of Bangalore’s premier business destinations, balancing couture, confidence, and polished camera presence.",
      image: di(
        "teal-lehenga",
        "Chaithrika in a green blouse, orange silk lehenga and teal and yellow dupatta, looking off to one side",
      ),
      caption: "Studio portrait — orange silk lehenga, teal dupatta",
      creditKicker: "Also in the credits",
      credit: "Amazon Kids Dress — commercial",
    },
  },
  gallery: {
    heading: "The *wardrobe*",
    introBig: "Nine looks. One presence.",
    introSmall: "Tulle and silk, sweatshirts and sequins: studio, garden, street and backstage.",
    cards: [
      {
        image: di("white-chair", "Chaithrika in a white tulle dress seated on a white folding chair, with soft pink hearts on the backdrop"),
        tall: false,
        title: "White tulle",
        where: "Studio",
      },
      {
        image: di("fairy", "Chaithrika in a white tulle dress with fairy wings against a grey studio backdrop"),
        tall: true,
        title: "Fairy wings",
        where: "Studio",
      },
      {
        image: di("green-gown", "Chaithrika holding out a dark green gown, wearing a tiara, with palm leaves behind her"),
        tall: false,
        title: "Emerald gown",
        where: "Outdoors",
      },
      {
        image: di("navy-ethnic", "Chaithrika in a navy embroidered dress with jewelled hair clips, looking down at hibiscus buds"),
        tall: true,
        title: "Navy & hibiscus",
        where: "Outdoors",
      },
      {
        image: di("red-peplum", "Chaithrika smiling in a red brocade peplum top and pink skirt against a pink backdrop"),
        tall: false,
        title: "Red brocade",
        where: "Studio",
      },
      {
        image: di("garden", "Chaithrika in a black and gold half-saree in a flowering garden, smiling shyly"),
        tall: true,
        title: "Black & gold",
        where: "Garden",
      },
      {
        image: di(
          "yellow-jeep",
          "Chaithrika in a yellow butterfly sweatshirt stepping out of a jeep, colour against a black and white background",
        ),
        tall: false,
        title: "Butterfly yellow",
        where: "Street",
      },
      {
        image: di("park", "Chaithrika in a yellow tee with an owl backpack on a red park bench, from a low angle"),
        tall: true,
        title: "Park day",
        where: "Lifestyle",
      },
      {
        image: di("backstage", "Backstage at IKFW, Chaithrika with an event lanyard looking into a bulb-lit makeup mirror"),
        tall: false,
        title: "Before the lights",
        where: "Backstage, IKFW",
      },
    ],
  },
  quote: {
    image: di(
      "blue-gown",
      "Chaithrika in a teal-blue rose ball gown with a hand on her hip, beside a wooden stool against a pink backdrop",
    ),
    text: "Modeling and acting both ask for presence. I love the challenge each one brings.",
    author: "Chaithrika",
  },
  contact: {
    heading: "Let’s create something *beautiful* together.",
    paragraphs: [
      "Casting a runway show, an editorial, a campaign or a role? Chaithrika’s parents handle every booking personally.",
      "Share the brief, the dates and the feeling you are after.",
    ],
    availability: "Available for bookings",
    projectTypes: [
      "Runway show",
      "Editorial shoot",
      "Brand or commercial campaign",
      "Film or screen",
      "Stage or live event",
      "Something else",
    ],
    button: "Book Chaithrika",
  },
  footer: { instagram: "", copyright: "© Chaithrika · Child model & actress, India" },
};

const category = [
  { key: "image", label: "Photo", type: "image" },
  { key: "title", label: "Title", type: "text" },
  { key: "kinds", label: "Kinds of work", type: "text" },
  { key: "body", label: "Text", type: "textarea" },
] as const;

export const chaithrikaSchema: PageSchema = {
  id: "chaithrika",
  title: "Chaithrika",
  path: "/chaithrika",
  sections: [
    {
      key: "hero",
      label: "Hero",
      type: "group",
      fields: [
        { key: "image", label: "Cut-out photo", type: "image", help: "Works best as a PNG with a transparent background." },
        { key: "kickerRight", label: "Small line, top right", type: "text" },
        { key: "lede", label: "Big line", type: "text" },
        { key: "sub", label: "Intro text", type: "textarea" },
        { key: "cta", label: "Button label", type: "text" },
      ],
    },
    {
      key: "about",
      label: "About",
      type: "group",
      fields: [
        { key: "statement", label: "Statement", type: "textarea", help: RICH_HELP },
        { key: "image", label: "Photo", type: "image" },
        { key: "paragraphs", label: "Paragraphs", type: "strings", itemLabel: "Paragraph" },
        {
          key: "disciplines",
          label: "Disciplines",
          type: "list",
          itemLabel: "Discipline",
          titleKey: "name",
          fields: [
            { key: "name", label: "Name", type: "text" },
            { key: "note", label: "Note", type: "text" },
          ],
        },
      ],
    },
    {
      key: "categories",
      label: "Modeling & acting",
      type: "group",
      fields: [
        { key: "marquee", label: "Scrolling words", type: "strings", itemLabel: "Word" },
        { key: "heading", label: "Heading", type: "text" },
        { key: "intro", label: "Intro", type: "textarea" },
        { key: "modeling", label: "Modeling", type: "group", fields: [...category] },
        { key: "acting", label: "Acting", type: "group", fields: [...category] },
      ],
    },
    {
      key: "scenes",
      label: "Featured scenes",
      type: "group",
      fields: [
        { key: "heading", label: "Heading", type: "text", help: RICH_HELP },
        {
          key: "scene1",
          label: "Scene 1 (full-width photo)",
          type: "group",
          fields: [
            { key: "image", label: "Photo", type: "image" },
            { key: "title", label: "Title", type: "text", help: RICH_HELP },
            { key: "text", label: "Text", type: "textarea" },
            { key: "meta", label: "Details (one per line)", type: "strings", itemLabel: "Line" },
          ],
        },
        {
          key: "scene2",
          label: "Scene 2",
          type: "group",
          fields: [
            { key: "title", label: "Title", type: "text", help: RICH_HELP },
            { key: "text", label: "Text", type: "textarea" },
            { key: "image", label: "Photo", type: "image" },
            { key: "caption", label: "Photo caption", type: "text" },
            { key: "creditKicker", label: "Credit label", type: "text" },
            { key: "credit", label: "Credit", type: "text" },
          ],
        },
      ],
    },
    {
      key: "gallery",
      label: "Wardrobe gallery",
      type: "group",
      fields: [
        { key: "heading", label: "Heading", type: "text", help: RICH_HELP },
        { key: "introBig", label: "Intro card, big line", type: "text" },
        { key: "introSmall", label: "Intro card, small line", type: "textarea" },
        {
          key: "cards",
          label: "Looks",
          type: "list",
          itemLabel: "Look",
          titleKey: "title",
          fields: [
            { key: "image", label: "Photo", type: "image" },
            { key: "title", label: "Title", type: "text" },
            { key: "where", label: "Where", type: "text" },
            { key: "tall", label: "Tall card", type: "boolean" },
          ],
        },
      ],
    },
    {
      key: "quote",
      label: "Quote",
      type: "group",
      fields: [
        { key: "image", label: "Photo", type: "image" },
        { key: "text", label: "Quote", type: "textarea" },
        { key: "author", label: "Author", type: "text" },
      ],
    },
    {
      key: "contact",
      label: "Bookings",
      type: "group",
      fields: [
        { key: "heading", label: "Heading", type: "text", help: RICH_HELP },
        { key: "paragraphs", label: "Paragraphs", type: "strings", itemLabel: "Paragraph" },
        { key: "availability", label: "Availability line", type: "text" },
        { key: "projectTypes", label: "Project types in the form", type: "strings", itemLabel: "Option" },
        { key: "button", label: "Button label", type: "text" },
      ],
    },
    {
      key: "footer",
      label: "Footer",
      type: "group",
      fields: [
        { key: "instagram", label: "Instagram link", type: "url", help: "Leave empty to hide the link." },
        { key: "copyright", label: "Copyright line", type: "text" },
      ],
    },
  ],
};
