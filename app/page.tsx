import { AppBar } from "@/components/AppBar";
import { Landing } from "@/components/Landing";

export default function Home() {
  return (
    <div className="relative">
      <Landing/>
      <Landing/>
      <AppBar/>
    </div>
  );
}
