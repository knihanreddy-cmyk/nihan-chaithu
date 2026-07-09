'use client';

import Image from 'next/image';
import { useEffect, useRef, useState } from 'react';

function useInView(threshold = 0.08) {
  const ref = useRef<HTMLDivElement>(null);
  const [inView, setInView] = useState(false);
  useEffect(() => {
    const el = ref.current;
    if (!el) return;
    const obs = new IntersectionObserver(
      ([e]) => {
        if (e.isIntersecting) setInView(true);
      },
      { threshold },
    );
    obs.observe(el);
    return () => obs.disconnect();
  }, [threshold]);
  return { ref, inView };
}

function anim(inView: boolean, delayMs: number) {
  return {
    opacity: inView ? 1 : 0,
    transform: inView
      ? 'translateY(0) scale(1)'
      : 'translateY(28px) scale(0.94)',
    transition: `opacity 0.6s ease ${delayMs}ms, transform 0.6s ease ${delayMs}ms`,
  };
}

// All 10 real modeling photos mapped by visual content
const ROW1 = [
  // tall left
  {
    src: '/images/modeling/826b469d6b8587ca9ca8d9c3a7a3916e.jpg',
    alt: 'White dress on chair',
    tall: true,
  },
  // 3 beside it
  {
    src: '/images/modeling/3005248305dc5a621343f6cd29ac79a8.jpg',
    alt: 'Blue ball gown',
  },
  {
    src: '/images/modeling/4d5a5c7ce41a772b8de50c92769a3c48.jpg',
    alt: 'Outdoor lehenga',
  },
  {
    src: '/images/modeling/effc021251ec6bab0e2d6b62e6aaf173.jpg',
    alt: 'Red traditional saree',
  },
];

const ROW2 = [
  {
    src: '/images/modeling/d836b3be1726eca9280fca4cee202665.jpg',
    alt: 'Backstage lights mirror',
  },
  // tall center
  {
    src: '/images/modeling/711d092589eb647812b11440c0385b34.jpg',
    alt: 'Floral spinning gown',
    tall: true,
  },
  {
    src: '/images/modeling/cb5e0e7e0626995381ec6faaff8dc347.jpg',
    alt: 'Blue ethnic with plants',
  },
  {
    src: '/images/modeling/3c0b7b1884d27e601f62b63157871af0.jpg',
    alt: 'Birthday princess',
  },
];

const ROW3 = [
  {
    src: '/images/modeling/f8a150964162d626ff684ffdf37850bc.jpg',
    alt: 'Park bench fun',
  },
  {
    src: '/images/modeling/6f3770f204fac1437841a24b67396283.jpg',
    alt: 'Candid portrait',
  },
];

type Photo = { src: string; alt: string; tall?: boolean };

function Img({ src, alt }: Photo) {
  return (
    <Image
      src={src}
      alt={alt}
      fill
      className='object-cover object-top'
      sizes='(max-width: 640px) 50vw, (max-width: 1024px) 33vw, 25vw'
    />
  );
}

export default function GallerySection() {
  const { ref, inView } = useInView();

  return (
    <section
      ref={ref}
      className='bg-black py-10 sm:py-14 px-4 sm:px-8 lg:px-16 overflow-hidden container mx-auto'
    >
      <div className='max-w-6xl mx-auto space-y-3 sm:space-y-4'>
        {/* ── Mobile (< sm): uniform 2-col grid, all 10 photos ── */}
        <div className='sm:hidden grid grid-cols-2 gap-3'>
          {[...ROW1, ...ROW2, ...ROW3].map((p, i) => (
            <div
              key={p.alt}
              className='photo-hover rounded-xl overflow-hidden relative aspect-4/5'
              style={anim(inView, i * 55)}
            >
              <Img src={p.src} alt={p.alt} />
            </div>
          ))}
        </div>

        {/* ── Tablet / Desktop (sm+): complex layout ── */}
        <div className='hidden sm:block space-y-3 lg:space-y-4'>
          {/* Row 1: tall white dress | blue gown | outdoor lehenga | red saree */}
          <div className='grid grid-cols-3 md:grid-cols-4 gap-3 lg:gap-4 items-start'>
            {/* White dress — tall, spans 2 rows */}
            <div
              className='photo-hover rounded-2xl overflow-hidden relative'
              style={{
                ...anim(inView, 0),
                gridRow: '1 / span 2',
                aspectRatio: '3/5',
              }}
            >
              <Img src={ROW1[0].src} alt={ROW1[0].alt} />
            </div>

            <div
              className='photo-hover rounded-2xl overflow-hidden relative aspect-4/5'
              style={anim(inView, 80)}
            >
              <Img src={ROW1[1].src} alt={ROW1[1].alt} />
            </div>
            <div
              className='photo-hover rounded-2xl overflow-hidden relative aspect-4/5'
              style={anim(inView, 160)}
            >
              <Img src={ROW1[2].src} alt={ROW1[2].alt} />
            </div>
            {/* 4th column — hidden on 3-col tablet, visible on 4-col desktop */}
            <div
              className='hidden md:block photo-hover rounded-2xl overflow-hidden relative aspect-4/5'
              style={anim(inView, 240)}
            >
              <Img src={ROW1[3].src} alt={ROW1[3].alt} />
            </div>
          </div>

          {/* Row 2: backstage | floral gown (tall center) | blue plants | birthday */}
          <div className='grid grid-cols-3 md:grid-cols-4 gap-3 lg:gap-4 items-start'>
            <div
              className='photo-hover rounded-2xl overflow-hidden relative aspect-4/5'
              style={anim(inView, 100)}
            >
              <Img src={ROW2[0].src} alt={ROW2[0].alt} />
            </div>

            {/* Floral gown — tall, spans 2 rows */}
            <div
              className='photo-hover rounded-2xl overflow-hidden relative'
              style={{
                ...anim(inView, 180),
                gridRow: '1 / span 2',
                aspectRatio: '3/5',
              }}
            >
              <Img src={ROW2[1].src} alt={ROW2[1].alt} />
            </div>

            <div
              className='photo-hover rounded-2xl overflow-hidden relative aspect-4/5'
              style={anim(inView, 260)}
            >
              <Img src={ROW2[2].src} alt={ROW2[2].alt} />
            </div>
            <div
              className='hidden md:block photo-hover rounded-2xl overflow-hidden relative aspect-4/5'
              style={anim(inView, 340)}
            >
              <Img src={ROW2[3].src} alt={ROW2[3].alt} />
            </div>
          </div>

          {/* Row 3: 2 candid photos centered */}
          <div className='grid grid-cols-2 sm:grid-cols-4 gap-3 lg:gap-4'>
            <div
              className='photo-hover rounded-2xl overflow-hidden relative aspect-square sm:col-start-2'
              style={anim(inView, 80)}
            >
              <Img src={ROW3[0].src} alt={ROW3[0].alt} />
            </div>
            <div
              className='photo-hover rounded-2xl overflow-hidden relative aspect-square'
              style={anim(inView, 160)}
            >
              <Img src={ROW3[1].src} alt={ROW3[1].alt} />
            </div>
          </div>
        </div>
      </div>{' '}
      {/* Heading */}
      <div className='flex justify-end'>
        <h2 className='text-6xl md:text-8xl bold tracking-wide uppercase'>
          Work With Me
        </h2>
      </div>
    </section>
  );
}
