import React, { useState } from 'react';

export const NewsletterForm: React.FC = () => {
  const [email, setEmail] = useState('');
  const [status, setStatus] = useState<'idle' | 'loading' | 'success' | 'error'>('idle');
  const [message, setMessage] = useState('');

  const handleSubscribe = async (e: React.FormEvent) => {
    e.preventDefault();
    setStatus('loading');

    try {
      const response = await fetch('/.netlify/functions/subscribe', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email }),
      });

      const data = await response.json();

      if (!response.ok) {
        throw new Error(data.error || 'Something went wrong.');
      }

      setStatus('success');
      setMessage('Awesome! You\'re on the list.');
      setEmail('');
    } catch (err: any) {
      setStatus('error');
      setMessage(err.message || 'Failed to join the list.');
    }
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
          className="bg-zinc-950 border border-zinc-700 text-white rounded px-3 py-2 text-sm w-full focus:outline-none focus:border-indigo-500 font-sans"
        />
        <button
          type="submit"
          disabled={status === 'loading'}
          className="bg-white text-black font-mono text-sm px-4 py-2 rounded font-bold hover:bg-zinc-200 transition-colors disabled:opacity-50"
        >
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