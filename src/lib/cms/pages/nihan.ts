import { nihanPhoto, type NihanPhotoNo } from "@/app/nihan/photos";
import { RICH_HELP, type Field, type Img, type PageSchema } from "../fields";

const np = (no: NihanPhotoNo, alt: string): Img => ({ ...nihanPhoto(no), alt });

export type Tape = "" | "g" | "b";
export type NihanCat = "looks" | "adv" | "little";

export type NihanLook = { image: Img; tape: Tape; caption: string; small: string };
export type NihanStop = { image: Img; tape: Tape; caption: string; date: string; title: string; text: string; hand: string };
export type NihanEntry = { category: NihanCat; image: Img; tape: Tape; caption: string };

export type NihanContent = {
  hero: {
    kicker: string;
    title: string;
    lead: string;
    note: string;
    image: Img;
    caption: string;
    captionSmall: string;
    stampYears: string;
  };
  intro: { hand: string; text: string };
  looks: {
    heading: string;
    intro: string;
    packTitle: string;
    packList: string[];
    packFoot: string;
    items: NihanLook[];
  };
  story: { heading: string; intro: string; stops: NihanStop[]; end: string };
  gallery: { heading: string; intro: string; entries: NihanEntry[] };
  sibling: { image: Img; caption: string; kicker: string; heading: string; hand: string; text: string; button: string };
  contact: { heading: string; text: string; hand: string };
  footer: { copyright: string };
};

