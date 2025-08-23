import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import MarkdownLoader from "./components/MarkdownLoader"
import Navmenu from "./Navmenu"
import { useOrientation } from "./providers/OrientationProvider";
import { useEffect, useState } from "react";
import "./App.css"
import Analytics from "./components/Analytics";


const App = () => {
  const [times, setTimes] = useState({});

  useEffect(() => {
    fetch("/file-timestamps.json") // file.json should be in your `public/` folder
      .then((res) => {
        console.log(res)
        if (!res.ok) {
          throw new Error("Failed to fetch JSON file");
        }
        return res.json();
      })
      .then((json)=>{setTimes(json);console.log(json);})
      .catch((err)=> {console.log(err)});
  }, []);

  const WikiPage = () => {
    const { page } = useParams();
    const page_name = page?.replaceAll("/wiki/index.php","")
    console.log(page_name)
    const filePath = `/wiki/${page_name || "Home"}.md`;
    return( 
      <div style={PageContainer}>
        <div style={markdownPaneStyle} className="markdownPane">
          <MarkdownLoader filePath={filePath} updateTimes={times}/>
        </div>
      </div>
    );
  };


  const isPortrait = useOrientation();

  const [menuopen, setMenuOpen] = useState<boolean>(!isPortrait);

  const markdownPaneStyle: React.CSSProperties = {
    maxWidth: "1000px",
    minWidth: "200px",
    marginLeft: menuopen? "12px": "40px",
    marginRight: "16px",
  }

  const PageContainer: React.CSSProperties = {
    display:"flex",
    justifyContent: "center", /* Centers horizontally */
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
