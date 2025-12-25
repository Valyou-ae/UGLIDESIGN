import { useState } from "react";
import { Link, useLocation } from "wouter";
import { Check, Sparkles, ArrowRight, Zap, Loader2, Shield, Star, Users, Clock, ChevronDown, ChevronUp, MessageCircle } from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { cn } from "@/lib/utils";
import { Button } from "@/components/ui/button";
import { Sidebar } from "@/components/sidebar";
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
  price: number;
  priceYearly: number;
  credits: number;
  popular?: boolean;
  features: PlanFeature[];
}

interface SubscriptionStatus {
  hasSubscription: boolean;
  subscription: {
    id: string;
    status: string;
    current_period_end: number;
  } | null;
  plan: string;
}

interface StripeProduct {
  product_id: string;
  product_name: string;
  product_description: string | null;
  price_id: string;
  unit_amount: number | null;
  recurring: { interval: string } | null;
}

const PLANS: PricingPlan[] = [
  {
    id: "free",
    name: "Free",
    description: "Try UGLI risk-free",
    price: 0,
    priceYearly: 0,
    credits: 50,
    features: [
      { text: "~10 AI images per month", included: true },
      { text: "Standard quality (720p)", included: true },
      { text: "Basic styles & prompts", included: true },
      { text: "Community support", included: true },
      { text: "Background removal", included: false },
      { text: "Product mockups", included: false },
      { text: "Priority generation", included: false },
    ],
  },
  {
    id: "starter",
    name: "Starter",
    description: "Perfect for side projects",
    price: 6.99,
    priceYearly: 67,
    credits: 500,
    features: [
      { text: "~100 AI images per month", included: true },
      { text: "HD quality (1080p)", included: true },
      { text: "All styles & advanced prompts", included: true },
      { text: "Unlimited background removal", included: true },
      { text: "Email support", included: true },
      { text: "Product mockups", included: false },
      { text: "Priority generation", included: false },
    ],
  },
  {
    id: "pro",
    name: "Pro",
    description: "For serious creators",
    price: 19.99,
    priceYearly: 192,
    credits: 2000,
    popular: true,
    features: [
      { text: "~400 AI images per month", included: true },
      { text: "HD quality (1080p)", included: true },
      { text: "All styles & advanced prompts", included: true },
      { text: "Unlimited background removal", included: true },
      { text: "Product mockup generator", included: true },
      { text: "Priority generation (2x faster)", included: true },
      { text: "Commercial license", included: true },
    ],
  },
  {
    id: "business",
    name: "Business",
    description: "For teams & agencies",
    price: 49.99,
    priceYearly: 480,
    credits: 10000,
    features: [
      { text: "~2000 AI images per month", included: true },
      { text: "4K quality (2160p)", included: true },
      { text: "API access", included: true },
      { text: "5 team seats", included: true },
      { text: "Dedicated account manager", included: true },
      { text: "Custom branding", included: true },
      { text: "Analytics dashboard", included: true },
    ],
  },
];

const PLAN_ORDER = ["free", "starter", "pro", "business"];

const TESTIMONIALS = [
  {
    name: "Sarah M.",
    role: "E-commerce Owner",
    text: "UGLI saved me hours of work. I create product mockups in minutes instead of hiring designers.",
    rating: 5,
  },
  {
    name: "James K.",
    role: "Content Creator",
    text: "The AI quality is incredible. My social media engagement doubled after switching to UGLI-generated images.",
    rating: 5,
  },
  {
    name: "Lisa T.",
    role: "Marketing Manager",
    text: "Best investment for our team. We produce 10x more content with the same budget.",
    rating: 5,
  },
];

const FAQS = [
  {
    q: "How do credits work?",
    a: "Each AI image generation uses approximately 5 credits. Background removal and mockups use 2-3 credits each. Unused credits don't roll over to the next month.",
  },
  {
    q: "Can I cancel anytime?",
    a: "Yes! You can cancel your subscription at any time. You'll keep access until the end of your billing period.",
  },
  {
    q: "What payment methods do you accept?",
    a: "We accept all major credit cards (Visa, Mastercard, American Express) through Stripe's secure payment system.",
  },
  {
    q: "Is there a money-back guarantee?",
    a: "Yes, we offer a 7-day money-back guarantee. If you're not satisfied, contact us for a full refund.",
  },
];

