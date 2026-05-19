import { BrowserRouter as Router, Routes, Route, useParams} from "react-router-dom";
import MarkdownLoader from "./components/MarkdownLoader"
import Navmenu from "./Navmenu"
import { useOrientation } from "./providers/OrientationProvider";
import { useEffect, useState } from "react";
import "./App.css"
import Analytics from "./components/Analytics";
import ScrollRestoration from "./components/ScrollRestoration";
import SearchPage from "./components/SearchPage";


const App = () => {


  const maxContentWidth = () => {
    const width = window.innerWidth;
    if(width >= 1440){
      return "1000px";
    }
    if(width >= 768){
      return "660px";
    }
    return "480px"
  }


  const [times, setTimes] = useState({});
  const [maxContWidth, setMaxContWidth] = useState(maxContentWidth());

  useEffect(() => {
    setMaxContWidth(maxContentWidth())
  }, [window.innerWidth]);



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

  const [menuopen, setMenuOpen] = useState<boolean>(!isPortrait && window.innerWidth > 850); // TODO check also monitor width > 1024 b4 opening menu

 

  const markdownPaneStyle: React.CSSProperties = {
    maxWidth: maxContWidth,
    minWidth: "200px",
    marginLeft: menuopen? "12px": "28px",
    marginRight: "16px",
  }

  const PageContainer: React.CSSProperties = {
    display:"flex",
    justifyContent: "center", /* Centers horizontally */
    width: "100%"
  }

  return (
    
      <Router>
        <ScrollRestoration />
        <Analytics/>
        <div style={{display:"flex", overflowX: "hidden"}}>
          <nav>
            <Navmenu isMenuOpen={menuopen} setMenuOpen={setMenuOpen} />  
          </nav>

          <Routes>
            <Route path="/search" element={<SearchPage />} />
            <Route path="/" element={<WikiPage />} />
            <Route path="/:page" element={<WikiPage />} />
            <Route path="/wiki/index.php/:page" element={<WikiPage />} />
          </Routes>
         
        </div>
        
      </Router>
      
  );
};

export default App;
