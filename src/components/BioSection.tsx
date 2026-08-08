import Image from "next/image";

const details = [
  "Runway",
  "Editorial",
  "Commercial",
  "Acting",
];

export default function BioSection() {
  return (
    <section className="bg-[#050505] px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-28">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.95fr_1fr] lg:items-center lg:gap-16">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="image-frame relative col-span-2 aspect-[5/4] sm:col-span-1 sm:aspect-[4/5]">
            <Image
              src="/images/bio/321410e0258a17ffe27b788771ce7a5f.jpg"
              alt="Chaithrika in a red dress"
              fill
              className="object-cover object-[50%_24%]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 31vw"
            />
          </div>

          <div className="grid gap-3 sm:gap-4">
            <div className="image-frame relative aspect-square">
              <Image
                src="/images/bio/3097497f8498d5234237af1a1cdbcd96.png"
                alt="Chaithrika portrait"
                fill
                className="object-cover object-[50%_18%]"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 22vw, 15vw"
              />
            </div>
            <div className="image-frame relative aspect-[4/5]">
              <Image
                src="/images/bio/89797d9d509176ebf0e1549939a2509f.jpg"
                alt="Chaithrika editorial portrait"
                fill
                className="object-cover object-[50%_18%]"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 22vw, 15vw"
              />
            </div>
          </div>
        </div>

        <div className="text-white">
          <p className="mb-3 font-inter text-[10px] uppercase tracking-[0.28em] text-[#c9a84c]">
            About
          </p>
          <h2 className="font-bebas text-[clamp(4rem,12vw,8rem)] leading-[0.84] text-white">
            Bio
          </h2>
          <p className="mt-6 max-w-2xl font-inter text-base leading-8 text-white/72 sm:text-lg">
            From India Kids Fashion Week Season 11 to Amazon Kids Dress,
            Chaithrika brings confidence, creativity, and expressive performance
            to every brief. Her work blends clean camera presence with a natural
            sense of movement and story.
          </p>

          <div className="mt-9 grid grid-cols-2 border-y border-white/10 sm:grid-cols-4">
            {details.map((item) => (
              <p
                key={item}
                className="border-white/10 py-4 font-inter text-[10px] uppercase tracking-[0.2em] text-white/54 odd:border-r sm:border-r sm:px-4 sm:first:pl-0 sm:last:border-r-0"
              >
                {item}
              </p>
            ))}
          </div>
        </div>
      </div>
    </section>
  );
}
