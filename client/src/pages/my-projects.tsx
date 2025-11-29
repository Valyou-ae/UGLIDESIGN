import { useState } from "react";
import { useLocation } from "wouter";
import { 
  Search, 
  Plus, 
  Filter, 
  ChevronDown, 
  LayoutGrid, 
  List, 
  Folder, 
  MoreVertical, 
  Download, 
  Star, 
  Trash2, 
  FolderInput, 
  ArrowUpRight, 
  Eye, 
  Pencil, 
  Copy, 
  Type, 
  Check,
  X,
  Image as ImageIcon,
  Shirt,
  Scissors,
  Upload,
  CornerDownRight
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Input } from "@/components/ui/input";
import { Sidebar } from "@/components/sidebar";
import {
  DropdownMenu,
  DropdownMenuContent,
  DropdownMenuItem,
  DropdownMenuSeparator,
  DropdownMenuTrigger,
} from "@/components/ui/dropdown-menu";
import { Badge } from "@/components/ui/badge";
import {
  Dialog,
  DialogContent,
  DialogHeader,
  DialogTitle,
} from "@/components/ui/dialog";
import {
  AlertDialog,
  AlertDialogAction,
  AlertDialogCancel,
  AlertDialogContent,
  AlertDialogDescription,
  AlertDialogFooter,
  AlertDialogHeader,
  AlertDialogTitle,
} from "@/components/ui/alert-dialog";
import { ScrollArea } from "@/components/ui/scroll-area";
import { useToast } from "@/hooks/use-toast";

// Mock Data
const PROJECTS = [
  { id: "1", name: "Cyberpunk City", type: "image", date: "2 hours ago", size: "2.4 MB", dimensions: "1024×1024", src: "https://images.unsplash.com/photo-1605806616949-1e87b487bc2a?q=80&w=1000&auto=format&fit=crop", favorite: false },
  { id: "2", name: "Summer Collection T-Shirt", type: "mockup", date: "5 hours ago", size: "4.1 MB", dimensions: "2000×2000", src: "https://images.unsplash.com/photo-1521572163474-6864f9cf17ab?q=80&w=1000&auto=format&fit=crop", favorite: true },
  { id: "3", name: "Product Shoot Clean", type: "bg-removed", date: "1 day ago", size: "1.8 MB", dimensions: "1024×1024", src: "https://images.unsplash.com/photo-1505740420928-5e560c06d30e?q=80&w=1000&auto=format&fit=crop", favorite: false },
  { id: "4", name: "Neon Warrior", type: "image", date: "2 days ago", size: "3.2 MB", dimensions: "1024×1024", src: "https://images.unsplash.com/photo-1535378437327-2710c0423936?q=80&w=1000&auto=format&fit=crop", favorite: true },
  { id: "5", name: "Logo Variations", type: "folder", count: 12, date: "3 days ago", size: "-", dimensions: "-", src: "", favorite: false },
  { id: "6", name: "Abstract Backgrounds", type: "folder", count: 8, date: "1 week ago", size: "-", dimensions: "-", src: "", favorite: false },
  { id: "7", name: "Coffee Cup Mockup", type: "mockup", date: "1 week ago", size: "5.5 MB", dimensions: "2400×2400", src: "https://images.unsplash.com/photo-1514432324607-a09d9b4aefdd?q=80&w=1000&auto=format&fit=crop", favorite: false },
  { id: "8", name: "Headshot Transparent", type: "bg-removed", date: "2 weeks ago", size: "1.2 MB", dimensions: "800×800", src: "https://images.unsplash.com/photo-1438761681033-6461ffad8d80?q=80&w=1000&auto=format&fit=crop", favorite: false },
  { id: "9", name: "Fantasy Landscape", type: "image", date: "2 weeks ago", size: "2.8 MB", dimensions: "1024×1024", src: "https://images.unsplash.com/photo-1464822759023-fed622ff2c3b?q=80&w=1000&auto=format&fit=crop", favorite: true },
  { id: "10", name: "Corporate Branding", type: "folder", count: 24, date: "3 weeks ago", size: "-", dimensions: "-", src: "", favorite: false },
  { id: "11", name: "App Icon Set", type: "image", date: "1 month ago", size: "1.5 MB", dimensions: "512×512", src: "https://images.unsplash.com/photo-1611162617474-5b21e879e113?q=80&w=1000&auto=format&fit=crop", favorite: false },
  { id: "12", name: "Hoodie Design", type: "mockup", date: "1 month ago", size: "3.9 MB", dimensions: "2000×2000", src: "https://images.unsplash.com/photo-1556906781-9a412961d28c?q=80&w=1000&auto=format&fit=crop", favorite: false },
];

