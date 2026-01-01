import React, { ChangeEvent, useRef } from 'react';
import { Camera, Upload, X } from 'lucide-react';
import { ImageFile } from '../types';

interface ImageUploaderProps {
  imageFile: ImageFile | null;
  onImageSelected: (file: ImageFile | null) => void;
}

const ImageUploader: React.FC<ImageUploaderProps> = ({ imageFile, onImageSelected }) => {
  const fileInputRef = useRef<HTMLInputElement>(null);

  const handleFileChange = async (event: ChangeEvent<HTMLInputElement>) => {
    const file = event.target.files?.[0];
    if (!file) return;

    // Convert to base64
    const reader = new FileReader();
    reader.onloadend = () => {
      const base64String = reader.result as string;
      // Remove metadata prefix (e.g., "data:image/jpeg;base64,") for API usage later if needed
      // But for preview we keep it. We will strip it in the service.
      
      onImageSelected({
        file,
        previewUrl: URL.createObjectURL(file),
        base64: base64String
      });
    };
    reader.readAsDataURL(file);
  };

  const clearImage = () => {
    onImageSelected(null);
    if (fileInputRef.current) {
      fileInputRef.current.value = '';
    }
  };

  if (imageFile) {
    return (
      <div className="relative w-full aspect-video sm:aspect-[2/1] bg-gray-900 rounded-xl overflow-hidden shadow-lg border border-gray-200">
        <img 
          src={imageFile.previewUrl} 
          alt="Preview" 
          className="w-full h-full object-contain"
        />
        <button
          onClick={clearImage}
          className="absolute top-2 right-2 bg-black/50 hover:bg-black/70 text-white p-2 rounded-full backdrop-blur-sm transition-colors"
          aria-label="Remover imagem"
        >
          <X size={20} />
        </button>
        <div className="absolute bottom-0 left-0 right-0 bg-gradient-to-t from-black/70 to-transparent p-4">
          <p className="text-white text-sm font-medium truncate">{imageFile.file.name}</p>
        </div>
      </div>
    );
  }

  return (
    <div className="w-full">
      <input
        type="file"
        ref={fileInputRef}
        onChange={handleFileChange}
        accept="image/*"
        className="hidden"
        id="image-upload"
      />
      <label
        htmlFor="image-upload"
        className="flex flex-col items-center justify-center w-full h-48 border-2 border-dashed border-gray-300 rounded-xl cursor-pointer bg-gray-50 hover:bg-red-50 hover:border-red-300 transition-colors group"
      >
        <div className="flex flex-col items-center justify-center pt-5 pb-6">
          <div className="mb-3 p-3 bg-white rounded-full shadow-sm group-hover:scale-110 transition-transform">
             <Camera className="w-8 h-8 text-gray-400 group-hover:text-red-500" />
          </div>
          <p className="mb-1 text-sm text-gray-600 font-semibold">Tire uma foto ou faça upload</p>
          <p className="text-xs text-gray-500">Rótulos, ingredientes ou tabela nutricional</p>
        </div>
      </label>
    </div>
  );
};

export default ImageUploader;
