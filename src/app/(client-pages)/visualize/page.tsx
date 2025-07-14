"use client";
import React, { useRef, useState } from "react";
import Image from "next/image";
import Tesseract from "tesseract.js";
import * as pdfjsLib from "pdfjs-dist";
import "pdfjs-dist/build/pdf.worker";
import { useTranslations } from "@/app/hooks/useTranslations";
import { dashboardFakes } from "@/app/utils/fakes/DashboardFakes";

pdfjsLib.GlobalWorkerOptions.workerSrc = `//cdnjs.cloudflare.com/ajax/libs/pdf.js/${pdfjsLib.version}/pdf.worker.min.js`;

export default function VisualizePage() {
  const { t } = useTranslations();
  const [description, setDescription] = useState("");
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reply, setReply] = useState<string | null>(null);
  const [imageUrl, setImageUrl] = useState<string | null>(null);
  const [visualizeLoading, setVisualizeLoading] = useState(false);
  const fileInputRef = useRef<HTMLInputElement>(null);

  React.useEffect(() => {
    console.log("=== API KEYS CHECK ===");
    console.log(
      "COHERE_API_KEY:",
      process.env.NEXT_PUBLIC_COHERE_API_KEY ? "✅ Present" : "❌ Missing"
    );
    console.log(
      "HF_TOKEN:",
      process.env.NEXT_PUBLIC_HF_TOKEN ? "✅ Present" : "❌ Missing"
    );
    console.log(
      "COHERE_API_KEY value:",
      process.env.NEXT_PUBLIC_COHERE_API_KEY
    );
    console.log("HF_TOKEN value:", process.env.NEXT_PUBLIC_HF_TOKEN);
    console.log("======================");
  }, []);

  const extractTextFromImage = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const {
        data: { text },
      } = await Tesseract.recognize(file, "eng", {
        logger: (m) => {
          console.log("[Tesseract Progress]", m);
        },
      });
      setDescription(text);
    } catch (err) {
      setError("Failed to extract text from image.");
    } finally {
      setLoading(false);
    }
  };

  const extractTextFromPDF = async (file: File) => {
    setLoading(true);
    setError(null);
    try {
      const arrayBuffer = await file.arrayBuffer();
      const pdf = await pdfjsLib.getDocument({ data: arrayBuffer }).promise;
      const page = await pdf.getPage(1);
      const viewport = page.getViewport({ scale: 2 });
      const canvas = document.createElement("canvas");
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas context not found");

      canvas.width = viewport.width;
      canvas.height = viewport.height;

      await page.render({ canvasContext: context, viewport }).promise;

      const blob = await new Promise<Blob | null>((resolve) =>
        canvas.toBlob(resolve, "image/png")
      );

      if (!blob) throw new Error("PDF rendering failed");

      const imageFile = new File([blob], "page.png", { type: "image/png" });

      await extractTextFromImage(imageFile);
    } catch (err) {
      setError("Failed to extract text from PDF.");
    } finally {
      setLoading(false);
    }
  };

  const handleFileChange = async (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (!file) return;

    if (file.type.startsWith("image/")) {
      await extractTextFromImage(file);
    } else if (file.type === "application/pdf") {
      await extractTextFromPDF(file);
    } else {
      setError("Please upload a PDF or image file.");
    }
  };

  const handleVisualize = async (e: React.FormEvent) => {
    e.preventDefault();

    if (description.trim().length < 250) {
      setError("Description must be at least 250 characters.");
      return;
    }

    setReply(null);
    setImageUrl(null);
    setVisualizeLoading(true);
    setError(null);

    try {
      // Cohere API Call
      const coherePayload = {
        text: description,
        length: "medium",
        format: "paragraph",
        model: "summarize-xlarge",
      };

      const cohereResponse = await fetch("https://api.cohere.ai/v1/summarize", {
        method: "POST",
        headers: {
          Authorization: `Bearer ${process.env.NEXT_PUBLIC_COHERE_API_KEY}`,
          "Content-Type": "application/json",
        },
        body: JSON.stringify(coherePayload),
      });

      if (!cohereResponse.ok) {
        const errorText = await cohereResponse.text();
        throw new Error(
          `Cohere API error: ${cohereResponse.status} - ${errorText}`
        );
      }

      const cohereData = await cohereResponse.json();
      const summary = cohereData.summary || "No summary returned from Cohere.";
      setReply(summary);

      // Hugging Face API Call
      const hfPayload = { inputs: description };

      const hfResponse = await fetch(
        "https://api-inference.huggingface.co/models/prompthero/openjourney",
        {
          method: "POST",
          headers: {
            Authorization: `Bearer ${process.env.NEXT_PUBLIC_HF_TOKEN}`,
            "Content-Type": "application/json",
          },
          body: JSON.stringify(hfPayload),
        }
      );

      if (!hfResponse.ok) {
        const errorText = await hfResponse.text();
        throw new Error(
          `HuggingFace API error: ${hfResponse.status} - ${errorText}`
        );
      }

      const imageBlob = await hfResponse.blob();
      const imageObjectURL = URL.createObjectURL(imageBlob);
      setImageUrl(imageObjectURL);
    } catch (err) {
      setError(
        `Failed to generate summary or image: ${
          err instanceof Error ? err.message : "Unknown error"
        }`
      );
    } finally {
      setVisualizeLoading(false);
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
        onSubmit={handleVisualize}
      >
        <label
          htmlFor="description"
          className="text-lg font-semibold text-amber-800"
        >
          {t(dashboardFakes.VisualizePage.describeLabel)}
        </label>
        <textarea
          id="description"
          rows={4}
          className="w-full rounded-lg border border-amber-200 p-4 text-base focus:outline-none focus:ring-2 focus:ring-amber-400 resize-none"
          placeholder={t(dashboardFakes.VisualizePage.describePlaceholder)}
          value={description}
          onChange={(e) => setDescription(e.target.value)}
        />
        <p className="text-sm mt-1 text-red-600">
          {description.trim().length < 250
            ? t(dashboardFakes.VisualizePage.descriptionLength, {
                count: description.trim().length,
              })
            : t(dashboardFakes.VisualizePage.descriptionSufficient)}
        </p>
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
            disabled={loading || visualizeLoading}
          />
        </div>
        {loading && (
          <div className="text-amber-600 font-semibold">
            {t(dashboardFakes.VisualizePage.extractingText)}
          </div>
        )}
        {error && <div className="text-red-500 font-medium">{error}</div>}
        <button
          type="submit"
          className="mt-2 px-8 py-3 bg-amber-500 hover:bg-amber-600 text-white text-lg font-semibold rounded-full shadow transition-all flex items-center gap-2 disabled:opacity-50 disabled:cursor-not-allowed"
          disabled={
            visualizeLoading || loading || description.trim().length < 250
          }
        >
          {visualizeLoading ? (
            <span className="flex items-center gap-2">
              <svg
                className="animate-spin h-5 w-5 text-white"
                xmlns="http://www.w3.org/2000/svg"
                fill="none"
                viewBox="0 0 24 24"
              >
                <circle
                  className="opacity-25"
                  cx="12"
                  cy="12"
                  r="10"
                  stroke="currentColor"
                  strokeWidth="4"
                ></circle>
                <path
                  className="opacity-75"
                  fill="currentColor"
                  d="M4 12a8 8 0 018-8v8z"
                ></path>
              </svg>
              {t(dashboardFakes.VisualizePage.processing)}
            </span>
          ) : (
            <>{t(dashboardFakes.VisualizePage.visualizeButton)}</>
          )}
        </button>
      </form>
      {reply && (
        <div className="w-full max-w-lg mx-auto mt-8 bg-white/90 rounded-xl shadow-lg p-6 text-center">
          <h2 className="text-xl font-bold text-amber-800 mb-2">
            {t(dashboardFakes.VisualizePage.summaryTitle)}
          </h2>
          <div className="text-sm text-gray-800 whitespace-pre-wrap text-left bg-gray-50 p-4 rounded-lg">
            {reply}
          </div>
        </div>
      )}
      {imageUrl && (
        <div className="w-full max-w-lg mx-auto mt-6">
          <h2 className="text-xl font-bold text-amber-800 text-center mb-2">
            {t(dashboardFakes.VisualizePage.generatedImageTitle)}
          </h2>
          <div className="relative">
            <img
              src={imageUrl}
              alt="Generated visualization"
              className="rounded-xl shadow-lg mx-auto max-w-full h-auto"
              onLoad={() => console.log("✅ Image loaded successfully")}
              onError={() => console.error("❌ Image failed to load")}
            />
          </div>
        </div>
      )}
    </div>
  );
}