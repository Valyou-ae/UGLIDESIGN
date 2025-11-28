import { useState } from "react";
import { Link, useLocation } from "wouter";
import { 
  Home, 
  Image as ImageIcon, 
  Shirt, 
  Scissors, 
  Folder, 
  Star, 
  Settings, 
  CreditCard, 
  HelpCircle,
  ChevronRight,
  Sun,
  Moon,
  Check
} from "lucide-react";
import { cn } from "@/lib/utils";
import { Avatar, AvatarFallback, AvatarImage } from "@/components/ui/avatar";
import { Separator } from "@/components/ui/separator";
import { Button } from "@/components/ui/button";

function ThemeToggle() {
  // Mock theme toggle for now, usually this would be from next-themes or similar
  const [theme, setTheme] = useState<"light" | "dark">("light");

  const toggleTheme = () => {
    const newTheme = theme === "light" ? "dark" : "light";
    setTheme(newTheme);
    document.documentElement.classList.toggle("dark");
  };

  return (
    <div 
      onClick={toggleTheme}
      className="flex h-9 w-full items-center rounded-full bg-zinc-200 dark:bg-zinc-800 p-1 cursor-pointer relative"
    >
      <div 
        className={cn(
          "absolute top-1 bottom-1 w-[calc(50%-4px)] rounded-full bg-white dark:bg-zinc-600 shadow-sm transition-all duration-300 ease-out",
          theme === "light" ? "left-1" : "left-[calc(50%)]"
        )}
      />
      <div className="flex-1 flex justify-center items-center z-10 text-zinc-600 dark:text-zinc-400">
        <Sun className="h-4 w-4" />
      </div>
      <div className="flex-1 flex justify-center items-center z-10 text-zinc-600 dark:text-zinc-400">
        <Moon className="h-4 w-4" />
      </div>
    </div>
  );
}

