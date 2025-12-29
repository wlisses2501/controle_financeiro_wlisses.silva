import React, { useState } from 'react';
import { supabase } from '../lib/supabase';

interface AuthProps {
  onLogin: () => void;
}

const Auth: React.FC<AuthProps> = ({ onLogin }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [name, setName] = useState('');
  const [isSignUp, setIsSignUp] = useState(false);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);

    try {
      if (isSignUp) {
        if (!name) {
          throw new Error('Por favor, digite seu nome.');
        }
        const { data, error } = await supabase.auth.signUp({
          email,
          password,
          options: {
            data: {
              name,
            },
          },
        });
        if (error) throw error;
        if (data.user) {
          alert('Cadastro realizado com sucesso! Você já pode entrar.');
          setIsSignUp(false);
        }
      } else {
        const { error } = await supabase.auth.signInWithPassword({
          email,
          password,
        });

        if (error) throw error;
        // onLogin is optional now as App.tsx handles session state, but calling it for immediate feedback is fine
        onLogin();
      }
    } catch (err: any) {
      setError(err.message || 'Ocorreu um erro.');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="min-h-screen flex items-center justify-center bg-dark-blue p-6 relative overflow-hidden">
      {/* Decorative background elements */}
      <div className="absolute top-0 left-0 w-96 h-96 bg-primary-blue/30 rounded-full -ml-32 -mt-32 blur-3xl"></div>
      <div className="absolute bottom-0 right-0 w-96 h-96 bg-accent-orange/10 rounded-full -mr-32 -mb-32 blur-3xl"></div>

      <div className="w-full max-w-md bg-white rounded-3xl shadow-2xl p-8 md:p-12 relative z-10 animate-scaleUp">
        <div className="text-center mb-10">
          <h1 className="text-4xl font-black text-dark-blue">ControlFin</h1>
          <p className="text-gray-500 font-medium mt-2">
            {isSignUp ? 'Crie sua conta para começar.' : 'Bem-vindo de volta! Faça login.'}
          </p>
        </div>

        <form onSubmit={handleSubmit} className="space-y-6">
          {error && (
            <div className="bg-red-50 text-red-500 p-3 rounded-lg text-sm text-center font-medium">
              {error}
            </div>
          )}

          {isSignUp && (
            <div>
              <label className="block text-sm font-bold text-dark-blue mb-1">Seu Nome</label>
              <input
                type="text"
                value={name}
                onChange={(e) => setName(e.target.value)}
                className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary-blue outline-none transition-all"
                placeholder="Ex: João Silva"
                required={isSignUp}
              />
            </div>
          )}

          <div>
            <label className="block text-sm font-bold text-dark-blue mb-1">Email</label>
            <input
              type="email"
              value={email}
              onChange={(e) => setEmail(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary-blue outline-none transition-all"
              placeholder="exemplo@email.com"
              required
            />
          </div>

          <div>
            <label className="block text-sm font-bold text-dark-blue mb-1">Senha</label>
            <input
              type="password"
              value={password}
              onChange={(e) => setPassword(e.target.value)}
              className="w-full px-5 py-3 rounded-xl bg-gray-50 border border-gray-200 focus:ring-2 focus:ring-primary-blue outline-none transition-all"
              placeholder="••••••••"
              required
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full bg-primary-blue text-white font-bold py-4 rounded-xl shadow-lg hover:bg-navy transition-all active:scale-95 transform disabled:opacity-50 disabled:cursor-not-allowed"
          >
            {loading ? 'Carregando...' : (isSignUp ? 'Criar minha Conta' : 'Entrar no Sistema')}
          </button>
        </form>

        <div className="mt-8 text-center text-sm font-medium">
          <span className="text-gray-500">
            {isSignUp ? 'Já possui uma conta?' : 'Ainda não tem conta?'}
          </span>
          <button
            onClick={() => setIsSignUp(!isSignUp)}
            className="text-accent-orange font-bold hover:underline ml-1"
          >
            {isSignUp ? 'Faça Login' : 'Cadastre-se'}
          </button>
        </div>
      </div>
    </div>
  );
};

export default Auth;
