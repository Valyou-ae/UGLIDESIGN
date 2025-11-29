import { Sidebar } from "@/components/sidebar";
import { Button } from "@/components/ui/button";
import { ArrowLeft, Link as LinkIcon } from "lucide-react";
import { Link } from "wouter";
import { Input } from "@/components/ui/input";

export default function ImportUrl() {
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
            <h1 className="text-3xl font-bold tracking-tight">Import from URL</h1>
            <p className="text-muted-foreground mt-2">Fetch images or resources directly from the web.</p>
          </div>
          
          <div className="max-w-xl mx-auto mt-12">
            <div className="flex gap-2">
              <Input placeholder="https://example.com/image.png" className="h-12" />
              <Button className="h-12 px-8">Import</Button>
            </div>
            <p className="text-xs text-muted-foreground mt-2 text-center">
              Supported: Direct image links, Google Drive shared links, Dropbox.
            </p>
          </div>
          
          <div className="flex flex-col items-center justify-center min-h-[300px] mt-12 border-2 border-dashed border-border rounded-2xl bg-card/50">
            <div className="p-4 rounded-full bg-muted mb-4">
              <LinkIcon className="h-8 w-8 text-muted-foreground" />
            </div>
            <h2 className="text-xl font-semibold mb-2">No imports yet</h2>
            <p className="text-muted-foreground max-w-md text-center">
              Enter a URL above to import resources.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}