export default function Pricing() {
  const { toast } = useToast();
  const [, setLocation] = useLocation();
  const [billingPeriod, setBillingPeriod] = useState<"monthly" | "yearly">("monthly");
  const [expandedFaq, setExpandedFaq] = useState<number | null>(null);
  const [imageNeed, setImageNeed] = useState(100);

  const { data: subscriptionData } = useQuery<SubscriptionStatus>({
    queryKey: ["stripe", "subscription"],
    queryFn: async () => {
      const res = await fetch("/api/stripe/subscription-status", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to get subscription status");
      return res.json();
    },
    staleTime: 1000 * 60 * 2,
  });

  const { data: productsData } = useQuery<{ products: StripeProduct[] }>({
    queryKey: ["stripe", "products"],
    queryFn: async () => {
      const res = await fetch("/api/stripe/products", { credentials: "include" });
      if (!res.ok) throw new Error("Failed to get products");
      return res.json();
    },
    staleTime: 1000 * 60 * 10,
  });

  const checkoutMutation = useMutation({
    mutationFn: async ({ priceId, mode }: { priceId: string; mode: 'subscription' | 'payment' }) => {
      const res = await fetch("/api/stripe/create-checkout-session", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        credentials: "include",
        body: JSON.stringify({ priceId, mode }),
      });
      if (!res.ok) throw new Error("Failed to create checkout session");
      return res.json();
    },
    onSuccess: (data) => {
      if (data.url) {
        window.location.href = data.url;
      }
    },
    onError: (error: Error) => {
      toast({ title: "Error", description: error.message, variant: "destructive" });
    },
  });

  const currentPlan = subscriptionData?.plan || "free";
  const currentPlanIndex = PLAN_ORDER.indexOf(currentPlan.toLowerCase());

  const products = productsData?.products || [];
  const stripePriceMap: Record<string, { monthly?: string; yearly?: string }> = {};
  
  const normalizePlanName = (name: string): string => {
    const lower = name.toLowerCase();
    if (lower.includes('starter')) return 'starter';
    if (lower.includes('pro')) return 'pro';
    return lower.replace(/\s*(plan|ugli)\s*/gi, '').trim();
  };
  
  products
    .filter(p => p.recurring && !p.product_name.toLowerCase().includes('enterprise'))
    .forEach(product => {
      const planId = normalizePlanName(product.product_name);
      if (!stripePriceMap[planId]) {
        stripePriceMap[planId] = {};
      }
      if (product.recurring?.interval === 'month') {
        stripePriceMap[planId].monthly = product.price_id;
      } else if (product.recurring?.interval === 'year') {
        stripePriceMap[planId].yearly = product.price_id;
      }
    });

  const getPlanStatus = (planId: string) => {
    const planIndex = PLAN_ORDER.indexOf(planId);
    if (planId === currentPlan.toLowerCase()) return "current";
    if (planIndex > currentPlanIndex) return "upgrade";
    return "downgrade";
  };

  const getRecommendedPlan = () => {
    if (imageNeed <= 10) return "free";
    if (imageNeed <= 100) return "starter";
    return "pro";
  };

  const handlePlanClick = (plan: PricingPlan) => {
    const status = getPlanStatus(plan.id);
    if (status === "current" || plan.id === "free") return;

    const priceId = billingPeriod === "monthly" 
      ? stripePriceMap[plan.id]?.monthly 
      : stripePriceMap[plan.id]?.yearly;

    if (priceId) {
      checkoutMutation.mutate({ priceId, mode: 'subscription' });
    } else {
      toast({ 
        title: "Plan not available", 
        description: "This plan is not currently available. Please try again later.",
        variant: "destructive" 
      });
    }
  };

  const recommendedPlan = getRecommendedPlan();

  return (
    <div className="min-h-screen bg-background flex font-sans text-foreground overflow-hidden">
      <Sidebar />
      
      <main className="flex-1 h-screen overflow-y-auto">
        <div className="max-w-4xl mx-auto px-6 py-12">
          
          {/* HERO: Problem/Solution */}
          <motion.div 
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            className="text-center mb-16"
          >
            <div className="inline-flex items-center gap-2 px-4 py-2 rounded-full bg-primary/10 text-primary text-sm font-medium mb-6">
              <Users className="h-4 w-4" />
              Trusted by 2,500+ creators
            </div>
            
            <h1 className="text-4xl md:text-5xl font-bold text-foreground mb-4 leading-tight">
              Stop spending hours on<br />
              <span className="text-primary">design work</span>
            </h1>
            <p className="text-lg text-muted-foreground max-w-2xl mx-auto mb-8">
              Generate stunning AI images, remove backgrounds, and create product mockups in seconds. No design skills needed.
            </p>

            {/* Stats */}
            <div className="flex justify-center gap-8 md:gap-12 text-center mb-8">
              <div>
                <div className="text-2xl font-bold text-foreground">500K+</div>
                <div className="text-sm text-muted-foreground">Images created</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">4.9/5</div>
                <div className="text-sm text-muted-foreground">User rating</div>
              </div>
              <div>
                <div className="text-2xl font-bold text-foreground">2x</div>
                <div className="text-sm text-muted-foreground">Faster workflow</div>
              </div>
            </div>
          </motion.div>

          {/* CALCULATOR: How many images do you need? */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.1 }}
            className="bg-card border border-border rounded-2xl p-6 mb-12"
          >
            <h3 className="text-lg font-semibold text-foreground mb-4 text-center">
              How many images do you need per month?
            </h3>
            <div className="flex items-center gap-4 max-w-md mx-auto">
              <input
                type="range"
                min="10"
                max="500"
                step="10"
                value={imageNeed}
                onChange={(e) => setImageNeed(Number(e.target.value))}
                className="flex-1 h-2 bg-muted rounded-lg appearance-none cursor-pointer accent-primary"
                data-testid="slider-image-need"
              />
              <div className="w-20 text-center">
                <span className="text-2xl font-bold text-foreground">{imageNeed}</span>
                <span className="text-sm text-muted-foreground block">images</span>
              </div>
            </div>
            <p className="text-center text-sm text-muted-foreground mt-4">
              Based on your needs, we recommend: <span className="font-semibold text-primary capitalize">{recommendedPlan}</span>
            </p>
          </motion.div>

          {/* BILLING TOGGLE */}
          <div className="flex justify-center mb-8">
            <div className="inline-flex items-center gap-2 p-1 bg-muted rounded-full">
              <button
                onClick={() => setBillingPeriod("monthly")}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all",
                  billingPeriod === "monthly" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                data-testid="button-monthly"
              >
                Monthly
              </button>
              <button
                onClick={() => setBillingPeriod("yearly")}
                className={cn(
                  "px-6 py-2 rounded-full text-sm font-medium transition-all flex items-center gap-2",
                  billingPeriod === "yearly" 
                    ? "bg-background text-foreground shadow-sm" 
                    : "text-muted-foreground hover:text-foreground"
                )}
                data-testid="button-yearly"
              >
                Yearly
                <span className="text-[10px] font-bold px-2 py-0.5 rounded-full bg-green-500/10 text-green-600">
                  Save 17%
                </span>
              </button>
            </div>
          </div>

          {/* PLANS: Upgrade Ladder */}
          <div className="grid md:grid-cols-3 gap-4 mb-12">
            {PLANS.map((plan, index) => {
              const status = getPlanStatus(plan.id);
              const isCurrentPlan = status === "current";
              const isRecommended = plan.id === recommendedPlan && !isCurrentPlan;
              const priceId = billingPeriod === "monthly" 
                ? stripePriceMap[plan.id]?.monthly 
                : stripePriceMap[plan.id]?.yearly;
              const hasPriceAvailable = plan.id === "free" || !!priceId;
              const isDisabled = isCurrentPlan || plan.id === "free" || !hasPriceAvailable;

              return (
                <motion.div
                  key={plan.id}
                  initial={{ opacity: 0, x: -20 }}
                  animate={{ opacity: 1, x: 0 }}
                  transition={{ delay: index * 0.1 }}
                  className={cn(
                    "relative rounded-2xl border p-6 transition-all",
                    isRecommended 
                      ? "border-primary bg-primary/5 shadow-lg shadow-primary/10 scale-[1.02]" 
                      : "border-border bg-card hover:border-primary/50",
                    isCurrentPlan && "ring-2 ring-green-500 border-green-500"
                  )}
                  data-testid={`card-plan-${plan.id}`}
                >
                  {isRecommended && (
                    <div className="absolute -top-3 left-6">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-primary text-primary-foreground text-xs font-semibold">
                        <Sparkles className="h-3 w-3" />
                        Recommended for you
                      </span>
                    </div>
                  )}
                  
                  {isCurrentPlan && (
                    <div className="absolute -top-3 left-6">
                      <span className="inline-flex items-center gap-1 px-3 py-1 rounded-full bg-green-500 text-white text-xs font-semibold">
                        <Check className="h-3 w-3" />
                        Your current plan
                      </span>
                    </div>
                  )}

                  <div className="flex flex-col h-full">
                    <div className="mb-4">
                      <h3 className="text-xl font-bold text-foreground">{plan.name}</h3>
                      <p className="text-sm text-muted-foreground">{plan.description}</p>
                    </div>

                    <div className="mb-6">
                      <div className="flex items-baseline gap-1">
                        <span className="text-4xl font-bold text-foreground">
                          ${billingPeriod === "monthly" ? plan.price : plan.priceYearly}
                        </span>
                        <span className="text-muted-foreground">
                          /{billingPeriod === "monthly" ? "mo" : "yr"}
                        </span>
                      </div>
                    </div>
                      
                    <ul className="space-y-2 mb-6 flex-1">
                      {plan.features.map((feature, i) => (
                        <li key={i} className={cn(
                          "flex items-start gap-2 text-sm",
                          feature.included ? "text-foreground" : "text-muted-foreground"
                        )}>
                          <Check className={cn(
                            "h-4 w-4 mt-0.5 flex-shrink-0", 
                            feature.included ? "text-primary" : "text-muted-foreground/40"
                          )} />
                          <span className={!feature.included ? "line-through" : ""}>{feature.text}</span>
                        </li>
                      ))}
                    </ul>
                      
                    <Button 
                      onClick={() => handlePlanClick(plan)}
                      disabled={isDisabled || checkoutMutation.isPending}
                      className={cn(
                        "w-full",
                        isCurrentPlan 
                          ? "bg-muted text-muted-foreground cursor-not-allowed"
                          : isRecommended
                            ? "bg-primary hover:bg-primary/90 text-primary-foreground" 
                            : "bg-secondary hover:bg-secondary/90 text-secondary-foreground"
                      )}
                      data-testid={`button-select-${plan.id}`}
                    >
                      {checkoutMutation.isPending ? (
                        <Loader2 className="h-4 w-4 animate-spin" />
                      ) : isCurrentPlan ? (
                        "Current Plan"
                      ) : plan.id === "free" ? (
                        "Get Started For FREE!"
                      ) : (
                        <>
                          Upgrade to {plan.name}
                          <ArrowRight className="ml-2 h-4 w-4" />
                        </>
                      )}
                    </Button>
                  </div>
                </motion.div>
              );
            })}
          </div>

          {/* TRUST BADGES */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.3 }}
            className="flex flex-wrap justify-center gap-6 mb-16 text-sm text-muted-foreground"
          >
            <div className="flex items-center gap-2">
              <Shield className="h-5 w-5 text-green-500" />
              <span>Secure checkout</span>
            </div>
            <div className="flex items-center gap-2">
              <Clock className="h-5 w-5 text-primary" />
              <span>7-day money-back guarantee</span>
            </div>
            <div className="flex items-center gap-2">
              <Zap className="h-5 w-5 text-yellow-500" />
              <span>Cancel anytime</span>
            </div>
          </motion.div>

          {/* TESTIMONIALS */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.4 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              Loved by creators worldwide
            </h2>
            <div className="grid md:grid-cols-3 gap-6">
              {TESTIMONIALS.map((testimonial, i) => (
                <div key={i} className="bg-card border border-border rounded-xl p-5">
                  <div className="flex gap-1 mb-3">
                    {[...Array(testimonial.rating)].map((_, j) => (
                      <Star key={j} className="h-4 w-4 fill-yellow-400 text-yellow-400" />
                    ))}
                  </div>
                  <p className="text-foreground mb-4 text-sm leading-relaxed">"{testimonial.text}"</p>
                  <div>
                    <div className="font-semibold text-foreground text-sm">{testimonial.name}</div>
                    <div className="text-xs text-muted-foreground">{testimonial.role}</div>
                  </div>
                </div>
              ))}
            </div>
          </motion.div>

          {/* FAQ */}
          <motion.div
            initial={{ opacity: 0, y: 20 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.5 }}
            className="mb-16"
          >
            <h2 className="text-2xl font-bold text-foreground text-center mb-8">
              Frequently asked questions
            </h2>
            <div className="space-y-3 max-w-2xl mx-auto">
              {FAQS.map((faq, i) => (
                <div 
                  key={i} 
                  className="bg-card border border-border rounded-xl overflow-hidden"
                >
                  <button
                    onClick={() => setExpandedFaq(expandedFaq === i ? null : i)}
                    className="w-full flex items-center justify-between p-4 text-left"
                    data-testid={`faq-toggle-${i}`}
                  >
                    <span className="font-medium text-foreground">{faq.q}</span>
                    {expandedFaq === i ? (
                      <ChevronUp className="h-5 w-5 text-muted-foreground" />
                    ) : (
                      <ChevronDown className="h-5 w-5 text-muted-foreground" />
                    )}
                  </button>
                  <AnimatePresence>
                    {expandedFaq === i && (
                      <motion.div
                        initial={{ height: 0, opacity: 0 }}
                        animate={{ height: "auto", opacity: 1 }}
                        exit={{ height: 0, opacity: 0 }}
                        className="overflow-hidden"
                      >
                        <p className="px-4 pb-4 text-sm text-muted-foreground">{faq.a}</p>
                      </motion.div>
                    )}
                  </AnimatePresence>
                </div>
              ))}
            </div>
          </motion.div>

          {/* CTA + Support */}
          <motion.div 
            initial={{ opacity: 0 }}
            animate={{ opacity: 1 }}
            transition={{ delay: 0.6 }}
            className="text-center bg-card border border-border rounded-2xl p-8"
          >
            <MessageCircle className="h-10 w-10 text-primary mx-auto mb-4" />
            <h3 className="text-xl font-bold text-foreground mb-2">
              Still have questions?
            </h3>
            <p className="text-muted-foreground mb-6">
              Our team is here to help you find the perfect plan for your needs.
            </p>
            <Link href="/help">
              <Button variant="outline" data-testid="button-contact-support">
                Chat with us
              </Button>
            </Link>
          </motion.div>

        </div>

        {/* STICKY MOBILE CTA */}
        <div className="fixed bottom-0 left-0 right-0 md:hidden bg-background/95 backdrop-blur border-t border-border p-4 z-50">
          <Button 
            onClick={() => {
              const plan = PLANS.find(p => p.id === recommendedPlan);
              if (plan) handlePlanClick(plan);
            }}
            className="w-full bg-primary hover:bg-primary/90 text-primary-foreground"
            size="lg"
            data-testid="button-mobile-cta"
          >
            Get {recommendedPlan.charAt(0).toUpperCase() + recommendedPlan.slice(1)} Plan
            <ArrowRight className="ml-2 h-4 w-4" />
          </Button>
        </div>
      </main>
    </div>
  );
}
