import React, { useState, useEffect } from "react";
import {Link } from "react-router-dom";
import "./Navmenu.css"

const Navmenu = () => {

    const [files, setFiles] = useState([]);

    useEffect(() => {
        // Use import.meta.glob to get the file list
        const filesGlob = import.meta.glob('./wiki/*');
        // Convert the keys (file paths) into a usable array
        const fileList = Object.keys(filesGlob).map((filePath) => ({
        path: filePath,
        name: filePath.split('/').pop(), // Extract file name
        }));
        setFiles(fileList);
    }, []);


    const menuStyle = {
        marginLeft: "8px",
        position: "fixed",
        top: 0,
        left: 0,
        // height: "100%",
        // width: "250px",
        // background-color: "#333",
        // color: "#fff",
        // overflow-x: "hidden",
        // transition: "all 0.3s ease",
        // box-shadow: "2px 0 5px rgba(0, 0, 0, 0.2)"
      };


return(
    <div style={menuStyle}>

        {files.map((file) => { 
            const name = file.name.replaceAll(".md", "");
            return(
            <div >
                <Link to={`/${name}`}>{name.replaceAll("_", " ")}</Link>
            </div>
            )
        }
        )
        }
    </div>
);

};
export default Navmenu;