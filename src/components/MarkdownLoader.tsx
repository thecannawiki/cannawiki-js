// @ts-nocheck
import React, { useState, useEffect, ReactElement } from "react";
import ReactMarkdown, { Components } from "react-markdown";
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

interface refTagProds {
  children: ReactElement;
}



const MarkdownLoader = ({ filePath }:props) => {

  const [content, setContent] = useState("");
  const [refDict, setRefDict] = useState({});
  
  const parseRefs = (htmlString: string) => {
    const refPattern = /<ref>(.*?)<\/ref>/g; // Regular expression to match <ref> tags
    let match;
    let order = 1;
    const result = {};

    // Match all occurrences of <ref>...</ref> tags
    while ((match = refPattern.exec(htmlString)) !== null) {
      const refText = match[1]; // Text inside <ref>...</ref>
      // @ts-ignore
      result[refText] = order; // Store text as key and order as value
      order++;
    }

    console.log(result);
    setRefDict(result); // Update the state with the parsed dictionary
  };




  const RefComponent = ({children}: refTagProds) => {
    let link="";
    let textContent: string = "";
    React.Children.forEach(children, (child: ReactElement) => {
      if (child.type == undefined) {
        // If the child is a string, append it to the textContent variable
        if(child != undefined){
          textContent += child;
        }
        
      } else {
        link = child.props.href; // Extract the href
        textContent += link
      }
    });
    
    // @ts-ignore
    const count = refDict[textContent];
  
    return (
      // @ts-expect-error
      <Link to={link} title={textContent}><sup>[{count}]</sup></Link>
    );
    
  }


  useEffect(()=>{
    parseRefs(content);
  },[content])
  
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
  

  // react markdown components list
  const components: Components = {
    a: ({href, children}: aProps) => <Link to={href}>{children}</Link>,
    ref: ({children}: refTagProds) => <RefComponent children={children}/>,
  }

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  // @ts-ignore
  return (
    <>
    <ReactMarkdown components={components} remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeRaw] as any, rehypeSlug]} >{content}</ReactMarkdown>
    

    
        {/* {Object.entries(refDict).map(([text, order]) => { 
                        // const name = file.name.replaceAll(".md", "");
                        return(
                            <div >
                                {order}{text}
                            </div>
                        )
        })} */}
    </>
  );
};

export default MarkdownLoader;
