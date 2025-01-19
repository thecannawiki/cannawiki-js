import { useState, useEffect } from "react";
import {Link, useLocation } from "react-router-dom";
// import "./Navmenu.css"
import React from 'react';
import { useOrientation } from "./providers/OrientationProvider";


interface props {
    isMenuOpen: boolean;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navmenu = ({isMenuOpen, setMenuOpen}: props) => {

    interface fileList {
        path:string,
        name:string
    }

    const FILENAMES_TO_IGNORE= ["Home"];
 
    const [files, setFiles] = useState<fileList[]>([]);
    const isPortrait = useOrientation();
    

    useEffect(() => {
        // Use import.meta.glob to get the file list
        const filesGlob = import.meta.glob('./wiki/*');
        // Convert the keys (file paths) into a usable array
        const fileList = Object.keys(filesGlob).map((filePath) => ({
        path: filePath,
        name: filePath.split('/').pop() || "err", // Extract file name
        }));
        setFiles(fileList);
    }, []);

    const location = useLocation();

    useEffect(() => {
        const onNavigation = () => {
            if(isPortrait){setMenuOpen(false);}
        };

        onNavigation();
    }, [location]);


    const menuStyle: React.CSSProperties = {
        marginLeft: "12px",
        // position: "fixed",
        top: 0,
        left: 0,
        lineHeight: 1.6,
        height: "98vh",
        width: isMenuOpen || !isPortrait ? "270px" : "0px",
        // overflowY: "scroll",
        display: "flex",
        flexDirection: "column",
        // background-color: "#333",
        // color: "#fff",
        // overflow-x: "hidden",
        transition: "all 0.3s ease",
        // box-shadow: "2px 0 5px rgba(0, 0, 0, 0.2)"
      };

    const menuFooter = {
        flexGrow: 0, /* Keeps the bottom segment at its natural size */
        marginTop: "auto", /* Push the bottom segment to the bottom */
        marginBottom:"16px",
        paddingTop:"8px"
    };

    const headerImage = {
        marginLeft: "auto", 
        marginRight: "auto", 
        display: "block", 
        width: "60%", 
        marginBottom:"8px",
        marginTop:"8px"
    }


return(
    <>  <div style={{...menuStyle}} ></div> {/* layout div */}
        <div style={{...menuStyle, position:"fixed"}}>
            

            <Link to="/"><img src="/images/CannawikiLogo.png" style={headerImage}/></Link>

            <div className="hide-scrollbar" style={{overflowY: "scroll", width:"100%"}}>
                {files.map((file: fileList) => { 
                    const name = file.name.replaceAll(".md", "");
                    const should_ignore = FILENAMES_TO_IGNORE.includes(name);
                    if(should_ignore){return(<></>);}
                    return(
                        <div >
                            <Link to={`/${name}`}>{name.replaceAll("_", " ")}</Link>
                        </div>
                    )
                })}
            </div>
            {isMenuOpen && isPortrait && <div style={menuFooter} onClick={()=> {setMenuOpen(!isMenuOpen)}}>{"Close Menu"}</div>}
            
        </div>
        
        {!isMenuOpen && isPortrait &&
        <div style={{width:"20px", height:"20px", position:"fixed", top:"20px"}} onClick={()=> {setMenuOpen(!isMenuOpen)}}>
            {/* <BurgerMenu fill="white"/>
             */}

             <img src="/images/burger-menu-svgrepo-com.svg"/>
            </div>
        }
    </>
);

};
export default Navmenu;