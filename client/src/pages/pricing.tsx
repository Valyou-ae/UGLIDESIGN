import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Check, X, Sparkles, ArrowRight, Zap, Mail, Crown, Star, ChevronDown, HelpCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";
import { useAuth } from "@/hooks/use-auth";
import { useMutation } from "@tanstack/react-query";
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
  icon: React.ReactNode;
}

const PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Perfect for exploring",
    price: 0,
    credits: 20,
    icon: <Star className="h-5 w-5" />,
    features: [
      { text: "20 credits/month", included: true },
      { text: "Basic image generation", included: true },
      { text: "Standard quality", included: true },
      { text: "Community gallery", included: true },
      { text: "Background remover", included: false },
      { text: "Mockup generator", included: false },
      { text: "Priority queue", included: false },
      { text: "Commercial license", included: false },
    ],
    cta: "Get Started",
  },
  {
    id: "basic",
    name: "Basic",
    description: "For hobbyists",
    price: 9,
    credits: 100,
    icon: <Zap className="h-5 w-5" />,
    features: [
      { text: "100 credits/month", included: true },
      { text: "All image styles", included: true },
      { text: "HD quality exports", included: true },
      { text: "Background remover", included: true },
      { text: "Basic mockups", included: true },
      { text: "Email support", included: true },
      { text: "Priority queue", included: false },
      { text: "Commercial license", included: false },
    ],
    cta: "Subscribe",
  },
  {
    id: "pro",
    name: "Pro",
    description: "For professionals",
    price: 29,
    credits: 500,
    popular: true,
    icon: <Crown className="h-5 w-5" />,
    features: [
      { text: "500 credits/month", included: true },
      { text: "All AI generators", included: true },
      { text: "4K quality exports", included: true },
      { text: "All mockup templates", included: true },
      { text: "Priority queue", included: true },
      { text: "Commercial license", included: true },
      { text: "Priority support", included: true },
      { text: "API access (soon)", included: true },
    ],
    cta: "Go Pro",
  },
  {
    id: "enterprise",
    name: "Enterprise",
    description: "For teams & agencies",
    price: "custom",
    credits: "unlimited",
    icon: <Sparkles className="h-5 w-5" />,
    features: [
      { text: "Unlimited credits", included: true },
      { text: "All Pro features", included: true },
      { text: "Custom integrations", included: true },
      { text: "Team collaboration", included: true },
      { text: "Dedicated manager", included: true },
      { text: "SLA guarantee", included: true },
      { text: "White-label options", included: true },
      { text: "On-premise deploy", included: true },
    ],
    cta: "Contact Us",
  },
];

const COMPARISON_FEATURES = [
  { name: "Monthly Credits", free: "20", basic: "100", pro: "500", enterprise: "Unlimited" },
  { name: "Image Quality", free: "Standard", basic: "HD", pro: "4K", enterprise: "4K+" },
  { name: "Commercial Use", free: "No", basic: "No", pro: "Yes", enterprise: "Yes" },
  { name: "Support", free: "Community", basic: "Email", pro: "Priority", enterprise: "Dedicated" },
];

const FAQS = [
  {
    question: "Can I upgrade or downgrade anytime?",
    answer: "Yes! You can change your plan at any time. When upgrading, you'll be charged the prorated difference. When downgrading, the change takes effect at the end of your billing cycle."
  },
  {
    question: "What happens when I run out of credits?",
    answer: "You can purchase additional credit packs from your billing page, or wait until your next billing cycle when your credits refresh."
  },
  {
    question: "Do unused credits roll over?",
    answer: "Credits reset each billing cycle and don't roll over. We recommend choosing a plan that matches your typical monthly usage."
  },
  {
    question: "Is there a refund policy?",
    answer: "We offer a 7-day money-back guarantee for first-time subscribers. Contact our support team if you're not satisfied."
  },
];

