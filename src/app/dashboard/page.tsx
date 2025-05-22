import { StatCard } from "./(components)/overview/stat-card";
import { TopCountries } from "./(components)/overview/top-countries";
import { TopCustomers } from "./(components)/overview/top-customers";
import { TopProducts } from "./(components)/overview/top-products";

export default function Home() {
  return (
    <div className="min-h-screen">
      <div className="px-2">
        {/* Header */}
        <div className="mb-10">
          <h1 className="text-2xl font-semibold">Welcome Back, Special!</h1>
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
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Left Column */}
          <div className="lg:col-span-2 space-y-8">
            <TopProducts />
          </div>

          {/* Right Column */}
          <div className="space-y-8">
            <TopCustomers />
            <TopCountries />
          </div>
        </div>
      </div>
    </div>
  );
}
