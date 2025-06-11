import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import MediaPlayer from "@/components/media/MediaPlayer";
import { type MediaContent, type Module } from "@shared/schema";


export default function MediaPlayerPage() {
  const { id } = useParams<{ id: string }>();
  const mediaId = parseInt(id);
  
  const { data: media, isLoading: isLoadingMedia, error: mediaError } = useQuery<MediaContent>({ 
    queryKey: ['/api/media', mediaId],
    enabled: !isNaN(mediaId)
  });
  
  const { data: modules = [], isLoading: isLoadingModules } = useQuery<Module[]>({ 
    queryKey: ['/api/courses/1/modules'], // Use proper course ID when available
    enabled: !isNaN(mediaId)
  });
  
  if (isNaN(mediaId)) {
    return (
      <div className="text-center py-10">
        <p className="text-status-error font-medium">Invalid media ID</p>
      </div>
    );
  }
  
  if (isLoadingMedia || isLoadingModules) {
    return (
      <div className="mb-10">
        <div className="mb-4">
          <Skeleton className="w-1/3 h-8 mb-2" />
          <Skeleton className="w-1/2 h-4" />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <Skeleton className="w-full aspect-video" />
          
          <div className="p-4">
            <Skeleton className="w-1/2 h-6 mb-1" />
            <Skeleton className="w-full h-4 mb-4" />
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
              <div className="flex items-center mb-2 sm:mb-0">
                <Skeleton className="w-10 h-10 rounded-full" />
                <div className="ml-3">
                  <Skeleton className="w-32 h-4 mb-1" />
                  <Skeleton className="w-24 h-3" />
                </div>
              </div>
              <div className="flex space-x-2">
                <Skeleton className="w-20 h-8 rounded" />
                <Skeleton className="w-20 h-8 rounded" />
              </div>
            </div>
          </div>
        </div>
      </div>
    );
  }
  
  if (mediaError || !media) {
    return (
      <div className="text-center py-10">
        <p className="text-status-error font-medium">Error loading media content</p>
        <p className="text-neutral-400 mt-2">Please try again later</p>
      </div>
    );
  }
  
  // Transform modules to match the expected interface
  const moduleItems = modules.map(module => ({
    id: module.id,
    title: module.title,
    duration: module.duration || '',
    isLocked: module.isLocked,
    isActive: module.id === 1 // Assuming first module is active
  }));
  
  return (
    <MediaPlayer 
      media={media} 
      modules={moduleItems}
    />
  );
}
