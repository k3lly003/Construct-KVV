import { Card } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

const countries = [
  { name: 'Australia', flag: '🇦🇺', value: '712K', trend: 'up' },
  { name: 'Belgium', flag: '🇧🇪', value: '415K', trend: 'down' },
  { name: 'Canada', flag: '🇨🇦', value: '645K', trend: 'up' },
  { name: 'Costa Rica', flag: '🇨🇷', value: '385K', trend: 'down' },
  { name: 'Austria', flag: '🇦🇹', value: '698K', trend: 'up' },
];

export function TopCountries() {
  return (
    <Card className="p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-lg font-semibold">Top Countries by Sells</h2>
        <span className="text-sm text-gray-500">Since last week</span>
      </div>
      <div className="space-y-4">
        {countries.map((country) => (
          <div key={country.name} className="flex items-center justify-between">
            <div className="flex items-center gap-2">
              <span className="text-2xl">{country.flag}</span>
              <span>{country.name}</span>
            </div>
            <div className="flex items-center gap-2">
              <span>{country.value}</span>
              {country.trend === 'up' ? (
                <ArrowUpIcon className="w-4 h-4 text-green-500" />
              ) : (
                <ArrowDownIcon className="w-4 h-4 text-red-500" />
              )}
            </div>
          </div>
        ))}
      </div>
    </Card>
  );
}