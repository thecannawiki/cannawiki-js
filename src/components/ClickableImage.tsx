

interface props {
    src: string;
    className: string;
    title: string;
    style: string;
    alt: string;
  }

const ClickableImage = ({src, className, title, style, alt}: props) => {


    const nolink = className?.includes("nolink") ?? false;


    return (
        <>
        {!nolink && (
            // @ts-expect-error: style type
            <a href={src} style={style}  target="_blank" rel="noopener noreferrer" ><img src={src} className={className} title={title} style={style} alt={alt}/>
            </a>
        )}

        {nolink &&(
            // @ts-expect-error: style type
            <img src={src} className={className} title={title} style={style} alt={alt}/>

        )}
        </>
    )
}


export default ClickableImage;