import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Check, X, Sparkles, ArrowRight, Zap, Mail } from "lucide-react";
import { motion } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useQuery, useMutation } from "@tanstack/react-query";
import { useToast } from "@/hooks/use-toast";

interface PlanFeature {
  text: string;
  included: boolean;
}

interface PricingPlan {
  id: string;
  name: string;
  description: string;
  price: number | "custom";
  credits: number | "unlimited";
  popular?: boolean;
  features: PlanFeature[];
  cta: string;
  ctaVariant: "default" | "primary" | "outline";
}

const PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for exploring UGLI",
    price: 0,
    credits: 20,
    features: [
      { text: "20 credits/month", included: true },
      { text: "Basic image generation", included: true },
      { text: "Standard quality", included: true },
      { text: "Community gallery access", included: true },
      { text: "Background remover", included: false },
      { text: "Mockup generator", included: false },
      { text: "Priority queue", included: false },
      { text: "Commercial license", included: false },
    ],
    cta: "Get Started",
    ctaVariant: "outline",
  },
  {
    id: "basic",
    name: "Basic",
    description: "For hobbyists and casual creators",
    price: 9,
    credits: 100,
    features: [
      { text: "100 credits/month", included: true },
      { text: "All image styles", included: true },
      { text: "HD quality exports", included: true },
      { text: "Background remover", included: true },
      { text: "Basic mockup templates", included: true },
      { text: "Email support", included: true },
      { text: "Priority queue", included: false },
      { text: "Commercial license", included: false },
    ],
    cta: "Subscribe",
    ctaVariant: "default",
  },
  {
    id: "pro",
    name: "Pro",
    description: "For professionals and power users",
    price: 29,
    credits: 500,
    popular: true,
    features: [
      { text: "500 credits/month", included: true },
      { text: "All AI generators", included: true },
      { text: "4K quality exports", included: true },
      { text: "All mockup templates", included: true },
      { text: "Priority queue", included: true },
      { text: "Commercial license", included: true },
      { text: "Priority support", included: true },
      { text: "API access (coming soon)", included: true },
    ],
    cta: "Subscribe",
    ctaVariant: "primary",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For teams and agencies",
    price: "custom",
    credits: "unlimited",
    features: [
      { text: "Unlimited credits", included: true },
      { text: "All Pro features", included: true },
      { text: "Custom integrations", included: true },
      { text: "Team collaboration", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "SLA guarantee", included: true },
      { text: "White-label options", included: true },
      { text: "On-premise deployment", included: true },
    ],
    cta: "Contact Us",
    ctaVariant: "outline",
  },
];

