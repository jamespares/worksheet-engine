import React, { useState, useCallback } from 'react';
import InputForm from './components/InputForm';
import WorksheetPreview from './components/WorksheetPreview';
import { generateWorksheetStructure, generateIllustration } from './services/geminiService';
import { WorksheetData, GeneratorParams, SectionType } from './types';

const App: React.FC = () => {
  const [worksheetData, setWorksheetData] = useState<WorksheetData | null>(null);
  const [isStructureLoading, setIsStructureLoading] = useState(false);
  const [generatingImagesCount, setGeneratingImagesCount] = useState(0);

  const handleGenerate = useCallback(async (params: GeneratorParams) => {
    setIsStructureLoading(true);
    setWorksheetData(null);
    setGeneratingImagesCount(0);

    try {
      // Step 1: Generate Text Structure
      const data = await generateWorksheetStructure(params.grade, params.subject, params.topic, params.details);
      
      // Initialize image loading states
      const dataWithImageStates = {
        ...data,
        sections: data.sections.map(s => ({
          ...s,
          isGeneratingImage: s.type === SectionType.Image
        }))
      };
      
      setWorksheetData(dataWithImageStates);
      setIsStructureLoading(false);

      // Step 2: Identify Image Sections and Generate Images in Parallel
      const imageSections = dataWithImageStates.sections.filter(s => s.type === SectionType.Image && s.imageDescription);
      
      if (imageSections.length > 0) {
        setGeneratingImagesCount(imageSections.length);
        
        // We trigger them all but don't await the Promise.all immediately to block UI. 
        // Instead, we update state as each completes.
        imageSections.forEach(async (section) => {
          if (!section.imageDescription) return;
          
          try {
            const imageUrl = await generateIllustration(section.imageDescription);
            
            setWorksheetData(currentData => {
              if (!currentData) return null;
              return {
                ...currentData,
                sections: currentData.sections.map(s => 
                  s.id === section.id 
                    ? { ...s, imageUrl, isGeneratingImage: false } 
                    : s
                )
              };
            });
          } catch (error) {
            console.error(`Failed to generate image for section ${section.id}`, error);
             setWorksheetData(currentData => {
              if (!currentData) return null;
              return {
                ...currentData,
                sections: currentData.sections.map(s => 
                  s.id === section.id 
                    ? { ...s, isGeneratingImage: false } 
                    : s
                )
              };
            });
          } finally {
            setGeneratingImagesCount(prev => Math.max(0, prev - 1));
          }
        });
      }

    } catch (error) {
      console.error("Error in generation flow:", error);
      setIsStructureLoading(false);
      alert("Something went wrong while generating the worksheet. Please check your API key and try again.");
    }
  }, []);

  return (
    <div className="min-h-screen bg-gray-50 text-gray-900 font-sans">
      {/* Navbar */}
      <nav className="bg-white border-b border-gray-200 sticky top-0 z-50 no-print">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between h-16">
            <div className="flex items-center">
              <span className="flex items-center justify-center h-10 w-10 rounded-lg bg-indigo-100 text-primary mr-3">
                 <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19.428 15.428a2 2 0 00-1.022-.547l-2.384-.477a6 6 0 00-3.86.517l-.318.158a6 6 0 01-3.86.517L6.05 15.21a2 2 0 00-1.806.547M8 4h8l-1 1v5.172a2 2 0 00.586 1.414l5 5c1.26 1.26.367 3.414-1.415 3.414H4.828c-1.782 0-2.674-2.154-1.414-3.414l5-5A2 2 0 009 10.172V5L8 4z" />
                  </svg>
              </span>
              <h1 className="text-xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-primary to-indigo-600">
                SmartWorksheet AI
              </h1>
            </div>
            <div className="flex items-center">
                <a href="https://ai.google.dev" target="_blank" rel="noreferrer" className="text-sm text-gray-500 hover:text-primary">
                    Powered by Gemini
                </a>
            </div>
          </div>
        </div>
      </nav>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="flex flex-col lg:flex-row gap-8">
          {/* Left Sidebar: Controls */}
          <div className="w-full lg:w-1/3 no-print">
            <InputForm 
              onSubmit={handleGenerate} 
              isLoading={isStructureLoading} 
            />
            
            <div className="mt-8 bg-white p-6 rounded-xl shadow-sm border border-gray-100">
                <h3 className="font-semibold text-gray-800 mb-2">How it works</h3>
                <ol className="list-decimal list-inside text-sm text-gray-600 space-y-2">
                    <li>Enter the grade level and subject.</li>
                    <li>Describe the topic (e.g., "The Life Cycle of a Butterfly").</li>
                    <li>Click Generate.</li>
                    <li>Wait for AI to write the content and draw pictures.</li>
                    <li>Print your worksheet!</li>
                </ol>
            </div>
          </div>

          {/* Right Area: Preview */}
          <div className="w-full lg:w-2/3">
             <WorksheetPreview 
                data={worksheetData} 
                isGeneratingImages={generatingImagesCount > 0} 
             />
          </div>
        </div>
      </main>
    </div>
  );
};

export default App;
