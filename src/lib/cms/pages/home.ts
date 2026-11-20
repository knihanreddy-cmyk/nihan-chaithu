import { designImage } from "@/components/designs/images";
import { RICH_HELP, type Field, type Img, type PageSchema } from "../fields";

export type HomePortal = {
  image: Img;
  chipA: string;
  chipB: string;
  eyebrow: string;
  name: string;
  sub: string;
};

export type HomeContent = {
  header: { pill: string };
  intro: { kicker: string; heading: string };
  chaithrika: HomePortal;
  nihan: HomePortal;
  footer: { note: string };
};

export const homeDefaults: HomeContent = {
  header: { pill: "Family portfolio · India" },
  intro: { kicker: "Two portfolios, one family", heading: "Choose a *world*" },
  chaithrika: {
    image: {
      ...designImage("blue-gown"),
      alt: "Chaithrika in a teal ball gown against a pink studio backdrop",
    },
    chipA: "**IKFW** Season 11",
    chipB: "Amazon Kids",
    eyebrow: "Model & actress",
    name: "Chaith*rika*",
    sub: "Runway · Editorial · Commercial · Acting",
  },
  nihan: {
    image: {
      src: "/images/nihan/nihan-25.jpg",
      width: 1600,
      height: 1200,
      alt: "Nihan in a checked shirt and sunglasses, sitting on the rocks by the sea under a cloudy sky",
      position: "27% 40%",
    },
    chipA: "Growing up in frames",
    chipB: "New faces",
    eyebrow: "Portfolio",
    name: "Ni*han*",
    sub: "New faces, fresh frames",
  },
  footer: { note: "Bookings managed by their parents" },
};

const portal: Field[] = [
  { key: "image", label: "Portal photo", type: "image", help: "Shown in a tall frame; set a focus point for landscape photos." },
  { key: "eyebrow", label: "Small label", type: "text" },
  { key: "name", label: "Name", type: "text", help: RICH_HELP },
  { key: "sub", label: "Subtitle", type: "text" },
  { key: "chipA", label: "Floating chip 1", type: "text", help: RICH_HELP },
  { key: "chipB", label: "Floating chip 2", type: "text" },
];

export const homeSchema: PageSchema = {
  id: "home",
  title: "Home page",
  path: "/",
  sections: [
    {
      key: "intro",
      label: "Heading",
      type: "group",
      fields: [
        { key: "kicker", label: "Small line above", type: "text" },
        { key: "heading", label: "Main heading", type: "text", help: RICH_HELP },
      ],
    },
    { key: "chaithrika", label: "Chaithrika portal", type: "group", fields: portal },
    { key: "nihan", label: "Nihan portal", type: "group", fields: portal },
    {
      key: "header",
      label: "Header",
      type: "group",
      fields: [{ key: "pill", label: "Top-right pill", type: "text" }],
    },
    {
      key: "footer",
      label: "Footer",
      type: "group",
      fields: [{ key: "note", label: "Footer note", type: "text" }],
    },
  ],
};
