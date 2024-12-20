import React from 'react';
import { useQuery } from 'react-query';
import { getImagePairs } from '../api/inpainting';
import { ImageIcon } from 'lucide-react';

export function ImageGallery() {
  const { data: imagePairs, isLoading, error } = useQuery('imagePairs', getImagePairs);

  if (isLoading) {
    return (
      <div className="flex items-center justify-center p-8">
        <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-500"></div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="text-red-500 p-4">
        Error loading images
      </div>
    );
  }

  if (!imagePairs?.length) {
    return (
      <div className="flex flex-col items-center justify-center p-8 text-gray-500">
        <ImageIcon size={48} className="mb-2" />
        <p>No images yet</p>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
      {imagePairs.map((pair) => (
        <div key={pair._id} className="bg-white rounded-lg shadow-md p-4">
          <div className="grid grid-cols-2 gap-4">
            <div>
              <h4 className="text-sm font-medium mb-2">Original</h4>
              <img
                src={`http://localhost:5000${pair.originalImage}`}
                alt="Original"
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
            <div>
              <h4 className="text-sm font-medium mb-2">Mask</h4>
              <img
                src={`http://localhost:5000${pair.maskImage}`}
                alt="Mask"
                className="w-full h-40 object-cover rounded-lg"
              />
            </div>
          </div>
          <div className="mt-4 text-sm text-gray-500">
            Created: {new Date(pair.createdAt).toLocaleDateString()}
          </div>
        </div>
      ))}
    </div>
  );
}