export default function Pricing() {
  const { user, isLoading: authLoading } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  
  const currentPlan = user?.planTier || "free";

  const checkoutMutation = useMutation({
    mutationFn: async (planId: string) => {
      const response = await fetch("/api/stripe/checkout-plan", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ planId }),
        credentials: "include",
      });
      if (!response.ok) {
        const error = await response.json();
        throw new Error(error.message || "Failed to create checkout session");
      }
      return response.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: Error) => {
      toast({
        title: "Error",
        description: error.message,
        variant: "destructive",
      });
    },
  });

  const handlePlanClick = (plan: PricingPlan) => {
    if (plan.id === "enterprise") {
      navigate("/help");
      return;
    }
    
    if (!user) {
      window.location.href = "/api/login";
      return;
    }
    
    if (plan.id === currentPlan) {
      return;
    }
    
    if (plan.id === "free") {
      navigate("/billing");
      return;
    }
    
    checkoutMutation.mutate(plan.id);
  };

  const getButtonText = (plan: PricingPlan) => {
    if (!user) {
      return plan.id === "enterprise" ? "Contact Us" : "Sign Up";
    }
    if (plan.id === currentPlan) {
      return "Current Plan";
    }
    if (plan.id === "enterprise") {
      return "Contact Us";
    }
    const planOrder = ["free", "basic", "pro", "enterprise"];
    const currentIndex = planOrder.indexOf(currentPlan);
    const planIndex = planOrder.indexOf(plan.id);
    return planIndex > currentIndex ? "Upgrade" : "Downgrade";
  };

  return (
    <div className="min-h-screen bg-background flex font-sans text-foreground overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 h-screen overflow-y-auto">
        <div className="max-w-7xl mx-auto px-6 py-12">
          
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-12"
          >
            <h1 className="text-4xl font-bold text-foreground mb-4">
              Simple, Transparent Pricing
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto">
              Choose the plan that fits your creative needs. Upgrade or downgrade anytime.
            </p>
          </motion.div>

          <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-16">
            {PLANS.map((plan, index) => {
              const isCurrentPlan = user && plan.id === currentPlan;
              const isPopular = plan.popular;
              
              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative rounded-2xl border p-6 flex flex-col",
                    isPopular 
                      ? "border-[#B94E30] bg-[#B94E30]/5 shadow-lg shadow-[#B94E30]/10" 
                      : isCurrentPlan
                        ? "border-[#E3B436] bg-[#E3B436]/5"
                        : "border-border bg-card"
                  )}
                  data-testid={`card-plan-${plan.id}`}
                >
                  {isPopular && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#B94E30] text-white text-xs font-semibold">
                        <Sparkles className="h-3 w-3" />
                        Most Popular
                      </span>
                    </div>
                  )}
                  
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E3B436] text-[#664D3F] text-xs font-semibold">
                        Current Plan
                      </span>
                    </div>
                  )}
                  
                  <div className="mb-6 pt-2">
                    <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                    <p className="text-sm text-muted-foreground mt-1">{plan.description}</p>
                  </div>
                  
                  <div className="mb-6">
                    <div className="flex items-baseline gap-1">
                      {plan.price === "custom" ? (
                        <span className="text-3xl font-bold text-foreground">Custom</span>
                      ) : (
                        <>
                          <span className="text-4xl font-bold text-foreground">
                            ${plan.price}
                          </span>
                          <span className="text-muted-foreground">/mo</span>
                        </>
                      )}
                    </div>
                    <p className="text-sm text-muted-foreground mt-1">
                      {plan.credits === "unlimited" 
                        ? "Unlimited credits" 
                        : `${plan.credits.toLocaleString()} credits/month`}
                    </p>
                  </div>
                  
                  <ul className="space-y-3 mb-8 flex-1">
                    {plan.features.map((feature, i) => (
                      <li key={i} className="flex items-start gap-2">
                        <div className={cn(
                          "h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                          feature.included 
                            ? "bg-[#B94E30]/10 text-[#B94E30]" 
                            : "bg-muted text-muted-foreground"
                        )}>
                          {feature.included ? (
                            <Check className="h-3 w-3" />
                          ) : (
                            <X className="h-3 w-3" />
                          )}
                        </div>
                        <span className={cn(
                          "text-sm",
                          feature.included ? "text-foreground" : "text-muted-foreground"
                        )}>
                          {feature.text}
                        </span>
                      </li>
                    ))}
                  </ul>
                  
                  <Button 
                    onClick={() => handlePlanClick(plan)}
                    disabled={isCurrentPlan || checkoutMutation.isPending}
                    className={cn(
                      "w-full",
                      isPopular 
                        ? "bg-[#B94E30] hover:bg-[#B94E30]/90 text-white" 
                        : plan.ctaVariant === "outline"
                          ? "border-[#664D3F]/20 hover:bg-[#664D3F]/5"
                          : "bg-[#E3B436] hover:bg-[#E3B436]/90 text-[#664D3F]"
                    )}
                    variant={plan.ctaVariant === "outline" ? "outline" : "default"}
                    data-testid={`button-select-${plan.id}`}
                  >
                    {plan.id === "enterprise" && <Mail className="mr-2 h-4 w-4" />}
                    {getButtonText(plan)}
                    {!isCurrentPlan && plan.id !== "enterprise" && (
                      <ArrowRight className="ml-2 h-4 w-4" />
                    )}
                  </Button>
                </motion.div>
              );
            })}
          </div>

          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="bg-gradient-to-r from-[#B94E30]/10 to-[#E3B436]/10 border border-[#B94E30]/20 rounded-2xl p-8 text-center"
          >
            <div className="flex items-center justify-center gap-3 mb-4">
              <div className="h-12 w-12 rounded-xl bg-[#E3B436]/20 flex items-center justify-center">
                <Zap className="h-6 w-6 text-[#E3B436]" />
              </div>
            </div>
            <h2 className="text-2xl font-bold text-foreground mb-2">
              Need More Credits?
            </h2>
            <p className="text-muted-foreground mb-6 max-w-lg mx-auto">
              Running low on credits? You can purchase additional credit packs anytime from your billing page.
            </p>
            <Link href={user ? "/billing" : "/api/login"}>
              <Button 
                className="bg-[#B94E30] hover:bg-[#B94E30]/90 text-white"
                data-testid="button-buy-credits"
              >
                {user ? "Buy More Credits" : "Sign Up to Get Started"}
                <ArrowRight className="ml-2 h-4 w-4" />
              </Button>
            </Link>
          </motion.div>

          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="mt-16 text-center"
          >
            <h3 className="text-lg font-semibold text-foreground mb-2">
              Questions? We're here to help.
            </h3>
            <p className="text-muted-foreground mb-4">
              Contact our team for custom enterprise solutions or any questions about our plans.
            </p>
            <Link href="/help">
              <Button variant="outline" data-testid="button-contact-support">
                Contact Support
              </Button>
            </Link>
          </motion.div>

        </div>
      </main>
    </div>
  );
}
