
import { BrowserRouter as Router, Routes, Route, useParams } from "react-router-dom";
import MarkdownLoader from "./components/MarkdownLoader"
import Navmenu from "./Navmenu"


const mainContentStyle = {
  marginLeft:"300px",
  maxWidth: "50%"
}


const WikiPage = () => {
  const { page } = useParams();
  const filePath = `./wiki/${page || "Main_Page"}.md`;
  return( 
    <div style={mainContentStyle}>
      <h1>{page?.replaceAll("_", " ")}</h1>
      <MarkdownLoader filePath={filePath} />
    </div>
  );
};

const App = () => {








  return (
    <Router>
      <nav>
        <Navmenu />
        
      </nav>
      <Routes>
        <Route path="/" element={<WikiPage />} />
        <Route path="/:page" element={<WikiPage />} />
      </Routes>
    </Router>
  );
};

export default App;
