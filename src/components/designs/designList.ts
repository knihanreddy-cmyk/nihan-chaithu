export type DesignEntry = {
  number: number;
  name: string;
  summary: string;
  href: string;
  cover: string;
  /** Ground and ink swatches shown on the index. */
  swatch: [string, string];
};

export const designs: DesignEntry[] = [
  {
    number: 1,
    name: "Luxury Minimal",
    summary: "Ivory lookbook, light Cormorant display, photos carry the colour.",
    href: "/design-1",
    cover: "/images/designs/white-chair.jpg",
    swatch: ["#FAF8F4", "#161514"],
  },
  {
    number: 2,
    name: "Dark Luxury",
    summary: "Black and antique gold, a film title-card hero, glowing cards.",
    href: "/design-2",
    cover: "/images/designs/runway.jpg",
    swatch: ["#0B0A09", "#C6A15B"],
  },
  {
    number: 3,
    name: "Apple-Inspired Minimal",
    summary: "Product-launch clarity, a hero photo that grows as you scroll.",
    href: "/design-3",
    cover: "/images/designs/blue-gown.jpg",
    swatch: ["#FFFFFF", "#1D1D1F"],
  },
  {
    number: 4,
    name: "Modern Glassmorphism",
    summary: "Frosted glass layered over drifting rose and teal light.",
    href: "/design-4",
    cover: "/images/designs/red-peplum.jpg",
    swatch: ["#F4EEF3", "#2A1B2E"],
  },
  {
    number: 5,
    name: "Editorial Magazine",
    summary: "A magazine issue with Chaithrika as the cover star.",
    href: "/design-5",
    cover: "/images/designs/floral-lehenga.jpg",
    swatch: ["#F1F0EC", "#B21F5A"],
  },
  {
    number: 6,
    name: "Luxury Corporate",
    summary: "Navy and brass, a talent profile sheet and booking process.",
    href: "/design-6",
    cover: "/images/designs/orange-flowers.jpg",
    swatch: ["#0F1E33", "#B08D57"],
  },
  {
    number: 7,
    name: "Modern Neo-Minimal",
    summary: "Giant stacked wordmark, geometry and one signal orange.",
    href: "/design-7",
    cover: "/images/designs/teal-lehenga.jpg",
    swatch: ["#FFFFFF", "#FF5B14"],
  },
  {
    number: 8,
    name: "Premium Soft Aesthetic",
    summary: "Linen and mocha, arch-topped frames, calm and tender.",
    href: "/design-8",
    cover: "/images/designs/garden.jpg",
    swatch: ["#EFE8DF", "#5A4B40"],
  },
  {
    number: 9,
    name: "Futuristic Premium",
    summary: "Dark interface, a lit stage, subtle cyan and magenta light.",
    href: "/design-9",
    cover: "/images/designs/fairy.jpg",
    swatch: ["#06070B", "#67E8F9"],
  },
  {
    number: 10,
    name: "Ultra Premium Creative",
    summary: "Colour-shifting chapters, a layered name reveal, pinned gallery.",
    href: "/design-10",
    cover: "/images/designs/green-gown.jpg",
    swatch: ["#E3769F", "#3A0B1E"],
  },
];
