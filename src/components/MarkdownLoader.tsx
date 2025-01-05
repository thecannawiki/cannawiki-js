import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import rehypeRaw from "rehype-raw";


interface props {
  filePath: string;
}

const MarkdownLoader = ({ filePath } :props) => {
  const [content, setContent] = useState("");
  console.log(filePath);
  useEffect(() => {
    fetch(filePath)
      .then((response) => {
        console.log(response)
        if (!response.ok) throw new Error("Markdown file not found.");
        return response.text();
      })
      .then(setContent)
      .catch((err) => setContent(`# Error\n${err.message}`));
  }, [filePath]);
 
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  return <ReactMarkdown remarkPlugins={[remarkGfm]} rehypePlugins={[rehypeRaw] as any} >{content}</ReactMarkdown>;
};

export default MarkdownLoader;
