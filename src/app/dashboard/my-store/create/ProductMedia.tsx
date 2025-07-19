import Image from "next/image";
import React from "react";

type ProductMediaProps = {
  images: { url: string; alt?: string }[];
  onAddImages: (files: FileList) => void;
};

const ProductMedia: React.FC<ProductMediaProps> = ({ images, onAddImages }) => {
  const fileInputRef = React.useRef<HTMLInputElement>(null);

  return (
    <div className="mb-6">
      <h3 className="font-semibold mb-2">Product Media</h3>
      <div className="border-2 border-dashed border-gray-300 rounded-lg p-4 flex flex-col gap-2">
        <div className="flex gap-2 mb-2">
          {images.map((img, idx) => (
            <Image
              key={idx}
              src={img.url}
              width={34}
              height={34}
              alt={img.alt || `Product image ${idx + 1}`}
              className="w-20 h-20 object-cover rounded"
            />
          ))}
        </div>
        <button
          type="button"
          className="border border-blue-400 text-blue-500 px-4 py-2 rounded bg-blue-50 hover:bg-blue-100 transition"
          onClick={() => fileInputRef.current?.click()}
        >
          Add More Image
        </button>
        <input
          type="file"
          accept="image/*"
          multiple
          ref={fileInputRef}
          className="hidden"
          onChange={e => {
            if (e.target.files) onAddImages(e.target.files);
          }}
        />
      </div>
    </div>
  );
};

export default ProductMedia; 