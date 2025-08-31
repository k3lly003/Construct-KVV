import { Card } from "@/components/ui/card";
import { ArrowUpIcon, ArrowDownIcon } from "lucide-react";

interface StatCardProps {
  title: string;
  value: string;
  change: number;
  trend: "up" | "down";
}

export function StatCard({ title, value, change, trend }: StatCardProps) {
  return (
    <Card className="p-6">
      <div className="flex flex-col">
        <span className="text-sm text-gray-500">{title}</span>
        <div className="flex items-baseline mt-2">
          <span className="text-2xl font-semibold">{value}</span>
          <div className={`ml-2 flex items-center ${trend === 'up' ? 'text-green-500' : 'text-red-500'}`}>
            {trend === 'up' ? (
              <ArrowUpIcon className="w-4 h-4" />
            ) : (
              <ArrowDownIcon className="w-4 h-4" />
            )}
            <span className="text-sm ml-1">{Math.abs(change)}%</span>
          </div>
        </div>
        <span className="text-xs text-gray-500 mt-1">This month</span>
      </div>
    </Card>
  );
}