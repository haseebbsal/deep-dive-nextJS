'use client';
import React, { useEffect, useState } from "react";
import { preLoaderAnim } from "../../animations";



const PreLoader = () => {
    const [animationFinished, setAnimationFinished] = useState(false);

    useEffect(() => {
        const onAnimationFinish = () => {
            // console.log('Animation finished');
            setAnimationFinished(true);
        };

        // console.log('In preloader');
        preLoaderAnim(onAnimationFinish);


        return () => {

        };
    }, []);


    return (

        <>
            <div className="preloader">
                <div className="texts-container">
                    <span>DEEP DIVE</span>
                </div>
            </div>
        </>

    );
};

export default PreLoader;
