import {  useLocation } from "react-router-dom";
import { useEffect } from "react";
import ReactGA from 'react-ga4';


const Analytics = () => {

    ReactGA.initialize("G-FM75FCT5LC");

    const location = useLocation();

    useEffect(() => {
        const onNavigation = () => {
            console.log("Navigated to:", location.pathname);
            ReactGA.send({ hitType: "pageview", page: location.pathname, title: location.pathname });
        };

        onNavigation();
    }, [location]);


  return (<></>)
}


export default Analytics;