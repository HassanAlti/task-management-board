import { Board } from "@/components/Board";
import { Header } from "@/components/Header";
import { Toaster } from "sonner";

export default function Home() {
  return (
    <div className="min-h-screen bg-gray-100 font-inter">
      <Header />
      <Board />
      <Toaster position="top-left" richColors expand closeButton />
    </div>
  );
}
