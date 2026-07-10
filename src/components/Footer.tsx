import { FaInstagram } from 'react-icons/fa6';

export default function Footer() {
  return (
    <footer className='bg-black text-white  flex items-center'>
      <div className='container mx-auto px-10 lg:px-20'>
   

        {/* Content */}
        <div className='grid grid-cols-1 lg:grid-cols-2 mt-24 container mx-auto'>
          {/* Left Side */}
          <div className='space-y-16'>
            <div>
              <h4 className='text-xl font-bold uppercase mb-3'>Address</h4>
              <p className='text-2xl uppercase leading-relaxed tracking-wide'>
                Krivi Aadhya Apartment, Kompally,
                <br />
                Hyderabad.
              </p>
            </div>

            <div>
              <h4 className='text-xl font-bold uppercase mb-3'>Phone</h4>
              <p className='text-2xl tracking-wide'>
                +(91) 96522 98089 / 9951 666 861
              </p>
            </div>

            <div>
              <h4 className='text-xl font-bold uppercase mb-3'>Email</h4>
              <p className='text-2xl uppercase tracking-wide'>
                kchaithrikareddy@gmail.com
              </p>
            </div>
          </div>

          {/* Right Side */}
          <div className='flex flex-col items-end justify-end mt-20 lg:mt-0'>
           
              <FaInstagram size={120} strokeWidth={1.5} />
           

            <p className='mt-6 text-3xl uppercase tracking-widest'>
              Follow Us On
            </p>
          </div>
        </div>
      </div>
    </footer>
  );
}
