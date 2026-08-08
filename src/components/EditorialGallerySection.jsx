import Image from "next/image";

const moments = [
  {
    src: "/images/bio/0211e3de91be30efb167447806dd54a9.jpg",
    alt: "Chaithrika in a blue dress",
    className: "lg:col-span-5 lg:row-span-5",
    imageClass: "object-cover object-[50%_18%]",
  },
  {
    src: "/images/bio/89797d9d509176ebf0e1549939a2509f.jpg",
    alt: "Chaithrika editorial look",
    className: "lg:col-span-4 lg:row-span-3",
    imageClass: "object-cover object-[50%_20%]",
  },
  {
    src: "/images/bio/baa1183d4b5df4bac78bd08850b8e544.jpg",
    alt: "Chaithrika in a festive outfit",
    className: "lg:col-span-3 lg:row-span-4",
    imageClass: "object-cover object-[50%_28%]",
  },
  {
    src: "/images/modeling/4d5a5c7ce41a772b8de50c92769a3c48.jpg",
    alt: "Chaithrika outdoor fashion portrait",
    className: "lg:col-span-7 lg:row-span-2",
    imageClass: "object-cover object-[50%_42%]",
  },
];

export default function EditorialGallerySection() {
  return (
    <section className="bg-[#080808] px-5 py-16 sm:px-8 sm:py-20 lg:px-16 lg:py-28">
      <div className="section-shell">
        <div className="mb-8 grid gap-4 sm:mb-10 lg:grid-cols-[0.6fr_1fr] lg:items-end">
          <div>
            <p className="mb-3 font-inter text-[10px] uppercase tracking-[0.28em] text-[#c9a84c]">
              Portfolio Set
            </p>
            <h2 className="font-bebas text-[clamp(3.75rem,10vw,8.5rem)] leading-[0.86] text-white">
              Editorial
            </h2>
          </div>
          <p className="max-w-2xl font-inter text-sm leading-7 text-white/56 lg:ml-auto lg:text-right">
            A compact look at expressive portraits, festive styling, and
            campaign-ready camera presence.
          </p>
        </div>

        <div className="grid gap-3 sm:grid-cols-2 sm:gap-4 lg:grid-cols-12 lg:auto-rows-[112px]">
          {moments.map((moment) => (
            <div
              key={moment.src}
              className={`image-frame relative aspect-[4/5] sm:aspect-[5/4] lg:aspect-auto ${moment.className}`}
            >
              <Image
                src={moment.src}
                alt={moment.alt}
                fill
                className={moment.imageClass}
                sizes="(max-width: 640px) 100vw, (max-width: 1024px) 50vw, 33vw"
              />
            </div>
          ))}
        </div>
      </div>
    </section>
  );
}
