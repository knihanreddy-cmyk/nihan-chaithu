"use client";

import Image from "next/image";

export default function EditorialGallerySection() {
  return (
    <section className="bg-black py-24 lg:py-32 overflow-hidden ">
      <div className=" container mx-auto px-6 lg:px-12">

        <div className="relative h-[900px]">

          {/* Top Landscape Image */}
          <div
            className="
              absolute
              left-80 
              top-20
              w-[40%]
              h-[300px]
              rounded-[36px]
              overflow-hidden
              shadow-2xl
              z-10
            "
          >
            <Image
              src="/images/bio/89797d9d509176ebf0e1549939a2509f.jpg"
              alt=""
               fill
               
              className="object-[60%_35%] object-cover"
            />
          </div>

          {/* Large Vertical Image */}
          <div
            className="
              absolute
              right-24
              top-42
              w-[27%]
              h-[620px]
              rounded-[36px]
              overflow-hidden
              shadow-[0_40px_120px_rgba(0,0,0,.5)]
              z-20
            "
          >
            <Image
              src="/images/bio/0211e3de91be30efb167447806dd54a9.jpg"
              alt=""
              fill
              className="object-cover scale-120"
            />
          </div>

          {/* Floating Square Image */}
          <div
            className="
              absolute
              left-[46%]
              bottom-40
              w-[280px]
              h-[300px]
              rounded-[32px]
              overflow-hidden
              shadow-2xl
              z-30
            "
          >
            <Image
              src="/images/bio/baa1183d4b5df4bac78bd08850b8e544.jpg"
              alt=""
              fill
              className="object-cover object-[60%_35%]"
            />
          </div>

        </div>

      </div>
    </section>
  );
}