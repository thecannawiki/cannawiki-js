import { useState, useEffect } from "react";
import {Link } from "react-router-dom";
import "./Navmenu.css"
import React from 'react';

interface props {
    isMenuOpen: boolean;
    setMenuOpen: React.Dispatch<React.SetStateAction<boolean>>;
}

const Navmenu = ({isMenuOpen, setMenuOpen}: props) => {

    interface fileList {
        path:string,
        name:string
    }

 

    const [files, setFiles] = useState<fileList[]>([]);
  

    

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


    const menuStyle: React.CSSProperties = {
        marginLeft: "12px",
        position: "fixed",
        top: 0,
        left: 0,
        lineHeight: 1.6,
        height: "100vh",
        width: isMenuOpen ? "280px" : "0px",
        // overflowY: "scroll",
        display: "flex",
        flexDirection: "column",
        // background-color: "#333",
        // color: "#fff",
        // overflow-x: "hidden",
        // transition: "all 0.3s ease",
        // box-shadow: "2px 0 5px rgba(0, 0, 0, 0.2)"
      };

    const menuFooter = {
        flexGrow: 0, /* Keeps the bottom segment at its natural size */
        marginTop: "auto", /* Push the bottom segment to the bottom */
        marginBottom:"8px"
    };


return(
    <div style={menuStyle}>

        <Link to="/"><img src="/images/CannawikiLogo.png" style={{maxHeight:"100%", maxWidth:"100%"}}/></Link>

        <div style={{overflowY: "scroll"}}>
            {files.map((file: fileList) => { 
                const name = file.name.replaceAll(".md", "");
                return(
                    <div >
                        <Link to={`/${name}`}>{name.replaceAll("_", " ")}</Link>
                    </div>
                )
            })}
        </div>

        <div style={menuFooter} onClick={()=> {setMenuOpen(!isMenuOpen)}}>{isMenuOpen ? "close Menu" :"open menu"}</div>
    </div>
);

};
export default Navmenu;