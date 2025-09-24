import { useState } from "react";




interface props {
    src: string;
    className: string;
    title: string;
    style: string;
    alt: string;
  }

const ClickableImage = ({src, className, title, style, alt}: props) => {


    const [isFullscreen, setIsFullscreen] = useState(false);


    const nolink = className?.includes("nolink") ?? false;


    return (
        <>
        {!nolink && (
        
            <a href={src} style={style}  target="_blank" rel="noopener noreferrer" >
                <img src={src} className={className} title={title} style={style}/>
            </a>
        )}

        {nolink &&(

            <img src={src} className={className} title={title} style={style}/>

        )}
        </>
        // <div>
        //   {/* Normal Image */}
        //   {!isFullscreen && (
        //     <img
        //       src={src}
        //       alt={alt}
        //       className={className}
        //       onClick={() => setIsFullscreen(true)}
        //     />
        //   )}

        //   {/* Fullscreen Overlay */}
        //   {isFullscreen && (
        //     <div
        //       className="fixed inset-0 z-50 flex items-center justify-center bg-black bg-opacity-90"
        //       onClick={() => setIsFullscreen(false)}
        //     >
        //       <img
        //         src={src}
        //         alt={alt}
        //         className="transform: scale(1.05);"
        //       />
        //       <button
        //         className="absolute top-4 right-4 text-white text-2xl bg-black/50 px-3 py-1 rounded-lg"
        //         onClick={() => setIsFullscreen(false)}
        //       >
        //         ✕
        //       </button>
        //     </div>
        //   )}
        // </div>
    )



}


export default ClickableImage;