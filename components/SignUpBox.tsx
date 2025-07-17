"use client"
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { SignUpOptionButton } from "./SIgnUpOptionButton";
import { useState } from "react";
import Error from "next/error";
import Link from "next/link";
import Image from "next/image";
import { useRouter } from "next/navigation";


export const SignUpBox = () => {
    const [mailSelection,setMailSelection] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");
    const [errMessage,setErrMessage] = useState("");
    const router = useRouter();

    const signupOptions = [
      {
        text:"Continue with Google",
        icon:FcGoogle,
        color:""
      },
      {
        text:"Continue with apple",
        icon:FaApple,
        color:"gray"
      },
      {
        text:"Continue with Email",
        icon:MdOutlineMailOutline,
        color:"purple"
      }
    ]

    const handleSignup = async () => {
      if(!checkPasswordCriteria()){
        return
      }
      try {
        const res = await fetch("/api/user/signup", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          console.log(data)
          setErrMessage(data.message || "Signup failed");
          return
        }

        router.push("/dashboard/home");
      } catch (err) {
        alert("Error: " + err);
      }
    };

    const checkPasswordCriteria = () => {
      if (password.length < 6) {
        setErrMessage("Password should be at least 6 characters long!");
        return false;
      }
    
      if (!/[a-z]/.test(password)) {
        setErrMessage("Password should include at least one lowercase letter!");
        return false;
      }
    
      if (!/[A-Z]/.test(password)) {
        setErrMessage("Password should include at least one uppercase letter!");
        return false;
      }
    
      if (!/[0-9]/.test(password)) {
        setErrMessage("Password should include at least one number!");
        return false;
      }
    
      if (!/[^A-Za-z0-9]/.test(password)) {
        setErrMessage("Password should include at least one special character!");
        return false;
      }
    
      setErrMessage(""); 
      return true;
    };
    
    
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden shadow-xl">
        <div className="bg-black rounded-2xl shadow-xl w-220 h-120 flex overflow-hidden">
            <div className="bg-zinc-900 w-45/100 flex flex-col">
            {
              mailSelection ? <div>
                  <button onClick={()=>{setMailSelection(false)}} className="flex justify-center text-white text-sm text-gray-800  m-4 py-1 px-2 rounded-lg hover:bg-stone-800">{"< "+ " "+"Back"}</button>
                    <div className="pt-5">
                    <div className="text-white font-bold text-3xl w-full flex justify-center">
                        Create your account
                    </div>
                    <div className="text-gray-400 text-sm pt-3 w-full flex justify-center">
                        {`Sign up to join VibeCast it's free`}
                    </div>
                    <div className="flex flex-col pt-3 p-2 items-center">
                      <input className="bg-neutral-800 text-white pl-4 p-3 w-4/5 rounded-xl  focus:outline focus:outline-2 focus:outline-violet-500 " type="text" placeholder="Email" onChange={(e)=>{setEmail(e.target.value);setErrMessage("");}}/>
                      <input className="bg-neutral-800 text-white pl-4 p-3 mt-3 w-4/5 rounded-xl focus:outline focus:outline-2 focus:outline-violet-500"  type="password" placeholder="Password" onChange={(e)=>{setPassword(e.target.value);setErrMessage("");}} />
                      <button className="bg-violet-500 w-4/5 py-2 mt-3 rounded-xl text-white font-bold text-md hover:bg-violet-800 hover:cursor-pointer" onClick={handleSignup}>Create your account</button>
                      {errMessage && (<div className="text-red-500 text-sm ml-5 w-4/5">{errMessage}</div>)}
                    </div>
                    <div className="flex justify-center text-xs text-gray-400 w-full pt-5 text-center">
                      By signing up, you agree to our
                      <span className="underline mx-1 cursor-pointer">Terms</span>
                      &amp;
                      <span className="underline mx-1 cursor-pointer">Privacy Policy</span>
                    </div>
                    <div className="flex justify-center text-xs text-gray-400 w-full pt-5 text-center">
                      Have an account? 
                      <div className="pl-2 text-purple-400 cursor-pointer">
                        <nav>
                          <Link href="/login">
                            Log in
                          </Link>
                        </nav>
                      </div>
                    </div>

                </div>
              </div> : <div className="pt-20">
                <div className="text-white font-bold text-3xl w-full flex justify-center">
                    Create your account
                </div>
                <div className="text-gray-400 text-sm pt-3 w-full flex justify-center">
                    {`Sign up to join VibeCast it's free`}
                </div>
                <div className="flex flex-col pt-3">
                  {
                    signupOptions.map((signupoption,index)=>{
                      
                      const handleClick = () => {
                        if (signupoption.text === "Continue with Email") {
                          setMailSelection(true);
                          console.log(mailSelection)
                        }
                      };

                      return <div className="flex justify-center p-1" key={index}>
                        <SignUpOptionButton buttonText={signupoption.text} icon={signupoption.icon} color={signupoption.color} onClick={handleClick}/>
                      </div>
                    })
                  }
                </div>
                <div className="flex justify-center text-xs text-gray-400 w-full pt-5 text-center">
                  By signing up, you agree to our
                  <span className="underline mx-1 cursor-pointer">Terms</span>
                  &amp;
                  <span className="underline mx-1 cursor-pointer">Privacy Policy</span>
                </div>
                <div className="flex justify-center text-xs text-gray-400 w-full pt-5 text-center">
                  Have an account? 
                  <nav>
                    <Link href={"/login"}>
                      <div className="pl-2 text-purple-400 cursor-pointer">
                        Log in
                      </div>
                    </Link>
                  </nav>
                </div>

            </div>
            }
            </div>
            <div className="bg-black w-[55%]">
              <Image
                src="/imagex2.749397e3.png"
                alt="Descriptive Alt Text"
                width={500}
                height={500}
                className="h-full w-full py-5 pl-5"
              />
            </div>
        </div>
      </div>
    );
  };
  