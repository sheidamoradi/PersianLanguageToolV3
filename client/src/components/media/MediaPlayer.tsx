import { useState } from 'react';
import ReactPlayer from 'react-player';
import { type MediaPlayerProps } from "@/lib/types";
import { Link } from "wouter";
import { X, Bookmark, Share } from "lucide-react";

export default function MediaPlayer({ media, modules }: MediaPlayerProps) {
  const [playing, setPlaying] = useState(false);
  
  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-4xl max-h-[90vh] overflow-auto">
        <div className="flex items-center justify-between p-4 border-b">
          <h2 className="text-xl font-semibold">پخش رسانه</h2>
          <Link href="/">
            <button className="p-2 hover:bg-gray-100 rounded-full">
              <X className="h-5 w-5" />
            </button>
          </Link>
        </div>
        
        <div className="bg-white rounded-lg shadow-md">
          <div className="p-0">
            <div className="bg-gray-500 relative aspect-video">
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
              <h3 className="font-medium text-gray-700 mb-1">{media.title}</h3>
              <p className="text-sm text-gray-500 mb-4">{media.description}</p>
              
              <div className="flex flex-col sm:flex-row sm:items-center justify-between mb-4">
                <div className="flex items-center mb-2 sm:mb-0">
                  <img src={media.instructorAvatar} alt={media.instructorName} className="w-10 h-10 rounded-full object-cover" />
                  <div className="ml-3">
                    <p className="text-sm font-medium text-gray-700">{media.instructorName}</p>
                    <p className="text-xs text-gray-500">{media.instructorTitle}</p>
                  </div>
                </div>
                <div className="flex space-x-2">
                  <button className="flex items-center text-sm text-gray-600 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
                    <Bookmark className="h-4 w-4 mr-1" />
                    ذخیره
                  </button>
                  <button className="flex items-center text-sm text-gray-600 px-3 py-1 border border-gray-300 rounded-md hover:bg-gray-50">
                    <Share className="h-4 w-4 mr-1" />
                    اشتراک
                  </button>
                </div>
              </div>
            </div>
          </div>
          
          {modules && modules.length > 0 && (
            <div className="p-4 border-t bg-gray-50">
              <h4 className="text-lg font-medium mb-3">فهرست محتوا</h4>
              <div className="space-y-2">
                {modules.map((module, index) => (
                  <div key={module.id} className="flex items-center p-2 bg-white rounded border hover:bg-gray-50">
                    <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center text-sm font-medium text-blue-600 mr-3">
                      {index + 1}
                    </div>
                    <div className="flex-1">
                      <h5 className="font-medium text-gray-800">{module.title}</h5>
                      <p className="text-sm text-gray-500">{module.duration}</p>
                    </div>
                  </div>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>
    </div>
  );
}