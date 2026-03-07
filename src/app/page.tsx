"use client";

import Link from "next/link";
import {
  ArrowRight,
  BarChart3,
  ShieldCheck,
  Zap,
  LineChart,
  Globe,
  Lock,
  PlayCircle,
  Star,
  ChevronDown,
  CheckCircle2,
  Trophy,
  Crown,
  Sparkles
} from "lucide-react";
import { motion, AnimatePresence } from "framer-motion";
import { useState } from "react";
import { Button } from "@/components/ui/Button";
import { Card, CardContent } from "@/components/ui/Card";
import AlphaSalesModal from "@/components/sections/AlphaSalesModal";

export default function Home() {
  const [activeFaq, setActiveFaq] = useState<number | null>(null);
  const [isSalesModalOpen, setIsSalesModalOpen] = useState(false);

  const fadeIn = {
    hidden: { opacity: 0, y: 30 },
    visible: { opacity: 1, y: 0, transition: { duration: 0.8, ease: "easeOut" as const } }
  };

  const staggerContainer = {
    hidden: { opacity: 0 },
    visible: {
      opacity: 1,
      transition: { staggerChildren: 0.15 }
    }
  };

  const glowEffect = {
    hidden: { opacity: 0, scale: 0.8 },
    visible: {
      opacity: 0.4,
      scale: 1,
      transition: { duration: 2, repeat: Infinity, repeatType: "reverse" as const }
    }
  };

  return (
    <div className="flex bg-[#000000] text-white min-h-screen flex-col overflow-x-hidden selection:bg-gold-500/30 selection:text-gold-200">
      {/* --- PREMIUUM NAVIGATION --- */}
      <nav className="fixed top-0 w-full p-4 md:px-12 flex justify-between items-center z-50 glass border-b border-gold-500/10 shadow-2xl">
        <div className="flex items-center gap-3 group cursor-pointer">
          <div className="w-10 h-10 rounded-xl bg-gradient-to-br from-[#BF953F] to-[#AA771C] flex items-center justify-center shadow-[0_0_20px_rgba(191,149,63,0.4)] group-hover:scale-110 transition-transform duration-500">
            <BarChart3 className="w-6 h-6 text-black" />
          </div>
          <span className="font-black text-2xl tracking-tighter text-white uppercase italic">
            Algo<span className="text-gold">Market</span>
          </span>
        </div>

        <div className="hidden md:flex gap-10 items-center text-sm font-bold tracking-widest uppercase">
          <Link href="#features" className="hover:text-gold transition-colors duration-300">Marketplace</Link>
          <Link href="#how-it-works" className="hover:text-gold transition-colors duration-300">Creators</Link>
          <Link href="#enterprise" className="hover:text-gold transition-colors duration-300">Enterprise</Link>
        </div>

        <div className="flex gap-6 items-center">
          <Link href="/login" className="text-sm font-bold uppercase tracking-widest hover:text-gold transition-colors">
            Sign In
          </Link>
          <Link href="/register">
            <Button size="lg" className="shadow-[0_0_30px_rgba(212,175,55,0.3)]">
              Get Started
            </Button>
          </Link>
        </div>
      </nav>

      <main className="flex-grow flex flex-col items-center w-full">

        {/* --- 1. HERO SECTION (ULTRA PREMIUM) --- */}
        <section className="relative w-full min-h-screen flex flex-col items-center justify-center pt-20 overflow-hidden">
          {/* Background Elements */}
          <div className="absolute top-0 left-0 w-full h-full bg-[radial-gradient(circle_at_center,rgba(212,175,55,0.05)_0%,transparent_70%)] pointer-events-none" />
          <motion.div
            initial="hidden" animate="visible" variants={glowEffect}
            className="absolute top-1/4 left-1/4 w-[500px] h-[500px] bg-gold-900/10 rounded-full blur-[120px] pointer-events-none"
          />
          <div className="absolute inset-0 bg-[url('https://grainy-gradients.vercel.app/noise.svg')] opacity-20 pointer-events-none mix-blend-overlay" />

          <motion.div
            initial="hidden" animate="visible" variants={staggerContainer}
            className="max-w-7xl w-full px-6 flex flex-col items-center text-center relative z-10"
          >
            <motion.div variants={fadeIn} className="flex items-center gap-2 px-4 py-2 rounded-full border border-gold-500/20 bg-gold-500/5 text-xs font-black tracking-[0.2em] uppercase text-gold mb-12 shadow-[inset_0_0_20px_rgba(212,175,55,0.05)]">
              <Crown className="w-3 h-3 animate-bounce" />
              <span>Invite-Only Quantitative Strategies</span>
            </motion.div>

            <motion.h1
              variants={fadeIn}
              className="text-6xl md:text-8xl lg:text-9xl font-black tracking-tight mb-8 leading-[0.85] uppercase italic"
            >
              The <span className="text-gold">Ultimate</span> <br />
              <span className="text-white">Edge For</span> <br className="hidden md:block" />
              <span className="text-gold">Modern Traders</span>
            </motion.h1>

            <motion.p variants={fadeIn} className="text-xl md:text-2xl text-zinc-400 mb-14 max-w-4xl mx-auto font-medium leading-relaxed">
              Institutional-grade TradingView indicators, delivered with absolute precision.
              <span className="text-white font-bold ml-2">Zero repainting. Zero latency. Instant authorization.</span>
            </motion.p>

            <motion.div variants={fadeIn} className="flex flex-col sm:flex-row gap-6 justify-center items-center w-full max-w-2xl px-4">
              <Link href="/register" className="w-full">
                <Button size="lg" className="w-full text-lg uppercase tracking-widest h-16 rounded-2xl shadow-2xl">
                  Explore Strategies
                  <ArrowRight className="w-6 h-6 ml-2 group-hover:translate-x-1" />
                </Button>
              </Link>
              <Link href="/register?role=vendor" className="w-full">
                <Button size="lg" variant="outline" className="w-full text-lg uppercase tracking-widest h-16 rounded-2xl border-white/10 hover:border-gold/50">
                  Become a Creator
                </Button>
              </Link>
            </motion.div>

            {/* Performance Badges */}
            <motion.div variants={fadeIn} className="mt-20 flex flex-wrap justify-center gap-8 md:gap-16 opacity-50 grayscale hover:grayscale-0 transition-all duration-700">
              <div className="flex items-center gap-3">
                <Zap className="w-6 h-6 text-gold" />
                <span className="text-sm font-black uppercase tracking-widest italic">Fast Auth</span>
              </div>
              <div className="flex items-center gap-3">
                <ShieldCheck className="w-6 h-6 text-gold" />
                <span className="text-sm font-black uppercase tracking-widest italic">Verified Results</span>
              </div>
              <div className="flex items-center gap-3">
                <Globe className="w-6 h-6 text-gold" />
                <span className="text-sm font-black uppercase tracking-widest italic">Global Market</span>
              </div>
            </motion.div>
          </motion.div>

          {/* Scrolling Down Hint */}
          <motion.div
            animate={{ y: [0, 10, 0] }}
            transition={{ duration: 2, repeat: Infinity }}
            className="absolute bottom-10 left-1/2 -translate-x-1/2 flex flex-col items-center gap-2 opacity-30"
          >
            <span className="text-[10px] font-black uppercase tracking-[0.3em] rotate-90 mb-4 whitespace-nowrap">Scroll Down</span>
            <div className="w-[1px] h-12 bg-gradient-to-b from-white to-transparent" />
          </motion.div>
        </section>

        {/* --- 2. THE GOLDEN STANDARDS (GRID) --- */}
        <section id="features" className="w-full py-32 bg-[#000000] border-t border-zinc-900 overflow-hidden">
          <div className="max-w-7xl mx-auto px-6">
            <motion.div
              initial="hidden" whileInView="visible" viewport={{ once: true, margin: "-100px" }} variants={staggerContainer}
              className="text-center mb-24"
            >
              <motion.span variants={fadeIn} className="text-gold text-sm font-black uppercase tracking-[0.5em] mb-4 block">Engineered Perfection</motion.span>
              <motion.h2 variants={fadeIn} className="text-5xl md:text-7xl font-black text-white mb-6 uppercase italic">Built For <br /> Competitive <span className="text-gold">Alpha</span></motion.h2>
              <motion.p variants={fadeIn} className="text-xl text-zinc-500 max-w-2xl mx-auto">We've eliminated the friction of script delivery. High-performance traders deserve high-performance tools.</motion.p>
            </motion.div>

            <div className="grid md:grid-cols-2 lg:grid-cols-3 gap-8">
              {[
                { icon: <Crown className="w-8 h-8" />, title: "Invite-Only Access", desc: "Our automation system logs into your TV account via background workers to authorize users instantly. No manual whitelisting required." },
                { icon: <ShieldCheck className="w-8 h-8" />, title: "Anti-Leak Security", desc: "Hardened script delivery infrastructure ensures your proprietary source code is protected and only accessible to verified buyers." },
                { icon: <Trophy className="w-8 h-8" />, title: "Creator Payouts", desc: "Vendors keep more with our fair 10% commission. Direct UPI payouts to your preferred account within 48 hours of verification." },
                { icon: <Sparkles className="w-8 h-8" />, title: "Live Marketplace", desc: "Display your backtesting metrics, live performance, and verified user reviews to build a global reputation as a quantitative expert." },
                { icon: <Lock className="w-8 h-8" />, title: "Quantum Security", desc: "All user credentials and payment data are encrypted with bank-grade standards, ensuring absolute privacy for both traders and creators." },
                { icon: <LineChart className="w-8 h-8" />, title: "Advanced Analytics", desc: "Predictive revenue modeling, churn analysis, and subscriber engagement data delivered in a sleek Vendor Dashboard." }
              ].map((feature, i) => (
                <motion.div
                  initial={{ opacity: 0, y: 40 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  transition={{ delay: i * 0.1 }}
                  key={i}
                  className="group"
                >
                  <Card className="h-full border-zinc-900 bg-zinc-950/20 hover:border-gold/30 hover:bg-zinc-900/30 transition-all duration-500 p-2 rounded-[2rem]">
                    <CardContent className="p-8">
                      <div className="w-16 h-16 rounded-2xl bg-gold/10 flex items-center justify-center mb-8 group-hover:scale-110 group-hover:bg-gold/20 transition-all duration-500 shadow-lg shadow-gold/5">
                        <div className="text-gold">{feature.icon}</div>
                      </div>
                      <h3 className="text-2xl font-black mb-4 text-white uppercase italic tracking-tight">{feature.title}</h3>
                      <p className="text-zinc-500 leading-relaxed font-medium">{feature.desc}</p>
                    </CardContent>
                  </Card>
                </motion.div>
              ))}
            </div>
          </div>
        </section>

        {/* --- 3. ENTERPRISE SOLUTIONS --- */}
        <section id="enterprise" className="w-full py-32 bg-[#050505] relative overflow-hidden">
          <div className="absolute top-1/2 right-0 w-[600px] h-[600px] bg-gold-900/5 rounded-full blur-[120px] pointer-events-none" />

          <div className="max-w-7xl mx-auto px-6">
            <div className="flex flex-col lg:flex-row items-center gap-20">
              <div className="flex-1 space-y-8">
                <motion.span
                  initial={{ opacity: 0, x: -20 }}
                  whileInView={{ opacity: 1, x: 0 }}
                  viewport={{ once: true }}
                  className="text-gold text-sm font-black uppercase tracking-[0.5em] block"
                >
                  Institutional Grade
                </motion.span>
                <motion.h2
                  initial={{ opacity: 0, y: 30 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-5xl md:text-7xl font-black text-white uppercase italic leading-tight"
                >
                  Enterprise <br /> <span className="text-gold">Intelligence</span>
                </motion.h2>
                <motion.p
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="text-xl text-zinc-400 leading-relaxed font-medium max-w-xl"
                >
                  Fuel your fund or brokerage with the world's most advanced quantitative strategies. Our enterprise infrastructure is built for scale, security, and absolute reliability.
                </motion.p>

                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  whileInView={{ opacity: 1, y: 0 }}
                  viewport={{ once: true }}
                  className="grid sm:grid-cols-2 gap-6 pt-8"
                >
                  {[
                    "Corporate API Access",
                    "Bulk User Whitelisting",
                    "White-Label Marketplace",
                    "Priority Quant Support",
                    "Custom Risk Modeling",
                    "SLA-Backed Performance"
                  ].map((item, i) => (
                    <div key={i} className="flex items-center gap-3">
                      <div className="w-5 h-5 rounded-full bg-gold/20 flex items-center justify-center">
                        <CheckCircle2 className="w-3 h-3 text-gold" />
                      </div>
                      <span className="text-sm font-bold text-zinc-300 uppercase tracking-wider">{item}</span>
                    </div>
                  ))}
                </motion.div>

                <div className="pt-10">
                  <Button
                    size="lg"
                    onClick={() => setIsSalesModalOpen(true)}
                    className="h-16 px-12 text-sm uppercase tracking-widest rounded-2xl shadow-gold/10"
                  >
                    Contact Alpha Sales
                  </Button>
                </div>
              </div>

              <motion.div
                initial={{ opacity: 0, scale: 0.8 }}
                whileInView={{ opacity: 1, scale: 1 }}
                viewport={{ once: true }}
                className="flex-1 relative"
              >
                <div className="aspect-square w-full max-w-lg mx-auto bg-gradient-to-br from-zinc-900 to-black rounded-[3rem] border border-zinc-800 shadow-2xl overflow-hidden group">
                  <div className="absolute inset-0 bg-gold/5 opacity-0 group-hover:opacity-100 transition-opacity duration-700" />
                  <div className="p-12 h-full flex flex-col justify-center items-center text-center">
                    <div className="w-24 h-24 rounded-3xl bg-zinc-800 flex items-center justify-center mb-8 border border-zinc-700 shadow-xl group-hover:border-gold/30 transition-all duration-500">
                      <Globe className="w-12 h-12 text-gold animate-pulse" />
                    </div>
                    <h4 className="text-2xl font-black text-white uppercase italic tracking-widest mb-4">Global Deployment</h4>
                    <p className="text-zinc-500 text-sm font-medium leading-relaxed">
                      Instant multi-region authorization for professional trading floors and institutional client bases.
                    </p>
                  </div>
                </div>

                {/* Decorative Elements */}
                <div className="absolute -top-10 -right-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
                <div className="absolute -bottom-10 -left-10 w-32 h-32 bg-gold/10 rounded-full blur-3xl" />
              </motion.div>
            </div>
          </div>
        </section>

        {/* --- 3. PREMIUM CALL TO ACTION --- */}
        <section className="w-full py-40 relative overflow-hidden bg-[#050505]">
          <div className="absolute top-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-20" />
          <div className="absolute bottom-0 left-0 w-full h-[1px] bg-gradient-to-r from-transparent via-gold/50 to-transparent opacity-20" />

          <div className="max-w-5xl mx-auto px-6 text-center relative z-10">
            <motion.div
              initial={{ opacity: 0, scale: 0.9 }}
              whileInView={{ opacity: 1, scale: 1 }}
              viewport={{ once: true }}
              transition={{ duration: 1 }}
            >
              <h2 className="text-5xl md:text-8xl font-black text-white mb-10 leading-tight uppercase italic">Ready to <span className="text-gold">Automate</span> Your Strategy?</h2>
              <p className="text-xl md:text-2xl text-zinc-400 mb-16 max-w-2xl mx-auto">Join the new era of algorithmic trading. Secure your edge today.</p>

              <div className="flex flex-col sm:flex-row gap-6 justify-center">
                <Button size="lg" className="h-20 text-xl px-16 shadow-[0_0_50px_rgba(212,175,55,0.2)]">Get Started Now</Button>
                <Button size="lg" variant="outline" className="h-20 text-xl px-16 border-white/10">Browse Marketplace</Button>
              </div>
            </motion.div>
          </div>
        </section>

      </main>

      {/* --- 4. PREMIUM FOOTER --- */}
      <footer className="w-full py-24 bg-[#000000] border-t border-zinc-900">
        <div className="max-w-7xl mx-auto px-6 grid grid-cols-1 md:grid-cols-4 gap-16">
          <div className="col-span-1 md:col-span-2 space-y-8">
            <div className="flex items-center gap-3">
              <div className="w-10 h-10 rounded-xl bg-gold flex items-center justify-center">
                <BarChart3 className="w-6 h-6 text-black" />
              </div>
              <span className="font-black text-2xl tracking-tighter text-white uppercase italic">
                Algo<span className="text-gold">Market</span>
              </span>
            </div>
            <p className="text-zinc-500 max-w-md text-lg leading-relaxed font-medium">
              Bridging the gap between institutional quantitative analysts and performance-driven retail traders. Securely automating Invite-Only script delivery since 2024.
            </p>
          </div>

          <div className="space-y-6">
            <h4 className="text-gold font-black uppercase tracking-[0.3em] text-xs">Resources</h4>
            <ul className="space-y-4 font-bold text-zinc-400">
              <li><Link href="#" className="hover:text-white transition-colors">Marketplace</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Documentation</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Creator Hub</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">API Access</Link></li>
            </ul>
          </div>

          <div className="space-y-6">
            <h4 className="text-gold font-black uppercase tracking-[0.3em] text-xs">Company</h4>
            <ul className="space-y-4 font-bold text-zinc-400">
              <li><Link href="#" className="hover:text-white transition-colors">About Us</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Privacy Council</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Terms of Trade</Link></li>
              <li><Link href="#" className="hover:text-white transition-colors">Support</Link></li>
            </ul>
          </div>
        </div>

        <div className="max-w-7xl mx-auto px-6 mt-24 pt-12 border-t border-zinc-900 flex flex-col md:flex-row justify-between items-center gap-8 text-xs font-black uppercase tracking-widest text-zinc-600">
          <p>© 2024 AlgoMarket Platform. All Rights Reserved.</p>
          <div className="flex gap-12">
            <span className="hover:text-gold cursor-pointer transition-colors">Twitter</span>
            <span className="hover:text-gold cursor-pointer transition-colors">Discord</span>
            <span className="hover:text-gold cursor-pointer transition-colors">Telegram</span>
          </div>
        </div>
      </footer>

      <AlphaSalesModal
        isOpen={isSalesModalOpen}
        onClose={() => setIsSalesModalOpen(false)}
      />
    </div>
  );
}
