import React from 'react'

const ContactAddress = () => {
  return (
    <>
          <div className="space-y-4 flex flex-col justify-between items-start w-full md:w-[90%]">
            <div className="text-white font md:text-md">
              <p>Construction-Kvv-shop</p>
              <p>KN 549 St, 36 Nyarugenge</p>
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
              <p>+250 788 473 533</p>
              <p>construction@kvv.org</p>
            </div>
            <div className="w-full flex justify-start items-cente md:w-full h-40 overflow-hidden">
              <iframe
                src="https://www.google.com/maps/embed?pb=!1m18!1m12!1m3!1d3987.553554881119!2d30.072044274050132!3d-1.9306041366678404!2m3!1f0!2f0!3f0!3m2!1i1024!2i768!4f13.1!3m3!1m2!1s0x19dca70041075f0d%3A0x8dd8bd686d407d92!2sSheCanCode%20Training%20Center!5e0!3m2!1sfr!2srw!4v1717664442768!5m2!1sfr!2srw"
                width="500"
                height="190"
                // allowFullScreen=""
                loading="lazy"
                referrerPolicy="no-referrer-when-downgrade"
              ></iframe>
            </div>
          </div>
    </> 
  )
}

export default ContactAddress