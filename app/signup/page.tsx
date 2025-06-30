import { AppBar } from "@/components/AppBar";
import { Landing } from "@/components/Landing";
import { SignUpBox } from "@/components/SignUpBox";

export default function Signup() {
  return (
    <div className="relative min-h-screen overflow-hidden bg-black">
      <div className="absolute inset-0 z-0">
        <div className="w-full h-full blur">
          <Landing />
          <AppBar />
        </div>
      </div>

      <div className="relative z-10">
        <SignUpBox />
      </div>
    </div>
  );
}
