import { useState, useEffect } from "react";
import ReactMarkdown from "react-markdown";
import remarkGfm from 'remark-gfm'
import rehypeRaw from "rehype-raw";
// import { Link } from 'react-router-dom'
import { HashLink as Link } from 'react-router-hash-link';
import rehypeSlug from 'rehype-slug';

interface props {
  filePath: string;
}

interface aProps {
  href: string;
  children: never;
}

// react markdown components list
const components = {
  a: ({href, children}: aProps) => <Link to={href}>{children}</Link>,
}

// remark plugin to add a custom tag to the AST
// function htmlDirectives() {
//   return transform

//   function transform(tree) {
//     visit(tree, ['textDirective', 'leafDirective', 'containerDirective'], ondirective)
//   }

//   function ondirective(node) {
//     let data = node.data || (node.data = {})
//     let hast = h(node.name, node.attributes)

//     data.hName = hast.tagname
//     data.hProperties = hast.properties
//   }
// }

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
  // @ts-ignore
  return <ReactMarkdown components={components} remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeRaw] as any, rehypeSlug]} >{content}</ReactMarkdown>;
};

export default MarkdownLoader;
