import { useState } from "react";
import { Document, Page } from "react-pdf";
import { type DocumentViewerProps } from "@/lib/types";
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
  const [numPages, setNumPages] = useState<number>(0);
  const [pageNumber, setPageNumber] = useState<number>(1);
  const [scale, setScale] = useState<number>(1.0);
  
  function onDocumentLoadSuccess({ numPages }: { numPages: number }): void {
    setNumPages(numPages);
  }

  const zoomIn = () => setScale(prev => Math.min(prev + 0.2, 3.0));
  const zoomOut = () => setScale(prev => Math.max(prev - 0.2, 0.5));
  const previousPage = () => setPageNumber(prev => Math.max(prev - 1, 1));
  const nextPage = () => setPageNumber(prev => Math.min(prev + 1, numPages));

  return (
    <div className="fixed inset-0 bg-black bg-opacity-75 z-50 flex items-center justify-center p-4">
      <div className="bg-white rounded-lg w-full max-w-6xl max-h-[95vh] overflow-hidden flex flex-col">
        {/* Header */}
        <div className="flex items-center justify-between p-4 border-b">
          <div>
            <h2 className="text-xl font-semibold text-gray-900">{document.title}</h2>
            <p className="text-sm text-gray-600">{document.description}</p>
          </div>
          <div className="flex items-center gap-2">
            {/* Zoom Controls */}
            <button 
              onClick={zoomOut}
              className="p-2 hover:bg-gray-100 rounded-md"
              title="کوچک کردن"
            >
              <ZoomOut className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-600 min-w-[60px] text-center">
              {Math.round(scale * 100)}%
            </span>
            <button 
              onClick={zoomIn}
              className="p-2 hover:bg-gray-100 rounded-md"
              title="بزرگ کردن"
            >
              <ZoomIn className="h-4 w-4" />
            </button>
            
            {/* Action Buttons */}
            <button className="p-2 hover:bg-gray-100 rounded-md" title="دانلود">
              <Download className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md" title="اشتراک‌گذاری">
              <Share className="h-4 w-4" />
            </button>
            <button className="p-2 hover:bg-gray-100 rounded-md" title="چاپ">
              <Printer className="h-4 w-4" />
            </button>
            
            <Link href="/library">
              <button className="p-2 hover:bg-gray-100 rounded-md" title="بستن">
                <X className="h-4 w-4" />
              </button>
            </Link>
          </div>
        </div>

        {/* PDF Viewer */}
        <div className="flex-1 overflow-auto bg-gray-100 flex flex-col items-center py-4">
          <div className="bg-white shadow-lg">
            <Document
              file={document.fileUrl}
              onLoadSuccess={onDocumentLoadSuccess}
              options={options}
              loading={
                <div className="flex items-center justify-center h-96">
                  <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
                </div>
              }
              error={
                <div className="flex items-center justify-center h-96 text-red-600">
                  خطا در بارگذاری PDF
                </div>
              }
            >
              <Page 
                pageNumber={pageNumber} 
                scale={scale}
                loading={
                  <div className="flex items-center justify-center h-96">
                    <div className="animate-pulse bg-gray-200 w-full h-full"></div>
                  </div>
                }
              />
            </Document>
          </div>
        </div>

        {/* Footer */}
        <div className="flex items-center justify-between p-4 border-t bg-gray-50">
          <div className="flex items-center gap-2">
            <button 
              onClick={previousPage}
              disabled={pageNumber <= 1}
              className="p-2 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronRight className="h-4 w-4" />
            </button>
            <span className="text-sm text-gray-600">
              صفحه {pageNumber} از {numPages}
            </span>
            <button 
              onClick={nextPage}
              disabled={pageNumber >= numPages}
              className="p-2 hover:bg-gray-200 rounded-md disabled:opacity-50 disabled:cursor-not-allowed"
            >
              <ChevronLeft className="h-4 w-4" />
            </button>
          </div>
          
          <div className="text-sm text-gray-500">
            نویسنده: {document.author} • تاریخ انتشار: {document.publishedAt}
          </div>
        </div>
      </div>
    </div>
  );
}