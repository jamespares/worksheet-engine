export enum SectionType {
  Header = 'header',
  Text = 'text',
  Question = 'question',
  Image = 'image',
  Activity = 'activity'
}

export interface WorksheetSection {
  id: string;
  type: SectionType;
  title?: string;
  content?: string;
  items?: string[]; // For multiple choice or lists
  imageDescription?: string; // Prompt for the image generator
  imageUrl?: string; // The generated base64 url
  isGeneratingImage?: boolean;
}

export interface WorksheetData {
  title: string;
  gradeLevel: string;
  subject: string;
  sections: WorksheetSection[];
}

export interface GeneratorParams {
  grade: string;
  subject: string;
  topic: string;
  details: string;
}
