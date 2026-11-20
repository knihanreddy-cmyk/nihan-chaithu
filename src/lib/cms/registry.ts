import type { PageSchema } from "./fields";
import { chaithrikaDefaults, chaithrikaSchema, type ChaithrikaContent } from "./pages/chaithrika";
import { homeDefaults, homeSchema, type HomeContent } from "./pages/home";
import { nihanDefaults, nihanSchema, type NihanContent } from "./pages/nihan";

export type PageContentMap = {
  home: HomeContent;
  chaithrika: ChaithrikaContent;
  nihan: NihanContent;
};
export type PageId = keyof PageContentMap;

export const PAGES: { [K in PageId]: { schema: PageSchema; defaults: PageContentMap[K] } } = {
  home: { schema: homeSchema, defaults: homeDefaults },
  chaithrika: { schema: chaithrikaSchema, defaults: chaithrikaDefaults },
  nihan: { schema: nihanSchema, defaults: nihanDefaults },
};

export const PAGE_IDS = Object.keys(PAGES) as PageId[];

export const isPageId = (v: string): v is PageId => v in PAGES;
