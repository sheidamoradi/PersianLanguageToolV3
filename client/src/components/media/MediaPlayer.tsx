import { useState } from 'react';
import ReactPlayer from 'react-player';
import { Button } from "@/components/ui/button";
import { type MediaPlayerProps } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Link } from "wouter";
import { X, Bookmark, Share } from "lucide-react";

export default function MediaPlayer({ media, modules }: MediaPlayerProps) {
  const [playing, setPlaying] = useState(false);
  
  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-500">Media Player</h2>
          <p className="text-neutral-300">View lectures and educational videos</p>
        </div>
        <Link href="/">
          <Button variant="ghost" className="text-neutral-400 hover:text-primary">
            <X className="h-5 w-5" />
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardContent className="p-0">
          <div className="bg-neutral-500 relative aspect-video">
            <ReactPlayer
              url={media.contentUrl}
              width="100%"
              height="100%"
              controls
              playing={playing}
              onPlay={() => setPlaying(true)}
              onPause={() => setPlaying(false)}
              config={{
                file: {
                  attributes: {
                    controlsList: 'nodownload'
                  }
                }
              }}
            />
          </div>
          
          <div className="p-4">
            <h3 className="font-medium text-neutral-500 mb-1">{media.title}</h3>
            <p className="text-sm text-neutral-300 mb-4">{media.description}</p>
            
            <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
              <div className="flex items-center mb-2 sm:mb-0">
                <img src={media.instructorAvatar} alt={media.instructorName} className="w-10 h-10 rounded-full object-cover" />
                <div className="ml-3">
                  <p className="text-sm font-medium text-neutral-500">{media.instructorName}</p>
                  <p className="text-xs text-neutral-300">{media.instructorTitle}</p>
                </div>
              </div>
              <div className="flex space-x-2">
                <Button variant="outline" className="flex items-center text-sm text-neutral-400">
                  <Bookmark className="h-4 w-4 mr-1" />
                  Save
                </Button>
                <Button variant="outline" className="flex items-center text-sm text-neutral-400">
                  <Share className="h-4 w-4 mr-1" />
                  Share
                </Button>
              </div>
            </div>
            
            <div className="border-t border-neutral-200 pt-4">
              <h4 className="font-medium text-neutral-500 mb-2">Course Content</h4>
              <ul className="space-y-3">
                {modules.map((module) => (
                  <li 
                    key={module.id} 
                    className={`flex items-center justify-between p-2 ${
                      module.isActive ? 'bg-blue-50 rounded-lg' : 'hover:bg-neutral-100 rounded-lg'
                    }`}
                  >
                    <div className="flex items-center">
                      <span className={`material-icons text-sm mr-2 ${
                        module.isLocked 
                          ? 'text-neutral-300'
                          : module.isActive
                            ? 'text-primary'
                            : 'text-neutral-300'
                      }`}>
                        {module.isLocked ? 'lock' : 'play_circle'}
                      </span>
                      <span className={`text-sm ${
                        module.isLocked 
                          ? 'text-neutral-400' 
                          : module.isActive
                            ? 'font-medium text-neutral-500'
                            : 'text-neutral-400'
                      }`}>
                        {module.title}
                      </span>
                    </div>
                    <span className="text-xs text-neutral-300">{module.duration}</span>
                  </li>
                ))}
              </ul>
            </div>
          </div>
        </CardContent>
      </Card>
    </div>
  );
}
