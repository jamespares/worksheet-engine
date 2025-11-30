import React, { useRef } from 'react';
import { WorksheetData, SectionType } from '../types';

interface WorksheetPreviewProps {
  data: WorksheetData | null;
  isGeneratingImages: boolean;
}

const WorksheetPreview: React.FC<WorksheetPreviewProps> = ({ data, isGeneratingImages }) => {
  const componentRef = useRef<HTMLDivElement>(null);

  const handlePrint = () => {
    window.print();
  };

  if (!data) {
    return (
      <div className="h-full flex flex-col items-center justify-center text-gray-400 border-2 border-dashed border-gray-300 rounded-xl bg-gray-50 min-h-[600px]">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-16 w-16 mb-4 opacity-50" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={1} d="M9 12h6m-6 4h6m2 5H7a2 2 0 01-2-2V5a2 2 0 012-2h5.586a1 1 0 01.707.293l5.414 5.414a1 1 0 01.293.707V19a2 2 0 01-2 2z" />
        </svg>
        <p className="text-lg font-medium">Your worksheet will appear here</p>
        <p className="text-sm">Fill out the form to get started</p>
      </div>
    );
  }

  return (
    <div className="flex flex-col items-center">
      <div className="w-full flex justify-end mb-4 no-print">
        <button 
          onClick={handlePrint}
          disabled={isGeneratingImages}
          className={`flex items-center gap-2 px-4 py-2 rounded-lg font-medium shadow-sm transition-colors ${
             isGeneratingImages 
             ? 'bg-gray-100 text-gray-400 cursor-wait' 
             : 'bg-white text-gray-700 hover:bg-gray-50 hover:text-primary border border-gray-200'
          }`}
        >
          {isGeneratingImages ? (
             <>
               <span className="h-2 w-2 rounded-full bg-blue-500 animate-pulse"></span>
               Generating Images...
             </>
          ) : (
            <>
              <svg xmlns="http://www.w3.org/2000/svg" className="h-5 w-5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M17 17h2a2 2 0 002-2v-4a2 2 0 00-2-2H5a2 2 0 00-2 2v4a2 2 0 002 2h2m2 4h6a2 2 0 002-2v-4a2 2 0 00-2-2H9a2 2 0 00-2 2v4a2 2 0 002 2zm8-12V5a2 2 0 00-2-2H9a2 2 0 00-2 2v4h10z" />
              </svg>
              Print Worksheet
            </>
          )}
        </button>
      </div>

      <div 
        ref={componentRef}
        className="bg-white shadow-2xl print:shadow-none w-full max-w-[210mm] min-h-[297mm] p-[15mm] md:p-[20mm] mx-auto text-gray-900 font-handwriting"
        id="printable-area"
      >
        {/* Worksheet Header */}
        <div className="border-b-2 border-gray-800 pb-4 mb-8">
          <div className="flex justify-between items-end mb-4">
            <div>
              <h1 className="text-4xl font-bold text-gray-900 mb-2">{data.title}</h1>
              <p className="text-lg text-gray-600">{data.subject} • {data.gradeLevel}</p>
            </div>
            <div className="text-right">
              <div className="mb-2">
                <span className="font-bold mr-2">Name:</span>
                <div className="inline-block w-48 border-b-2 border-gray-400"></div>
              </div>
              <div>
                <span className="font-bold mr-2">Date:</span>
                <div className="inline-block w-48 border-b-2 border-gray-400"></div>
              </div>
            </div>
          </div>
        </div>

        {/* Sections */}
        <div className="space-y-8">
          {data.sections.map((section) => (
            <div key={section.id} className="break-inside-avoid">
              {section.title && (
                <h3 className="text-2xl font-bold mb-3 text-gray-800 flex items-center">
                  <span className="w-2 h-8 bg-secondary mr-3 rounded-full"></span>
                  {section.title}
                </h3>
              )}
              
              {section.content && (
                <p className="text-lg mb-4 leading-relaxed whitespace-pre-line font-sans">
                  {section.content}
                </p>
              )}

              {section.type === SectionType.Question && section.items && (
                <div className="space-y-4 ml-4">
                  {section.items.map((item, idx) => (
                    <div key={idx} className="flex gap-3">
                      <span className="font-bold min-w-[24px]">{idx + 1}.</span>
                      <div className="flex-1">
                        <p className="text-lg mb-2 font-sans">{item}</p>
                        {/* Provide writing space */}
                        <div className="w-full h-8 border-b border-gray-300 border-dashed"></div>
                        <div className="w-full h-8 border-b border-gray-300 border-dashed"></div>
                      </div>
                    </div>
                  ))}
                </div>
              )}

              {section.type === SectionType.Activity && section.items && (
                <ul className="list-disc list-inside space-y-2 ml-4 font-sans text-lg">
                  {section.items.map((item, idx) => (
                    <li key={idx} className="pl-2">{item}</li>
                  ))}
                </ul>
              )}

              {section.type === SectionType.Image && (
                <div className="flex justify-center my-6">
                  {section.imageUrl ? (
                    <div className="relative group border-4 border-gray-800 rounded-xl overflow-hidden p-2 bg-white">
                         <img 
                          src={section.imageUrl} 
                          alt={section.imageDescription || "Worksheet illustration"} 
                          className="max-h-[300px] object-contain mx-auto filter contrast-125"
                        />
                        {/* Corner details to make it look like a frame */}
                        <div className="absolute top-0 left-0 w-4 h-4 border-t-4 border-l-4 border-gray-800"></div>
                        <div className="absolute top-0 right-0 w-4 h-4 border-t-4 border-r-4 border-gray-800"></div>
                        <div className="absolute bottom-0 left-0 w-4 h-4 border-b-4 border-l-4 border-gray-800"></div>
                        <div className="absolute bottom-0 right-0 w-4 h-4 border-b-4 border-r-4 border-gray-800"></div>
                    </div>
                  ) : (
                    <div className="w-full h-64 border-4 border-dashed border-gray-300 rounded-xl flex items-center justify-center bg-gray-50">
                       {section.isGeneratingImage ? (
                          <div className="text-center text-gray-500">
                             <svg className="animate-spin h-8 w-8 mx-auto mb-2 text-primary" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                               <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                               <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
                             </svg>
                             <span>Drawing illustration...</span>
                          </div>
                       ) : (
                          <span className="text-gray-400 italic">Image placeholder</span>
                       )}
                    </div>
                  )}
                  {section.imageDescription && !section.imageUrl && !section.isGeneratingImage && (
                      <p className="text-xs text-gray-400 mt-2 text-center w-full max-w-md no-print">
                          Failed to load image.
                      </p>
                  )}
                </div>
              )}
            </div>
          ))}
        </div>

        {/* Footer */}
        <div className="mt-16 pt-8 border-t border-gray-200 text-center text-gray-400 text-sm">
           <p>Created with SmartWorksheet AI • Great job!</p>
        </div>
      </div>
    </div>
  );
};

export default WorksheetPreview;
