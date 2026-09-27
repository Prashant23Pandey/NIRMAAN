import React, { useRef, useState } from 'react';
import { UploadCloud, FileCheck, X, Image as ImageIcon } from 'lucide-react';

export interface FileUploadProps {
  label?: string;
  accept?: string;
  helperText?: string;
  onFileSelect?: (file: File) => void;
  previewUrl?: string;
  error?: string;
}

export const FileUpload: React.FC<FileUploadProps> = ({
  label,
  accept = 'image/*',
  helperText = 'PNG, JPG, or PDF up to 5MB',
  onFileSelect,
  previewUrl,
  error,
}) => {
  const fileInputRef = useRef<HTMLInputElement>(null);
  const [selectedFileName, setSelectedFileName] = useState<string | null>(null);

  const handleFileChange = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file) {
      setSelectedFileName(file.name);
      if (onFileSelect) onFileSelect(file);
    }
  };

  const clearFile = (e: React.MouseEvent) => {
    e.stopPropagation();
    setSelectedFileName(null);
    if (fileInputRef.current) fileInputRef.current.value = '';
  };

  return (
    <div className="space-y-1.5 w-full">
      {label && (
        <label className="block text-xs font-bold text-[#17211F] tracking-tight">{label}</label>
      )}
      <div
        onClick={() => fileInputRef.current?.click()}
        className={`relative border-2 border-dashed rounded-2xl p-4 sm:p-6 text-center cursor-pointer transition-all duration-150 ${
          error
            ? 'border-red-300 bg-red-50/20'
            : 'border-stone-300 hover:border-[#176B5B] hover:bg-stone-50/60 bg-white'
        }`}
      >
        <input
          ref={fileInputRef}
          type="file"
          accept={accept}
          onChange={handleFileChange}
          className="hidden"
        />

        {selectedFileName || previewUrl ? (
          <div className="flex items-center justify-between gap-3 p-2 bg-stone-50 rounded-xl border border-stone-200">
            <div className="flex items-center gap-2 text-xs font-bold text-[#17211F] truncate">
              {previewUrl ? (
                <img
                  src={previewUrl}
                  alt="Preview"
                  className="w-8 h-8 rounded object-cover border"
                />
              ) : (
                <FileCheck className="text-[#2E8B57]" size={20} />
              )}
              <span className="truncate">{selectedFileName || 'Document Attached'}</span>
            </div>
            <button
              type="button"
              onClick={clearFile}
              className="text-stone-400 hover:text-stone-700 p-1"
            >
              <X size={14} />
            </button>
          </div>
        ) : (
          <div className="space-y-2">
            <div className="w-10 h-10 rounded-2xl bg-stone-100 flex items-center justify-center text-stone-500 mx-auto">
              <UploadCloud size={20} />
            </div>
            <div>
              <span className="text-xs font-bold text-[#176B5B] hover:underline">
                Click to upload
              </span>
              <span className="text-xs text-stone-500"> or drag and drop</span>
            </div>
            <p className="text-[11px] text-stone-400">{helperText}</p>
          </div>
        )}
      </div>
      {error && <p className="text-[11px] font-semibold text-[#D64545]">{error}</p>}
    </div>
  );
};
