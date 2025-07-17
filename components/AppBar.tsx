"use client"
import { useState,useEffect } from "react"
import Link from "next/link";


export const AppBar = ()=>{
    const [isScrolled, setIsScrolled] = useState(false);

    useEffect(() => {
        const onScroll = () => {
          setIsScrolled(window.scrollY > 10);
        };
    
        window.addEventListener("scroll", onScroll);
        return () => window.removeEventListener("scroll", onScroll);
      }, []);

    return <div className={`flex items-center pt-3 pb-3  fixed top-0 left-0 w-full z-50 ${isScrolled?"bg-white text-black":"bg-transparent text-white"}`}>
        <div className="px-10 font-extrabold">
            VIBECAST
        </div>
        <div className="pl-10 cursor-pointer">
            Product
        </div>
        <div className="pl-5 cursor-pointer">
            Solutions
        </div>
        <div className="pl-5 cursor-pointer">
            Business
        </div>
        <div className="pl-5 cursor-pointer">
            Pricing
        </div>
        <div className="pl-150 cursor-pointer">
            Contact Sales
        </div>
        <div className="pl-10 cursor-pointer">
            <nav>
                <Link href="/login">
                    Login
                </Link>
            </nav>
        </div>
        <nav>
            <Link href="/signup">
                <div className={`ml-8 border border-white font-bold rounded-sm text-sm hover:cursor-pointer ${isScrolled? "bg-black text-white hover:bg-gray-800" : "hover:bg-white hover:text-black"}`}>
                    <button className="mx-2 my-3 hover:cursor-pointer">Start For Free</button>
                </div>
            </Link>
        </nav>
        
    </div>
}