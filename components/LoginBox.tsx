"use client"
import { FcGoogle } from "react-icons/fc";
import { FaApple } from "react-icons/fa";
import { LoginOptionButton } from "./LoginOptionButton";
import { useState } from "react";
import { FaGoogle } from "react-icons/fa6";
import Error from "next/error";
import Link from "next/link";

export const LoginBox = () => {
    const [email, setEmail] = useState("");
    const [password, setPassword] = useState("");

    const loginOptions = [
      {
        type:"Google",
        icon:FaGoogle
      },
      {
        text:"apple",
        icon:FaApple
      }
    ]

    const handleLogin = async () => {
      try {
        const res = await fetch("/api/user/login", {
          method: "POST",
          headers: {
            "Content-Type": "application/json"
          },
          body: JSON.stringify({ email, password })
        });
  
        const data = await res.json();
  
        if (!res.ok) {
          throw new Error(data.message || "Login failed");
        }
  
        alert("Login successful!");
      } catch (err) {
        alert("Error: " + err);
      }
    };
    
    return (
      <div className="fixed inset-0 flex items-center justify-center z-50 overflow-hidden shadow-xl">
        <div className="bg-black rounded-2xl shadow-xl w-220 h-120 flex overflow-hidden">
            <div className="bg-zinc-900 w-45/100 flex flex-col">
            <div>
                <div className="pt-20">
                    <div className="text-white font-bold text-3xl w-full flex justify-center">
                        Login to VibeCast
                    </div>
                    <div className="text-gray-400 text-sm pt-3 w-full flex justify-center">
                        Don't have an account? 
                        <nav>
                            <Link href="/signup">
                                <div >
                                    <button className="pl-2 text-sm hover:cursor-pointer text-violet-500">Signup</button>
                                </div>
                            </Link>
                        </nav>
                    </div>
                    <div className="flex w-full justify-center">
                        {
                            loginOptions.map((loginoption,index)=>{
                                return <div className="" key={index}>
                                    <LoginOptionButton icon={loginoption.icon}/>
                                </div>
                            })
                        }
                    </div>
                    <div className="py-1 flex justify-center w-full text-gray-600">
                        or
                    </div>
                    <div className="flex flex-col pt-3 p-2 items-center">
                      <input className="bg-neutral-800 text-white pl-4 p-3 w-4/5 rounded-xl  focus:outline focus:outline-2 focus:outline-violet-500 " type="text" placeholder="Email" onChange={(e)=>{setEmail(e.target.value)}}/>
                      <input className="bg-neutral-800 text-white pl-4 p-3 mt-3 w-4/5 rounded-xl focus:outline focus:outline-2 focus:outline-violet-500" type="text" placeholder="Password" onChange={(e)=>{setPassword(e.target.value)}} />
                      <button className="bg-violet-500 w-4/5 py-2 mt-3 rounded-xl text-white font-bold text-md hover:bg-violet-800 hover:cursor-pointer" onClick={handleLogin}>Log in</button>
                    </div>
                    <nav>
                        <Link href="/resetpassword">
                            <div className="flex justify-center text-xs text-gray-400 w-full pt-5 text-center hover:cursor-pointer hover:text-white">
                                Forgot password?
                            </div>
                        </Link>
                    </nav>

                </div>
              </div> 
            </div>
            <div className="bg-black-900 w-55/100">
              <img src="/imagex2.749397e3.png" alt=""  className="h-full w-full py-5 pl-5"/>
            </div>
        </div>
      </div>
    );
  };
  