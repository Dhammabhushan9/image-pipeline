import React, { useEffect, useRef, useState } from 'react';
import { fabric } from 'fabric';
import { Minus, Plus, Upload, Download, Eraser } from 'lucide-react';

export function Canvas() {
  const canvasRef = useRef<HTMLCanvasElement>(null);
  const [canvas, setCanvas] = useState<fabric.Canvas | null>(null);
  const [brushSize, setBrushSize] = useState(20);
  const [originalImage, setOriginalImage] = useState<string | null>(null);
  const [maskImage, setMaskImage] = useState<string | null>(null);

  useEffect(() => {
    if (canvasRef.current) {
      const fabricCanvas = new fabric.Canvas(canvasRef.current, {
        isDrawingMode: true,
        width: 512,
        height: 512,
        backgroundColor: '#000000'
      });

      fabricCanvas.freeDrawingBrush = new fabric.PencilBrush(fabricCanvas);
      fabricCanvas.freeDrawingBrush.color = '#ffffff';
      fabricCanvas.freeDrawingBrush.width = brushSize;

      setCanvas(fabricCanvas);

      return () => {
        fabricCanvas.dispose();
      };
    }
  }, []);

  useEffect(() => {
    if (canvas) {
      canvas.freeDrawingBrush.width = brushSize;
    }
  }, [brushSize, canvas]);

  const handleImageUpload = (e: React.ChangeEvent<HTMLInputElement>) => {
    const file = e.target.files?.[0];
    if (file && canvas) {
      const reader = new FileReader();
      reader.onload = (event) => {
        const imgUrl = event.target?.result as string;
        setOriginalImage(imgUrl);
        
        fabric.Image.fromURL(imgUrl, (img) => {
          canvas.clear();
          canvas.setBackgroundImage(img, canvas.renderAll.bind(canvas), {
            scaleX: canvas.width! / img.width!,
            scaleY: canvas.height! / img.height!
          });
        });
      };
      reader.readAsDataURL(file);
    }
  };

  const exportMask = () => {
    if (canvas) {
      // Remove background image temporarily
      const bgImage = canvas.backgroundImage;
      canvas.backgroundImage = null;
      canvas.backgroundColor = '#000000';
      canvas.renderAll();

      // Export the mask
      const maskDataUrl = canvas.toDataURL({
        format: 'png',
        quality: 1
      });
      setMaskImage(maskDataUrl);

      // Restore background image
      canvas.backgroundImage = bgImage;
      canvas.renderAll();
    }
  };

  const clearCanvas = () => {
    if (canvas) {
      const bgImage = canvas.backgroundImage;
      canvas.clear();
      canvas.backgroundColor = '#000000';
      canvas.backgroundImage = bgImage;
      canvas.renderAll();
    }
  };

  return (
    <div className="flex flex-col items-center gap-6">
      <div className="flex gap-4 items-center">
        <input
          type="file"
          accept="image/*"
          onChange={handleImageUpload}
          className="hidden"
          id="imageUpload"
        />
        <label
          htmlFor="imageUpload"
          className="flex items-center gap-2 px-4 py-2 bg-blue-500 text-white rounded-lg hover:bg-blue-600 cursor-pointer"
        >
          <Upload size={20} />
          Upload Image
        </label>
        <div className="flex items-center gap-2 bg-gray-100 rounded-lg p-2">
          <button
            onClick={() => setBrushSize(Math.max(1, brushSize - 5))}
            className="p-2 hover:bg-gray-200 rounded-lg"
          >
            <Minus size={20} />
          </button>
          <span className="w-12 text-center">{brushSize}px</span>
          <button
            onClick={() => setBrushSize(Math.min(100, brushSize + 5))}
            className="p-2 hover:bg-gray-200 rounded-lg"
          >
            <Plus size={20} />
          </button>
        </div>
        <button
          onClick={clearCanvas}
          className="flex items-center gap-2 px-4 py-2 bg-red-500 text-white rounded-lg hover:bg-red-600"
        >
          <Eraser size={20} />
          Clear
        </button>
        <button
          onClick={exportMask}
          className="flex items-center gap-2 px-4 py-2 bg-green-500 text-white rounded-lg hover:bg-green-600"
        >
          <Download size={20} />
          Export Mask
        </button>
      </div>

      <div className="border-2 border-gray-300 rounded-lg">
        <canvas ref={canvasRef} />
      </div>

      {originalImage && maskImage && (
        <div className="flex gap-8">
          <div className="flex flex-col items-center gap-2">
            <h3 className="font-semibold">Original Image</h3>
            <img
              src={originalImage}
              alt="Original"
              className="w-64 h-64 object-contain border border-gray-300 rounded-lg"
            />
          </div>
          <div className="flex flex-col items-center gap-2">
            <h3 className="font-semibold">Mask</h3>
            <img
              src={maskImage}
              alt="Mask"
              className="w-64 h-64 object-contain border border-gray-300 rounded-lg"
            />
          </div>
        </div>
      )}
    </div>
  );
}