export default function MyProjects() {
  const [, setLocation] = useLocation();
  const [searchOpen, setSearchOpen] = useState(false);
  const [searchQuery, setSearchQuery] = useState("");
  const [activeFilter, setActiveFilter] = useState("All");
  const [viewMode, setViewMode] = useState<"grid" | "list">("grid");
  const [sortMode, setSortMode] = useState("Recent");
  const [multiSelectMode, setMultiSelectMode] = useState(false);
  const [selectedItems, setSelectedItems] = useState<string[]>([]);
  const [projects, setProjects] = useState(PROJECTS);
  const [quickViewProject, setQuickViewProject] = useState<typeof PROJECTS[0] | null>(null);
  const [projectToDelete, setProjectToDelete] = useState<string | null>(null);
  
  const { toast } = useToast();

  const handleOpenProject = (project: typeof PROJECTS[0]) => {
    if (project.type === "image") {
      setLocation(`/image-gen?prompt=${encodeURIComponent(project.name)}`);
    } else if (project.type === "mockup") {
      setLocation(`/mockup?journey=DTG&restore=true`);
    } else if (project.type === "bg-removed") {
      setLocation(`/bg-remover?image=${encodeURIComponent(project.src)}&restore=true`);
    }
    setQuickViewProject(null);
  };

  const handleDownload = (project: typeof PROJECTS[0]) => {
    const link = document.createElement('a');
    link.href = project.src;
    link.download = `${project.name.replace(/\s+/g, '_')}.jpg`;
    document.body.appendChild(link);
    link.click();
    document.body.removeChild(link);
    toast({
      title: "Download started",
      description: `Downloading ${project.name}...`,
    });
  };

  const handleDeleteClick = () => {
    if (quickViewProject) {
      setProjectToDelete(quickViewProject.id);
    }
  };

  const confirmDelete = () => {
    if (projectToDelete) {
      setProjects(projects.filter(p => p.id !== projectToDelete));
      setQuickViewProject(null);
      setProjectToDelete(null);
      toast({
        title: "Project deleted",
        description: "The project has been permanently removed.",
      });
    }
  };

  const toggleSelection = (id: string) => {
    if (selectedItems.includes(id)) {
      setSelectedItems(selectedItems.filter(item => item !== id));
    } else {
      setSelectedItems([...selectedItems, id]);
    }
  };

  const handleBulkAction = (action: string) => {
    toast({
      title: `${action} ${selectedItems.length} items`,
      description: "This is a mock action.",
    });
    setMultiSelectMode(false);
    setSelectedItems([]);
  };

  const filteredProjects = projects.filter(p => {
    if (activeFilter === "All") return true;
    if (activeFilter === "Images" && p.type === "image") return true;
    if (activeFilter === "Mockups" && p.type === "mockup") return true;
    if (activeFilter === "BG Removed" && p.type === "bg-removed") return true;
    if (activeFilter === "Folders" && p.type === "folder") return true;
    return false;
  }).filter(p => 
    p.name.toLowerCase().includes(searchQuery.toLowerCase())
  );

  const getTypeColor = (type: string) => {
    switch (type) {
      case "image": return "bg-[#7C3AED]";
      case "mockup": return "bg-[#4F46E5]";
      case "bg-removed": return "bg-[#DB2777]";
      default: return "bg-gray-500";
    }
  };

  return (
    <div className="h-screen bg-background flex font-sans text-foreground overflow-hidden">
      <Sidebar className="hidden md:flex border-r border-border/50" />
      
      <main className="flex-1 flex flex-col relative h-full overflow-hidden bg-[#FAFAFA] dark:bg-[#09090B] text-foreground">
        <div className="flex flex-col h-full p-8 md:px-10 md:py-8">
          
          {/* HEADER SECTION */}
          <div className="flex items-center justify-between mb-6 flex-shrink-0">
            <div className="flex items-center gap-3">
              <div className="h-10 w-10 bg-purple-100 dark:bg-purple-900/20 rounded-xl flex items-center justify-center">
                <Folder className="h-6 w-6 text-[#7C3AED]" />
              </div>
              <div>
                <div className="flex items-center gap-3">
                  <h1 className="text-2xl font-bold text-[#18181B] dark:text-[#FAFAFA]">My Projects</h1>
                  <span className="px-3 py-0.5 bg-[#F4F4F5] dark:bg-[#27272A] text-[#71717A] text-[13px] font-medium rounded-full">
                    124 projects
                  </span>
                </div>
                <p className="text-sm text-[#71717A] mt-1">All your AI-generated creations in one place</p>
              </div>
            </div>

            <div className="flex items-center gap-3">
              {/* Expandable Search */}
              <div className={cn(
                "flex items-center transition-all duration-300 bg-[#F4F4F5] dark:bg-[#27272A] rounded-[10px] border border-transparent focus-within:border-[#E4E4E7] dark:focus-within:border-[#3F3F46] overflow-hidden",
                searchOpen ? "w-[320px]" : "w-10 cursor-pointer hover:bg-[#E4E4E7] dark:hover:bg-[#3F3F46]"
              )}>
                 {searchOpen ? (
                   <>
                     <Search className="h-4 w-4 text-muted-foreground ml-3 shrink-0" />
                     <Input 
                       autoFocus
                       value={searchQuery}
                       onChange={(e) => setSearchQuery(e.target.value)}
                       placeholder="Search projects..." 
                       className="border-0 bg-transparent focus-visible:ring-0 h-10 text-sm"
                     />
                     <Button 
                       variant="ghost" 
                       size="icon" 
                       className="h-8 w-8 mr-1 text-muted-foreground hover:text-foreground"
                       onClick={() => {
                         setSearchOpen(false);
                         setSearchQuery("");
                       }}
                     >
                       <X className="h-4 w-4" />
                     </Button>
                   </>
                 ) : (
                   <Button 
                     variant="ghost" 
                     size="icon" 
                     className="h-10 w-10 rounded-[10px]"
                     onClick={() => setSearchOpen(true)}
                   >
                     <Search className="h-5 w-5 text-foreground" />
                   </Button>
                 )}
              </div>

              {/* New Project Button */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button 
                    className="h-10 px-5 bg-gradient-to-r from-[#7C3AED] to-[#9333EA] hover:brightness-110 text-white font-semibold rounded-[10px] shadow-lg shadow-purple-600/20 transition-all hover:-translate-y-[1px]"
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
          </div>

          {/* TOOLBAR SECTION */}
          <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-[14px] p-4 mb-5 flex items-center justify-between flex-shrink-0 shadow-sm">
            {/* Filters */}
            <div className="flex items-center gap-2">
              {[
                { name: "All", count: 124 },
                { name: "Images", count: 67, color: "#7C3AED" },
                { name: "Mockups", count: 42, color: "#4F46E5" },
                { name: "BG Removed", count: 15, color: "#DB2777" }
              ].map(filter => (
                <button
                  key={filter.name}
                  onClick={() => setActiveFilter(filter.name)}
                  className={cn(
                    "px-4 py-2 rounded-full text-[13px] font-medium transition-all flex items-center gap-2 border",
                    activeFilter === filter.name 
                      ? "bg-[#7C3AED] text-white border-[#7C3AED]" 
                      : "bg-transparent text-[#71717A] border-[#E4E4E7] dark:border-[#3F3F46] hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] hover:border-[#D4D4D8]"
                  )}
                >
                  {filter.color && (
                    <span className="w-1.5 h-1.5 rounded-full" style={{ backgroundColor: filter.color }} />
                  )}
                  {filter.name}
                  <span className={cn("ml-0.5 opacity-70", activeFilter === filter.name ? "text-white" : "")}>
                    ({filter.count})
                  </span>
                </button>
              ))}
            </div>

            {/* View Controls */}
            <div className="flex items-center gap-4">
              {/* Sort */}
              <DropdownMenu>
                <DropdownMenuTrigger asChild>
                  <Button variant="ghost" className="h-9 text-sm font-medium text-[#71717A]">
                    <span className="mr-2">Sort by:</span>
                    <span className="text-foreground">{sortMode}</span>
                    <ChevronDown className="h-4 w-4 ml-1 opacity-50" />
                  </Button>
                </DropdownMenuTrigger>
                <DropdownMenuContent align="end" className="w-40">
                  {["Recent", "Oldest", "Name A-Z", "Name Z-A", "Size", "Type"].map(mode => (
                    <DropdownMenuItem 
                      key={mode} 
                      onClick={() => setSortMode(mode)}
                      className="cursor-pointer"
                    >
                      {mode}
                      {sortMode === mode && <Check className="h-3.5 w-3.5 ml-auto" />}
                    </DropdownMenuItem>
                  ))}
                </DropdownMenuContent>
              </DropdownMenu>
              
              <div className="h-5 w-px bg-[#E4E4E7] dark:bg-[#27272A]" />

              {/* View Toggle */}
              <div className="flex p-0.5 bg-[#F4F4F5] dark:bg-[#27272A] rounded-lg border border-[#E4E4E7] dark:border-[#3F3F46]">
                <button
                  onClick={() => setViewMode("grid")}
                  className={cn(
                    "p-1.5 rounded-md transition-all",
                    viewMode === "grid" ? "bg-white dark:bg-[#18181B] shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <LayoutGrid className="h-4 w-4" />
                </button>
                <button
                  onClick={() => setViewMode("list")}
                  className={cn(
                    "p-1.5 rounded-md transition-all",
                    viewMode === "list" ? "bg-white dark:bg-[#18181B] shadow-sm text-foreground" : "text-muted-foreground hover:text-foreground"
                  )}
                >
                  <List className="h-4 w-4" />
                </button>
              </div>

              {/* Bulk Select Toggle */}
              <Button 
                variant={multiSelectMode ? "secondary" : "ghost"}
                size="sm"
                onClick={() => {
                  setMultiSelectMode(!multiSelectMode);
                  setSelectedItems([]);
                }}
                className={cn("h-9 text-xs", multiSelectMode && "bg-purple-100 text-purple-700 dark:bg-purple-900/30 dark:text-purple-300")}
              >
                {multiSelectMode ? "Cancel" : "Select"}
              </Button>
            </div>
          </div>

          {/* BULK ACTION BAR */}
          <AnimatePresence>
            {multiSelectMode && selectedItems.length > 0 && (
              <motion.div
                initial={{ height: 0, opacity: 0, y: -10, marginBottom: 0 }}
                animate={{ height: "auto", opacity: 1, y: 0, marginBottom: 20 }}
                exit={{ height: 0, opacity: 0, y: -10, marginBottom: 0 }}
                className="flex-shrink-0 overflow-hidden"
              >
                <div className="bg-[#18181B] dark:bg-[#27272A] rounded-xl p-3 px-5 flex items-center justify-between text-white shadow-xl">
                  <div className="flex items-center gap-4">
                    <span className="text-sm font-medium">{selectedItems.length} items selected</span>
                    <button 
                      onClick={() => setSelectedItems([])}
                      className="text-xs text-gray-400 hover:text-white hover:underline transition-colors"
                    >
                      Clear selection
                    </button>
                  </div>
                  <div className="flex items-center gap-2">
                    <Button size="sm" variant="ghost" className="h-8 text-gray-300 hover:text-white hover:bg-white/10" onClick={() => handleBulkAction("Move")}>
                      <FolderInput className="h-4 w-4 mr-2" /> Move
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 text-gray-300 hover:text-white hover:bg-white/10" onClick={() => handleBulkAction("Favorite")}>
                      <Star className="h-4 w-4 mr-2" /> Favorite
                    </Button>
                    <Button size="sm" variant="ghost" className="h-8 text-gray-300 hover:text-white hover:bg-white/10" onClick={() => handleBulkAction("Download")}>
                      <Download className="h-4 w-4 mr-2" /> Download
                    </Button>
                    <div className="w-px h-4 bg-gray-700 mx-1" />
                    <Button size="sm" variant="ghost" className="h-8 text-red-400 hover:text-red-300 hover:bg-red-900/20" onClick={() => handleBulkAction("Delete")}>
                      <Trash2 className="h-4 w-4 mr-2" /> Delete
                    </Button>
                  </div>
                </div>
              </motion.div>
            )}
          </AnimatePresence>

          {/* PROJECTS GRID/LIST VIEW */}
          <div className="flex-1 overflow-y-auto pr-2 -mr-2">
            {filteredProjects.length === 0 ? (
              <div className="h-[400px] flex flex-col items-center justify-center text-center">
                <div className="w-24 h-24 bg-muted/50 rounded-full flex items-center justify-center mb-6">
                  <Search className="h-10 w-10 text-muted-foreground/50" />
                </div>
                <h3 className="text-xl font-bold text-foreground mb-2">No projects found</h3>
                <p className="text-muted-foreground max-w-sm">
                  We couldn't find any projects matching your search. Try adjusting your filters or search for something else.
                </p>
              </div>
            ) : viewMode === "grid" ? (
              <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-5 pb-10">
                {filteredProjects.map((project) => (
                  <motion.div
                    layoutId={project.id}
                    key={project.id}
                    onClick={() => multiSelectMode ? toggleSelection(project.id) : setQuickViewProject(project)}
                    className={cn(
                      "group bg-white dark:bg-[#18181B] border rounded-2xl overflow-hidden cursor-pointer transition-all hover:-translate-y-1 hover:shadow-xl dark:hover:shadow-none dark:hover:bg-[#1F1F23]",
                      selectedItems.includes(project.id) 
                        ? "border-[#7C3AED] ring-2 ring-[#7C3AED]/20" 
                        : "border-[#E4E4E7] dark:border-[#27272A] hover:border-[#D4D4D8] dark:hover:border-[#3F3F46]"
                    )}
                  >
                    {/* Card Thumbnail */}
                    {project.type === "folder" ? (
                      <div className="aspect-[4/3] bg-[#F9FAFB] dark:bg-[#27272A] flex flex-col items-center justify-center border-b border-[#E4E4E7] dark:border-[#27272A/50] relative group-hover:bg-[#F4F4F5] dark:group-hover:bg-[#2A2A2D] transition-colors">
                        <Folder className="h-16 w-16 text-[#7C3AED]/80 mb-3 group-hover:scale-110 transition-transform duration-300" />
                        <div className="text-sm font-semibold">{project.count} items</div>
                        
                        {/* Checkbox for Multiselect */}
                        {multiSelectMode && (
                          <div className="absolute top-3 left-3 z-20">
                            <div className={cn(
                              "h-6 w-6 rounded-md border-2 flex items-center justify-center transition-all",
                              selectedItems.includes(project.id)
                                ? "bg-[#7C3AED] border-[#7C3AED]"
                                : "bg-white/80 border-[#D4D4D8]"
                            )}>
                              {selectedItems.includes(project.id) && <Check className="h-3.5 w-3.5 text-white" />}
                            </div>
                          </div>
                        )}
                      </div>
                    ) : (
                      <div className="aspect-[4/3] bg-[#F4F4F5] dark:bg-[#27272A] relative overflow-hidden">
                        <img 
                          src={project.src} 
                          alt={project.name} 
                          className="w-full h-full object-cover transition-transform duration-500 group-hover:scale-105" 
                        />
                        
                        {/* Gradient Overlay */}
                        <div className="absolute bottom-0 left-0 right-0 h-1/2 bg-gradient-to-t from-black/60 to-transparent opacity-60" />

                        {/* Type Badge */}
                        <div className={cn(
                          "absolute top-3 left-3 px-2.5 py-1 rounded-full text-[10px] font-bold uppercase text-white shadow-sm",
                          getTypeColor(project.type)
                        )}>
                          {project.type.replace("-", " ")}
                        </div>

                        {/* Favorite Star */}
                        {project.favorite && (
                          <div className="absolute top-3 right-3 h-8 w-8 bg-white/90 dark:bg-black/50 backdrop-blur-sm rounded-full flex items-center justify-center shadow-sm">
                            <Star className="h-4 w-4 text-amber-400 fill-amber-400" />
                          </div>
                        )}

                        {/* Hover Overlay */}
                        <div className={cn(
                          "absolute inset-0 bg-black/40 backdrop-blur-[2px] opacity-0 flex items-center justify-center gap-3 transition-opacity duration-200",
                          !multiSelectMode && "group-hover:opacity-100"
                        )}>
                          <Button size="sm" className="h-9 bg-white text-black hover:bg-white/90 border-0 font-medium shadow-lg">
                            Open
                          </Button>
                          <Button size="sm" variant="outline" className="h-9 bg-transparent text-white border-white/50 hover:bg-white/20 hover:border-white hover:text-white backdrop-blur-md">
                            <Eye className="h-4 w-4" />
                          </Button>
                        </div>

                        {/* Checkbox for Multiselect */}
                        {multiSelectMode && (
                          <div className="absolute top-3 left-3 z-20">
                            <div className={cn(
                              "h-6 w-6 rounded-md border-2 flex items-center justify-center transition-all",
                              selectedItems.includes(project.id)
                                ? "bg-[#7C3AED] border-[#7C3AED]"
                                : "bg-white/80 border-[#D4D4D8]"
                            )}>
                              {selectedItems.includes(project.id) && <Check className="h-3.5 w-3.5 text-white" />}
                            </div>
                          </div>
                        )}
                      </div>
                    )}

                    {/* Card Info */}
                    <div className="p-4">
                      <div className="flex justify-between items-start">
                        <h3 className="font-semibold text-[15px] text-[#18181B] dark:text-[#FAFAFA] line-clamp-1 group-hover:text-[#7C3AED] transition-colors">
                          {project.name}
                        </h3>
                        <button className="h-6 w-6 rounded-md hover:bg-[#F4F4F5] dark:hover:bg-[#27272A] flex items-center justify-center text-[#71717A] transition-colors -mr-1 -mt-1">
                          <MoreVertical className="h-4 w-4" />
                        </button>
                      </div>
                      <div className="flex items-center gap-3 mt-2 text-xs text-[#A1A1AA]">
                        <span>{project.date}</span>
                        {project.size !== "-" && (
                          <>
                            <span className="w-0.5 h-0.5 rounded-full bg-[#A1A1AA]" />
                            <span>{project.size}</span>
                          </>
                        )}
                      </div>
                    </div>
                  </motion.div>
                ))}
              </div>
            ) : (
              /* LIST VIEW */
              <div className="bg-white dark:bg-[#18181B] border border-[#E4E4E7] dark:border-[#27272A] rounded-2xl overflow-hidden mb-10">
                {/* Table Header */}
                <div className="grid grid-cols-[1fr_120px_140px_100px_100px] gap-4 px-6 py-4 bg-[#F9FAFB] dark:bg-[#27272A] border-b border-[#E4E4E7] dark:border-[#3F3F46] text-xs font-semibold text-[#71717A] uppercase tracking-wide">
                  <div className="flex items-center gap-4">
                    {multiSelectMode && <div className="w-6" />}
                    Name
                  </div>
                  <div>Type</div>
                  <div>Date</div>
                  <div>Size</div>
                  <div className="text-right">Actions</div>
                </div>

                {/* Table Rows */}
                {filteredProjects.map((project) => (
                  <div 
                    key={project.id}
                    onClick={() => multiSelectMode ? toggleSelection(project.id) : setQuickViewProject(project)}
                    className={cn(
                      "grid grid-cols-[1fr_120px_140px_100px_100px] gap-4 px-6 py-3 border-b border-[#E4E4E7] dark:border-[#27272A] items-center hover:bg-[#F9FAFB] dark:hover:bg-[#1F1F23] transition-colors cursor-pointer group last:border-0",
                      selectedItems.includes(project.id) && "bg-purple-50 dark:bg-purple-900/10"
                    )}
                  >
                    <div className="flex items-center gap-4 overflow-hidden">
                      {multiSelectMode && (
                         <div className={cn(
                            "h-5 w-5 rounded border flex items-center justify-center transition-all shrink-0",
                            selectedItems.includes(project.id)
                              ? "bg-[#7C3AED] border-[#7C3AED]"
                              : "bg-transparent border-[#D4D4D8]"
                          )}>
                            {selectedItems.includes(project.id) && <Check className="h-3 w-3 text-white" />}
                          </div>
                      )}
                      
                      <div className="h-10 w-10 rounded-lg bg-muted overflow-hidden shrink-0 border border-border">
                        {project.type === "folder" ? (
                          <div className="w-full h-full flex items-center justify-center bg-purple-50 dark:bg-purple-900/20">
                            <Folder className="h-5 w-5 text-purple-500" />
                          </div>
                        ) : (
                          <img src={project.src} className="w-full h-full object-cover" alt="" />
                        )}
                      </div>
                      <span className="font-medium text-sm truncate text-[#18181B] dark:text-[#FAFAFA] group-hover:text-[#7C3AED] transition-colors">
                        {project.name}
                      </span>
                    </div>
                    
                    <div>
                      <Badge variant="outline" className="font-normal capitalize text-xs bg-transparent">
                        {project.type}
                      </Badge>
                    </div>
                    
                    <div className="text-sm text-muted-foreground">{project.date}</div>
                    
                    <div className="text-sm text-muted-foreground font-mono text-xs">{project.size}</div>
                    
                    <div className="flex items-center justify-end gap-1 opacity-0 group-hover:opacity-100 transition-opacity">
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Star className={cn("h-4 w-4", project.favorite ? "fill-amber-400 text-amber-400" : "text-muted-foreground")} />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <Download className="h-4 w-4 text-muted-foreground" />
                      </Button>
                      <Button size="icon" variant="ghost" className="h-8 w-8">
                        <MoreVertical className="h-4 w-4 text-muted-foreground" />
                      </Button>
                    </div>
                  </div>
                ))}
              </div>
            )}
          </div>
        </div>

        {/* Quick View Modal */}
        <AnimatePresence>
          {quickViewProject && (
            <motion.div
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              exit={{ opacity: 0 }}
              className="fixed inset-0 z-[100] bg-black/80 backdrop-blur-sm flex items-center justify-center p-4 md:p-8"
              onClick={() => setQuickViewProject(null)}
            >
              <motion.div
                initial={{ opacity: 0, scale: 0.95 }}
                animate={{ opacity: 1, scale: 1 }}
                exit={{ opacity: 0, scale: 0.95 }}
                className="w-full max-w-5xl h-[80vh] bg-white dark:bg-[#18181B] rounded-2xl overflow-hidden flex shadow-2xl border border-[#E4E4E7] dark:border-[#27272A]"
                onClick={e => e.stopPropagation()}
              >
                {/* Left Image Preview */}
                <div className="w-[60%] bg-[#F4F4F5] dark:bg-black/20 flex items-center justify-center p-10 relative border-r border-[#E4E4E7] dark:border-[#27272A]">
                  {quickViewProject.type === "folder" ? (
                    <div className="flex flex-col items-center">
                      <Folder className="h-32 w-32 text-purple-500/50 mb-4" />
                      <p className="text-xl font-medium">{quickViewProject.count} items inside</p>
                    </div>
                  ) : (
                    <img 
                      src={quickViewProject.src} 
                      alt={quickViewProject.name} 
                      className="max-w-full max-h-full object-contain shadow-2xl rounded-lg" 
                    />
                  )}
                  <div className="absolute top-4 left-4">
                    <Badge className={cn("uppercase tracking-wider", getTypeColor(quickViewProject.type))}>
                      {quickViewProject.type}
                    </Badge>
                  </div>
                </div>

                {/* Right Details Panel */}
                <div className="w-[40%] flex flex-col bg-white dark:bg-[#18181B]">
                  <div className="p-6 border-b border-[#E4E4E7] dark:border-[#27272A] flex justify-between items-start">
                    <div>
                      <h2 className="text-xl font-bold text-[#18181B] dark:text-[#FAFAFA] mb-1">
                        {quickViewProject.name}
                      </h2>
                      <p className="text-sm text-[#71717A]">Created {quickViewProject.date}</p>
                    </div>
                    <Button variant="ghost" size="icon" onClick={() => setQuickViewProject(null)} className="rounded-full">
                      <X className="h-5 w-5" />
                    </Button>
                  </div>

                  <ScrollArea className="flex-1 p-6">
                    <div className="space-y-6">
                      <div>
                        <h3 className="text-xs font-bold text-[#71717A] uppercase tracking-wider mb-3">Metadata</h3>
                        <div className="grid grid-cols-2 gap-4">
                          <div className="bg-[#F4F4F5] dark:bg-[#27272A] p-3 rounded-lg">
                            <span className="text-xs text-[#71717A] block mb-1">Dimensions</span>
                            <span className="text-sm font-medium">{quickViewProject.dimensions}</span>
                          </div>
                          <div className="bg-[#F4F4F5] dark:bg-[#27272A] p-3 rounded-lg">
                            <span className="text-xs text-[#71717A] block mb-1">File Size</span>
                            <span className="text-sm font-medium">{quickViewProject.size}</span>
                          </div>
                          <div className="bg-[#F4F4F5] dark:bg-[#27272A] p-3 rounded-lg col-span-2">
                            <span className="text-xs text-[#71717A] block mb-1">Location</span>
                            <div className="flex items-center gap-2 text-sm font-medium">
                              <Folder className="h-3.5 w-3.5 text-purple-500" />
                              <span>My Projects / Summer Collection</span>
                            </div>
                          </div>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-[#71717A] uppercase tracking-wider mb-3">Prompt</h3>
                        <div className="bg-[#F4F4F5] dark:bg-[#27272A] p-4 rounded-xl border border-[#E4E4E7] dark:border-[#3F3F46]">
                          <p className="text-sm leading-relaxed text-[#18181B] dark:text-[#FAFAFA] italic">
                            "A futuristic cyberpunk city street at night with neon lights, rain reflections, cinematic lighting, 8k resolution, highly detailed..."
                          </p>
                        </div>
                      </div>

                      <div>
                        <h3 className="text-xs font-bold text-[#71717A] uppercase tracking-wider mb-3">Tags</h3>
                        <div className="flex flex-wrap gap-2">
                          {["Cyberpunk", "Neon", "City", "Futuristic", "Night", "Rain"].map(tag => (
                            <span key={tag} className="px-2.5 py-1 rounded-md bg-[#F4F4F5] dark:bg-[#27272A] text-xs text-[#71717A] font-medium">
                              #{tag}
                            </span>
                          ))}
                        </div>
                      </div>
                    </div>
                  </ScrollArea>

                  <div className="p-6 border-t border-[#E4E4E7] dark:border-[#27272A] bg-[#F9FAFB] dark:bg-[#18181B]">
                    <div className="grid grid-cols-2 gap-3 mb-3">
                      <Button 
                        className="w-full bg-[#18181B] dark:bg-white text-white dark:text-black hover:opacity-90"
                        onClick={() => quickViewProject && handleOpenProject(quickViewProject)}
                      >
                        Open Project
                      </Button>
                      <Button 
                        variant="outline" 
                        className="w-full"
                        onClick={() => quickViewProject && handleDownload(quickViewProject)}
                      >
                        <Download className="h-4 w-4 mr-2" /> Download
                      </Button>
                    </div>
                    <div className="flex justify-center">
                      <Button 
                        variant="ghost" 
                        size="sm" 
                        className="text-red-500 hover:text-red-600 hover:bg-red-50 dark:hover:bg-red-900/20"
                        onClick={handleDeleteClick}
                      >
                        <Trash2 className="h-4 w-4 mr-2" /> Delete Project
                      </Button>
                    </div>
                  </div>
                </div>
              </motion.div>
            </motion.div>
          )}
        </AnimatePresence>

        <AlertDialog open={!!projectToDelete} onOpenChange={(open) => !open && setProjectToDelete(null)}>
          <AlertDialogContent>
            <AlertDialogHeader>
              <AlertDialogTitle>Are you absolutely sure?</AlertDialogTitle>
              <AlertDialogDescription>
                This action cannot be undone. This will permanently delete the project and remove the data from our servers.
              </AlertDialogDescription>
            </AlertDialogHeader>
            <AlertDialogFooter>
              <AlertDialogCancel>Cancel</AlertDialogCancel>
              <AlertDialogAction onClick={confirmDelete} className="bg-red-600 hover:bg-red-700 text-white focus:ring-red-600">
                Delete
              </AlertDialogAction>
            </AlertDialogFooter>
          </AlertDialogContent>
        </AlertDialog>

      </main>
    </div>
  );
}
