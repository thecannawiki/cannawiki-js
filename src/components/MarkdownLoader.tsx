// @ts-nocheck
import React, { useState, useEffect, ReactElement } from "react";
import ReactMarkdown, { Components } from "react-markdown";
import remarkGfm from 'remark-gfm'
import rehypeRaw from "rehype-raw";
import { HashLink as Link } from 'react-router-hash-link';
import rehypeSlug from 'rehype-slug';
import { Helmet } from "react-helmet";

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

function extractFirstImgSrc(htmlString: string): string | null {
    // Regular expression to match the first <img> tag and extract its src attribute
    const match = htmlString.match(/<img[^>]+src=["'](.*?)["']/i);
    if (match && match[1]) {
        return match[1]; // Return the captured src value
    }
    return null; // Return null if no match is found
}

const MarkdownLoader = ({ filePath }:props) => {

  const [content, setContent] = useState("");
  const [refDict, setRefDict] = useState({});

  const page_name: string = filePath.split("/").at(-1)?.replaceAll("_", " ").replaceAll(".md","")
  
  const parseRefs = (htmlString: string) => {
    const refPattern = /<ref>(.*?)<\/ref>/g; // Regular expression to match <ref> tags
    let match;
    let order = 1;
    const result = {};

    // Match all occurrences of <ref>...</ref> tags
    while ((match = refPattern.exec(htmlString)) !== null) {
      const refText = match[1]; // Text inside <ref>...</ref>
      // @ts-ignore
      if(!(Object.prototype.hasOwnProperty.call(result, refText))){
        result[refText] = order; // Store text as key and order as value
        order++;
      }
    }
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
    if(count){
      return (
        // @ts-expect-error
        <Link to={link} title={textContent}><sup>[{count}]</sup></Link>
      );
    }
    
    return(<></>);
    
  }

  const RefListComponent = () => {
    const extractLink = (text) =>{
      const urlRegex = /(https?:\/\/[^\s]+)/g; // Matches URLs starting with http:// or https://
      const matches = text.match(urlRegex); // Finds all matches in the string
      return matches ? matches[0] : null; // Returns the first match or null if no match
    }

    if(Object.keys(refDict).length>0){
      return(
        <div style={{marginTop:"60px"}}>
          <h2>References</h2>
          <ol>
            {Object.entries(refDict).map(([text]) => { 
              const link = extractLink(text)
              let refText = text.replaceAll(link,"");
              return(
                  
                    <li style={{marginBottom:"16px"}}>
                        {`${refText} `}<a href={link}>{link}</a>
                    </li>
                  
              )
            })}
          </ol>
        </div>
      );
    } else {
      return(<></>);
    }
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
    <Helmet>
        <meta charSet="utf-8" />
        <title>{page_name !== "Home" ? page_name : "Cannawiki"}</title>
        <meta property="og:type" content="website"/>
        <meta property="og:title" content={page_name}/>
        <meta property="og:description" content={`${content.slice(0, 200).replace(/<\/?[^>]+(>|$)/g, "")}...`}/>
        <meta property="og:image" content={`https://cannawiki.net${extractFirstImgSrc(content)}` || "https://cannawiki.net/images/CannawikiLogo.png"}/>
    </Helmet>
    <ReactMarkdown components={components} remarkPlugins={[remarkGfm]} rehypePlugins={[[rehypeRaw] as any, rehypeSlug]} >{content}</ReactMarkdown>
    <RefListComponent/>
    </>
  );
};

export default MarkdownLoader;
