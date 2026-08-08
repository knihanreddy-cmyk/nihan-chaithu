export type PortfolioItem = {
  number: string;
  category: string;
  description: string;
  image: string;
  imageClass: string;
  href: string;
  accent: string;
  /** Default share of the row width on desktop, in percent. */
  share: number;
};

export const portfolioItems: PortfolioItem[] = [
  {
    number: "01",
    category: "Modeling",
    description: "Runway · Editorial · Fashion campaigns",
    image: "/images/modeling/3005248305dc5a621343f6cd29ac79a8.jpg",
    imageClass: "object-[50%_18%]",
    href: "/category-one",
    accent: "#c9a84c",
    share: 58,
  },
  {
    number: "02",
    category: "Acting",
    description: "Screen · Stage · Performance",
    image: "/images/featured_works/d67b374abf8d99540107eef87e4b9f71.jpg",
    imageClass: "object-[50%_12%]",
    href: "/category-two",
    accent: "#9fb7a6",
    share: 42,
  },
];
