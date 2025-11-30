import React, { useState } from 'react';
import { GeneratorParams } from '../types';

interface InputFormProps {
  onSubmit: (params: GeneratorParams) => void;
  isLoading: boolean;
}

const InputForm: React.FC<InputFormProps> = ({ onSubmit, isLoading }) => {
  const [grade, setGrade] = useState('2nd Grade');
  const [subject, setSubject] = useState('Science');
  const [topic, setTopic] = useState('The Solar System');
  const [details, setDetails] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    onSubmit({ grade, subject, topic, details });
  };

  return (
    <div className="bg-white p-6 rounded-xl shadow-lg border border-gray-100 h-fit sticky top-6">
      <h2 className="text-2xl font-bold text-gray-800 mb-6 flex items-center">
        <svg xmlns="http://www.w3.org/2000/svg" className="h-6 w-6 mr-2 text-primary" fill="none" viewBox="0 0 24 24" stroke="currentColor">
          <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 6.253v13m0-13C10.832 5.477 9.246 5 7.5 5S4.168 5.477 3 6.253v13C4.168 18.477 5.754 18 7.5 18s3.332.477 4.5 1.253m0-13C13.168 5.477 14.754 5 16.5 5c1.747 0 3.332.477 4.5 1.253v13C19.832 18.477 18.247 18 16.5 18c-1.746 0-3.332.477-4.5 1.253" />
        </svg>
        Worksheet Creator
      </h2>
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Grade Level</label>
          <select 
            value={grade} 
            onChange={(e) => setGrade(e.target.value)}
            className="w-full bg-white text-gray-900 rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
          >
            {['Kindergarten', '1st Grade', '2nd Grade', '3rd Grade', '4th Grade', '5th Grade', '6th Grade', 'Middle School'].map(g => (
              <option key={g} value={g}>{g}</option>
            ))}
          </select>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Subject</label>
          <input 
            type="text" 
            value={subject}
            onChange={(e) => setSubject(e.target.value)}
            placeholder="e.g. Math, Science, History"
            className="w-full bg-white text-gray-900 rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Topic / Lesson Plan</label>
          <input 
            type="text" 
            value={topic}
            onChange={(e) => setTopic(e.target.value)}
            placeholder="e.g. Dinosaurs, Fractions, Ancient Rome"
            className="w-full bg-white text-gray-900 rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
            required
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700 mb-1">Specific Instructions</label>
          <textarea 
            value={details}
            onChange={(e) => setDetails(e.target.value)}
            placeholder="Any specific learning goals, vocabulary words, or student interests?"
            rows={4}
            className="w-full bg-white text-gray-900 rounded-lg border-gray-300 border p-2 focus:ring-2 focus:ring-primary focus:border-transparent outline-none transition"
          />
        </div>

        <button 
          type="submit" 
          disabled={isLoading}
          className={`w-full py-3 px-4 rounded-lg text-white font-semibold shadow-md transition-all transform hover:scale-[1.02] active:scale-[0.98] ${
            isLoading 
              ? 'bg-gray-400 cursor-not-allowed' 
              : 'bg-gradient-to-r from-primary to-indigo-600 hover:from-indigo-600 hover:to-primary'
          }`}
        >
          {isLoading ? (
            <span className="flex items-center justify-center">
              <svg className="animate-spin -ml-1 mr-3 h-5 w-5 text-white" xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 24 24">
                <circle className="opacity-25" cx="12" cy="12" r="10" stroke="currentColor" strokeWidth="4"></circle>
                <path className="opacity-75" fill="currentColor" d="M4 12a8 8 0 018-8V0C5.373 0 0 5.373 0 12h4zm2 5.291A7.962 7.962 0 014 12H0c0 3.042 1.135 5.824 3 7.938l3-2.647z"></path>
              </svg>
              Creating Magic...
            </span>
          ) : 'Generate Worksheet'}
        </button>
      </form>

      <div className="mt-6 p-4 bg-blue-50 rounded-lg text-sm text-blue-700">
        <p className="font-medium mb-1">💡 Tip:</p>
        <p>Try adding details like "Include a word search" or "Make it about space pirates" for more creative results!</p>
      </div>
    </div>
  );
};

export default InputForm;