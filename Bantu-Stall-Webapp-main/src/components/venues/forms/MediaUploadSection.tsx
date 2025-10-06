import React, { useRef } from 'react';

interface MediaUploadSectionProps {
  files: File[];
  setFiles: (files: File[]) => void;
}

const ACCEPTED_TYPES = [
  'image/jpeg', 'image/png', 'image/webp',
  'application/pdf',
  'video/mp4', 'video/quicktime', 'video/webm',
];
const MAX_IMAGE_SIZE_MB = 10;
const MAX_VIDEO_SIZE_MB = 50;
const MAX_FILES = 10;

const MediaUploadSection: React.FC<MediaUploadSectionProps> = ({ files, setFiles }) => {
  const inputRef = useRef<HTMLInputElement>(null);

  const handleFiles = (fileList: FileList | null) => {
    if (!fileList) return;
    let newFiles: File[] = Array.from(fileList);
    // Filter by type and size
    newFiles = newFiles.filter(file => {
      if (!ACCEPTED_TYPES.includes(file.type)) return false;
      if (file.type.startsWith('image/') && file.size > MAX_IMAGE_SIZE_MB * 1024 * 1024) return false;
      if (file.type.startsWith('video/') && file.size > MAX_VIDEO_SIZE_MB * 1024 * 1024) return false;
      return true;
    });
    setFiles([...files, ...newFiles].slice(0, MAX_FILES));
  };

  const handleDrop = (e: React.DragEvent<HTMLDivElement>) => {
    e.preventDefault();
    handleFiles(e.dataTransfer.files);
  };

  const handleRemove = (idx: number) => {
    setFiles(files.filter((_, i) => i !== idx));
  };

  return (
    <div className="mb-4">
      <label className="block font-semibold mb-2">Upload Images, Videos, or PDFs (optional, max 10 files)</label>
      <div
        className="border-2 border-dashed border-gray-300 rounded-lg p-6 text-center cursor-pointer bg-white hover:bg-gray-50 transition"
        onClick={() => inputRef.current?.click()}
        onDrop={handleDrop}
        onDragOver={e => e.preventDefault()}
      >
        <p className="text-gray-500">Drag & drop files here, or <span className="text-bantu-orange underline">browse</span></p>
        <input
          ref={inputRef}
          type="file"
          accept={ACCEPTED_TYPES.join(',')}
          multiple
          className="hidden"
          onChange={e => handleFiles(e.target.files)}
        />
      </div>
      <div className="mt-4 grid grid-cols-2 md:grid-cols-4 gap-4">
        {files.map((file, idx) => (
          <div key={idx} className="relative group border rounded p-2 bg-gray-50">
            {file.type.startsWith('image/') ? (
              <img src={URL.createObjectURL(file)} alt={file.name} className="w-full h-24 object-cover rounded" />
            ) : file.type.startsWith('video/') ? (
              <video src={URL.createObjectURL(file)} controls className="w-full h-24 object-cover rounded" />
            ) : (
              <div className="flex flex-col items-center justify-center h-24">
                <span className="text-gray-700 text-xs">{file.name}</span>
                <span className="text-gray-400 text-xs">{(file.size / 1024 / 1024).toFixed(1)} MB</span>
              </div>
            )}
            <button
              type="button"
              className="absolute top-1 right-1 bg-white/80 rounded-full p-1 text-red-500 hover:bg-red-100 transition"
              onClick={e => { e.stopPropagation(); handleRemove(idx); }}
              aria-label="Remove file"
            >
              &times;
            </button>
          </div>
        ))}
      </div>
      <p className="text-xs text-gray-400 mt-2">Accepted: JPG, PNG, WebP, PDF, MP4, MOV, WebM. Max 10MB/image or doc, 50MB/video.</p>
    </div>
  );
};

export default MediaUploadSection;
