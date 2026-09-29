import { 
  User, 
  Share2, 
  Award, 
  Briefcase, 
  FolderOpen, 
  Layers, 
  Cpu, 
  MessageSquare, 
  FileText, 
  Palette,
  BookOpen,
  Database
} from "lucide-react"

export const getModelIcon = (modelName: string) => {
  switch (modelName.toLowerCase()) {
    case "profile": return User;
    case "socials": return Share2;
    case "certifications": return Award;
    case "experiences": return Briefcase;
    case "projects": return FolderOpen;
    case "services": return Layers;
    case "skills": return Cpu;
    case "testimonials": return MessageSquare;
    case "blogs": return FileText;
    case "stories": return BookOpen;
    case "featured-designs": return Palette;
    default: return Database;
  }
}
