import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import MarkdownLoader from "./components/MarkdownLoader"
import Navmenu from "./Navmenu"
import { useOrientation } from "./providers/OrientationProvider";
import { useState } from "react";






const App = () => {

  const WikiPage = () => {
    const { page } = useParams();
    const page_name = page?.replaceAll("/wiki/index.php","")
    console.log(page_name)
    const filePath = `/wiki/${page_name || "Main_Page"}.md`;
    return( 
      <div style={markdownPaneStyle}>
        <h1>{page_name?.replaceAll("_", " ")}</h1>
        <MarkdownLoader filePath={filePath} />
      </div>
    );
  };

  const isPortrait = useOrientation();

  const [menuopen, setMenuOpen] = useState<boolean>(!isPortrait);


  const markdownPaneStyle = {
    marginLeft: menuopen? "300px": "60px",
    maxWidth: isPortrait ?"80%" : "1000px" 
  }

  return (
    
      <Router>
        
        <div style={{display:"flex"}}>
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
