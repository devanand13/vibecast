import { ServicesButton } from "./ServicesButton";
import Link from "next/link";

export const Landing = () => {
    
    const buttonsLine1 = ["Podcasts", "Video Interviews", "Social media clips", "Transcriptions"]
    const buttonsLine2 = ["Webinars", "Video Marketing", "AI show notes", "Captions"]

    return (
      <div className="relative w-full h-screen overflow-hidden">
        <video
          className="absolute top-0 left-0 w-full h-full object-cover z-0"
          autoPlay
          loop
          muted
          playsInline
        >
          <source src="/mic-bg.webm" type="video/webm" />
          Your browser does not support the video tag.
        </video>
  
        <div className="relative z-10 px-30 pt-25 text-white">
          <div className="text-7xl font-extrabold">
            Create your <br /> best Content yet.
          </div>
          <div className="text-xl mt-2">
            Your all-in-one studio to record in high quality, edit in a flash, and
            go live <br /> with a bang. All with AI that works with you.
          </div>
          <div className="pt-5">
            What would you like to start creating?
          </div>
          <div className="flex pt-2">
            {buttonsLine1.map((buttonText,index)=>{
                return <ServicesButton key={index} buttonText={buttonText}/>
            })}
          </div>
          <div className="flex pt-2">
            {buttonsLine2.map((buttonText,index)=>{
                return <ServicesButton key={index} buttonText={buttonText}/>
            })}
          </div>
          <div className="mt-15 bg-violet-500 hover:bg-violet-400 cursor-pointer w-60 rounded-lg text-center font-bold">
            <nav>
              <Link href="/signup">
                <button className="p-2 py-3 cursor-pointer ">Start For Free</button>
              </Link>
            </nav>
          </div>
        </div>
  
        <div className="absolute inset-0 bg-black/40 z-[1]" />
      </div>
    );
  };
  