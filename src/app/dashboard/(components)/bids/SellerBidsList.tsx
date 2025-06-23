// "use client";

// import React from 'react';
// import { useBids } from '@/app/hooks/useBids';
// import { Bid } from '@/types/bid';
// import { Card, CardContent, CardHeader, CardTitle, CardDescription } from '@/components/ui/card';
// import { Badge } from '@/components/ui/badge';
// import { useRouter } from 'next/navigation';

// const SellerBidCard = ({ bid }: { bid: Bid }) => {
//   const router = useRouter();

//   const getStatusVariant = (status: Bid['status']) => {
//     switch (status) {
//       case 'ACCEPTED':
//         return 'success';
//       case 'REJECTED':
//         return 'destructive';
//       case 'PENDING':
//       default:
//         return 'default';
//     }
//   };

//   return (
//     <Card className="cursor-pointer hover:shadow-lg transition-shadow" onClick={() => router.push(`/store/${bid.finalProjectId}`)}>
//       <CardHeader>
//         <div className="flex justify-between items-start">
//             <div>
//                 <CardTitle>Bid on Project</CardTitle>
//                 <CardDescription>Project ID: {bid.finalProjectId}</CardDescription>
//             </div>
//             <Badge variant={getStatusVariant(bid.status)}>{bid.status}</Badge>
//         </div>
//       </CardHeader>
//       <CardContent>
//         <p className="text-2xl font-bold">${bid.amount.toLocaleString()}</p>
//         <p className="text-sm text-gray-600 mt-2">{bid.message}</p>
//       </CardContent>
//     </Card>
//   );
// };

// export const SellerBidsList = () => {
//   const { useSellerBids } = useBids();
//   const { data: bids, isLoading, error } = useSellerBids();

//   if (isLoading) return <div>Loading your bids...</div>;
//   if (error) return <div>Error loading bids: {error.message}</div>;

//   return (
//     <div className="space-y-4">
//       {bids && bids.length > 0 ? (
//         bids.map((bid) => <SellerBidCard key={bid.id} bid={bid} />)
//       ) : (
//         <p>You have not placed any bids yet.</p>
//       )}
//     </div>
//   );
// }; 