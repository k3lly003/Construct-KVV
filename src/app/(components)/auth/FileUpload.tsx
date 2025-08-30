import React, { useRef, useState } from 'react';
import { Upload, File, X, CheckCircle } from 'lucide-react';

interface FileUploadProps {
  files: File[];
  onChange: (files: File[]) => void;
}

export const FileUpload: React.FC<FileUploadProps> = ({ files, onChange }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [dragActive, setDragActive] = useState(false);

  const handleDrag = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    if (e.type === 'dragenter' || e.type === 'dragover') {
      setDragActive(true);
    } else if (e.type === 'dragleave') {
      setDragActive(false);
    }
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    e.stopPropagation();
    setDragActive(false);

    if (e.dataTransfer.files && e.dataTransfer.files[0]) {
      const newFiles = Array.from(e.dataTransfer.files);
      onChange([...files, ...newFiles]);
    }
  };

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files && e.target.files[0]) {
      const newFiles = Array.from(e.target.files);
      onChange([...files, ...newFiles]);
    }
  };

  const removeFile = (index: number) => {
    const newFiles = files.filter((_, i) => i !== index);
    onChange(newFiles);
  };

  return (
    <div className="space-y-6">
      <div className="mb-6">
        <h3 className="text-lg font-semibold text-slate-800 mb-2">Upload Documents</h3>
        <p className="text-slate-600">Upload your certificates, ID, and other relevant documents</p>
      </div>

      <div
        className={`relative border-2 border-dashed rounded-xl p-8 text-center transition-all duration-300 cursor-pointer hover:bg-slate-50 ${
          dragActive 
            ? 'border-emerald-500 bg-emerald-50' 
            : 'border-slate-300 bg-white hover:border-slate-400'
        }`}
        onDragEnter={handleDrag}
        onDragLeave={handleDrag}
        onDragOver={handleDrag}
        onDrop={handleDrop}
        onClick={() => fileInputRef.current?.click()}
      >
        <div className="space-y-4">
          <div className={`mx-auto w-12 h-12 rounded-full flex items-center justify-center transition-colors duration-300 ${
            dragActive ? 'bg-emerald-100' : 'bg-slate-100'
          }`}>
            <Upload className={`w-6 h-6 transition-colors duration-300 ${
              dragActive ? 'text-emerald-600' : 'text-slate-500'
            }`} />
          </div>
          <div>
            <p className="text-lg font-semibold text-slate-800">
              Drag & drop files here
            </p>
            <p className="text-sm text-slate-600 mt-1">
              or <span className="text-emerald-600 font-medium">browse files</span>
            </p>
            <p className="text-xs text-slate-500 mt-2">
              Supports PDF, DOC, DOCX, JPG, PNG (Max 10MB each)
            </p>
          </div>
        </div>

        <input
          ref={fileInputRef}
          type="file"
          multiple
          accept=".pdf,.doc,.docx,.jpg,.jpeg,.png"
          onChange={handleFileChange}
          className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
        />
      </div>

      {files.length > 0 && (
        <div className="space-y-3">
          <h4 className="text-sm font-semibold text-slate-700">
            Uploaded Files ({files.length})
          </h4>
          {files.map((file, index) => (
            <div
              key={index}
              className="flex items-center justify-between p-4 bg-slate-50 rounded-xl border border-slate-200 hover:border-slate-300 transition-colors duration-200"
            >
              <div className="flex items-center space-x-3">
                <div className="w-10 h-10 rounded-lg bg-emerald-100 flex items-center justify-center">
                  <File className="w-5 h-5 text-emerald-600" />
                </div>
                <div>
                  <p className="text-sm font-semibold text-slate-800 truncate max-w-xs">
                    {file.name}
                  </p>
                  <p className="text-xs text-slate-500">
                    {(file.size / 1024 / 1024).toFixed(2)} MB
                  </p>
                </div>
              </div>
              <div className="flex items-center space-x-2">
                <CheckCircle className="w-5 h-5 text-emerald-600" />
                <button
                  onClick={(e) => {
                    e.stopPropagation();
                    removeFile(index);
                  }}
                  className="w-6 h-6 rounded-full bg-red-100 flex items-center justify-center hover:bg-red-200 transition-colors duration-200"
                >
                  <X className="w-4 h-4 text-red-600" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  );
};