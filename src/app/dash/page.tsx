import { StatCard } from "./(components)/overview/stat-card";
import { TopProducts } from "./(components)/overview/top-products";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="px-2">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold">Welcome Back, Seller !</h1>
          <p className="text-gray-500">
            Here is what happening with your store today
          </p>
        </div>
        {/* Stats Grid */}
        <div className="grid grid-cols-1 md:grid-cols-3 gap-6 mb-8">
          <StatCard
            title="Total Customer"
            value="307.48K"
            change={30}
            trend="up"
          />
          <StatCard
            title="Total Revenue"
            value="$30.58K"
            change={-15}
            trend="down"
          />
          <StatCard title="Total Deals" value="2.48K" change={23} trend="up" />
        </div>

        {/* Main Content Grid */}
            <TopProducts />
      </div>
    </div>
  );
}
