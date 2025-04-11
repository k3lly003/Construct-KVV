import { openGraphImage } from "../../shared-metadata";
import DefaultPageBanner from "../_components/DefaultPageBanner";
import PageTitle from "../_components/PageTitle";
import ContactForm from "../_components/sections/contact-us/ContactForm";

export const metadata = {
  title: 'Contact Us',
  description: "Do you have a question you would like to ask us, do not hesitate to contact us.",
  keywords: "Contact-Us, Contact kvv, Contact e-commerce, Contact construction, real estate in Rwanda, Contact kvv Rwanda, Rwanda, construction e-commerce, Visit Rwanda, House in Rwanda, Rent House near me, Rent House in Rwanda, Igihe, paul kagame, Gorilla in Rwanda, Shop near me",
  openGraph: {
    title: 'Contact Us',
    description: "Do you have a question you would like to ask us, do not hesitate to contact us.",
    ...openGraphImage,
  },
};

const jsonLd = {
  '@context': 'https://www.kvv.shop/contact-us',
  '@type': 'Contact-us',
  name: 'Contact Us',
  image: 'https://www.kvv.shop/banner_img.png',
  description: 'Do you have a question or would like to visit our training center, or join our program, do not hesitate to contac us.',
}

export default function page() {
  return (
    <>
      <script
        type="application/ld+json"
        dangerouslySetInnerHTML={{ __html: JSON.stringify(jsonLd) }}
      />
      <DefaultPageBanner
        backgroundImage="/banner_img.png"
        title="Contact Us"
        description="Leave here your feedback and let’s us know what do you think Contact- us"
      />
      <div>
        <PageTitle orientation={"center"} title={"Tell us what you need!"} />
        <ContactForm />
      </div>
    </>
  )
}