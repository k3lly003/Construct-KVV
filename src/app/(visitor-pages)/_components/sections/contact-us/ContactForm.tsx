  "use client";

  import ReusableSection from '../../ReusableSection';
  import { toast } from 'sonner';
  // import { useFormState, useFormStatus } from'react-dom';
  import { contactUs } from '@/app/(visitor-pages)/_actions/contactus';
  import { SubmitButton } from '../footer/SubscribeForm';
  export default function ContactForm() {
    // const [response, action] = useFormState(contactUs, {});
    // if (response.error) {
    //   toast.error(response.error);
    // } else if (response.message) {
    //   toast.success(response.message);
    //   setTimeout(() => {
    //     window.location.reload();
    //   }, 2000);
    // }

    return (
      <ReusableSection isTopSection background="">
        <div className='flex justify-between flex-wrap bg-white w-full border p-8 md:p-20 shadow-lg rounded-md'>
          {/* Left side  */}
          <div className="flex flex-col justify-between items-start w-full md:w-[48%] mb-10">
            <form className="space-y-6 w-full text-black" action={action}>
              <div className="flex gap-4 mb-4 flex-col">
                <label htmlFor='name' className='flex flex-col space-y-2'>
                  <input
                    type='text'
                    name='name'
                    id='name'
                    className='border border-gray-300 rounded-md p-2 w-full bg-slate-100'
                    placeholder="Full Name"
                    required
                  />
                </label>
                <label htmlFor='email' className='flex flex-col space-y-2'>
                  <input
                    type='email'
                    name='email'
                    id='email'
                    className='border border-gray-300 rounded-md p-2 w-full bg-slate-100'
                    placeholder="Email address"
                    required
                  />
                </label>
                <label htmlFor='message' className='flex flex-col space-y-2'>
                  <textarea
                    name='message'
                    id='message'
                    className='border bg-slate-50 border-gray-300 rounded-md p-2 w-full h-100'
                    placeholder="Your message here..."
                    required
                  />
                </label>
                <SubmitButton label={'SEND MESSAGE'}/>
              </div>
            </form>
          </div>

          {/* Right side  */}
          <div className="space-y-4 flex flex-col justify-between items-start w-full md:w-[48%]">
            <div className="text-black font text-base md:text-lg">
              <p>construction kvv shop</p>
              <p>KG 549 St, Nyarugenge</p>
              <p>
                <a
                  href="https://maps.app.goo.gl/iRoJAuvj1EA5Xb827"
                  target="_blank"
                  rel="noopener noreferrer"
                  className="underline"
                >
                  Google Maps Location
                </a>
              </p>
              <p>+250 788 888 888</p>
              <p>constructionkvv@gmail.org</p>
            </div>
            <div className="w-full flex justify-start items-cente md:w-full h-40 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.553554881119!2d30.072044274050132!3d-1.9306041366678404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca70041075f0d%3A0x8dd8bd686d407d92!2sSheCanCode%20Training%20Center!5e0!3m2!1sfr!2srw!4v1717664442768!5m2!1sfr!2srw"
                width="500"
                height="190"
                allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
        </div>
      </ReusableSection>
    );
  };
