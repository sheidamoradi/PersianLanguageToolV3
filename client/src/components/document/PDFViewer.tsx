import { useState } from "react";
import { Document, Page } from "react-pdf";
import { Button } from "@/components/ui/button";
import { type DocumentViewerProps } from "@/lib/types";
import { Card, CardContent, CardHeader, CardTitle, CardDescription } from "@/components/ui/card";
import { Skeleton } from "@/components/ui/skeleton";
import { 
  Download, Share, Printer, ChevronLeft, ChevronRight, 
  ZoomIn, ZoomOut, X 
} from "lucide-react";
import { Link } from "wouter";

import 'react-pdf/dist/esm/Page/AnnotationLayer.css';
import 'react-pdf/dist/esm/Page/TextLayer.css';

const options = {
  cMapUrl: 'https://cdn.jsdelivr.net/npm/pdfjs-dist@3.4.120/cmaps/',
  cMapPacked: true,
};

export default function PDFViewer({ document }: DocumentViewerProps) {
  const [numPages, setNumPages] = useState<number | null>(null);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  const [loading, setLoading] = useState<boolean>(true);

  function onDocumentLoadSuccess({ numPages }: { numPages: number }) {
    setNumPages(numPages);
    setLoading(false);
  }

  function changePage(offset: number) {
    if (numPages === null) return;
    
    const newPageNumber = pageNumber + offset;
    if (newPageNumber >= 1 && newPageNumber <= numPages) {
      setPageNumber(newPageNumber);
    }
  }

  function changeZoom(delta: number) {
    const newScale = Math.max(0.5, Math.min(2.0, scale + delta));
    setScale(newScale);
  }

  return (
    <div className="mb-10">
      <div className="mb-4 flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-semibold text-neutral-500">Document Viewer</h2>
          <p className="text-neutral-300">View and interact with PDF documents</p>
        </div>
        <Link href="/">
          <Button variant="ghost" className="text-neutral-400 hover:text-primary">
            <X className="h-5 w-5" />
          </Button>
        </Link>
      </div>
      
      <Card>
        <CardHeader className="border-b border-neutral-200 p-4 flex-row justify-between items-center space-y-0">
          <div className="flex items-center">
            <span className="material-icons text-status-error text-2xl mr-2">picture_as_pdf</span>
            <div>
              <CardTitle className="font-medium text-neutral-500">{document.fileName}</CardTitle>
              <CardDescription className="text-xs text-neutral-300">Last updated: {document.lastUpdated}</CardDescription>
            </div>
          </div>
          <div className="flex items-center">
            {document.allowDownload && (
              <Button variant="ghost" className="p-2 text-neutral-400 hover:text-primary" title="Download PDF">
                <Download className="h-5 w-5" />
              </Button>
            )}
            <Button variant="ghost" className="p-2 text-neutral-400 hover:text-primary" title="Share">
              <Share className="h-5 w-5" />
            </Button>
            <Button variant="ghost" className="p-2 text-neutral-400 hover:text-primary" title="Print">
              <Printer className="h-5 w-5" />
            </Button>
          </div>
        </CardHeader>
        
        <CardContent className="pdf-viewer p-4 flex flex-col items-center justify-center border-b border-neutral-200 min-h-[400px] bg-neutral-50">
          <Document
            file={document.fileUrl}
            onLoadSuccess={onDocumentLoadSuccess}
            options={options}
            loading={<Skeleton className="w-full max-w-2xl h-[600px] mx-auto" />}
            error={
              <div className="text-center text-status-error">
                <p className="font-medium">Failed to load PDF</p>
                <p className="text-sm">Please try again later</p>
              </div>
            }
          >
            {loading ? (
              <Skeleton className="w-full max-w-2xl h-[600px] mx-auto" />
            ) : (
              <Page
                pageNumber={pageNumber}
                scale={scale}
                renderTextLayer={true}
                renderAnnotationLayer={true}
                className="mx-auto shadow-md"
              />
            )}
          </Document>
        </CardContent>
        
        <div className="p-4 flex items-center justify-between">
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="p-1 text-neutral-400 hover:text-primary" 
              title="Previous Page"
              onClick={() => changePage(-1)}
              disabled={pageNumber <= 1}
            >
              <ChevronLeft className="h-5 w-5" />
            </Button>
            <span className="mx-3 text-sm">Page {pageNumber} of {numPages || document.totalPages}</span>
            <Button 
              variant="ghost" 
              className="p-1 text-neutral-400 hover:text-primary" 
              title="Next Page"
              onClick={() => changePage(1)}
              disabled={pageNumber >= (numPages || document.totalPages)}
            >
              <ChevronRight className="h-5 w-5" />
            </Button>
          </div>
          <div className="flex items-center">
            <Button 
              variant="ghost" 
              className="p-1 text-neutral-400 hover:text-primary" 
              title="Zoom Out"
              onClick={() => changeZoom(-0.1)}
              disabled={scale <= 0.5}
            >
              <ZoomOut className="h-5 w-5" />
            </Button>
            <span className="mx-3 text-sm">{Math.round(scale * 100)}%</span>
            <Button 
              variant="ghost" 
              className="p-1 text-neutral-400 hover:text-primary" 
              title="Zoom In"
              onClick={() => changeZoom(0.1)}
              disabled={scale >= 2.0}
            >
              <ZoomIn className="h-5 w-5" />
            </Button>
          </div>
        </div>
      </Card>
    </div>
  );
}
