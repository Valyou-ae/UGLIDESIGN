import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Plus } from "lucide-react";
import { Link } from "wouter";

export default function NewProject() {
  return (
    <div className="min-h-screen bg-background flex font-sans text-foreground overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 h-screen overflow-y-auto relative">
        <div className="p-6 lg:p-10 max-w-[1600px] mx-auto animate-fade-in">
          <div className="mb-8">
            <Link href="/" className="inline-flex items-center text-sm text-muted-foreground hover:text-foreground mb-4 transition-colors">
              <ArrowLeft className="h-4 w-4 mr-2" />
              Back to Home
            </Link>
            <h1 className="text-3xl font-bold tracking-tight">Start New Project</h1>
            <p className="text-muted-foreground mt-2">Create a new creative project from scratch.</p>
          </div>
          
          <div className="flex flex-col items-center justify-center min-h-[400px] border-2 border-dashed border-border rounded-2xl bg-card/50">
            <div className="p-4 rounded-full bg-muted mb-4">
              <Plus className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">New Project Wizard</h2>
            <p className="text-muted-foreground max-w-md text-center">
              The project creation wizard is currently being built. Soon you'll be able to start complex multi-module projects here.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
