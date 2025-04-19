// "use client"

// import { testimonials } from '@/app/utils/fakes/AboutFakes';
// import React from 'react';
// import { AuthorInfo, AuthorName, Avatar, Pagination, PaginationDot, Quote, Rating, Section, SectionTitle, ServiceCard, ServiceImage, ServiceOverlay, ServicesContainer, StoryContainer, StoryImage, StoryText, TestimonialCard, TestimonialsContainer, VisionMissionContainer, VmBox, VmItem, VmList, VmTitle } from '../../../../public/styled-components/about';


// const pipesImageUrl = 'https://via.placeholder.com/600/cccccc/808080?Text=Pipes';
// const buyImageUrl = 'https://via.placeholder.com/300/cceeff/000000?Text=Buy';
// const sellImageUrl = 'https://via.placeholder.com/300/ffddaa/000000?Text=Sell';
// const employmentImageUrl = 'https://via.placeholder.com/300/ddeeff/000000?Text=Employment';
// const connectImageUrl = 'https://via.placeholder.com/300/eeddff/000000?Text=Connect';
// const avatarPlaceholder = 'https://via.placeholder.com/50/aaaaaa/ffffff?Text=User';

// const App: React.FC = () => {

//   return (
//     <>
//       <Section>
//         <SectionTitle>Our Story</SectionTitle>
//         <StoryContainer>
//           <StoryImage src={pipesImageUrl} alt="Pipes" />
//           <StoryText>
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Integer posuere erat a ante venenatis dapibus posuere velit aliquet. Maecenas faucibus mollis interdum. Cras mattis consectetur purus sit amet fermentum.
//             <br /><br />
//             Lorem ipsum dolor sit amet, consectetur adipiscing elit. Sed posuere consectetur est at lobortis. Donec id elit non mi porta gravida at eget metus. Aenean eu leo quam. Pellentesque ornare sem lacinia quam venenatis vestibulum.
//           </StoryText>
//         </StoryContainer>
//       </Section>

//       <Section>
//         <VisionMissionContainer>
//           <VmBox>
//             <VmTitle>Our Vision</VmTitle>
//             <VmList>
//               <VmItem>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</VmItem>
//               <VmItem>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</VmItem>
//             </VmList>
//           </VmBox>
//           <VmBox>
//             <VmTitle>Our Mission</VmTitle>
//             <VmList>
//               <VmItem>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</VmItem>
//               <VmItem>Lorem ipsum dolor sit amet, consectetur adipiscing elit.</VmItem>
//             </VmList>
//           </VmBox>
//         </VisionMissionContainer>
//       </Section>

//       <Section>
//         <SectionTitle>Services</SectionTitle>
//         <ServicesContainer>
//           <ServiceCard>
//             <ServiceImage src={buyImageUrl} alt="Buy" />
//             <ServiceOverlay>Buy</ServiceOverlay>
//           </ServiceCard>
//           <ServiceCard>
//             <ServiceImage src={sellImageUrl} alt="Sell" />
//             <ServiceOverlay>Sell</ServiceOverlay>
//           </ServiceCard>
//           <ServiceCard>
//             <ServiceImage src={employmentImageUrl} alt="Employment" />
//             <ServiceOverlay>Employment</ServiceOverlay>
//           </ServiceCard>
//           <ServiceCard>
//             <ServiceImage src={connectImageUrl} alt="Connect" />
//             <ServiceOverlay>Connect</ServiceOverlay>
//           </ServiceCard>
//         </ServicesContainer>
//       </Section>

//       <Section>
//         <SectionTitle>What our customers say !</SectionTitle>
//         <TestimonialsContainer>
//           {testimonials.map((testimonial, index) => (
//             <TestimonialCard key={index}>
//               <Rating>{testimonial.rating.toFixed(1)} ⭐</Rating>
//               <Quote>{testimonial.quote}</Quote>
//               <AuthorInfo>
//                 <Avatar src={avatarPlaceholder} alt={testimonial.author} />
//                 <AuthorName>{testimonial.author}</AuthorName>
//               </AuthorInfo>
//             </TestimonialCard>
//           ))}
//         </TestimonialsContainer>
//         <Pagination>
//           <PaginationDot className="active" />
//           <PaginationDot />
//           <PaginationDot />
//         </Pagination>
//       </Section>
//     </>
//   );
// };

// export default App;