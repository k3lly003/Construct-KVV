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
                src="https://www.google.com/maps?q=-1.9849325292232458,30.053393524365962&hl=es;z=14&output=embed"
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