export function Sidebar() {
  const [location] = useLocation();

  const navigation = [
    { name: "Home", icon: Home, href: "/", count: null },
    { name: "Image Generator", icon: ImageIcon, href: "/image-gen", badge: "5 agents" },
    { name: "Mockup Generator", icon: Shirt, href: "/mockup", badge: "New" },
    { name: "Background Remover", icon: Scissors, href: "/bg-remover", count: null },
    { name: "My Projects", icon: Folder, href: "/projects", count: "24" },
    { name: "Favorites", icon: Star, href: "/favorites", count: "8" },
  ];

  const account = [
    { name: "Settings", icon: Settings, href: "/settings" },
    { name: "Billing", icon: CreditCard, href: "/billing" },
    { name: "Help & Support", icon: HelpCircle, href: "/help" },
  ];

  return (
    <aside className="fixed left-0 top-0 z-40 h-screen w-[280px] border-r bg-sidebar transition-transform hidden lg:flex flex-col px-4 py-6">
      {/* Header / Logo */}
      <div className="flex items-center gap-3 px-2 pb-6 border-b border-sidebar-border/50">
        <div className="h-10 w-10 rounded-xl bg-gradient-to-br from-purple-600 to-pink-500 flex items-center justify-center shadow-lg shadow-purple-500/20">
          <div className="h-5 w-5 bg-white/20 rounded-md backdrop-blur-sm" />
        </div>
        <div className="flex flex-col">
          <span className="font-bold text-sidebar-foreground">AI Creative Studio</span>
          <span className="text-[11px] text-muted-foreground font-medium">Pro Plan</span>
        </div>
      </div>

      {/* User Profile */}
      <div className="mt-6 p-3 rounded-xl bg-sidebar-accent/50 border border-sidebar-border/50 flex items-center gap-3 cursor-pointer hover:bg-sidebar-accent transition-colors group">
        <div className="relative">
          <div className="absolute -inset-0.5 bg-gradient-to-br from-purple-500 to-pink-500 rounded-full opacity-70 group-hover:opacity-100 transition-opacity" />
          <Avatar className="h-9 w-9 border-2 border-sidebar relative">
            <AvatarImage src="https://github.com/shadcn.png" />
            <AvatarFallback>JD</AvatarFallback>
          </Avatar>
        </div>
        <div className="flex-1 overflow-hidden">
          <p className="text-sm font-semibold truncate text-sidebar-foreground">John Doe</p>
          <p className="text-xs text-muted-foreground truncate">john@example.com</p>
        </div>
        <ChevronRight className="h-4 w-4 text-muted-foreground" />
      </div>

      {/* Navigation */}
      <div className="mt-8 flex-1 overflow-y-auto no-scrollbar">
        <div className="mb-2 px-3 text-[11px] font-bold text-muted-foreground tracking-widest">WORKSPACE</div>
        <nav className="space-y-1">
          {navigation.map((item) => (
            <Link key={item.name} href={item.href}>
              <div
                className={cn(
                  "flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-medium transition-all cursor-pointer group relative",
                  location === item.href 
                    ? "text-primary bg-primary/5" 
                    : "text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground"
                )}
              >
                {location === item.href && (
                  <div className="absolute left-0 top-1/2 -translate-y-1/2 h-6 w-1 bg-primary rounded-r-full" />
                )}
                <item.icon className={cn("h-5 w-5", location === item.href ? "text-primary" : "text-sidebar-foreground/50 group-hover:text-sidebar-foreground")} />
                <span className="flex-1">{item.name}</span>
                {item.badge && (
                  <span className="text-[10px] font-semibold px-2 py-0.5 rounded-full bg-primary/10 text-primary">
                    {item.badge}
                  </span>
                )}
                {item.count && (
                  <span className="text-xs text-muted-foreground group-hover:text-sidebar-foreground">
                    {item.count}
                  </span>
                )}
              </div>
            </Link>
          ))}
        </nav>

        <Separator className="my-6 bg-sidebar-border/60" />

        <div className="mb-2 px-3 text-[11px] font-bold text-muted-foreground tracking-widest">ACCOUNT</div>
        <nav className="space-y-1">
          {account.map((item) => (
            <Link key={item.name} href={item.href}>
              <div className="flex items-center gap-3 px-3.5 py-3 rounded-lg text-sm font-medium text-sidebar-foreground/70 hover:bg-sidebar-accent hover:text-sidebar-foreground transition-colors cursor-pointer">
                <item.icon className="h-5 w-5 text-sidebar-foreground/50" />
                <span>{item.name}</span>
              </div>
            </Link>
          ))}
        </nav>
      </div>

      {/* Footer */}
      <div className="pt-4 mt-auto">
        <div className="flex items-center gap-4 mb-4 px-2">
          <div className="relative h-12 w-12 flex items-center justify-center">
            <svg className="h-full w-full -rotate-90" viewBox="0 0 36 36">
              <path
                className="text-sidebar-accent"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
              />
              <path
                className="text-primary drop-shadow-md"
                strokeDasharray="76, 100"
                d="M18 2.0845 a 15.9155 15.9155 0 0 1 0 31.831 a 15.9155 15.9155 0 0 1 0 -31.831"
                fill="none"
                stroke="currentColor"
                strokeWidth="3"
                strokeLinecap="round"
              />
            </svg>
            <span className="absolute text-[10px] font-bold text-sidebar-foreground">76%</span>
          </div>
          <div className="flex-1">
            <div className="flex items-baseline gap-1">
              <span className="text-lg font-bold text-sidebar-foreground">1,523</span>
              <span className="text-[10px] text-muted-foreground">/ 2,000</span>
            </div>
            <Button size="sm" className="h-7 text-[10px] rounded-full w-full mt-1 bg-primary hover:bg-primary/90 text-white border-0">
              Upgrade Plan
            </Button>
          </div>
        </div>
        
        <ThemeToggle />
      </div>
    </aside>
  );
}
