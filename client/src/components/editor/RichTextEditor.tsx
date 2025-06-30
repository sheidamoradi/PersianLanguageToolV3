import { useState } from 'react';
import { 
  Bold, 
  Italic, 
  Underline as UnderlineIcon, 
  List, 
  ListOrdered, 
  Quote, 
  Undo, 
  Redo,
  AlignLeft,
  AlignCenter,
  AlignRight,
  Link as LinkIcon,
  Image as ImageIcon,
  Type
} from 'lucide-react';

interface RichTextEditorProps {
  content: string;
  onChange: (content: string) => void;
  onImageInsert?: () => void;
}

export default function RichTextEditor({ content, onChange, onImageInsert }: RichTextEditorProps) {
  const [editorContent, setEditorContent] = useState(content);

  const handleChange = (value: string) => {
    setEditorContent(value);
    onChange(value);
  };

  return (
    <div className="border border-gray-300 rounded-lg overflow-hidden">
      {/* Toolbar */}
      <div className="border-b border-gray-200 p-2 bg-gray-50">
        <div className="flex flex-wrap gap-1">
          {/* Text Formatting */}
          <div className="flex gap-1 border-l border-gray-300 pl-2 ml-2">
            <button
              className="p-2 rounded hover:bg-gray-200"
              title="ضخیم"
            >
              <Bold className="h-4 w-4" />
            </button>
            <button
              className="p-2 rounded hover:bg-gray-200"
              title="کج"
            >
              <Italic className="h-4 w-4" />
            </button>
            <button
              className="p-2 rounded hover:bg-gray-200"
              title="زیرخط"
            >
              <UnderlineIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Lists */}
          <div className="flex gap-1 border-l border-gray-300 pl-2 ml-2">
            <button
              className="p-2 rounded hover:bg-gray-200"
              title="لیست"
            >
              <List className="h-4 w-4" />
            </button>
            <button
              className="p-2 rounded hover:bg-gray-200"
              title="لیست شماره‌دار"
            >
              <ListOrdered className="h-4 w-4" />
            </button>
            <button
              className="p-2 rounded hover:bg-gray-200"
              title="نقل قول"
            >
              <Quote className="h-4 w-4" />
            </button>
          </div>

          {/* Alignment */}
          <div className="flex gap-1 border-l border-gray-300 pl-2 ml-2">
            <button
              className="p-2 rounded hover:bg-gray-200"
              title="راست‌چین"
            >
              <AlignRight className="h-4 w-4" />
            </button>
            <button
              className="p-2 rounded hover:bg-gray-200"
              title="وسط‌چین"
            >
              <AlignCenter className="h-4 w-4" />
            </button>
            <button
              className="p-2 rounded hover:bg-gray-200"
              title="چپ‌چین"
            >
              <AlignLeft className="h-4 w-4" />
            </button>
          </div>

          {/* Media */}
          <div className="flex gap-1 border-l border-gray-300 pl-2 ml-2">
            <button
              className="p-2 rounded hover:bg-gray-200"
              title="افزودن لینک"
            >
              <LinkIcon className="h-4 w-4" />
            </button>
            <button
              onClick={onImageInsert}
              className="p-2 rounded hover:bg-gray-200"
              title="افزودن تصویر"
            >
              <ImageIcon className="h-4 w-4" />
            </button>
          </div>

          {/* Undo/Redo */}
          <div className="flex gap-1">
            <button
              className="p-2 rounded hover:bg-gray-200"
              title="بازگشت"
            >
              <Undo className="h-4 w-4" />
            </button>
            <button
              className="p-2 rounded hover:bg-gray-200"
              title="تکرار"
            >
              <Redo className="h-4 w-4" />
            </button>
          </div>
        </div>
      </div>

      {/* Simple Textarea Editor */}
      <textarea
        value={editorContent}
        onChange={(e) => handleChange(e.target.value)}
        className="w-full min-h-[300px] max-h-[500px] p-4 resize-none focus:outline-none"
        dir="rtl"
        placeholder="محتوای نوشته خود را اینجا بنویسید..."
      />
    </div>
  );
}