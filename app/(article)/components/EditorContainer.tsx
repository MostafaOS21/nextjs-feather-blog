import dynamic from "next/dynamic";
import { IBlogData } from "../article/[[...articleId]]/page";
import EditorJS from "@editorjs/editorjs";

const EditorInner = dynamic(() => import("./EditorInner"), {
  ssr: false,
});

// Props Interface
export interface IEditorProps {
  useArticleData: {
    articleData: IBlogData;
    setArticleData: React.Dispatch<React.SetStateAction<IBlogData>>;
  };
  editorRef: React.MutableRefObject<EditorJS | undefined>;
  setIsSaveDisabled: React.Dispatch<React.SetStateAction<boolean>>;
  setIsPublishDisabled: React.Dispatch<React.SetStateAction<boolean>>;
}

export default function EditorContainer({
  useArticleData: { articleData, setArticleData },
  editorRef,
  setIsSaveDisabled,
  setIsPublishDisabled,
}: IEditorProps) {
  return (
    <EditorInner
      useArticleData={{ articleData, setArticleData }}
      editorRef={editorRef}
      setIsSaveDisabled={setIsSaveDisabled}
      setIsPublishDisabled={setIsPublishDisabled}
    />
  );
}
