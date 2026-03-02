import React, { useState } from "react";
import {
  analyzeDecision,
  AnalysisType,
  ProsConsResult,
  ComparisonResult,
  SwotResult,
} from "./services/gemini";
import { ProsConsView } from "./components/ProsConsView";
import { ComparisonView } from "./components/ComparisonView";
import { SwotView } from "./components/SwotView";
import {
  Scale,
  Loader2,
  ListChecks,
  Table as TableIcon,
  LayoutGrid,
  ImagePlus,
  X,
  UploadCloud
} from "lucide-react";
import { motion, AnimatePresence } from "motion/react";

export default function App() {
  const [decision, setDecision] = useState("");
  const [images, setImages] = useState<File[]>([]);
  const [imagePreviews, setImagePreviews] = useState<string[]>([]);
  const [isDragging, setIsDragging] = useState(false);
  const [analysisType, setAnalysisType] = useState<AnalysisType>("pros_cons");
  const [isAnalyzing, setIsAnalyzing] = useState(false);
  const [result, setResult] = useState<
    ProsConsResult | ComparisonResult | SwotResult | null
  >(null);
  const [error, setError] = useState<string | null>(null);

  const fileToBase64 = (file: File): Promise<string> => {
    return new Promise((resolve, reject) => {
      const reader = new FileReader();
      reader.readAsDataURL(file);
      reader.onload = () => {
        const base64String = (reader.result as string).split(',')[1];
        resolve(base64String);
      };
      reader.onerror = error => reject(error);
    });
  };

  const handleAnalyze = async () => {
    if (!decision.trim() && images.length === 0) return;

    setIsAnalyzing(true);
    setError(null);
    setResult(null);

    try {
      const processedImages = await Promise.all(
        images.map(async (file) => ({
          data: await fileToBase64(file),
          mimeType: file.type
        }))
      );
      
      const data = await analyzeDecision(decision, analysisType, processedImages);
      setResult(data);
    } catch (err) {
      console.error(err);
      setError(
        "Failed to analyze the decision. Please try again or rephrase your request.",
      );
    } finally {
      setIsAnalyzing(false);
    }
  };

  const handleDragOver = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(true);
  };

  const handleDragLeave = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
  };

  const handleDrop = (e: React.DragEvent) => {
    e.preventDefault();
    setIsDragging(false);
    if (e.dataTransfer.files && e.dataTransfer.files.length > 0) {
      const droppedFiles = Array.from(e.dataTransfer.files as Iterable<File> | ArrayLike<File>).filter((f: File) => f.type.startsWith('image/'));
      addFiles(droppedFiles);
    }
  };

  const handleFileInput = (e: React.ChangeEvent<HTMLInputElement>) => {
    if (e.target.files) {
      addFiles(Array.from(e.target.files as Iterable<File> | ArrayLike<File>));
    }
  };

  const addFiles = (newFiles: File[]) => {
    setImages(prev => [...prev, ...newFiles]);
    const newPreviews = newFiles.map(file => URL.createObjectURL(file));
    setImagePreviews(prev => [...prev, ...newPreviews]);
  };

  const removeImage = (index: number) => {
    setImages(prev => prev.filter((_, i) => i !== index));
    setImagePreviews(prev => {
      const newPreviews = [...prev];
      URL.revokeObjectURL(newPreviews[index]);
      newPreviews.splice(index, 1);
      return newPreviews;
    });
  };

  const renderResult = () => {
    if (!result) return null;

    switch (analysisType) {
      case "pros_cons":
        return <ProsConsView data={result as ProsConsResult} />;
      case "comparison":
        return <ComparisonView data={result as ComparisonResult} />;
      case "swot":
        return <SwotView data={result as SwotResult} />;
      default:
        return null;
    }
  };

  return (
    <div className="min-h-screen bg-[#f9fafb] text-gray-900 font-sans selection:bg-indigo-100 selection:text-indigo-900">
      {/* Header */}
      <header className="bg-white border-b border-gray-100 sticky top-0 z-10">
        <div className="max-w-5xl mx-auto px-6 h-16 flex items-center justify-between">
          <div className="flex items-center space-x-2">
            <div className="bg-indigo-600 p-2 rounded-xl">
              <Scale className="w-5 h-5 text-white" />
            </div>
            <span className="font-bold text-xl tracking-tight text-gray-900">
              The Tiebreaker
            </span>
          </div>
        </div>
      </header>

      <main className="max-w-5xl mx-auto px-6 py-12 space-y-12">
        {/* Hero Section */}
        <div className="text-center max-w-2xl mx-auto space-y-4">
          <h1 className="text-4xl md:text-5xl font-bold tracking-tight text-gray-900">
            Make better decisions,{" "}
            <span className="text-indigo-600">faster.</span>
          </h1>
          <p className="text-lg text-gray-500">
            Describe a choice you're facing, and let AI break it down for you
            with structured analysis.
          </p>
        </div>

        {/* Input Section */}
        <div className="bg-white rounded-3xl shadow-sm border border-gray-200 p-2 md:p-4 max-w-3xl mx-auto">
          <div className="p-4 md:p-6 space-y-6">
            <div className="space-y-2">
              <label
                htmlFor="decision"
                className="block text-sm font-medium text-gray-700"
              >
                What's the decision? (Optional if uploading images)
              </label>
              <textarea
                id="decision"
                rows={3}
                className="w-full rounded-xl border-gray-200 shadow-sm focus:border-indigo-500 focus:ring-indigo-500 resize-none p-4 text-gray-900 bg-gray-50/50"
                placeholder="e.g., Should I buy a new car or keep repairing my old one? Or upload photos of items to compare."
                value={decision}
                onChange={(e) => setDecision(e.target.value)}
              />
            </div>

            {/* Image Upload Section */}
            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Attach Photos (Optional)
              </label>
              <div 
                className={`relative border-2 border-dashed rounded-xl p-6 transition-colors ${
                  isDragging ? 'border-indigo-500 bg-indigo-50' : 'border-gray-300 hover:border-gray-400 bg-gray-50/50'
                }`}
                onDragOver={handleDragOver}
                onDragLeave={handleDragLeave}
                onDrop={handleDrop}
              >
                <input
                  type="file"
                  multiple
                  accept="image/*"
                  onChange={handleFileInput}
                  className="absolute inset-0 w-full h-full opacity-0 cursor-pointer"
                  title="Upload images"
                />
                <div className="text-center">
                  <UploadCloud className={`mx-auto h-8 w-8 ${isDragging ? 'text-indigo-500' : 'text-gray-400'}`} />
                  <p className="mt-2 text-sm text-gray-600">
                    <span className="font-semibold text-indigo-600">Click to upload</span> or drag and drop
                  </p>
                  <p className="text-xs text-gray-500 mt-1">PNG, JPG, GIF up to 10MB</p>
                </div>
              </div>

              {/* Image Previews */}
              {imagePreviews.length > 0 && (
                <div className="flex flex-wrap gap-3 mt-4">
                  {imagePreviews.map((preview, idx) => (
                    <div key={idx} className="relative group">
                      <img 
                        src={preview} 
                        alt={`Preview ${idx}`} 
                        className="h-20 w-20 object-cover rounded-lg border border-gray-200 shadow-sm"
                      />
                      <button
                        onClick={() => removeImage(idx)}
                        className="absolute -top-2 -right-2 bg-white rounded-full p-1 shadow-md border border-gray-200 text-gray-500 hover:text-red-500 opacity-0 group-hover:opacity-100 transition-opacity"
                        title="Remove image"
                      >
                        <X className="w-3 h-3" />
                      </button>
                    </div>
                  ))}
                </div>
              )}
            </div>

            <div className="space-y-3">
              <label className="block text-sm font-medium text-gray-700">
                Analysis Format
              </label>
              <div className="grid grid-cols-1 sm:grid-cols-3 gap-3">
                <button
                  onClick={() => setAnalysisType("pros_cons")}
                  className={`flex items-center justify-center px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    analysisType === "pros_cons"
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <ListChecks className="w-4 h-4 mr-2" />
                  Pros & Cons
                </button>
                <button
                  onClick={() => setAnalysisType("comparison")}
                  className={`flex items-center justify-center px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    analysisType === "comparison"
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <TableIcon className="w-4 h-4 mr-2" />
                  Comparison Table
                </button>
                <button
                  onClick={() => setAnalysisType("swot")}
                  className={`flex items-center justify-center px-4 py-3 rounded-xl border text-sm font-medium transition-colors ${
                    analysisType === "swot"
                      ? "bg-indigo-50 border-indigo-200 text-indigo-700"
                      : "bg-white border-gray-200 text-gray-600 hover:bg-gray-50"
                  }`}
                >
                  <LayoutGrid className="w-4 h-4 mr-2" />
                  SWOT Analysis
                </button>
              </div>
            </div>

            <div className="pt-2">
              <button
                onClick={handleAnalyze}
                disabled={(!decision.trim() && images.length === 0) || isAnalyzing}
                className="w-full flex items-center justify-center px-8 py-4 border border-transparent text-base font-medium rounded-xl text-white bg-indigo-600 hover:bg-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-indigo-500 disabled:opacity-50 disabled:cursor-not-allowed transition-all shadow-sm"
              >
                {isAnalyzing ? (
                  <>
                    <Loader2 className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" />
                    Analyzing...
                  </>
                ) : (
                  "Break the Tie"
                )}
              </button>
            </div>
          </div>
        </div>

        {/* Results Section */}
        <AnimatePresence mode="wait">
          {error && (
            <motion.div
              initial={{ opacity: 0, y: 10 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -10 }}
              className="max-w-3xl mx-auto bg-red-50 text-red-800 p-4 rounded-xl border border-red-100 text-sm"
            >
              {error}
            </motion.div>
          )}

          {result && !isAnalyzing && (
            <motion.div
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              exit={{ opacity: 0, y: -20 }}
              transition={{ duration: 0.4, ease: "easeOut" }}
              className="max-w-5xl mx-auto pt-8 border-t border-gray-200"
            >
              <div className="mb-8">
                <h2 className="text-2xl font-bold text-gray-900">
                  Analysis Results
                </h2>
                <p className="text-gray-500 mt-1">
                  Based on your input, here is the breakdown.
                </p>
              </div>
              {renderResult()}
            </motion.div>
          )}
        </AnimatePresence>
      </main>
    </div>
  );
}
