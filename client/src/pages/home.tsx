import { Sidebar } from "@/components/sidebar";
import { TopBar } from "@/components/top-bar";
import { BentoGrid } from "@/components/bento-grid";
import { WelcomeModal } from "@/components/welcome-modal";

export default function Home() {
  return (
    <div className="min-h-screen bg-background flex font-sans text-foreground overflow-hidden">
      <WelcomeModal />
      <Sidebar />
      
      <main className="flex-1 h-screen overflow-y-auto relative">
        <div className="max-w-[1600px] mx-auto">
          <TopBar />
          <div className="p-6 lg:p-10 animate-fade-in">
            <BentoGrid />
          </div>
        </div>
      </main>
    </div>
  );
}
