"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import { useTranslations } from "@/app/hooks/useTranslations";
import { dashboardFakes } from "@/app/utils/fakes/DashboardFakes";

export default function VisualizePage() {
  const { t } = useTranslations();
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [ocrText, setOcrText] = useState<string | null>(null);
  const [summary, setSummary] = useState<string | null>(null);
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;
    setError(null);
    setOcrText(null);
    setSummary(null);
    setLoading(true);
    try {
      const formData = new FormData();
      formData.append("file", file);
      const response = await fetch(
        "https://construct-kvv-bn-fork.onrender.com/api/v1/floorplan/ocr",
        {
          method: "POST",
          body: formData,
        }
      );
      if (!response.ok) {
        const errorText = await response.text();
        throw new Error(`OCR API error: ${response.status} - ${errorText}`);
      }
      const data = await response.json();
      setOcrText(data.text || "");
      setSummary(data.summary || "");
    } catch (err) {
      setError(
        `Failed to process file: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="relative min-h-screen flex flex-col items-center justify-center bg-gray-50">
      <div className="absolute inset-0 -z-10">
        <Image
          src="/create-house.jpg"
          alt="Visualize background"
          fill
          className="object-cover opacity-30"
          priority
        />
        <div className="absolute inset-0 bg-gradient-to-b from-white/80 to-amber-100/80" />
      </div>
      <h1 className="text-4xl md:text-5xl font-bold text-amber-900 mb-8 mt-24 text-center drop-shadow-lg">
        {t(dashboardFakes.VisualizePage.title)}
      </h1>
      <form
        className="w-full max-w-lg mx-auto flex flex-col items-center gap-6 bg-white/80 rounded-xl shadow-lg p-8"
        onSubmit={(e) => e.preventDefault()}
      >
        <div className="flex flex-col items-center gap-2 w-full">
          <label className="font-medium text-amber-700">
            {t(dashboardFakes.VisualizePage.uploadLabel)}
          </label>
          <input
            ref={fileInputRef}
            type="file"
            accept="image/*,application/pdf"
            className="block w-full text-sm text-gray-500 file:mr-4 file:py-2 file:px-4 file:rounded-full file:border-0 file:text-sm file:font-semibold file:bg-amber-50 file:text-amber-700 hover:file:bg-amber-100"
            onChange={handleFileChange}
            disabled={loading}
          />
        </div>
        {loading && (
          <div className="text-amber-600 font-semibold">
            {t(dashboardFakes.VisualizePage.processing)}
          </div>
        )}
        {error && <div className="text-red-500 font-medium">{error}</div>}
      </form>
      
      {summary && (
        <div className="w-full max-w-lg mx-auto mt-6 bg-white/90 rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-xl font-bold text-amber-800 mb-2">
            {t(dashboardFakes.VisualizePage.summaryTitle) || "Summary"}
          </h2>
          <div className="text-sm text-gray-800 whitespace-pre-wrap text-left bg-gray-50 p-4 rounded-lg">
            {summary}
          </div>
        </div>
      )}
    </div>
  );
}
