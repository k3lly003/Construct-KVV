"use client";

import { useEffect, useState } from "react";
import DefaultPageBanner from "@/app/(components)/DefaultPageBanner";
import { useTranslations } from "@/app/hooks/useTranslations";
import { useParams } from "next/navigation";
import { Portfolio } from "@/app/services/porfolioService";
import { usePortfolio } from "@/app/hooks/usePortfolio";
import { Badge } from "@/components/ui/badge";
import { Calendar, Clock, DollarSign, MapPin, Users } from "lucide-react";

export default function PortfolioDetailsPage() {
  const { t } = useTranslations();
  const params = useParams();
  const portfolioId = String(params?.id ?? "");
  const { getById, loading } = usePortfolio();
  const [item, setItem] = useState<Portfolio | null>(null);

  useEffect(() => {
    if (!portfolioId) return;
    getById(portfolioId).then(setItem).catch(() => setItem(null));
  }, [getById, portfolioId]);

  return (
    <div className="min-h-screen bg-gray-50">
      <DefaultPageBanner title={t("", "Portfolio Details")} backgroundImage="/store-img.jpg" />
      <div className="max-w-7xl mx-auto px-4 py-8">
        {!item ? (
          <div className="flex items-center justify-center min-h-[300px] text-amber-800">
            {loading ? "Loading portfolio..." : "Portfolio not found"}
          </div>
        ) : (
          <div className="space-y-6">
            <div className="flex items-center justify-between">
              <h1 className="text-2xl font-semibold">{item.title}</h1>
              <Badge className={item.isPublic ? "bg-green-100 text-green-800" : "bg-red-100 text-red-700"}>
                {item.isPublic ? "Visible" : "Invisible"}
              </Badge>
            </div>
            {item.images && item.images.length > 0 && (
              <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-4 gap-3">
                {item.images.map((src, idx) => (
                  <img key={idx} src={src} alt={`image-${idx}`} className="h-40 w-full object-cover rounded" />
                ))}
              </div>
            )}
            <p className="text-gray-700 whitespace-pre-line">{item.description}</p>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <MapPin className="h-4 w-4" />
                <span>{item.location || "—"}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <Calendar className="h-4 w-4" />
                <span>{item.workDate || "—"}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <DollarSign className="h-4 w-4" />
                <span>{item.budget || "—"}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <Clock className="h-4 w-4" />
                <span>{item.duration || "—"}</span>
              </div>
              <div className="flex items-center space-x-2 text-sm text-gray-700">
                <Users className="h-4 w-4" />
                <span>{(item.images?.length ?? 0)} Photos</span>
              </div>
            </div>
            {item.skills && item.skills.length > 0 && (
              <div>
                <div className="text-sm font-medium mb-2">Skills</div>
                <div className="flex flex-wrap gap-2">
                  {item.skills.map((s, i) => (
                    <span key={i} className="text-xs px-2 py-1 rounded bg-gray-100 text-gray-700">{s}</span>
                  ))}
                </div>
              </div>
            )}
          </div>
        )}
      </div>
    </div>
  );
}