export const nihanDefaults: NihanContent = {
  hero: {
    kicker: "Portfolio · Vol. 1",
    title: "The Adventures *of Nihan*",
    lead: "New faces, fresh frames. Style, story and a lot of sunshine.",
    note: "best view yet!",
    image: np(25, "Nihan by the sea in a checked shirt and sunglasses under a cloudy, dramatic sky"),
    caption: "Seaside, Aug 2023",
    captionSmall: "Field page 01",
    stampYears: "2015–2026",
  },
  intro: {
    hand: "First entry —",
    text: "From a curious baby in 2015 to a sharp-dressed boy in 2026: tractors, paddy fields, seasides and temple steps. These pages keep his looks, his places and the little moments in between.",
  },
  looks: {
    heading: "Packing list: Looks",
    intro: "Five outfits worth taking on any trip, from studio kurta to festive gold.",
    packTitle: "Outfits packed",
    packList: [
      "Navy embroidered kurta",
      "Lime-green kurta, 2019",
      "Festive gold shawl, 2023",
      "Striped sweater, 2026",
      "Little-Krishna costume",
    ],
    packFoot: "Sunglasses come along every time.",
    items: [
      {
        image: np(6, "Studio portrait of Nihan in a navy embroidered kurta and sunglasses against a grey backdrop"),
        tape: "",
        caption: "Navy kurta, studio",
        small: "Look 01",
      },
      { image: np(28, "Nihan in a striped navy and white sweater against a yellow wall"), tape: "g", caption: "Striped knit, 2026", small: "Look 02" },
      {
        image: np(26, "Festive close portrait of Nihan in a gold shawl and pearl necklaces with a tilak"),
        tape: "b",
        caption: "Festive look, 2023",
        small: "Look 03",
      },
      {
        image: np(20, "Nihan in a lime-green kurta, white trousers and sunglasses in a garden"),
        tape: "",
        caption: "Garden kurta, 2019",
        small: "Look 04",
      },
      {
        image: np(15, "Young Nihan dressed as little Krishna in a yellow dhoti and red scarf against a white wall"),
        tape: "g",
        caption: "Little Krishna, 2019",
        small: "Look 05",
      },
    ],
  },
  story: {
    heading: "The route so far",
    intro: "Growing up in frames: every stop on the map, in the order it happened.",
    end: "… to be continued",
    stops: [
      { image: np(19, "Baby Nihan looking at a phone, close-up"), tape: "", caption: "The first page", date: "Sep 2015", title: "Day one of the journal", text: "The earliest photo in the collection, already curious about the camera.", hand: "" },
      { image: np(1, "Baby Nihan in a striped tee sitting beside a giant bottle gourd"), tape: "g", caption: "Who's bigger?", date: "Jan 2016", title: "Vegetable for scale", text: "A striped tee and a bottle gourd almost as tall as him.", hand: "" },
      { image: np(3, "Toddler Nihan at the steering wheel of a big red tractor"), tape: "b", caption: "Driver's seat", date: "Sep 2017", title: "Big red tractor", text: "Hands on the wheel of the largest vehicle in the album.", hand: "first expedition vehicle" },
      { image: np(12, "Nihan standing next to a giant cartoon statue in a park"), tape: "", caption: "Park giants", date: "Jun 2018", title: "Park of statues", text: "A day out among giant figures, three pages from the same trip.", hand: "" },
      { image: np(13, "Nihan riding a crocodile statue in a park"), tape: "g", caption: "Crocodile ride", date: "Jun 2018", title: "Crocodile, tamed", text: "Same park, a braver seat.", hand: "no crocodiles were harmed" },
      { image: np(14, "Nihan digging soil with a hoe"), tape: "b", caption: "Ground work", date: "Jun 2018", title: "Digging in", text: "Hoe in hand, working the soil.", hand: "" },
      { image: np(16, "Nihan standing in a flooded paddy field holding rice saplings"), tape: "", caption: "Monsoon planting", date: "Jul 2020", title: "Paddy field, monsoon", text: "Ankle-deep in water with a bundle of rice saplings.", hand: "" },
      { image: np(21, "Nihan in a yellow tee standing with his bicycle on a street"), tape: "g", caption: "Two wheels", date: "Jul 2022", title: "On his own bicycle", text: "A yellow tee and a bike of his own for the street.", hand: "" },
      { image: np(5, "Nihan walking on the beach in a striped tee and sunglasses with waves behind"), tape: "b", caption: "Beach walk", date: "Undated page", title: "Along the waterline", text: "Striped tee, sunglasses and the waves for company.", hand: "" },
      { image: np(25, "Nihan by the sea in a checked shirt and sunglasses under a cloudy sky"), tape: "", caption: "Seaside, 2023", date: "Aug 2023", title: "Seaside, cinematic", text: "Checked shirt, dark glasses and a sky full of weather.", hand: "" },
      { image: np(27, "Nihan smiling in a blue polo in front of an ornate temple"), tape: "g", caption: "Temple visit", date: "Apr 2025", title: "Temple steps", text: "A big smile in front of carved stone.", hand: "latest stop, more to come" },
    ],
  },
  gallery: {
    heading: "Logged entries",
    intro: "Every page, stamped and sorted. Pick a stamp to filter.",
    entries: [
      { category: "looks", image: np(6, "Studio portrait in a navy embroidered kurta and sunglasses"), tape: "", caption: "Studio, navy kurta" },
      { category: "adv", image: np(3, "Toddler driving a big red tractor"), tape: "b", caption: "Tractor, 2017" },
      { category: "little", image: np(11, "Baby studio shot on a black backdrop with a finger on his lip"), tape: "g", caption: "Shh, studio baby" },
      { category: "looks", image: np(26, "Festive portrait with gold shawl, pearl necklaces and tilak"), tape: "b", caption: "Festive look, 2023" },
      { category: "adv", image: np(16, "Standing in a flooded paddy field with rice saplings"), tape: "", caption: "Paddy field, 2020" },
      { category: "little", image: np(2, "Toddler in sunglasses sitting on a car bonnet"), tape: "", caption: "Cool already, 2017" },
      { category: "adv", image: np(25, "By the sea under a dramatic cloudy sky"), tape: "g", caption: "Seaside, 2023" },
      { category: "looks", image: np(28, "Striped navy and white sweater against a yellow wall"), tape: "g", caption: "Yellow wall, 2026" },
      { category: "little", image: np(19, "Baby looking at a phone, close-up"), tape: "b", caption: "First photo, 2015" },
      { category: "adv", image: np(13, "Riding a crocodile statue in a park"), tape: "", caption: "Croc ride, 2018" },
      { category: "looks", image: np(22, "At night among fairy lights in a yellow hoodie, holding a small light"), tape: "b", caption: "Fairy lights, 2023" },
      { category: "little", image: np(24, "Holding a green and white umbrella in a yellow tee"), tape: "g", caption: "Umbrella day, 2023" },
      { category: "adv", image: np(21, "With his bicycle on a street in a yellow tee"), tape: "b", caption: "Cycling, 2022" },
      { category: "looks", image: np(20, "Lime-green kurta with white trousers and sunglasses in a garden"), tape: "", caption: "Garden kurta, 2019" },
      { category: "little", image: np(1, "Baby beside a giant bottle gourd"), tape: "", caption: "Bottle gourd, 2016" },
      { category: "adv", image: np(27, "Smiling in a blue polo in front of an ornate temple"), tape: "g", caption: "Temple, 2025" },
    ],
  },
  sibling: {
    image: np(23, "Nihan with his sister Chaithrika, both carrying school-style bags"),
    caption: "With Chaithrika, Jun 2023",
    kicker: "Expedition partner",
    heading: "Every explorer needs a co-pilot.",
    hand: "bags packed, ready to go",
    text: "His sister Chaithrika is a child model and actress, and the other half of this family portfolio.",
    button: "Meet his sister Chaithrika →",
  },
  contact: {
    heading: "Send a note",
    text: "For shoots, campaigns and collaborations. Bookings are managed by his parents, who will reply personally.",
    hand: "— replies come by post (well, email)",
  },
  footer: { copyright: "Bookings managed by his parents · © Nihan Reddy" },
};

