"use client"
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { MdOutlineMailOutline } from "react-icons/md";
import { SignUpOptionButton } from "./SIgnUpOptionButton";
import { useState } from "react";
import Error from "next/error";

export const SignUpBox = () => {
    const [mailSelection,setMailSelection] = useState(false);
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

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
          throw new Error(data.message || "Signup failed");
        }
  
        alert("Signup successful!");
      } catch (err) {
        alert("Error: " + err);
      }
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
                        Sign up to join VibeCast it's free
                    </div>
                    <div className="flex flex-col pt-3 p-2 items-center">
                      <input className="bg-neutral-800 text-white p-2 w-4/5 rounded-xl" type="text" placeholder="Email" onChange={(e)=>{setEmail(e.target.value)}}/>
                      <input className="bg-neutral-800 text-white p-2 mt-5 w-4/5 rounded-xl" type="text" placeholder="Password" onChange={(e)=>{setPassword(e.target.value)}} />
                      <button className="bg-violet-500 w-4/5 py-2 mt-5 rounded-xl text-white font-bold text-md hover:bg-violet-800 hover:cursor-pointer" onClick={handleSignup}>Create your account</button>
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
                        Log in
                      </div>
                    </div>

                </div>
              </div> : <div className="pt-20">
                <div className="text-white font-bold text-3xl w-full flex justify-center">
                    Create your account
                </div>
                <div className="text-gray-400 text-sm pt-3 w-full flex justify-center">
                    Sign up to join VibeCast it's free
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
                  <div className="pl-2 text-purple-400 cursor-pointer">
                    Log in
                  </div>
                </div>

            </div>
            }
            </div>
            <div className="bg-black-900 w-55/100">
              <img src="/imagex2.749397e3.png" alt=""  className="h-full w-full py-5 pl-5"/>
            </div>
        </div>
      </div>
    );
  };
  