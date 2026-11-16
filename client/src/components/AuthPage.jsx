import React, { useState } from 'react';
import { 
  Sparkles, 
  Lock, 
  Mail, 
  User, 
  Briefcase, 
  ArrowRight, 
  CheckCircle2, 
  ShieldCheck, 
  Bot, 
  Eye, 
  EyeOff, 
  Building2,
  Zap
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
    <div className="min-h-screen bg-[#f6f8fc] flex items-center justify-center p-4 sm:p-6 lg:p-8 font-sans selection:bg-[#c2e7ff] selection:text-[#001d35]">
      <div className="max-w-4xl w-full bg-white rounded-3xl shadow-xl border border-[#eaedf1] overflow-hidden grid grid-cols-1 lg:grid-cols-12 min-h-[580px]">
        
        {/* Left Col: Brand & Assistant Value Proposition */}
        <div className="lg:col-span-5 bg-gradient-to-br from-[#0b57d0] via-[#0842a0] to-[#041e49] p-6 sm:p-8 text-white flex flex-col justify-between">
          <div>
            {/* Logo */}
            <div className="flex items-center gap-2.5 mb-8">
              <div className="w-10 h-10 rounded-2xl bg-white/10 backdrop-blur-md flex items-center justify-center text-white border border-white/20 shadow-xs">
                <Sparkles className="w-5 h-5 text-[#c2e7ff]" />
              </div>
              <div>
                <span className="font-bold text-lg font-poppins tracking-tight block">OmniMail AI</span>
                <span className="text-[11px] text-[#c2e7ff] font-medium uppercase tracking-wider block">Executive Assistant Workspace</span>
              </div>
            </div>

            <h2 className="text-xl sm:text-2xl font-bold font-poppins leading-snug mb-3">
              The AI Operating System for Personal Assistants
            </h2>
            <p className="text-xs sm:text-sm text-[#d3e3fd] font-lato leading-relaxed mb-6">
              Manage multiple executive clients, triage high email volume, and automate reply responsibilities with Google Gemini AI.
            </p>

            {/* Feature Highlights */}
            <div className="flex flex-col gap-3.5 text-xs text-white/90 font-poppins">
              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-full bg-white/15 text-[#c2e7ff] mt-0.5">
                  <CheckCircle2 className="w-3.5 h-3.5" />
                </div>
                <span><strong>Multi-Client Inbox Triage:</strong> Seamlessly oversee emails across Alex, Sarah, and Marcus.</span>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-full bg-white/15 text-[#c2e7ff] mt-0.5">
                  <Bot className="w-3.5 h-3.5" />
                </div>
                <span><strong>AI Reply Responsibility:</strong> Automatically routes what you can handle vs. what requires client sign-off.</span>
              </div>

              <div className="flex items-start gap-2.5">
                <div className="p-1 rounded-full bg-white/15 text-[#c2e7ff] mt-0.5">
                  <ShieldCheck className="w-3.5 h-3.5" />
                </div>
                <span><strong>Minimalist Executive Focus:</strong> Give your clients a Zen portal for 1-click approvals & delegation.</span>
              </div>
            </div>
          </div>

          <div className="pt-6 mt-6 border-t border-white/15 text-[11px] text-[#c2e7ff] font-lato flex items-center justify-between">
            <span>Powered by Gemini 2.5 Flash</span>
            <span className="flex items-center gap-1">
              <span className="w-2 h-2 rounded-full bg-[#1e8e3e] animate-pulse"></span>
              Atlas Connected
            </span>
          </div>
        </div>

        {/* Right Col: Sign In / Register Forms */}
        <div className="lg:col-span-7 p-6 sm:p-10 flex flex-col justify-between bg-white">
          <div>
            {/* Tab Navigation (Sign In vs Register) */}
            <div className="flex items-center justify-between border-b border-[#eaedf1] pb-3 mb-6">
              <div className="flex items-center gap-1 bg-[#f0f4f9] p-1 rounded-full">
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold font-poppins transition ${
                    mode === 'login'
                      ? 'bg-white text-[#0b57d0] shadow-xs'
                      : 'text-[#444746] hover:text-[#1f1f1f]'
                  }`}
                >
                  Assistant Sign In
                </button>
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                  }}
                  className={`px-4 py-1.5 rounded-full text-xs font-semibold font-poppins transition ${
                    mode === 'register'
                      ? 'bg-white text-[#0b57d0] shadow-xs'
                      : 'text-[#444746] hover:text-[#1f1f1f]'
                  }`}
                >
                  Register Assistant
                </button>
              </div>

              <span className="text-[11px] text-[#747775] font-poppins hidden sm:inline">
                {mode === 'login' ? 'Existing Assistant' : 'New Onboarding'}
              </span>
            </div>

            {/* Error Notification */}
            {errorMessage && (
              <div className="mb-4 p-3 rounded-2xl bg-[#f9dedc] text-[#b3261e] text-xs font-semibold font-poppins flex items-center gap-2 animate-fade-in border border-[#f2b8b5]">
                <span className="w-1.5 h-1.5 rounded-full bg-[#b3261e]"></span>
                <span>{errorMessage}</span>
              </div>
            )}

            {/* 1-Click Quick Demo Evaluation Banner */}
            {mode === 'login' && (
              <div className="mb-5 p-3 rounded-2xl bg-[#eaf1fb] border border-[#c2e7ff] flex flex-col sm:flex-row sm:items-center justify-between gap-2.5">
                <div>
                  <span className="text-xs font-bold text-[#041e49] font-poppins flex items-center gap-1">
                    <Zap className="w-3.5 h-3.5 text-[#0b57d0]" />
                    Fast Evaluation Mode
                  </span>
                  <p className="text-[11px] text-[#444746] font-lato mt-0.5">
                    Pre-configured demo account: <code className="bg-white/70 px-1 py-0.2 rounded font-mono text-[10px]">assistant@omnimail.ai</code>
                  </p>
                </div>
                <button
                  type="button"
                  onClick={handleQuickDemoLogin}
                  disabled={isLoading}
                  className="px-3.5 py-1.5 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] text-white text-xs font-semibold font-poppins shadow-xs transition whitespace-nowrap self-start sm:self-auto flex items-center gap-1"
                >
                  <span>1-Click Sign In</span>
                  <ArrowRight className="w-3 h-3" />
                </button>
              </div>
            )}

            {/* LOGIN FORM */}
            {mode === 'login' ? (
              <form onSubmit={handleLogin} className="flex flex-col gap-4">
                <div>
                  <label className="block text-xs font-semibold text-[#1f1f1f] mb-1 font-poppins">
                    Assistant Work Email
                  </label>
                  <div className="relative flex items-center">
                    <Mail className="w-4 h-4 text-[#747775] absolute left-3.5 pointer-events-none" />
                    <input
                      type="email"
                      required
                      placeholder="e.g. assistant@omnimail.ai"
                      value={loginEmail}
                      onChange={(e) => setLoginEmail(e.target.value)}
                      className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-xl pl-10 pr-4 py-2.5 text-sm text-[#1f1f1f] placeholder-[#747775] focus:outline-none focus:border-[#0b57d0] font-poppins transition"
                    />
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f1f1f] mb-1 font-poppins">
                    Password
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-[#747775] absolute left-3.5 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="••••••••"
                      value={loginPassword}
                      onChange={(e) => setLoginPassword(e.target.value)}
                      className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-xl pl-10 pr-10 py-2.5 text-sm text-[#1f1f1f] placeholder-[#747775] focus:outline-none focus:border-[#0b57d0] font-poppins transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-[#747775] hover:text-[#1f1f1f]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm font-poppins shadow-xs transition flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Enter Assistant Dashboard</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            ) : (
              /* REGISTER FORM */
              <form onSubmit={handleRegister} className="flex flex-col gap-3.5">
                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1f1f1f] mb-1 font-poppins">
                      Full Name *
                    </label>
                    <div className="relative flex items-center">
                      <User className="w-4 h-4 text-[#747775] absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        required
                        placeholder="e.g. Samantha Clark"
                        value={registerName}
                        onChange={(e) => setRegisterName(e.target.value)}
                        className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-xl pl-10 pr-3.5 py-2 text-sm text-[#1f1f1f] placeholder-[#747775] focus:outline-none focus:border-[#0b57d0] font-poppins transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1f1f1f] mb-1 font-poppins">
                      Work Email *
                    </label>
                    <div className="relative flex items-center">
                      <Mail className="w-4 h-4 text-[#747775] absolute left-3.5 pointer-events-none" />
                      <input
                        type="email"
                        required
                        placeholder="samantha@assistants.co"
                        value={registerEmail}
                        onChange={(e) => setRegisterEmail(e.target.value)}
                        className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-xl pl-10 pr-3.5 py-2 text-sm text-[#1f1f1f] placeholder-[#747775] focus:outline-none focus:border-[#0b57d0] font-poppins transition"
                      />
                    </div>
                  </div>
                </div>

                <div className="grid grid-cols-1 sm:grid-cols-2 gap-3">
                  <div>
                    <label className="block text-xs font-semibold text-[#1f1f1f] mb-1 font-poppins">
                      Professional Title
                    </label>
                    <div className="relative flex items-center">
                      <Briefcase className="w-4 h-4 text-[#747775] absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. Executive Assistant / Chief of Staff"
                        value={registerTitle}
                        onChange={(e) => setRegisterTitle(e.target.value)}
                        className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-xl pl-10 pr-3.5 py-2 text-sm text-[#1f1f1f] placeholder-[#747775] focus:outline-none focus:border-[#0b57d0] font-poppins transition"
                      />
                    </div>
                  </div>

                  <div>
                    <label className="block text-xs font-semibold text-[#1f1f1f] mb-1 font-poppins">
                      Agency / Office Name
                    </label>
                    <div className="relative flex items-center">
                      <Building2 className="w-4 h-4 text-[#747775] absolute left-3.5 pointer-events-none" />
                      <input
                        type="text"
                        placeholder="e.g. Apex Multi-Principal Office"
                        value={registerAgency}
                        onChange={(e) => setRegisterAgency(e.target.value)}
                        className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-xl pl-10 pr-3.5 py-2 text-sm text-[#1f1f1f] placeholder-[#747775] focus:outline-none focus:border-[#0b57d0] font-poppins transition"
                      />
                    </div>
                  </div>
                </div>

                <div>
                  <label className="block text-xs font-semibold text-[#1f1f1f] mb-1 font-poppins">
                    Password * (min 6 characters)
                  </label>
                  <div className="relative flex items-center">
                    <Lock className="w-4 h-4 text-[#747775] absolute left-3.5 pointer-events-none" />
                    <input
                      type={showPassword ? 'text' : 'password'}
                      required
                      placeholder="Create a strong password"
                      value={registerPassword}
                      onChange={(e) => setRegisterPassword(e.target.value)}
                      className="w-full bg-[#f8fafd] border border-[#dadce0] rounded-xl pl-10 pr-10 py-2 text-sm text-[#1f1f1f] placeholder-[#747775] focus:outline-none focus:border-[#0b57d0] font-poppins transition"
                    />
                    <button
                      type="button"
                      onClick={() => setShowPassword(!showPassword)}
                      className="absolute right-3 text-[#747775] hover:text-[#1f1f1f]"
                    >
                      {showPassword ? <EyeOff className="w-4 h-4" /> : <Eye className="w-4 h-4" />}
                    </button>
                  </div>
                </div>

                <button
                  type="submit"
                  disabled={isLoading}
                  className="w-full mt-2 py-2.5 px-4 rounded-full bg-[#0b57d0] hover:bg-[#0842a0] disabled:opacity-50 text-white font-semibold text-xs sm:text-sm font-poppins shadow-xs transition flex items-center justify-center gap-2"
                >
                  {isLoading ? (
                    <div className="w-4 h-4 border-2 border-white border-t-transparent rounded-full animate-spin"></div>
                  ) : (
                    <>
                      <span>Complete Assistant Registration</span>
                      <ArrowRight className="w-4 h-4" />
                    </>
                  )}
                </button>
              </form>
            )}
          </div>

          <div className="pt-4 border-t border-[#eaedf1] text-center text-xs text-[#747775] font-lato">
            {mode === 'login' ? (
              <p>
                New executive assistant?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('register');
                    setErrorMessage('');
                  }}
                  className="text-[#0b57d0] font-semibold hover:underline font-poppins ml-1"
                >
                  Create an account
                </button>
              </p>
            ) : (
              <p>
                Already registered?{' '}
                <button
                  type="button"
                  onClick={() => {
                    setMode('login');
                    setErrorMessage('');
                  }}
                  className="text-[#0b57d0] font-semibold hover:underline font-poppins ml-1"
                >
                  Sign in here
                </button>
              </p>
            )}
          </div>
        </div>

      </div>
    </div>
  );
}
