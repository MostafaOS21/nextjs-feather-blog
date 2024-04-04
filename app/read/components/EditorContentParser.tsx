// edjsHTML transforms editor js blocks to html
import edjsHTML from "editorjs-html";
// this function parses strings (html elements) to html
import parse from "html-react-parser";
import { Noto_Serif_Georgian } from "next/font/google";
import { EditorParser, EditorRenderer } from "@mobtakr/editorjs-parser";

// Serif font
const serif_font = Noto_Serif_Georgian({
  subsets: ["latin"],
  weight: ["200", "300", "400", "500", "600", "700"],
});

import styles from "../styles.module.css";

// Editor Parser
export default function EditorContentParser({ content }: { content: any[] }) {
  // @ts-ignore
  const html = edjsHTML()?.parse({ blocks: content });

  const parser = new EditorParser(content);

  const parsedBlocks = parser.parse();

  return (
    <div className={serif_font.className + " " + styles.articleContainer}>
      {/* {parse(html.join(""))}
       */}
      <EditorRenderer parsedBlocks={parsedBlocks} styles={""} />
    </div>
  );
}
