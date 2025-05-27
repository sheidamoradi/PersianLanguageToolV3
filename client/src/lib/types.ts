export interface NavLink {
  label: string;
  path: string;
  icon: string;
  active?: boolean;
}

export interface UserProfile {
  name: string;
  username: string;
  membershipType: string;
  progress: number;
  avatar?: string;
}

export interface CourseCardProps {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  progress: number;
  totalModules: number;
  completedModules: number;
  category?: string;
  level?: string;
  isNew?: boolean;
  isPopular?: boolean;
}

export interface ProjectCardProps {
  id: number;
  title: string;
  description: string;
  thumbnailUrl: string;
  type: "project" | "magazine";
  dueDate?: string;
  pages?: number;
  isLocked: boolean;
}

export interface ModuleItem {
  id: number;
  title: string;
  duration: string;
  isLocked: boolean;
  isActive?: boolean;
}

export interface DocumentViewerProps {
  document: {
    id: number;
    title: string;
    fileName: string;
    fileUrl: string;
    totalPages: number;
    lastUpdated: string;
    allowDownload: boolean;
  };
}

export interface MediaPlayerProps {
  media: {
    id: number;
    title: string;
    description: string;
    contentUrl: string;
    instructorName: string;
    instructorTitle: string;
    instructorAvatar: string;
  };
  modules: ModuleItem[];
}
