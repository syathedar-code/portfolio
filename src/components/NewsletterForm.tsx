import React, { useState } from 'react';

export const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    // Simulate a realistic 600ms network delay
    setTimeout(() => {
      setStatus('success');
      setMessage("Awesome! You're on the list.");
      setEmail('');
    }, 600);
  };

  return (
    <div className="p-6 bg-zinc-900 border border-zinc-800 rounded-lg max-w-md">
      <h3 className="text-xl font-bold font-mono text-white mb-2">Join the Dev Journal</h3>
      <p className="text-zinc-400 text-sm mb-4">Daily micro-insights on engineering and tech ecosystem changes.</p>

      <form onSubmit={handleSubscribe} className="flex gap-2">
        <input
          type="email"
          required
          placeholder="your.email@domain.com"
          value={email}
          onChange={(e) => setEmail(e.target.value)}
          disabled={status === 'loading'}
          className="bg-zinc-950 border border-zinc-700 text-white rounded px-3 py-2 text-sm w-full focus:outline-none focus:border-indigo-500 font-mono"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="w-full sm:w-auto bg-transparent border border-teal/80 text-white font-mono text-xs tracking-wider uppercase px-5 py-2 rounded transition-all duration-300 ease-out hover:bg-teal/10 hover:text-teal hover:shadow-[0_0_15px_rgba(45,212,191,0.4)] hover:border-teal focus:outline-none focus:ring-1 focus:ring-teal/50 active:scale-[0.98]"        >
          {status === 'loading' ? '...' : 'Subscribe'}
        </button>
      </form>

      {message && (
        <p className={`mt-3 text-xs font-mono ${status === 'success' ? 'text-green-400' : 'text-red-400'}`}>
          {message}
        </p>
      )}
    </div>
  );
};