import { Bell, Search, Command, Plus, Image as ImageIcon, Shirt, Scissors, Folder, Upload } from "lucide-react";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";

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

        <div className="relative cursor-pointer hover:bg-sidebar-accent p-2 rounded-full transition-colors">
          <Bell className="h-5 w-5 text-muted-foreground" />
          <span className="absolute top-2 right-2 h-2 w-2 rounded-full bg-red-500 border-2 border-background" />
        </div>

        <DropdownMenu>
          <DropdownMenuTrigger asChild>
            <Button 
              className="h-10 px-5 bg-gradient-to-r from-[#7C3AED] to-[#EC4899] hover:brightness-110 text-white font-semibold rounded-[10px] shadow-lg shadow-purple-600/20 transition-all hover:-translate-y-[1px]"
            >
              <Plus className="h-4 w-4 mr-2" />
              New Project
            </Button>
          </DropdownMenuTrigger>
          <DropdownMenuContent align="end" className="w-56 rounded-xl p-1.5">
            <DropdownMenuItem className="rounded-lg py-2 cursor-pointer">
              <ImageIcon className="h-4 w-4 mr-2 text-purple-500" />
              New Image Generation
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg py-2 cursor-pointer">
              <Shirt className="h-4 w-4 mr-2 text-indigo-500" />
              New Mockup
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg py-2 cursor-pointer">
              <Scissors className="h-4 w-4 mr-2 text-pink-500" />
              New Background Removal
            </DropdownMenuItem>
            <DropdownMenuItem className="rounded-lg py-2 cursor-pointer">
              <Folder className="h-4 w-4 mr-2 text-yellow-500" />
              Create Folder
            </DropdownMenuItem>
            <DropdownMenuSeparator />
            <DropdownMenuItem className="rounded-lg py-2 cursor-pointer">
              <Upload className="h-4 w-4 mr-2" />
              Import from URL
            </DropdownMenuItem>
          </DropdownMenuContent>
        </DropdownMenu>
      </div>
    </header>
  );
}
