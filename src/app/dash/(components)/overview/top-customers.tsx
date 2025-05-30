import { Card } from "@/components/ui/card";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";

const customers = [
  { name: 'Robert Lewis', purchases: '40 Purchases', amount: '$4.19K', image: 'https://i.pravatar.cc/150?u=1' },
  { name: 'Tom Barrett', purchases: '21 Purchases', amount: '$3.56K', image: 'https://i.pravatar.cc/150?u=2' },
  { name: 'Jensen Doyle', purchases: '17 Purchases', amount: '$3.12K', image: 'https://i.pravatar.cc/150?u=3' },
  { name: 'Donald Cortez', purchases: '13 Purchases', amount: '$2.14K', image: 'https://i.pravatar.cc/150?u=4' },
];

export function TopCustomers() {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Top Customers</h2>
        <button className="text-sm text-blue-600">See all</button>
      </div>
      <div className="space-y-4">
        {customers.map((customer) => (
          <div key={customer.name} className="flex items-center justify-between">
            <div className="flex items-center gap-3">
              <Avatar>
                <AvatarImage src={customer.image} />
                <AvatarFallback>{customer.name[0]}</AvatarFallback>
              </Avatar>
              <div>
                <p className="font-medium">{customer.name}</p>
                <p className="text-sm text-gray-500">{customer.purchases}</p>
              </div>
            </div>
            <span className="font-medium">{customer.amount}</span>
          </div>
        ))}
      </div>
    </Card>
  );
}