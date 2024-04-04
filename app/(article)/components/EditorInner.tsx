"use client";
import React, { useCallback, useEffect } from "react";
import debounce from "lodash.debounce";
import Editor, { API } from "@editorjs/editorjs";
import { Noto_Serif_Georgian } from "next/font/google";
//@ts-ignore
import ImageTool from "@editorjs/image";
//@ts-ignore
import ListTool from "@editorjs/list";
//@ts-ignore
import QuoteTool from "@editorjs/quote";
//@ts-ignore
import HeaderTool from "@editorjs/header";
// @ts-ignore
import CodeTool from "@editorjs/code";
// @ts-ignore
// import LinkTool from "@editorjs/link"

import { IEditorProps } from "./EditorContainer";
import { api } from "@/api/api";
import toast from "react-hot-toast";

// EditorJS Tools
const editorJsTools = {
  list: ListTool,
  quote: QuoteTool,
  header: {
    class: HeaderTool,
    placeholder: "Enter a header",
    levels: [1, 2, 3],
    defaultLevel: 1,
  },
  // LinkTool,
  code: CodeTool,
};

const EDITOR_TOOLS = {
  ...editorJsTools,
  image: {
    class: ImageTool,
    config: {
      uploader: {
        async uploadByFile(file: File) {
          try {
            const formData = new FormData();
            formData.append("image", file);

            const res = await api.post("/article/upload-image", formData, {
              headers: {
                "Content-Type": "multipart/form-data",
              },
            });

            const data: {
              success: number;
              file: {
                url: string;
              };
            } = await res.data;

            if (data?.success === 1) {
              return {
                success: 1,
                file: {
                  url: `${process.env.NEXT_PUBLIC_API_URL}/${data.file.url}`,
                },
              };
            }
          } catch (error) {
            toast.error("Failed to upload image");
          }
        },
      },
      types: ".jpg,.jpeg,.png",
    },
  },
};

// Serif font
const serif_font = Noto_Serif_Georgian({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

// Custom hook for debouncing
function useDebounce(callback: (content: API) => void, delay: number) {
  const debouncedCallback = useCallback(
    debounce((content: API) => {
      callback(content);
    }, delay),
    [callback, delay]
  );

  return debouncedCallback;
}

// EditorInner
export default function EditorInner({
  useArticleData: { articleData, setArticleData },
  editorRef,
  setIsSaveDisabled,
  setIsPublishDisabled,
}: IEditorProps) {
  const useDebounceSave = useDebounce(async (content: API) => {
    try {
      const data = await content.saver.save();
      setArticleData((prev) => ({
        ...prev,
        blocks: data.blocks,
      }));
    } catch (error) {
      toast.error("Failed to save article");
    } finally {
      setIsSaveDisabled(false);
    }
  }, 3000);

  useEffect(() => {
    if (!editorRef.current) {
      const editor = new Editor({
        holder: "editorjs",
        placeholder: "Let's write something fancy...",
        tools: EDITOR_TOOLS,
        data: articleData,
        onChange: (content) => {
          setIsSaveDisabled(true);
          setIsPublishDisabled(true);
          useDebounceSave(content);
        },
      });

      editorRef.current = editor;
    }
    return () => {
      if (editorRef.current) {
        return editorRef.current.destroy?.();
      }
    };
  }, []);

  return <div id="editorjs" className={serif_font.className}></div>;
}
