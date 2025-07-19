import Image from "next/image";
import React from "react";

type ProductImageUploadProps = {
  images: { url: string; alt: string; isDefault: boolean; fileKey?: string; file?: File }[];
  onAddImages: (files: FileList) => void;
  onRemoveImage: (index: number) => void;
};

const ProductImageUpload: React.FC<ProductImageUploadProps> = ({
  images,
  onAddImages,
  onRemoveImage,
}) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2 flex items-center gap-2">
        Product Image
        <span className="text-gray-400 cursor-pointer" title="Upload product images">
          ⓘ
        </span>
      </h3>
      <div className="flex gap-2">
        {/* Upload box */}
        <div
          className="w-24 h-24 border-2 border-dashed border-teal-300 rounded flex flex-col items-center justify-center cursor-pointer hover:bg-teal-50 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          <span className="text-2xl text-teal-400">📷</span>
          <span className="text-xs text-teal-500 mt-1">Click to Upload</span>
          <input
            type="file"
            accept="image/*"
            multiple
            ref={fileInputRef}
            className="hidden"
            onChange={e => {
              if (e.target.files) {
                console.log('=== PRODUCT IMAGE UPLOAD DEBUG ===');
                console.log('Files selected:', e.target.files);
                console.log('Number of files:', e.target.files.length);
                Array.from(e.target.files).forEach((file, index) => {
                  console.log(`File ${index}:`, file.name, file.size, file.type);
                });
                onAddImages(e.target.files);
              }
            }}
          />
        </div>
        {/* Image previews */}
        {images.map((img, idx) => (
          <div key={idx} className="relative group w-24 h-24 rounded overflow-hidden">
            {img.url
              ? (
                <Image
                  src={img.url}
                  width={34}
                  height={34}
                  alt={img.alt}
                  className="object-cover w-full h-full"
                />
              )
              : (
                <div className="w-full h-full bg-gray-100 flex items-center justify-center text-gray-400">
                  No Image
                </div>
              )
            }
            <button
              type="button"
              className="absolute inset-0 bg-black/40 flex items-center justify-center opacity-0 group-hover:opacity-100 transition"
              onClick={() => onRemoveImage(idx)}
            >
              <span className="bg-white text-red-600 px-3 py-1 rounded shadow font-semibold">
                Remove
              </span>
            </button>
          </div>
        ))}
      </div>
    </div>
  );
};

export default ProductImageUpload; 