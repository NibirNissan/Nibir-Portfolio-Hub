import { useEffect, useRef } from "react";
import Quill from "quill";
import "quill/dist/quill.snow.css";

interface QuillEditorProps {
  value: string;
  onChange: (html: string) => void;
  placeholder?: string;
}

export default function QuillEditor({ value, onChange, placeholder }: QuillEditorProps) {
  const containerRef = useRef<HTMLDivElement>(null);
  const quillRef = useRef<Quill | null>(null);
  const onChangeRef = useRef(onChange);
  const isInternalChange = useRef(false);

  useEffect(() => {
    onChangeRef.current = onChange;
  }, [onChange]);

  useEffect(() => {
    if (!containerRef.current || quillRef.current) return;

    const editorDiv = document.createElement("div");
    containerRef.current.appendChild(editorDiv);

    const quill = new Quill(editorDiv, {
      theme: "snow",
      placeholder: placeholder ?? "Write your content here...",
      modules: {
        toolbar: [
          [{ header: [1, 2, 3, false] }],
          ["bold", "italic", "underline", "strike"],
          [{ list: "ordered" }, { list: "bullet" }],
          ["blockquote", "code-block"],
          ["link", "image"],
          [{ color: [] }, { background: [] }],
          ["clean"],
        ],
      },
    });

    quillRef.current = quill;

    if (value) {
      quill.clipboard.dangerouslyPasteHTML(value);
    }

    quill.on("text-change", () => {
      isInternalChange.current = true;
      const html = editorDiv.querySelector(".ql-editor")?.innerHTML ?? "";
      onChangeRef.current(html === "<p><br></p>" ? "" : html);
      isInternalChange.current = false;
    });

    return () => {
      quillRef.current = null;
      if (containerRef.current) {
        containerRef.current.innerHTML = "";
      }
    };
  }, []);

  useEffect(() => {
    if (!quillRef.current || isInternalChange.current) return;
    const current = quillRef.current.root.innerHTML;
    if (current !== value) {
      quillRef.current.clipboard.dangerouslyPasteHTML(value ?? "");
    }
  }, [value]);

  return <div ref={containerRef} className="quill-wrapper" />;
}
