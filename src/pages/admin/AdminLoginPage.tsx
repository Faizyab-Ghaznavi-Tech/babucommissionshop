import { useState, type FormEvent } from 'react';
import { Navigate, useNavigate, Link } from 'react-router-dom';
import { Lock, Mail, ArrowLeft, AlertCircle } from 'lucide-react';
import { useAuth } from '@/context/AuthContext';
import { SEO } from '@/components/SEO';

export function AdminLoginPage() {
  const { signIn, session, loading } = useAuth();
  const navigate = useNavigate();

  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [error, setError] = useState('');
  const [submitting, setSubmitting] = useState(false);

  if (loading) return null;
  if (session) return <Navigate to="/admin" replace />;

  const handleSubmit = async (e: FormEvent) => {
    e.preventDefault();
    setError('');
    setSubmitting(true);

    const { error } = await signIn(email, password);

    if (error) {
      setError(error);
      setSubmitting(false);
    } else {
      navigate('/admin');
    }
  };

  return (
    <>
      <SEO title="Admin Login | Babu Commission Shop" noIndex />
      <div className="min-h-screen flex items-center justify-center bg-date-900 px-4">
        <div className="w-full max-w-md">
          <div className="text-center mb-8">
            <div className="inline-flex items-center justify-center w-16 h-16 rounded-2xl bg-date-700 mb-4">
              <Lock size={28} className="text-cream" />
            </div>
            <h1 className="text-2xl font-display font-bold text-cream">Admin Panel</h1>
            <p className="text-cream/60 text-sm mt-1">Babu Commission Shop</p>
          </div>

          <div className="bg-cream rounded-2xl p-8 shadow-2xl">
            <h2 className="text-xl font-display font-bold text-date-800 mb-6">
              Sign In
            </h2>

            {error && (
              <div className="flex items-start gap-3 p-3 rounded-lg bg-red-50 border border-red-200 text-red-700 mb-4">
                <AlertCircle size={18} className="shrink-0 mt-0.5" />
                <p className="text-sm">{error}</p>
              </div>
            )}

            <form onSubmit={handleSubmit} className="space-y-4">
              <div>
                <label className="label-text" htmlFor="email">Email</label>
                <div className="relative">
                  <Mail size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-date-400" />
                  <input
                    id="email"
                    type="email"
                    required
                    value={email}
                    onChange={(e) => setEmail(e.target.value)}
                    className="input-field pl-10"
                    placeholder="admin@example.com"
                  />
                </div>
              </div>
              <div>
                <label className="label-text" htmlFor="password">Password</label>
                <div className="relative">
                  <Lock size={18} className="absolute left-3 top-1/2 -translate-y-1/2 text-date-400" />
                  <input
                    id="password"
                    type="password"
                    required
                    minLength={6}
                    value={password}
                    onChange={(e) => setPassword(e.target.value)}
                    className="input-field pl-10"
                    placeholder="••••••••"
                  />
                </div>
              </div>

              <button
                type="submit"
                disabled={submitting}
                className="btn-primary w-full disabled:opacity-60 disabled:cursor-not-allowed"
              >
                {submitting ? 'Please wait...' : 'Sign In'}
              </button>
            </form>
            <p className="mt-5 text-center text-xs leading-5 text-date-500">Admin accounts are created by a project administrator.</p>
          </div>

          <div className="text-center mt-6">
            <Link to="/" className="inline-flex items-center gap-2 text-cream/60 text-sm hover:text-cream transition-colors">
              <ArrowLeft size={14} />
              Back to website
            </Link>
          </div>
        </div>
      </div>
    </>
  );
}
