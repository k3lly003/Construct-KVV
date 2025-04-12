// import { getPrivacyPolicy } from '@/app/(dashboard-pages)/dashboard/_actions/articlesActions';
// import { openGraphImage } from "../../metadata";
// import DefaultPageBanner from '../_components/DefaultPageBanner';
// import PrivacyPolicyInformationSection from '../_components/sections/privacyPolicy/PrivacyPolicyInformationSection';

// export const metadata = {
//   title: 'Privacy Policy',
//   description: "Kvv Privacy Policy.",
//   keywords: "",
//   openGraph: {
//     title: 'Privacy Policy',
//     description: "Kvv Privacy Policy.",
//     ...openGraphImage,
//   },
// }

// export default async function PrivacyPolicy() {
//   let privacyPolicy = {};
//   const response = await getPrivacyPolicy();
//   if (typeof response === "string") {
//     privacyPolicy = JSON.parse(response);
//   }

//   return (
//     <>
//       <DefaultPageBanner
//         backgroundImage={privacyPolicy.image}
//         title={privacyPolicy.title}
//         description={`Last updated: ${new Date(privacyPolicy.updatedAt).toDateString()}`}
//       />
//       <PrivacyPolicyInformationSection PrivacyPolicyPageData={privacyPolicy}/>
//     </>
//   )
// }