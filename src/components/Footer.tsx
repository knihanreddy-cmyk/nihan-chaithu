import { FaInstagram } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className='bg-black text-white flex items-center'>
      <div className='container mx-auto px-4 sm:px-8 lg:px-20'>

        {/* Content */}
        <div className='grid grid-cols-1 lg:grid-cols-2 mt-10 sm:mt-16 lg:mt-24 container mx-auto'>

          {/* Left Side */}
          <div className='space-y-8 sm:space-y-12 lg:space-y-16'>

            <div>
              <h4 className='text-base lg:text-xl font-bold uppercase mb-2 lg:mb-3'>Address</h4>
              <p className='text-base sm:text-xl lg:text-2xl uppercase leading-relaxed tracking-wide'>
                Krivi Aadhya Apartment, Kompally,
                <br />
                Hyderabad.
              </p>
            </div>

            <div>
              <h4 className='text-base lg:text-xl font-bold uppercase mb-2 lg:mb-3'>Phone</h4>
              <p className='text-base sm:text-xl lg:text-2xl tracking-wide'>
                +(91) 96522 98089 / 9951 666 861
              </p>
            </div>

            <div>
              <h4 className='text-base lg:text-xl font-bold uppercase mb-2 lg:mb-3'>Email</h4>
              <p className='text-base sm:text-xl lg:text-2xl uppercase tracking-wide break-all sm:break-normal'>
                kchaithrikareddy@gmail.com
              </p>
            </div>

          </div>

          {/* Right Side */}
          <div className='flex flex-col items-end justify-end mt-10 sm:mt-14 lg:mt-0'>
            <FaInstagram className='w-16 h-16 sm:w-20 sm:h-20 lg:w-28 lg:h-28' />
            <p className='mt-4 lg:mt-6 text-xl sm:text-2xl lg:text-3xl uppercase tracking-widest'>
              Follow Us On
            </p>
          </div>

        </div>

        {/* Bottom padding */}
        <div className='pb-8 sm:pb-12 lg:pb-16' />

      </div>
    </footer>
  );
}
