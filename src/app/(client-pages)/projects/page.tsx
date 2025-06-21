// "use client"

// import React from 'react'
// import DefaultPageBanner from '@/app/(components)/DefaultPageBanner'
// import { useProjects } from '@/app/hooks/useProjects'

// const page = () => {
//   const {  projects, isLoading, error } = useProjects(); 
//   console.log(projects);
//   return (
//     <>
//       <DefaultPageBanner title='Projects' backgroundImage='/store-img.jpg' />
//       {projects.map((project) => (
//         <div key={project.id}>
//           <h1>{project.name}</h1>
//           <p>{project.description}</p>
//           <p>{project.estimatedCost}</p>
//           <p>{project.rooms}</p>
//           <p>{project.bathrooms}</p>
//           <p>{project.kitchens}</p>
//           <p>{project.conversationRooms}</p>
//           <p>{project.extras}</p>
//         </div>
//       ))}
//     </>
//   )
// }

// export default page