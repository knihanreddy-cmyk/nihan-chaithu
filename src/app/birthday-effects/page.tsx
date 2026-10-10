import type { Metadata } from "next";
import ShareButton from "./ShareButton";

export const metadata: Metadata = {
  title: "Chaithrika's Birthday Opening — Pick Your Favourite",
  description:
    "Ten birthday opening animations for Chaithrika's website. Watch them all and tell us which one is best.",
};

const effects = [
  { name: "Confetti Cannons", idea: "Two little cannons fire colourful confetti, then her name pops in.", start: "Plays by itself", colors: ["#FFF8F5", "#E8577E", "#E2B04A"] },
  { name: "Gold Luxe", idea: "Black and gold, with shimmering gold-foil confetti and a golden name.", start: "Plays by itself", colors: ["#0B0A09", "#D4AF37", "#F3E3B5"] },
  { name: "Balloon Pop", idea: "Balloons float up and pop, each one dropping a letter of her name.", start: "Plays by itself", colors: ["#EAF6F8", "#FF7A7A", "#FFD166"] },
  { name: "Fireworks Night", idea: "Rockets launch from both corners into a night-sky fireworks show.", start: "Plays by itself", colors: ["#0A1028", "#FFD27A", "#FF7EA8"] },
  { name: "Party Popper Streamers", idea: "Big poppers burst curly paper streamers over a bold greeting.", start: "Plays by itself", colors: ["#FFFFFF", "#FF4F8B", "#3355FF"] },
  { name: "Gift Box Unwrap", idea: "Tap the gift: the ribbon unties, the lid flies off and she rises out.", start: "Tap the gift", colors: ["#2A0F1F", "#F4C6CF", "#C98A7A"] },
  { name: "Petals & Glitter", idea: "Soft rose petals and glitter, with 'Happy Birthday' in script.", start: "Plays by itself", colors: ["#FBEFF1", "#E7A3B4", "#F7D9C4"] },
  { name: "Photo Pop Collage", idea: "Her photos fly out with the confetti and land in a collage.", start: "Tap the cards", colors: ["#F6F1EA", "#E26D8A", "#2A9D8F"] },
  { name: "Cake & Candle", idea: "Make a wish: blow out the candle, then the celebration begins.", start: "Tap the candle", colors: ["#2B1A14", "#F4A6B8", "#E7B65C"] },
  { name: "Runway Countdown", idea: "A 3-2-1 countdown on the runway, camera flashes and confetti.", start: "Tap “Lights”", colors: ["#060606", "#F3E3B5", "#B76E79"] },
];

export default function BirthdayEffectsPage() {
  return (
    <main className="min-h-svh bg-[#fff6f1] px-4 pb-24 pt-14 text-[#2a1219] sm:px-8 lg:px-16 lg:pt-20">
      <div className="mx-auto max-w-[1200px]">
        <header className="grid gap-8 border-b border-[#2a1219]/10 pb-10 lg:grid-cols-[1.2fr_1fr] lg:items-end">
          <div>
            <p className="mb-4 font-inter text-[11px] uppercase tracking-[0.28em] text-[#c2405c]">
              A birthday gift for Chaithrika
            </p>
            <h1 className="font-playfair text-[clamp(2.6rem,7vw,5.2rem)] italic leading-[0.98] [text-wrap:balance]">
              Which birthday opening is the best?
            </h1>
          </div>
          <div className="grid gap-5">
            <p className="max-w-md font-inter text-[15px] leading-7 text-[#5c3d46]">
              Her website will open with a celebration. Watch all 10, each
              takes about 10 seconds, then tell us the{" "}
              <strong className="font-semibold text-[#2a1219]">number</strong> you
              like best.
            </p>
            <ShareButton />
          </div>
        </header>

        <ol className="mt-12 grid gap-5 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-5">
          {effects.map((effect, index) => {
            const number = index + 1;
            const [ground, a, b] = effect.colors;
            return (
              <li key={effect.name}>
                <a
                  href={`/birthday-effects/${number}`}
                  className="group flex h-full flex-col overflow-hidden rounded-2xl border border-[#2a1219]/10 bg-white shadow-[0_18px_40px_-28px_rgba(90,30,45,0.45)] transition duration-300 hover:-translate-y-1 hover:shadow-[0_26px_50px_-26px_rgba(90,30,45,0.55)] focus-visible:outline-2 focus-visible:outline-offset-4 focus-visible:outline-[#d9576f]"
                >
                  <div
                    className="relative grid aspect-[4/3] place-items-center overflow-hidden"
                    style={{
                      background: `radial-gradient(circle at 18% 100%, ${a} 0 18%, transparent 42%), radial-gradient(circle at 82% 100%, ${b} 0 18%, transparent 42%), ${ground}`,
                    }}
                  >
                    <span
                      className="font-bebas text-[5.5rem] leading-none transition-transform duration-500 group-hover:scale-110"
                      style={{ color: a, textShadow: "0 6px 30px rgba(0,0,0,0.18)" }}
                    >
                      {String(number).padStart(2, "0")}
                    </span>
                    <span className="absolute bottom-3 right-3 rounded-full bg-black/45 px-3 py-1 font-inter text-[11px] font-medium text-white backdrop-blur">
                      ▶ Watch
                    </span>
                  </div>
                  <div className="flex flex-1 flex-col gap-2 p-4">
                    <h2 className="font-playfair text-lg leading-tight">{effect.name}</h2>
                    <p className="font-inter text-[13px] leading-6 text-[#5c3d46]">{effect.idea}</p>
                    <p className="mt-auto pt-1 font-inter text-[11px] uppercase tracking-[0.16em] text-[#c2405c]">
                      {effect.start}
                    </p>
                  </div>
                </a>
              </li>
            );
          })}
        </ol>

        <p className="mt-12 max-w-2xl font-inter text-[13px] leading-6 text-[#7a5560]">
          Tip: turn your sound on. The ones you start with a tap play soft pops
          and chimes. Every effect has Replay and Skip buttons at the top, and
          an “All 10 effects” button at the bottom to come back here.
        </p>
      </div>
    </main>
  );
}