export default function Pricing() {
  const { user } = useAuth();
  const [, navigate] = useLocation();
  const { toast } = useToast();
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  
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
        <div className="relative">
          <div className="absolute inset-0 bg-gradient-to-br from-[#B94E30]/10 via-background to-[#E3B436]/10 pointer-events-none" />
          <div className="absolute top-0 left-1/4 w-96 h-96 bg-[#B94E30]/5 rounded-full blur-3xl pointer-events-none" />
          <div className="absolute top-20 right-1/4 w-72 h-72 bg-[#E3B436]/5 rounded-full blur-3xl pointer-events-none" />
          
          <div className="relative max-w-7xl mx-auto px-6 py-16">
            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              className="text-center mb-16"
            >
              <motion.div
                initial={{ scale: 0.9, opacity: 0 }}
                animate={{ scale: 1, opacity: 1 }}
                transition={{ delay: 0.1 }}
                className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-[#B94E30]/10 border border-[#B94E30]/20 mb-6"
              >
                <Sparkles className="h-4 w-4 text-[#B94E30]" />
                <span className="text-sm font-medium text-[#B94E30]">Simple, transparent pricing</span>
              </motion.div>
              
              <h1 className="text-5xl md:text-6xl font-bold mb-6">
                <span className="bg-gradient-to-r from-[#B94E30] via-[#E3B436] to-[#B94E30] bg-clip-text text-transparent">
                  Choose Your Plan
                </span>
              </h1>
              <p className="text-xl text-muted-foreground max-w-2xl mx-auto">
                Start free and scale as you grow. All plans include access to our AI-powered creative tools.
              </p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-4 gap-6 mb-20">
              {PLANS.map((plan, index) => {
                const isCurrentPlan = user && plan.id === currentPlan;
                const isPopular = plan.popular;
                
                return (
                  <motion.div
                    key={plan.id}
                    initial={{ opacity: 0, y: 30 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: index * 0.1 + 0.2 }}
                    whileHover={{ y: isPopular ? -8 : -4, transition: { duration: 0.2 } }}
                    className={cn(
                      "relative rounded-3xl p-6 flex flex-col transition-all duration-300",
                      isPopular 
                        ? "bg-gradient-to-b from-[#B94E30] to-[#8a3a24] text-white shadow-2xl shadow-[#B94E30]/30 scale-[1.02] lg:scale-105 z-10" 
                        : isCurrentPlan
                          ? "bg-card border-2 border-[#E3B436] shadow-lg shadow-[#E3B436]/10"
                          : "bg-card border border-border hover:border-[#B94E30]/50 hover:shadow-xl"
                    )}
                    data-testid={`card-plan-${plan.id}`}
                  >
                    {isPopular && (
                      <motion.div 
                        initial={{ scale: 0 }}
                        animate={{ scale: 1 }}
                        transition={{ delay: 0.5, type: "spring" }}
                        className="absolute -top-4 left-1/2 -translate-x-1/2"
                      >
                        <span className="inline-flex items-center gap-1.5 px-4 py-1.5 rounded-full bg-[#E3B436] text-[#664D3F] text-xs font-bold shadow-lg">
                          <Crown className="h-3.5 w-3.5" />
                          MOST POPULAR
                        </span>
                      </motion.div>
                    )}
                    
                    {isCurrentPlan && !isPopular && (
                      <div className="absolute -top-3 left-1/2 -translate-x-1/2">
                        <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-[#E3B436] text-[#664D3F] text-xs font-semibold">
                          Current Plan
                        </span>
                      </div>
                    )}

                    <div className={cn(
                      "w-12 h-12 rounded-2xl flex items-center justify-center mb-4",
                      isPopular 
                        ? "bg-white/20" 
                        : "bg-gradient-to-br from-[#B94E30]/10 to-[#E3B436]/10"
                    )}>
                      <div className={isPopular ? "text-white" : "text-[#B94E30]"}>
                        {plan.icon}
                      </div>
                    </div>
                    
                    <div className="mb-4">
                      <h3 className={cn(
                        "text-xl font-bold",
                        isPopular ? "text-white" : "text-foreground"
                      )}>{plan.name}</h3>
                      <p className={cn(
                        "text-sm mt-1",
                        isPopular ? "text-white/80" : "text-muted-foreground"
                      )}>{plan.description}</p>
                    </div>
                    
                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        {plan.price === "custom" ? (
                          <span className={cn(
                            "text-3xl font-bold",
                            isPopular ? "text-white" : "text-foreground"
                          )}>Custom</span>
                        ) : (
                          <>
                            <span className={cn(
                              "text-4xl font-bold",
                              isPopular ? "text-[#E3B436]" : "text-[#B94E30]"
                            )}>
                              ${plan.price}
                            </span>
                            <span className={isPopular ? "text-white/70" : "text-muted-foreground"}>/mo</span>
                          </>
                        )}
                      </div>
                      <p className={cn(
                        "text-sm mt-1",
                        isPopular ? "text-white/70" : "text-muted-foreground"
                      )}>
                        {plan.credits === "unlimited" 
                          ? "Unlimited credits" 
                          : `${plan.credits.toLocaleString()} credits/month`}
                      </p>
                    </div>
                    
                    <ul className="space-y-3 mb-6 flex-1">
                      {plan.features.map((feature, i) => (
                        <motion.li 
                          key={i} 
                          initial={{ opacity: 0, x: -10 }}
                          animate={{ opacity: 1, x: 0 }}
                          transition={{ delay: index * 0.1 + i * 0.05 + 0.3 }}
                          className="flex items-start gap-2"
                        >
                          <div className={cn(
                            "h-5 w-5 rounded-full flex items-center justify-center flex-shrink-0 mt-0.5",
                            feature.included 
                              ? isPopular 
                                ? "bg-white/20 text-white" 
                                : "bg-[#B94E30]/10 text-[#B94E30]"
                              : isPopular
                                ? "bg-white/10 text-white/40"
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
                            feature.included 
                              ? isPopular ? "text-white" : "text-foreground"
                              : isPopular ? "text-white/40" : "text-muted-foreground"
                          )}>
                            {feature.text}
                          </span>
                        </motion.li>
                      ))}
                    </ul>
                    
                    <Button 
                      onClick={() => handlePlanClick(plan)}
                      disabled={isCurrentPlan || checkoutMutation.isPending}
                      className={cn(
                        "w-full h-12 text-base font-semibold rounded-xl transition-all",
                        isPopular 
                          ? "bg-white text-[#B94E30] hover:bg-white/90 shadow-lg" 
                          : plan.id === "enterprise"
                            ? "bg-[#664D3F] text-white hover:bg-[#664D3F]/90"
                            : "bg-[#B94E30] text-white hover:bg-[#B94E30]/90"
                      )}
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
              transition={{ delay: 0.6 }}
              className="bg-card border border-border rounded-3xl p-8 mb-16 overflow-hidden"
            >
              <h2 className="text-2xl font-bold text-center mb-8">Compare Plans</h2>
              <div className="overflow-x-auto">
                <table className="w-full min-w-[600px]">
                  <thead>
                    <tr className="border-b border-border">
                      <th className="text-left py-4 px-4 font-medium text-muted-foreground">Feature</th>
                      <th className="text-center py-4 px-4 font-medium">Free</th>
                      <th className="text-center py-4 px-4 font-medium">Basic</th>
                      <th className="text-center py-4 px-4 font-medium text-[#B94E30]">Pro</th>
                      <th className="text-center py-4 px-4 font-medium">Enterprise</th>
                    </tr>
                  </thead>
                  <tbody>
                    {COMPARISON_FEATURES.map((feature, i) => (
                      <tr key={i} className="border-b border-border/50 last:border-0">
                        <td className="py-4 px-4 text-sm font-medium">{feature.name}</td>
                        <td className="py-4 px-4 text-center text-sm text-muted-foreground">{feature.free}</td>
                        <td className="py-4 px-4 text-center text-sm">{feature.basic}</td>
                        <td className="py-4 px-4 text-center text-sm font-medium text-[#B94E30]">{feature.pro}</td>
                        <td className="py-4 px-4 text-center text-sm">{feature.enterprise}</td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.7 }}
              className="bg-gradient-to-r from-[#B94E30] to-[#E3B436] rounded-3xl p-8 md:p-12 text-center mb-16"
            >
              <div className="max-w-2xl mx-auto">
                <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-white/20 mb-6">
                  <Zap className="h-8 w-8 text-white" />
                </div>
                <h2 className="text-3xl font-bold text-white mb-4">
                  Need More Credits?
                </h2>
                <p className="text-white/80 mb-8">
                  Running low? Purchase additional credit packs anytime from your billing page. Credits never expire once purchased.
                </p>
                <Link href={user ? "/billing" : "/api/login"}>
                  <Button 
                    size="lg"
                    className="bg-white text-[#B94E30] hover:bg-white/90 font-semibold px-8 h-12 rounded-xl shadow-lg"
                    data-testid="button-buy-credits"
                  >
                    {user ? "Buy More Credits" : "Sign Up to Get Started"}
                    <ArrowRight className="ml-2 h-5 w-5" />
                  </Button>
                </Link>
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0, y: 20 }}
              animate={{ opacity: 1, y: 0 }}
              transition={{ delay: 0.8 }}
              className="max-w-3xl mx-auto mb-16"
            >
              <div className="flex items-center justify-center gap-2 mb-8">
                <HelpCircle className="h-5 w-5 text-[#B94E30]" />
                <h2 className="text-2xl font-bold">Frequently Asked Questions</h2>
              </div>
              <div className="space-y-3">
                {FAQS.map((faq, i) => (
                  <motion.div
                    key={i}
                    initial={{ opacity: 0, y: 10 }}
                    animate={{ opacity: 1, y: 0 }}
                    transition={{ delay: 0.8 + i * 0.1 }}
                    className="border border-border rounded-xl overflow-hidden"
                  >
                    <button
                      onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                      className="w-full flex items-center justify-between p-5 text-left hover:bg-muted/50 transition-colors"
                      data-testid={`faq-${i}`}
                    >
                      <span className="font-medium">{faq.question}</span>
                      <ChevronDown className={cn(
                        "h-5 w-5 text-muted-foreground transition-transform",
                        expandedFaq === i && "rotate-180"
                      )} />
                    </button>
                    <AnimatePresence>
                      {expandedFaq === i && (
                        <motion.div
                          initial={{ height: 0, opacity: 0 }}
                          animate={{ height: "auto", opacity: 1 }}
                          exit={{ height: 0, opacity: 0 }}
                          transition={{ duration: 0.2 }}
                          className="overflow-hidden"
                        >
                          <p className="px-5 pb-5 text-muted-foreground">
                            {faq.answer}
                          </p>
                        </motion.div>
                      )}
                    </AnimatePresence>
                  </motion.div>
                ))}
              </div>
            </motion.div>

            <motion.div 
              initial={{ opacity: 0 }}
              animate={{ opacity: 1 }}
              transition={{ delay: 1 }}
              className="text-center pb-8"
            >
              <h3 className="text-lg font-semibold text-foreground mb-2">
                Still have questions?
              </h3>
              <p className="text-muted-foreground mb-4">
                Our team is here to help you find the perfect plan.
              </p>
              <Link href="/help">
                <Button variant="outline" className="rounded-xl" data-testid="button-contact-support">
                  <Mail className="mr-2 h-4 w-4" />
                  Contact Support
                </Button>
              </Link>
            </motion.div>

          </div>
        </div>
      </main>
    </div>
  );
}
