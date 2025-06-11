import { useQuery } from "@tanstack/react-query";
import { useParams } from "wouter";
import PDFViewer from "@/components/document/PDFViewer";
import { type Document } from "@shared/schema";


export default function DocumentViewerPage() {
  const { id } = useParams<{ id: string }>();
  const documentId = parseInt(id);
  
  const { data: document, isLoading, error } = useQuery<Document>({ 
    queryKey: ['/api/documents', documentId],
    enabled: !isNaN(documentId)
  });
  
  if (isNaN(documentId)) {
    return (
      <div className="text-center py-10">
        <p className="text-status-error font-medium">Invalid document ID</p>
      </div>
    );
  }
  
  if (isLoading) {
    return (
      <div className="mb-10">
        <div className="mb-4">
          <Skeleton className="w-1/3 h-8 mb-2" />
          <Skeleton className="w-1/2 h-4" />
        </div>
        
        <div className="bg-white rounded-xl shadow-sm overflow-hidden">
          <div className="border-b border-neutral-200 p-4 flex items-center justify-between">
            <div className="flex items-center">
              <Skeleton className="w-8 h-8 mr-2 rounded" />
              <div>
                <Skeleton className="w-40 h-6 mb-1" />
                <Skeleton className="w-24 h-3" />
              </div>
            </div>
            <div className="flex items-center">
              <Skeleton className="w-8 h-8 rounded mx-1" />
              <Skeleton className="w-8 h-8 rounded mx-1" />
              <Skeleton className="w-8 h-8 rounded mx-1" />
            </div>
          </div>
          
          <div className="pdf-viewer p-4 flex flex-col items-center justify-center border-b border-neutral-200 min-h-[400px] bg-neutral-50">
            <Skeleton className="w-full max-w-2xl h-[600px] mx-auto" />
          </div>
        </div>
      </div>
    );
  }
  
  if (error || !document) {
    return (
      <div className="text-center py-10">
        <p className="text-status-error font-medium">Error loading document</p>
        <p className="text-neutral-400 mt-2">Please try again later</p>
      </div>
    );
  }
  
  return (
    <PDFViewer document={document} />
  );
}
