import Link from "next/link";
import { Button } from "./ui/button";
import { ClipboardList } from "lucide-react";

export const Header = () => {
  return (
    <header className="bg-primary text-white p-4 flex justify-around items-center">
      <Link
        href="/"
        className="text-xl font-semibold hover:text-neutral transition-colors"
      >
        Task Management
      </Link>
      <Link href="/history">
        <Button
          variant="ghost"
          className="text-white hover:text-neutral hover:bg-primary-hover transition-colors flex items-center gap-2"
        >
          <ClipboardList className="w-4 h-4" />
          History Logs
        </Button>
      </Link>
    </header>
  );
};