const tape: Field = {
  key: "tape",
  label: "Tape colour",
  type: "select",
  options: [
    { value: "", label: "Cream" },
    { value: "g", label: "Green" },
    { value: "b", label: "Blue" },
  ],
};

export const nihanSchema: PageSchema = {
  id: "nihan",
  title: "Nihan",
  path: "/nihan",
  sections: [
    {
      key: "hero",
      label: "Cover",
      type: "group",
      fields: [
        { key: "kicker", label: "Cover label", type: "text" },
        { key: "title", label: "Title", type: "text", help: RICH_HELP },
        { key: "lead", label: "Intro line", type: "textarea" },
        { key: "image", label: "Cover photo", type: "image" },
        { key: "caption", label: "Photo caption", type: "text" },
        { key: "captionSmall", label: "Photo caption, small", type: "text" },
        { key: "note", label: "Handwritten note", type: "text" },
        { key: "stampYears", label: "Stamp years", type: "text" },
      ],
    },
    {
      key: "intro",
      label: "First entry",
      type: "group",
      fields: [
        { key: "hand", label: "Handwritten lead-in", type: "text" },
        { key: "text", label: "Text", type: "textarea" },
      ],
    },
    {
      key: "looks",
      label: "Looks",
      type: "group",
      fields: [
        { key: "heading", label: "Heading", type: "text" },
        { key: "intro", label: "Intro", type: "textarea" },
        { key: "packTitle", label: "Checklist title", type: "text" },
        { key: "packList", label: "Checklist", type: "strings", itemLabel: "Item" },
        { key: "packFoot", label: "Checklist footnote", type: "text" },
        {
          key: "items",
          label: "Looks (5 photo slots)",
          type: "list",
          fixed: true,
          itemLabel: "Look",
          titleKey: "caption",
          help: "The collage has five fixed slots. The first slot is the large one.",
          fields: [
            { key: "image", label: "Photo", type: "image" },
            { key: "caption", label: "Caption", type: "text" },
            { key: "small", label: "Small label", type: "text" },
            tape,
          ],
        },
      ],
    },
    {
      key: "story",
      label: "The route (timeline)",
      type: "group",
      fields: [
        { key: "heading", label: "Heading", type: "text" },
        { key: "intro", label: "Intro", type: "textarea" },
        {
          key: "stops",
          label: "Stops",
          type: "list",
          itemLabel: "Stop",
          titleKey: "title",
          fields: [
            { key: "image", label: "Photo", type: "image" },
            { key: "caption", label: "Photo caption", type: "text" },
            { key: "date", label: "Date", type: "text" },
            { key: "title", label: "Title", type: "text" },
            { key: "text", label: "Text", type: "textarea" },
            { key: "hand", label: "Handwritten note (optional)", type: "text" },
            tape,
          ],
        },
        { key: "end", label: "End line", type: "text" },
      ],
    },
    {
      key: "gallery",
      label: "Gallery",
      type: "group",
      fields: [
        { key: "heading", label: "Heading", type: "text" },
        { key: "intro", label: "Intro", type: "textarea" },
        {
          key: "entries",
          label: "Photos",
          type: "list",
          itemLabel: "Photo",
          titleKey: "caption",
          fields: [
            { key: "image", label: "Photo", type: "image" },
            { key: "caption", label: "Caption", type: "text" },
            {
              key: "category",
              label: "Category",
              type: "select",
              options: [
                { value: "looks", label: "Looks" },
                { value: "adv", label: "Adventures" },
                { value: "little", label: "Little moments" },
              ],
            },
            tape,
          ],
        },
      ],
    },
    {
      key: "sibling",
      label: "Sister band",
      type: "group",
      fields: [
        { key: "image", label: "Photo", type: "image" },
        { key: "caption", label: "Photo caption", type: "text" },
        { key: "kicker", label: "Small label", type: "text" },
        { key: "heading", label: "Heading", type: "text" },
        { key: "hand", label: "Handwritten note", type: "text" },
        { key: "text", label: "Text", type: "textarea" },
        { key: "button", label: "Button label", type: "text" },
      ],
    },
    {
      key: "contact",
      label: "Contact",
      type: "group",
      fields: [
        { key: "heading", label: "Heading", type: "text" },
        { key: "text", label: "Text", type: "textarea" },
        { key: "hand", label: "Handwritten note", type: "text" },
      ],
    },
    {
      key: "footer",
      label: "Footer",
      type: "group",
      fields: [{ key: "copyright", label: "Footer line", type: "text" }],
    },
  ],
};
