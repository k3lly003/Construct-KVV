"use client";

import { useState } from 'react';
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card';
import { Button } from '@/components/ui/button';
import { Label } from '@/components/ui/label';
import { FileUpload } from '@/components/file-upload';
import { useFloorplanProject } from '@/app/hooks/useFloorplanProject';
import { FloorplanProjectRequest } from '@/app/services/floorplanProjectService';
import { Upload, FileText, Building, Sparkles } from 'lucide-react';
import { toast } from 'sonner';

interface CreateFloorplanProjectFormProps {
  onSuccess?: (projectId: string) => void;
  onCancel?: () => void;
}

export default function CreateFloorplanProjectForm({ onSuccess, onCancel }: CreateFloorplanProjectFormProps) {
  const { createProject, loading, error } = useFloorplanProject();
  
  // Only file state needed
  const [selectedFile, setSelectedFile] = useState<File | null>(null);

  const handleFileChange = (files: File[]) => {
    if (files.length > 0) {
      setSelectedFile(files[0]);
    }
  };

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    
    if (!selectedFile) {
      toast.error('Please select a floorplan file');
      return;
    }

    try {
      const requestData: FloorplanProjectRequest = {
        file: selectedFile,
      };

      const result = await createProject(requestData);
      
      // Show success message with processing results
      toast.success('Project created successfully! 🎉', {
        description: `AI analyzed your floorplan and generated cost estimates. OCR extracted ${result.text.length} characters.`,
        duration: 5000,
      });
      
      onSuccess?.(result.finalProject.id);
    } catch (err) {
      console.error('Failed to create project:', err);
    }
  };

  const resetForm = () => {
    setSelectedFile(null);
  };

  return (
    <div className="max-w-4xl mx-auto space-y-6">
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center gap-2">
            <Building className="h-6 w-6" />
            Create New Construction Project
          </CardTitle>
          <CardDescription>
            Simply upload your architect's floorplan and our AI will automatically analyze it, extract details, generate cost estimates, and create a complete project ready for contractor bidding.
          </CardDescription>
        </CardHeader>
        <CardContent>
          <form onSubmit={handleSubmit} className="space-y-6">
            {/* File Upload Section */}
            <div className="space-y-4">
              <div className="flex items-center gap-2">
                <Upload className="h-5 w-5" />
                <Label className="text-base font-semibold">Upload Your Floorplan *</Label>
              </div>
              <FileUpload
                onFilesChange={handleFileChange}
                maxFiles={1}
                accept={{
                  "application/pdf": [".pdf"],
                  "image/jpeg": [".jpg", ".jpeg"],
                  "image/png": [".png"],
                  "image/webp": [".webp"]
                }}
                label=""
                description="Upload your architect's floorplan (PDF, JPG, PNG, WebP) - Max 10MB"
              />
              {selectedFile && (
                <div className="flex items-center gap-2 p-3 bg-green-50 border border-green-200 rounded-lg">
                  <FileText className="h-4 w-4 text-green-600" />
                  <span className="text-sm text-green-800">
                    Selected: {selectedFile.name} ({(selectedFile.size / 1024 / 1024).toFixed(2)} MB)
                  </span>
                </div>
              )}
            </div>

            {/* AI Processing Info */}
            <div className="bg-blue-50 border border-blue-200 rounded-lg p-4">
              <div className="flex items-start gap-3">
                <Sparkles className="h-5 w-5 text-blue-600 mt-0.5" />
                <div>
                  <h4 className="font-semibold text-blue-900 mb-1">AI Will Automatically:</h4>
                  <ul className="text-sm text-blue-800 space-y-1">
                    <li>• Extract text and details from your floorplan</li>
                    <li>• Analyze the architectural design</li>
                    <li>• Generate realistic cost estimates</li>
                    <li>• Create a complete project ready for bidding</li>
                  </ul>
                </div>
              </div>
            </div>


            {/* Error Display */}
            {error && (
              <div className="p-4 bg-red-50 border border-red-200 rounded-lg">
                <p className="text-sm text-red-800">{error}</p>
              </div>
            )}

            {/* Action Buttons */}
            <div className="flex gap-4 pt-4">
              <Button
                type="submit"
                disabled={loading || !selectedFile}
                className="flex-1"
              >
                {loading ? (
                  <>
                    <div className="animate-spin rounded-full h-4 w-4 border-b-2 border-white mr-2"></div>
                    AI Analyzing Floorplan...
                  </>
                ) : (
                  'Analyze & Create Project'
                )}
              </Button>
              
              <Button
                type="button"
                variant="outline"
                onClick={resetForm}
                disabled={loading}
              >
                Reset
              </Button>
              
              {onCancel && (
                <Button
                  type="button"
                  variant="outline"
                  onClick={onCancel}
                  disabled={loading}
                >
                  Cancel
                </Button>
              )}
            </div>
          </form>
        </CardContent>
      </Card>
    </div>
  );
}
