
interface props {
    page_name:string;
    updateTimes: object;
}

const text_style: React.CSSProperties = {
    color: "gray"

}

const LastUpdated = ({ page_name, updateTimes }:props) => {

    function formatDate(isoString: string) {
        const date = new Date(isoString);
        const now = new Date();
        // @ts-ignore
        const diffMs = now - date;
        const diffSec = Math.floor(diffMs / 1000);
        const diffMin = Math.floor(diffSec / 60);
        const diffHrs = Math.floor(diffMin / 60);
        const diffDays = Math.floor(diffHrs / 24);
      
        if (diffSec < 60) return `${diffSec} seconds ago`;
        if (diffMin < 60) return `${diffMin} minutes ago`;
        if (diffHrs < 24) return `${diffHrs} hours ago`;
        if (diffDays < 100) return `${diffDays} days ago`;
      
        // Otherwise show a full date
        return date.toLocaleDateString(undefined, {
          year: "numeric",
          month: "short",
          day: "numeric",
        });
      }
    
    function findValueByKeyContains(obj:object, substring:string) {
        console.log(substring);
        const key = Object.keys(obj).find(k => k.includes(substring.replace("/wiki/","")));
        if(key == undefined){
            return ""
        }
        // @ts-ignore
        return key ? obj[key] as string : undefined;
      }

      
   
    
    return (
      <div style={{...text_style}}>
      Last updated: {formatDate(findValueByKeyContains(updateTimes, page_name)!)}
      </div>
    );
  };
  
  export default LastUpdated;