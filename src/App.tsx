import React from 'react';
import { QueryClient, QueryClientProvider } from 'react-query';
import { Canvas } from './components/Canvas';
import { ImageGallery } from './components/ImageGallery';
import { Brush } from 'lucide-react';

const queryClient = new QueryClient();

function App() {
  return (
    <QueryClientProvider client={queryClient}>
      <div className="min-h-screen bg-gray-100 p-8">
        <div className="max-w-6xl mx-auto">
          <div className="bg-white rounded-xl shadow-lg p-8 mb-8">
            <div className="flex items-center gap-3 mb-8">
              <Brush className="w-8 h-8 text-blue-500" />
              <h1 className="text-2xl font-bold">Image Inpainting Widget</h1>
            </div>
            <Canvas />
          </div>
          
          <div className="bg-white rounded-xl shadow-lg p-8">
            <h2 className="text-xl font-bold mb-6">Previous Images</h2>
            <ImageGallery />
          </div>
        </div>
      </div>
    </QueryClientProvider>
  );
}

export default App;