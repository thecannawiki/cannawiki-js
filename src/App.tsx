import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import MarkdownLoader from "./components/MarkdownLoader"
import Navmenu from "./Navmenu"
import { useOrientation } from "./providers/OrientationProvider";
import { useState } from "react";

import Analytics from "./components/Analytics";





const App = () => {

  const WikiPage = () => {
    const { page } = useParams();
    const page_name = page?.replaceAll("/wiki/index.php","")
    console.log(page_name)
    const filePath = `/wiki/${page_name || "Main_Page"}.md`;
    return( 
      <div style={PageContainer}>
        <div style={markdownPaneStyle}>
          <h1>{page_name?.replaceAll("_", " ")}</h1>
          <MarkdownLoader filePath={filePath} />
        </div>
      </div>
    );
  };


  const isPortrait = useOrientation();

  const [menuopen, setMenuOpen] = useState<boolean>(!isPortrait);

  const markdownPaneStyle: React.CSSProperties = {
     maxWidth: isPortrait ?"80%" : "1000px",
     wordWrap: 'break-word',      // Allows words to break onto the next line
      // overflowWrap: 'break-word', // Ensures compatibility across browsers
      wordBreak: 'break-word',
  }

  const PageContainer: React.CSSProperties = {
    marginLeft: menuopen? "300px": "60px",
    // maxWidth: isPortrait ?"80%" : "1000px" 
    display:"flex",
    justifyContent: "center", /* Centers horizontally */
    // alignItems: "center",
    width: "100%"
  }

  return (
    
      <Router>
        <Analytics/>
        
        <div style={{display:"flex", overflowX: "hidden"}}>
          <nav>
            <Navmenu isMenuOpen={menuopen} setMenuOpen={setMenuOpen} />  
          </nav>


          <Routes>
            <Route path="/" element={<WikiPage />} />
            <Route path="/:page" element={<WikiPage />} />
            <Route path="/wiki/index.php/:page" element={<WikiPage />} />
          </Routes>
        </div>

      </Router>

  );
};

export default App;
