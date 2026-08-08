import Image from "next/image";

const details = [
  "Screen",
  "Stage",
  "Theatre",
  "Modeling",
];

export default function ActingBioSection() {
  return (
    <section className="bg-[#050505] px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-28">
      <div className="section-shell grid gap-10 lg:grid-cols-[0.95fr_1fr] lg:items-center lg:gap-16">
        <div className="grid grid-cols-2 gap-3 sm:gap-4">
          <div className="image-frame relative col-span-2 aspect-[5/4] sm:col-span-1 sm:aspect-[4/5]">
            <Image
              src="/images/acting/placeholder-portrait.jpg"
              alt="Acting portrait placeholder"
              fill
              className="object-cover object-[50%_24%]"
              sizes="(max-width: 640px) 100vw, (max-width: 1024px) 45vw, 31vw"
            />
          </div>

          <div className="grid gap-3 sm:gap-4">
            <div className="image-frame relative aspect-square">
              <Image
                src="/images/acting/placeholder-square.jpg"
                alt="Acting portrait placeholder"
                fill
                className="object-cover object-[50%_18%]"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 22vw, 15vw"
              />
            </div>
            <div className="image-frame relative aspect-[4/5]">
              <Image
                src="/images/acting/placeholder-portrait.jpg"
                alt="Acting portrait placeholder"
                fill
                className="object-cover object-[50%_18%]"
                sizes="(max-width: 640px) 50vw, (max-width: 1024px) 22vw, 15vw"
              />
            </div>
          </div>
        </div>

        <div className="text-white">
          <p className="mb-3 font-inter text-[10px] uppercase tracking-[0.28em] text-[#9fb7a6]">
            About
          </p>
          <h2 className="font-bebas text-[clamp(4rem,12vw,8rem)] leading-[0.84] text-white">
            Bio
          </h2>
          <p className="mt-6 max-w-2xl font-inter text-base leading-8 text-white/72 sm:text-lg">
            An emerging screen and stage presence, bringing natural expression
            and confident storytelling to every role. Full acting portfolio
            and credits coming soon.
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
