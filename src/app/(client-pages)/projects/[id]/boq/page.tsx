"use client";

import { useEffect, useState } from "react";
import { useParams, useRouter } from "next/navigation";
import {
  Card,
  CardContent,
  CardDescription,
  CardHeader,
  CardTitle,
} from "@/components/ui/card";
import { Button } from "@/components/ui/button";
import { Badge } from "@/components/ui/badge";
import { ArrowLeft, Download, FileText, Calendar, Building, User } from "lucide-react";
import { toast } from "sonner";
import { getBOQ, BOQDetails } from "@/app/services/boqService";
import Image from "next/image";
import Head from "next/head";
import jsPDF from "jspdf";

export default function ViewBOQPage() {
  const params = useParams();
  const router = useRouter();
  const projectId = params.id as string;

  const [boq, setBoq] = useState<BOQDetails | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const loadBOQ = async () => {
      try {
        const authToken =
          typeof window !== "undefined"
            ? localStorage.getItem("authToken")
            : null;

        if (!authToken) {
          toast.error("Please log in to view BOQ");
          router.push("/projects");
          return;
        }

        const boqData = await getBOQ(projectId, authToken);
        setBoq(boqData);
      } catch (err: any) {
        console.error("Failed to load BOQ:", err);
        toast.error(err.message || "Failed to load BOQ");
        router.push(`/projects/${projectId}`);
      } finally {
        setLoading(false);
      }
    };

    if (projectId) {
      loadBOQ();
    }
  }, [projectId, router]);

  const formatCurrency = (amount: string, currency = "RWF") => {
    const numAmount = parseFloat(amount);
    return new Intl.NumberFormat("en-RW", {
      style: "currency",
      currency: currency,
      minimumFractionDigits: 0,
    }).format(numAmount);
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString("en-US", {
      year: "numeric",
      month: "long",
      day: "numeric",
    });
  };

  const getCategoryColor = (category: string) => {
    const colors: Record<string, string> = {
      construction: "bg-blue-100 text-blue-800",
      electrical: "bg-yellow-100 text-yellow-800",
      plumbing: "bg-green-100 text-green-800",
      finishing: "bg-purple-100 text-purple-800",
      fixtures: "bg-pink-100 text-pink-800",
      safety: "bg-red-100 text-red-800",
    };
    return colors[category] || "bg-gray-100 text-gray-800";
  };

  const generatePDF = async () => {
    if (!boq) return;

    try {
      toast.loading("Generating PDF...");
      const doc = new jsPDF();
      const pageWidth = doc.internal.pageSize.getWidth();
      const pageHeight = doc.internal.pageSize.getHeight();
      let yPosition = 20;
      const margin = 14;
      const maxWidth = pageWidth - 2 * margin;

      // Helper function to add a new page if needed
      const checkNewPage = (requiredSpace: number) => {
        if (yPosition + requiredSpace > pageHeight - 20) {
          doc.addPage();
          yPosition = 20;
          return true;
        }
        return false;
      };

      // Load and add company logo (big width)
      if (boq.companyLogoUrl) {
        try {
          // Fetch image as blob to handle CORS
          const response = await fetch(boq.companyLogoUrl);
          const blob = await response.blob();
          const imgUrl = URL.createObjectURL(blob);
          
          const img = document.createElement("img");
          img.crossOrigin = "anonymous";
          
          await new Promise((resolve, reject) => {
            img.onload = () => {
              // Make logo big in width - use 60% of page width
              const logoWidth = pageWidth * 0.6;
              const logoHeight = (img.height * logoWidth) / img.width;
              
              // Limit height to reasonable size but keep width prominent
              const maxLogoHeight = 50;
              const finalLogoHeight = Math.min(logoHeight, maxLogoHeight);
              const finalLogoWidth = (img.width * finalLogoHeight) / img.height;
              
              // Ensure minimum width for prominence
              const minLogoWidth = pageWidth * 0.4;
              const adjustedLogoWidth = Math.max(finalLogoWidth, minLogoWidth);
              const adjustedLogoHeight = (img.height * adjustedLogoWidth) / img.width;

              doc.addImage(
                imgUrl,
                "PNG",
                (pageWidth - adjustedLogoWidth) / 2, // Center horizontally
                yPosition,
                adjustedLogoWidth,
                adjustedLogoHeight
              );
              yPosition += adjustedLogoHeight + 15;
              URL.revokeObjectURL(imgUrl);
              resolve(null);
            };
            img.onerror = () => {
              URL.revokeObjectURL(imgUrl);
              reject(new Error("Failed to load image"));
            };
            img.src = imgUrl;
          });
        } catch (error) {
          console.error("Error loading logo:", error);
          // Continue without logo if it fails to load
        }
      }

      // Company Name (Large, Bold)
      doc.setFontSize(20);
      doc.setFont("helvetica", "bold");
      const companyNameLines = doc.splitTextToSize(boq.companyName, maxWidth);
      doc.text(companyNameLines, margin, yPosition);
      yPosition += companyNameLines.length * 8 + 5;

      // Title
      doc.setFontSize(16);
      doc.setFont("helvetica", "bold");
      doc.text("BILL OF QUANTITIES", margin, yPosition);
      yPosition += 10;

      // BOQ Information Section
      doc.setFontSize(11);
      doc.setFont("helvetica", "normal");
      
      const clientName = boq.finalProject?.owner
        ? `${boq.finalProject.owner.firstName || ""} ${boq.finalProject.owner.lastName || ""}`.trim() ||
          boq.finalProject.owner.email ||
          "N/A"
        : "N/A";

      doc.text(`Client: ${clientName}`, margin, yPosition);
      yPosition += 7;
      doc.text(`BOQ ID: ${boq.id}`, margin, yPosition);
      yPosition += 7;
      doc.text(`Project ID: ${boq.finalProjectId}`, margin, yPosition);
      yPosition += 7;
      doc.text(`Generated Date: ${formatDate(boq.createdAt)}`, margin, yPosition);
      yPosition += 10;

      // Group items by category
      const itemsByCategory = boq.items.reduce((acc, item) => {
        if (!acc[item.category]) {
          acc[item.category] = [];
        }
        acc[item.category].push(item);
        return acc;
      }, {} as Record<string, typeof boq.items>);

      // Add items by category
      Object.entries(itemsByCategory).forEach(([category, items]) => {
        checkNewPage(30);
        
        // Category Header
        doc.setFontSize(14);
        doc.setFont("helvetica", "bold");
        doc.setTextColor(0, 0, 0);
        doc.setFillColor(230, 230, 230);
        doc.rect(margin, yPosition - 5, maxWidth, 8, "F");
        doc.text(category.toUpperCase(), margin + 2, yPosition);
        yPosition += 10;

        // Table Header
        doc.setFontSize(9);
        doc.setFont("helvetica", "bold");
        doc.setFillColor(240, 240, 240);
        doc.rect(margin, yPosition - 5, maxWidth, 7, "F");
        
        // Adjusted column widths to fit page (total ~182 points)
        const colWidths = [70, 20, 18, 35, 40];
        const colPositions = [margin];
        for (let i = 1; i < colWidths.length; i++) {
          colPositions.push(colPositions[i - 1] + colWidths[i - 1]);
        }

        doc.text("Item Name", colPositions[0], yPosition);
        doc.text("Qty", colPositions[1], yPosition);
        doc.text("Unit", colPositions[2], yPosition);
        doc.text("Unit Rate", colPositions[3], yPosition);
        doc.text("Total", colPositions[4], yPosition);
        yPosition += 8;

        // Items
        doc.setFont("helvetica", "normal");
        items.forEach((item) => {
          checkNewPage(15);
          
          // Item name (may wrap)
          const itemNameLines = doc.splitTextToSize(item.itemName, colWidths[0] - 2);
          const itemHeight = Math.max(itemNameLines.length * 4, 6);
          
          doc.text(itemNameLines, colPositions[0] + 1, yPosition);
          doc.text(item.quantity, colPositions[1] + 1, yPosition);
          doc.text(item.unit, colPositions[2] + 1, yPosition);
          doc.text(formatCurrency(item.unitRate, boq.currency), colPositions[3] + 1, yPosition);
          doc.text(formatCurrency(item.totalAmount, boq.currency), colPositions[4] + 1, yPosition);
          
          yPosition += itemHeight + 2;
        });

        yPosition += 5; // Space between categories
      });

      // Total Summary
      checkNewPage(15);
      doc.setFontSize(14);
      doc.setFont("helvetica", "bold");
      doc.setFillColor(255, 243, 205); // Amber background
      doc.rect(margin, yPosition - 5, maxWidth, 10, "F");
      doc.setTextColor(0, 0, 0);
      doc.text(
        `GRAND TOTAL: ${formatCurrency(boq.totalAmount, boq.currency)}`,
        margin + 2,
        yPosition + 3
      );

      // Footer
      const totalPages = doc.getNumberOfPages();
      for (let i = 1; i <= totalPages; i++) {
        doc.setPage(i);
        doc.setFontSize(8);
        doc.setFont("helvetica", "normal");
        doc.setTextColor(128, 128, 128);
        doc.text(
          `Page ${i} of ${totalPages}`,
          pageWidth / 2,
          pageHeight - 10,
          { align: "center" }
        );
      }

      // Save PDF
      const fileName = `BOQ-${boq.finalProjectId}-${new Date().getTime()}.pdf`;
      doc.save(fileName);
      toast.dismiss(); // Dismiss loading toast
      toast.success("PDF downloaded successfully");
    } catch (error: any) {
      console.error("Error generating PDF:", error);
      toast.dismiss(); // Dismiss loading toast on error
      toast.error("Failed to generate PDF. Please try again.");
    }
  };

  if (loading) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="flex items-center justify-center min-h-[400px]">
            <div className="text-center">
              <div className="animate-spin rounded-full h-32 w-32 border-b-2 border-gray-900 mx-auto"></div>
              <p className="mt-4 text-gray-600">Loading BOQ details...</p>
            </div>
          </div>
        </div>
      </div>
    );
  }

  if (!boq) {
    return (
      <div className="min-h-screen bg-gray-50">
        <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
          <div className="text-center">
            <h1 className="text-2xl font-bold text-gray-900 mb-4">
              BOQ Not Found
            </h1>
            <p className="text-gray-600 mb-4">
              The BOQ you're looking for doesn't exist or has been removed.
            </p>
            <Button onClick={() => router.push(`/projects/${projectId}`)}>
              Back to Project
            </Button>
          </div>
        </div>
      </div>
    );
  }

  const clientName = boq.finalProject?.owner
    ? `${boq.finalProject.owner.firstName || ""} ${boq.finalProject.owner.lastName || ""}`.trim() ||
      boq.finalProject.owner.email ||
      "N/A"
    : "N/A";

  // Group items by category
  const itemsByCategory = boq.items.reduce((acc, item) => {
    if (!acc[item.category]) {
      acc[item.category] = [];
    }
    acc[item.category].push(item);
    return acc;
  }, {} as Record<string, typeof boq.items>);

  return (
    <div className="min-h-screen bg-gray-50">
      <Head>
        <title>View BOQ | Construct KVV</title>
        <meta
          name="description"
          content="View Bill of Quantities details for your construction project"
        />
      </Head>

      <div className="max-w-6xl mx-auto px-4 sm:px-6 lg:px-8 py-4 sm:py-6 lg:py-8">
        {/* Header */}
        <div className="mb-6 sm:mb-8">
          <Button
            variant="outline"
            onClick={() => router.push(`/projects/${projectId}`)}
            className="mb-4 text-sm sm:text-base"
          >
            <ArrowLeft className="h-4 w-4 mr-2" />
            Back to Project
          </Button>

          <div className="flex flex-col sm:flex-row sm:items-start sm:justify-between gap-4">
            <div className="flex-1">
              <h1 className="text-2xl sm:text-3xl font-bold text-gray-900 mb-2">
                Bill of Quantities
              </h1>
              <div className="flex flex-wrap items-center gap-2 sm:gap-3">
                <Badge className="bg-amber-100 text-amber-800 text-xs sm:text-sm">
                  BOQ #{boq.id.slice(-8)}
                </Badge>
                <span className="text-xs sm:text-sm text-gray-500">
                  Generated {formatDate(boq.createdAt)}
                </span>
              </div>
            </div>
            <div className="flex flex-wrap items-center gap-2">
              <Button
                variant="outline"
                className="border-amber-400 text-amber-700 hover:bg-amber-50 text-sm sm:text-base"
                onClick={generatePDF}
              >
                <Download className="h-4 w-4 mr-1 sm:mr-2" />
                <span className="hidden sm:inline">Download PDF</span>
                <span className="sm:hidden">PDF</span>
              </Button>
            </div>
          </div>
        </div>

        <div className="grid gap-4 sm:gap-6">
          {/* BOQ Header Info */}
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center gap-2">
                <FileText className="h-5 w-5" />
                BOQ Information
              </CardTitle>
            </CardHeader>
            <CardContent>
              <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                {/* Company Logo and Name */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  {boq.companyLogoUrl && (
                    <div className="relative w-16 h-16 rounded-lg overflow-hidden bg-white border border-gray-200">
                      <Image
                        src={boq.companyLogoUrl}
                        alt={boq.companyName}
                        fill
                        className="object-contain p-2"
                      />
                    </div>
                  )}
                  <div>
                    <p className="text-sm text-gray-600">Company</p>
                    <p className="font-semibold text-gray-900">
                      {boq.companyName}
                    </p>
                  </div>
                </div>

                {/* Client Name */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-blue-100 rounded-lg">
                    <User className="h-6 w-6 text-blue-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Client</p>
                    <p className="font-semibold text-gray-900">{clientName}</p>
                  </div>
                </div>

                {/* Date Generated */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-green-100 rounded-lg">
                    <Calendar className="h-6 w-6 text-green-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Generated On</p>
                    <p className="font-semibold text-gray-900">
                      {formatDate(boq.createdAt)}
                    </p>
                  </div>
                </div>

                {/* Total Amount */}
                <div className="flex items-center gap-4 p-4 bg-gray-50 rounded-lg">
                  <div className="p-2 bg-amber-100 rounded-lg">
                    <Building className="h-6 w-6 text-amber-600" />
                  </div>
                  <div>
                    <p className="text-sm text-gray-600">Total Amount</p>
                    <p className="font-semibold text-amber-600 text-lg">
                      {formatCurrency(boq.totalAmount, boq.currency)}
                    </p>
                  </div>
                </div>
              </div>
            </CardContent>
          </Card>

          {/* BOQ Items by Category */}
          {Object.entries(itemsByCategory).map(([category, items]) => (
            <Card key={category}>
              <CardHeader>
                <div className="flex items-center justify-between">
                  <CardTitle className="flex items-center gap-2 capitalize">
                    <FileText className="h-5 w-5" />
                    {category} Items
                  </CardTitle>
                  <Badge className={getCategoryColor(category)}>
                    {items.length} items
                  </Badge>
                </div>
              </CardHeader>
              <CardContent>
                <div className="overflow-x-auto">
                  <table className="w-full border-collapse">
                    <thead>
                      <tr className="bg-gray-100">
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                          Item Name
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-left text-sm font-semibold text-gray-700">
                          Description
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">
                          Quantity
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-center text-sm font-semibold text-gray-700">
                          Unit
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-700">
                          Unit Rate
                        </th>
                        <th className="border border-gray-300 px-4 py-2 text-right text-sm font-semibold text-gray-700">
                          Total Amount
                        </th>
                      </tr>
                    </thead>
                    <tbody>
                      {items.map((item) => (
                        <tr key={item.id} className="hover:bg-gray-50">
                          <td className="border border-gray-300 px-4 py-2 text-sm font-medium text-gray-900">
                            {item.itemName}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-sm text-gray-600">
                            {item.description}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-sm text-center text-gray-700">
                            {item.quantity}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-sm text-center text-gray-700">
                            {item.unit}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-sm text-right text-gray-700">
                            {formatCurrency(item.unitRate, boq.currency)}
                          </td>
                          <td className="border border-gray-300 px-4 py-2 text-sm text-right font-semibold text-gray-900">
                            {formatCurrency(item.totalAmount, boq.currency)}
                          </td>
                        </tr>
                      ))}
                    </tbody>
                  </table>
                </div>
              </CardContent>
            </Card>
          ))}

          {/* Total Summary */}
          <Card className="bg-amber-50 border-amber-200">
            <CardContent className="pt-6">
              <div className="flex justify-between items-center">
                <span className="text-lg font-semibold text-gray-900">
                  Grand Total
                </span>
                <span className="text-2xl font-bold text-amber-600">
                  {formatCurrency(boq.totalAmount, boq.currency)}
                </span>
              </div>
            </CardContent>
          </Card>

          {/* Connect with Professionals Section */}
          <Card className="bg-gradient-to-r from-amber-50 to-orange-50 border-amber-200">
            <CardContent className="pt-6 pb-6">
              <div className="text-center space-y-4">
                <p className="text-lg text-gray-700">
                  Let us connect you with experienced professionals who will help make your dream project a reality.
                </p>
                <Button
                  onClick={() => router.push(`/projects/${projectId}/professionals`)}
                  className="bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-600 hover:to-amber-700 text-white px-8 py-6 text-lg font-semibold"
                >
                  Continue to see those professionals
                </Button>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  );
}

