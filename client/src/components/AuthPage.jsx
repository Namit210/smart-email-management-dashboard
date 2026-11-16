import React, { useState, useEffect } from 'react';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  Bot, 
  Eye, 
  EyeOff, 
  Building2,
  Zap,
  ChevronLeft,
  ChevronRight,
  UserCheck,
  Calendar,
  Flame,
  Check,
  ShieldCheck,
  Clock
} from 'lucide-react';
import { loginAssistant, registerAssistant, setStoredToken, setStoredUser } from '../services/api';

export default function AuthPage({ onAuthSuccess }) {
  const [mode, setMode] = useState('login'); // 'login' | 'register'
  
  // Login fields
  const [loginEmail, setLoginEmail] = useState('');
  const [loginPassword, setLoginPassword] = useState('');
  
  // Register fields
  const [registerName, setRegisterName] = useState('');
  const [registerEmail, setRegisterEmail] = useState('');
  const [registerPassword, setRegisterPassword] = useState('');
  const [registerTitle, setRegisterTitle] = useState('Executive Virtual Assistant');
  const [registerAgency, setRegisterAgency] = useState('Apex Multi-Principal Office');

  // UI state
  const [showPassword, setShowPassword] = useState(false);
  const [isLoading, setIsLoading] = useState(false);
  const [errorMessage, setErrorMessage] = useState('');

  // Carousel state
  const [currentSlide, setCurrentSlide] = useState(0);
  const [isPaused, setIsPaused] = useState(false);

  const slides = [
    {
      id: 'triage',
      step: 'FEATURE 01 • INTELLIGENT ROUTING',
      title: 'Automated AI Email Triage',
      description: 'Gemini 2.5 Flash analyzes every incoming thread in real-time. It determines who needs to respond—delegating routine operations to you while escalating critical matters to clients.',
      stats: { label: 'Triage Accuracy', value: '98.4%' },
      mockup: (
        <div className="bg-[#111827]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
            <div className="flex items-center gap-2">
              <span className="w-2.5 h-2.5 rounded-full bg-[#10b981] animate-pulse"></span>
              <span className="text-[#9ca3af] font-mono">LIVE AI CLASSIFICATION</span>
            </div>
            <span className="text-[#6b7280] font-mono">2m ago</span>
          </div>
          
          <div className="mt-3.5 space-y-2.5">
            <div className="flex items-center justify-between">
              <span className="text-sm font-semibold text-white font-poppins">David Kim (Founders Fund)</span>
              <span className="text-xs text-[#9ca3af] font-mono">&lt;david@foundersfund.com&gt;</span>
            </div>

            {/* Single line stamps */}
            <div className="flex items-center gap-1.5 flex-wrap">
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#f97316]/20 text-[#fb923c] border border-[#f97316]/40">
                <UserCheck className="w-3 h-3 text-[#fb923c]" />
                <span>Client to Reply 94%</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2.5 py-0.5 rounded-full text-[11px] font-semibold bg-[#a855f7]/20 text-[#c084fc] border border-[#a855f7]/40">
                <User className="w-3 h-3 text-[#c084fc]" />
                <span>Alex Morgan</span>
              </span>
              <span className="inline-flex items-center gap-1 px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#ef4444]/20 text-[#f87171] border border-[#ef4444]/40">
                <Flame className="w-3 h-3 text-[#f87171]" />
                <span>URGENT</span>
              </span>
            </div>

            <p className="text-xs text-[#e5e7eb] font-medium font-poppins">
              Series B Term Sheet & Valuation Terms
            </p>
            <p className="text-xs text-[#9ca3af] font-lato leading-relaxed bg-white/5 p-2.5 rounded-xl border border-white/5">
              <strong className="text-[#d1d5db]">AI Rationale:</strong> Involves principal equity governance and contract execution authority. Escalated directly to Alex.
            </p>
          </div>
        </div>
      )
    },
    {
      id: 'multiclient',
      step: 'FEATURE 02 • MULTI-PRINCIPAL DELEGATION',
      title: 'One Hub, Multiple Executives',
      description: 'Manage high email volume across Alex Morgan (CEO), Sarah Jenkins (VP Sales), and Marcus Vance (MD) in one unified dashboard with zero lost context or missed deadlines.',
      stats: { label: 'Time Saved Daily', value: '4.5 hrs' },
      mockup: (
        <div className="bg-[#111827]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
            <span className="text-[#9ca3af] font-mono">CONNECTED PRINCIPALS</span>
            <span className="text-[#10b981] font-semibold">3 Active Inboxes</span>
          </div>

          <div className="space-y-2">
            {[
              { name: 'Alex Morgan', role: 'CEO • Apex Innovations', pending: 3, color: '#0b57d0' },
              { name: 'Sarah Jenkins', role: 'VP Sales • CloudScale', pending: 1, color: '#10b981' },
              { name: 'Marcus Vance', role: 'Managing Director • Vantage Capital', pending: 0, color: '#8b5cf6' }
            ].map((client) => (
              <div 
                key={client.name}
                className="flex items-center justify-between p-2.5 rounded-xl bg-white/5 border border-white/5 hover:border-white/20 transition"
              >
                <div className="flex items-center gap-3">
                  <div 
                    className="w-8 h-8 rounded-full flex items-center justify-center font-bold text-xs text-white"
                    style={{ backgroundColor: client.color }}
                  >
                    {client.name.charAt(0)}
                  </div>
                  <div>
                    <span className="text-xs font-semibold text-white font-poppins block">{client.name}</span>
                    <span className="text-[10px] text-[#9ca3af] font-lato">{client.role}</span>
                  </div>
                </div>
                <div>
                  {client.pending > 0 ? (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-bold bg-[#f97316]/20 text-[#fb923c] border border-[#f97316]/30">
                      {client.pending} for Client
                    </span>
                  ) : (
                    <span className="px-2 py-0.5 rounded-full text-[10px] font-medium bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/30">
                      ✓ All Clear
                    </span>
                  )}
                </div>
              </div>
            ))}
          </div>
        </div>
      )
    },
    {
      id: 'zenmode',
      step: 'FEATURE 03 • EXECUTIVE ZEN & COPILOT',
      title: 'Executive Focus & AI Copilot',
      description: 'Give executive principals a distraction-free Zen Portal with 1-click approvals, while the Assistant Copilot drafts high-touch replies matching client tone.',
      stats: { label: 'Response Latency', value: '< 15 mins' },
      mockup: (
        <div className="bg-[#111827]/80 backdrop-blur-md border border-white/10 rounded-2xl p-5 shadow-2xl space-y-3">
          <div className="flex items-center justify-between pb-3 border-b border-white/10 text-xs">
            <span className="text-[#c084fc] font-semibold flex items-center gap-1.5 font-mono">
              <ShieldCheck className="w-3.5 h-3.5 text-[#c084fc]" />
              EXECUTIVE ZEN MODE
            </span>
            <span className="text-[#34d399] text-[11px] font-medium">1-Click Sign-off</span>
          </div>

          <div className="p-3 rounded-xl bg-white/5 border border-white/10 space-y-2">
            <div className="flex items-center justify-between">
              <span className="text-xs font-semibold text-white font-poppins">Acme Corp Q4 SOW & Budget</span>
              <span className="text-[10px] text-[#9ca3af]">Today, 11:30 AM</span>
            </div>
            <p className="text-[11px] text-[#d1d5db] font-lato">
              "Hi Alex, attached is the revised statement of work with the 12% enterprise discount applied."
            </p>
            <div className="pt-2 flex items-center gap-2">
              <button 
                type="button"
                className="flex-1 py-1.5 rounded-lg bg-[#10b981] text-black font-bold text-[11px] font-poppins hover:bg-[#34d399] transition text-center"
              >
                ✓ Approve & Send
              </button>
              <button 
                type="button"
                className="px-3 py-1.5 rounded-lg bg-white/10 text-white text-[11px] font-medium font-poppins hover:bg-white/20 transition"
              >
                Delegate to Assistant
              </button>
            </div>
          </div>
        </div>
      )
    }
  ];

  // Auto-rotate carousel slides every 5.5s
  useEffect(() => {
    if (isPaused) return;
    const timer = setInterval(() => {
      setCurrentSlide((prev) => (prev + 1) % slides.length);
    }, 5500);
    return () => clearInterval(timer);
  }, [isPaused, slides.length]);

  const handleNextSlide = () => {
    setCurrentSlide((prev) => (prev + 1) % slides.length);
  };

  const handlePrevSlide = () => {
    setCurrentSlide((prev) => (prev - 1 + slides.length) % slides.length);
  };

  const handleLogin = async (e) => {
    if (e) e.preventDefault();
    if (!loginEmail || !loginPassword) {
      setErrorMessage('Please enter both email and password.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await loginAssistant(loginEmail, loginPassword);
      if (res.success) {
        setStoredToken(res.token);
        setStoredUser(res.user);
        onAuthSuccess(res.user);
      } else {
        setErrorMessage(res.error || 'Failed to sign in.');
      }
    } catch (err) {
      setErrorMessage('Network error connecting to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleRegister = async (e) => {
    e.preventDefault();
    if (!registerName || !registerEmail || !registerPassword) {
      setErrorMessage('Please fill out all required fields.');
      return;
    }
    if (registerPassword.length < 6) {
      setErrorMessage('Password must be at least 6 characters long.');
      return;
    }

    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await registerAssistant({
        name: registerName,
        email: registerEmail,
        password: registerPassword,
        title: registerTitle,
        agency: registerAgency
      });

      if (res.success) {
        setStoredToken(res.token);
        setStoredUser(res.user);
        onAuthSuccess(res.user);
      } else {
        setErrorMessage(res.error || 'Failed to create assistant account.');
      }
    } catch (err) {
      setErrorMessage('Network error connecting to server. Please try again.');
    } finally {
      setIsLoading(false);
    }
  };

  const handleQuickDemoLogin = async () => {
    setLoginEmail('assistant@omnimail.ai');
    setLoginPassword('password123');
    setErrorMessage('');
    setIsLoading(true);

    try {
      const res = await loginAssistant('assistant@omnimail.ai', 'password123');
      if (res.success) {
        setStoredToken(res.token);
        setStoredUser(res.user);
        onAuthSuccess(res.user);
      } else {
        setErrorMessage(res.error || 'Failed to sign in demo account.');
      }
    } catch (err) {
      setErrorMessage('Network error connecting to server.');
    } finally {
      setIsLoading(false);
    }
  };

  return (
    <div className="w-full min-h-screen lg:h-screen lg:overflow-hidden bg-[#090d16] flex flex-col lg:flex-row font-sans selection:bg-[#38bdf8] selection:text-[#0f172a]">
      
      {/* ======================================================== */}
      {/* LEFT COLUMN: HackerRank-Style Dark Feature Showcase (Carousel) */}
      {/* ======================================================== */}
      <div 
        className="w-full lg:w-[52%] lg:h-full bg-gradient-to-br from-[#090d16] via-[#0d1424] to-[#0a1122] text-white flex flex-col justify-between p-6 sm:p-10 lg:p-14 relative overflow-hidden border-b lg:border-b-0 lg:border-r border-white/10"
        onMouseEnter={() => setIsPaused(true)}
        onMouseLeave={() => setIsPaused(false)}
      >
        {/* Ambient Glow Orbs */}
        <div className="absolute top-0 right-0 w-96 h-96 bg-[#0b57d0]/15 rounded-full blur-3xl pointer-events-none"></div>
        <div className="absolute bottom-0 left-0 w-80 h-80 bg-[#10b981]/10 rounded-full blur-3xl pointer-events-none"></div>

        {/* Top Header & Brand */}
        <div className="relative z-10 flex items-center justify-between">
          <div className="flex items-center gap-3">
            <div className="w-10 h-10 rounded-xl bg-gradient-to-tr from-[#0b57d0] to-[#38bdf8] p-0.5 shadow-lg shadow-[#0b57d0]/20 flex items-center justify-center">
              <div className="w-full h-full bg-[#090d16] rounded-[10px] flex items-center justify-center">
                <Sparkles className="w-5 h-5 text-[#38bdf8]" />
              </div>
            </div>
            <div>
              <div className="flex items-center gap-2">
                <span className="font-bold text-lg font-poppins tracking-tight text-white">OmniMail AI</span>
                <span className="px-2 py-0.5 rounded text-[10px] font-bold font-mono uppercase bg-[#10b981]/20 text-[#34d399] border border-[#10b981]/30">
                  Assistant OS
                </span>
              </div>
              <span className="text-xs text-[#94a3b8] font-lato">The AI workspace for executive assistants</span>
            </div>
          </div>

          <div className="hidden sm:flex items-center gap-2 text-xs text-[#94a3b8] font-mono">
            <span className="w-2 h-2 rounded-full bg-[#10b981] animate-pulse"></span>
            <span>Gemini 2.5 Flash</span>
          </div>
        </div>

        {/* Middle: Interactive 3-Feature Carousel */}
        <div className="relative z-10 my-auto py-8 lg:py-6">
          <div className="min-h-[380px] sm:min-h-[420px] flex flex-col justify-center transition-all duration-500 ease-in-out">
            
            {/* Step badge */}
            <div className="mb-3">
              <span className="inline-flex items-center gap-1.5 px-3 py-1 rounded-full text-[11px] font-bold font-mono tracking-wider bg-white/10 text-[#38bdf8] border border-white/10 backdrop-blur-sm">
                {slides[currentSlide].step}
              </span>
            </div>

            {/* Title & Description */}
            <h2 className="text-2xl sm:text-3xl lg:text-4xl font-bold font-poppins text-white leading-tight mb-3">
              {slides[currentSlide].title}
            </h2>
            <p className="text-xs sm:text-sm text-[#94a3b8] font-lato leading-relaxed max-w-xl mb-6">
              {slides[currentSlide].description}
            </p>

            {/* Feature Mockup Card */}
            <div className="w-full max-w-xl">
              {slides[currentSlide].mockup}
            </div>

          </div>
        </div>

        {/* Bottom: Carousel Controls & Navigation */}
        <div className="relative z-10 pt-4 flex flex-col sm:flex-row sm:items-center justify-between gap-4 border-t border-white/10">
          
          {/* Slide Indicator Dots */}
          <div className="flex items-center gap-2">
            {slides.map((slide, idx) => (
              <button
                key={slide.id}
                onClick={() => setCurrentSlide(idx)}
                className={`h-2 rounded-full transition-all duration-300 ${
                  currentSlide === idx 
                    ? 'w-8 bg-[#38bdf8] shadow-sm shadow-[#38bdf8]/50' 
                    : 'w-2 bg-white/20 hover:bg-white/40'
                }`}
                title={`Go to slide ${idx + 1}`}
              />
            ))}
            <span className="text-xs text-[#64748b] font-mono ml-2">
              0{currentSlide + 1} / 0{slides.length}
            </span>
          </div>

          {/* Prev / Next Buttons */}
          <div className="flex items-center gap-2">
            <button
              onClick={handlePrevSlide}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#94a3b8] hover:text-white transition"
              title="Previous Feature"
            >
              <ChevronLeft className="w-4 h-4" />
            </button>
            <button
              onClick={handleNextSlide}
              className="p-2 rounded-xl bg-white/5 hover:bg-white/10 border border-white/10 text-[#94a3b8] hover:text-white transition"
              title="Next Feature"
            >
              <ChevronRight className="w-4 h-4" />
            </button>
          </div>

        </div>

      </div>

      {/* ======================================================== */}
      {/* RIGHT COLUMN: HackerRank-Style Spacious Auth Form */}
      {/* ======================================================== */}
      <div className="w-full lg:w-[48%] lg:h-full bg-white flex flex-col justify-center items-center p-6 sm:p-10 lg:p-16 overflow-y-auto">
        <div className="max-w-md w-full mx-auto my-auto py-4">
          
          {/* Segmented Control Toggle (Log In vs Sign Up) */}
          <div className="p-1 bg-[#f1f5f9] rounded-2xl flex items-center mb-8 border border-[#e2e8f0]">
            <button
              type="button"
              onClick={() => {
                setMode('login');
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold font-poppins transition-all duration-200 ${
                mode === 'login'
                  ? 'bg-white text-[#0f172a] shadow-sm font-bold'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              Log In
            </button>
            <button
              type="button"
              onClick={() => {
                setMode('register');
                setErrorMessage('');
              }}
              className={`flex-1 py-2.5 rounded-xl text-xs sm:text-sm font-semibold font-poppins transition-all duration-200 ${
                mode === 'register'
                  ? 'bg-white text-[#0f172a] shadow-sm font-bold'
                  : 'text-[#64748b] hover:text-[#0f172a]'
              }`}
            >
              Sign Up
            </button>
          </div>

          {/* Form Header */}
          <div className="mb-6">
            <h1 className="text-2xl sm:text-3xl font-bold text-[#0f172a] font-poppins tracking-tight">
              {mode === 'login' ? 'Welcome Back' : 'Create Assistant Account'}
            </h1>
            <p className="text-xs sm:text-sm text-[#64748b] font-lato mt-1.5">
              {mode === 'login'
                ? 'Sign in to access your multi-principal email workspace.'
                : 'Register your executive assistant profile to start triaging.'}
            </p>
          </div>

          {/* Error Message */}
          {errorMessage && (
            <div className="mb-5 p-3.5 rounded-xl bg-[#fef2f2] text-[#b91c1c] text-xs font-semibold font-poppins flex items-center gap-2 border border-[#fecaca]">
              <span className="w-1.5 h-1.5 rounded-full bg-[#b91c1c] flex-shrink-0"></span>
              <span>{errorMessage}</span>
            </div>
          )}

          {/* 1-Click Evaluation Login (HackerRank Quick Access Style) */}
          {mode === 'login' && (
            <div className="mb-6 p-4 rounded-2xl bg-gradient-to-r from-[#eff6ff] to-[#f0fdf4] border border-[#bfdbfe] flex items-center justify-between gap-3">
              <div>
                <span className="text-xs font-bold text-[#1e3a8a] font-poppins flex items-center gap-1.5">
                  <Zap className="w-3.5 h-3.5 text-[#2563eb]" />
                  Evaluator Fast Sign-In
                </span>
                <p className="text-[11px] text-[#475569] font-lato mt-0.5">
                  Pre-configured account (<code className="font-mono text-[10px] bg-white px-1 py-0.5 rounded border border-[#e2e8f0]">assistant@omnimail.ai</code>)
                </p>
              </div>
              <button
                type="button"
                onClick={handleQuickDemoLogin}
                disabled={isLoading}
                className="px-3.5 py-2 rounded-xl bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-semibold font-poppins shadow-sm transition flex items-center gap-1.5 whitespace-nowrap"
              >
                <span>1-Click Sign In</span>
                <ArrowRight className="w-3.5 h-3.5" />
              </button>
            </div>
          )}

          {/* ======================================================== */}
          {/* LOGIN FORM */}
          {/* ======================================================== */}
          {mode === 'login' ? (
            <form onSubmit={handleLogin} className="space-y-4">
              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5 font-poppins">
                  Work Email
                </label>
                <div className="relative flex items-center">
                  <Mail className="w-4 h-4 text-[#94a3b8] absolute left-3.5 pointer-events-none" />
                  <input
                    type="email"
                    required
                    placeholder="assistant@omnimail.ai"
                    value={loginEmail}
                    onChange={(e) => setLoginEmail(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl pl-10 pr-4 py-3 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#0b57d0] focus:ring-3 focus:ring-[#0b57d0]/15 font-poppins transition"
                  />
                </div>
              </div>

              <div>
                <div className="flex items-center justify-between mb-1.5">
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] font-poppins">
                    Password
                  </label>
                  <span className="text-[11px] text-[#64748b] font-lato">Demo: password123</span>
                </div>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-[#94a3b8] absolute left-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="••••••••"
                    value={loginPassword}
                    onChange={(e) => setLoginPassword(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl pl-10 pr-10 py-3 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#0b57d0] focus:ring-3 focus:ring-[#0b57d0]/15 font-poppins transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-[#94a3b8] hover:text-[#0f172a] transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#0b57d0] hover:bg-[#0842a0] disabled:opacity-50 text-white font-semibold text-sm font-poppins shadow-md shadow-[#0b57d0]/20 transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Enter Workspace</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          ) : (
            /* ======================================================== */
            /* REGISTER FORM */
            /* ======================================================== */
            <form onSubmit={handleRegister} className="space-y-3.5">
              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5 font-poppins">
                    Full Name *
                  </label>
                  <div className="relative flex items-center">
                    <User className="w-4 h-4 text-[#94a3b8] absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      required
                      placeholder="Samantha Clark"
                      value={registerName}
                      onChange={(e) => setRegisterName(e.target.value)}
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/15 font-poppins transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5 font-poppins">
                    Work Email *
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-[#94a3b8] absolute left-3.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="samantha@omnimail.ai"
                      value={registerEmail}
                      onChange={(e) => setRegisterEmail(e.target.value)}
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/15 font-poppins transition"
                    />
                  </div>
                </div>
              </div>

              <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5 font-poppins">
                    Title
                  </label>
                  <div className="relative flex items-center">
                    <Briefcase className="w-4 h-4 text-[#94a3b8] absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Executive Virtual Assistant"
                      value={registerTitle}
                      onChange={(e) => setRegisterTitle(e.target.value)}
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/15 font-poppins transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5 font-poppins">
                    Agency / Office
                  </label>
                  <div className="relative flex items-center">
                    <Building2 className="w-4 h-4 text-[#94a3b8] absolute left-3.5 pointer-events-none" />
                    <input
                      type="text"
                      placeholder="Apex Executive Office"
                      value={registerAgency}
                      onChange={(e) => setRegisterAgency(e.target.value)}
                      className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl pl-10 pr-3.5 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/15 font-poppins transition"
                    />
                  </div>
                </div>
              </div>

              <div>
                <label className="block text-xs font-semibold uppercase tracking-wider text-[#475569] mb-1.5 font-poppins">
                  Password * (min 6 characters)
                </label>
                <div className="relative flex items-center">
                  <Lock className="w-4 h-4 text-[#94a3b8] absolute left-3.5 pointer-events-none" />
                  <input
                    type={showPassword ? 'text' : 'password'}
                    required
                    placeholder="Create a strong password"
                    value={registerPassword}
                    onChange={(e) => setRegisterPassword(e.target.value)}
                    className="w-full bg-[#f8fafc] border border-[#cbd5e1] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#0f172a] placeholder-[#94a3b8] focus:outline-none focus:border-[#0b57d0] focus:ring-2 focus:ring-[#0b57d0]/15 font-poppins transition"
                  />
                  <button
                    type="button"
                    onClick={() => setShowPassword(!showPassword)}
                    className="absolute right-3.5 text-[#94a3b8] hover:text-[#0f172a] transition"
                  >
                    {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                  </button>
                </div>
              </div>

              <button
                type="submit"
                disabled={isLoading}
                className="w-full mt-2 py-3.5 px-4 rounded-xl bg-[#0b57d0] hover:bg-[#0842a0] disabled:opacity-50 text-white font-semibold text-sm font-poppins shadow-md shadow-[#0b57d0]/20 transition flex items-center justify-center gap-2"
              >
                {isLoading ? (
                  <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                ) : (
                  <>
                    <span>Create Assistant Profile</span>
                    <ArrowRight className="w-4 h-4" />
                  </>
                )}
              </button>
            </form>
          )}

          {/* Footer note */}
          <div className="mt-8 pt-6 border-t border-[#e2e8f0] text-center text-xs text-[#64748b] font-lato">
            {mode === 'login' ? (
              <p>
                Don't have an assistant account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                  }}
                  className="text-[#0b57d0] font-semibold hover:underline font-poppins ml-1"
                >
                  Sign up for free
                </button>
              </p>
            ) : (
              <p>
                Already have an account?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                  className="text-[#0b57d0] font-semibold hover:underline font-poppins ml-1"
                >
                  Log in
                </button>
              </p>
            )}
          </div>

        </div>
      </div>

    </div>
  );
}
