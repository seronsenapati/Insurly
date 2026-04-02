import React, { useState } from 'react';
import { useNavigate, Link } from 'react-router-dom';
import { useAuth } from '@/hooks/useAuth';
import toast from 'react-hot-toast';
import { Loader2 } from 'lucide-react';

const AdminLoginPage = () => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [showPassword, setShowPassword] = useState(false);
  const [isSubmitting, setIsSubmitting] = useState(false);
  
  const { login } = useAuth();
  const navigate = useNavigate();

  const handleLogin = async (e) => {
    e.preventDefault();
    if (!email || !password) {
      toast.error('Please enter email and password');
      return;
    }

    try {
      setIsSubmitting(true);
      await login(email, password, 'admin');
      toast.success('Logged in successfully as admin');
      navigate('/admin/dashboard');
    } catch (error) {
      toast.error(error.response?.data?.message || 'Login failed. Invalid credentials.');
    } finally {
      setIsSubmitting(false);
    }
  };

  const autofillAdmin = () => {
    setEmail('admin@insurly.com');
    setPassword('Admin@1234');
  };

  return (
    <div className="min-h-screen bg-background flex items-center justify-center p-6 text-primary">
      <div className="w-full max-w-lg">
        {/* Logo/Brand */}
        <div className="text-center mb-12">
          <Link to="/" className="text-4xl font-serif font-bold italic tracking-tight mb-2 inline-block">Insurly</Link>
          <p className="text-secondary font-medium uppercase tracking-[0.2em] text-[10px]">System Administration Portal</p>
        </div>

        <div className="bg-white rounded-[3rem] p-10 border border-border/10 shadow-sm">
          <form onSubmit={handleLogin} className="space-y-8">
            <h2 className="text-4xl font-serif italic text-primary">Admin Access</h2>
            
            <div className="space-y-6">
              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Admin Email</label>
                <input 
                  type="text"
                  placeholder="admin@insurly.com"
                  value={email}
                  onChange={(e) => setEmail(e.target.value)}
                  className="w-full bg-muted border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                />
              </div>

              <div className="space-y-2">
                <label className="text-[10px] font-bold uppercase tracking-[0.2em] text-secondary">Password</label>
                <div className="relative">
                  <input
                    type={showPassword ? "text" : "password"}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="w-full bg-muted border-none rounded-2xl p-4 focus:ring-2 focus:ring-primary/20 transition-all outline-none"
                  />
                  <button
                    type="button"
                    className="absolute right-4 top-1/2 -translate-y-1/2 text-secondary hover:text-primary"
                    onClick={() => setShowPassword(!showPassword)}
                  >
                    <span className="material-symbols-outlined text-lg">
                      {showPassword ? 'visibility_off' : 'visibility'}
                    </span>
                  </button>
                </div>
              </div>
            </div>

            <div className="flex items-center justify-between">
              <button 
                type="button" 
                onClick={autofillAdmin}
                className="text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-primary transition-colors underline decoration-dotted"
              >
                Auto-fill Demo
              </button>
              <Link to="#" className="text-[10px] font-bold uppercase tracking-widest text-secondary hover:text-primary">Forgot Password?</Link>
            </div>

            <button 
              type="submit" 
              className="w-full bg-primary text-primary-foreground py-5 rounded-full font-bold uppercase tracking-widest hover:scale-[1.02] active:scale-[0.98] transition-all flex items-center justify-center space-x-3 disabled:opacity-70"
              disabled={isSubmitting}
            >
              {isSubmitting ? <Loader2 className="animate-spin h-5 w-5" /> : null}
              <span>Login to Admin Portal</span>
            </button>
          </form>
        </div>
      </div>
    </div>
  );
};

export default AdminLoginPage;
