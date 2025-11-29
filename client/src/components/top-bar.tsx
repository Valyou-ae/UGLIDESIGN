import { Bell, Search } from "lucide-react";
import { Input } from "@/components/ui/input";

export function TopBar() {
  return (
    <header className="sticky top-0 z-30 flex h-20 items-center justify-between bg-background/80 backdrop-blur-md px-8 lg:px-10 border-b border-transparent transition-all">
      <div className="flex flex-col justify-center animate-fade-in">
        <h1 className="text-2xl font-bold tracking-tight text-foreground">
          Good evening, John <span className="animate-wave inline-block origin-bottom-right">👋</span>
        </h1>
        <p className="text-sm text-muted-foreground font-medium">
          Ready to create something amazing?
        </p>
      </div>

      <div className="flex items-center gap-6">
        <div className="relative cursor-pointer hover:bg-sidebar-accent p-2 rounded-full transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-background" />
        </div>

        <div className="relative hidden md:block group">
          <Search className="absolute left-3 top-1/2 -translate-y-1/2 h-4 w-4 text-muted-foreground group-focus-within:text-primary transition-colors" />
          <Input 
            placeholder="Search projects, prompts..." 
            className="w-[320px] h-11 pl-10 pr-12 rounded-full bg-sidebar-accent/50 border-border/50 focus:bg-background transition-all shadow-sm"
          />
          <div className="absolute right-3 top-1/2 -translate-y-1/2 flex items-center gap-1 px-1.5 py-0.5 rounded border border-border bg-background text-[10px] font-medium text-muted-foreground shadow-sm">
            <span className="text-xs">⌘</span> K
          </div>
        </div>
      </div>
    </header>
  );
}
