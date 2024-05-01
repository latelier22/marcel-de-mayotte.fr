'use client';


import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';
import { signIn } from 'next-auth/react';

export default function RegisterForm() {
  const router = useRouter();
  const [error, setError] = useState('');

  const [isRouterReady, setIsRouterReady] = useState(false);
  useEffect(() => {
    if (router.isReady) {
      setIsRouterReady(true);
    }
  }, [router.isReady]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    try {
      const formData = new FormData(e.currentTarget);
      const response = await fetch(`/api/auth/register`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          email: formData.get('email'),
          password: formData.get('password'),
        })

 
        
      }
     
      );

      const data = await response.json();
      console.log(data.message)
      if (data.message === "success") {
        signIn();       
      } else {
        setError(data.message || 'Une erreur est survenue lors de l’inscription.');
      }
    } catch (err) {
      setError('Le serveur ne répond pas.');
    }
  };

  
  


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mx-auto max-w-md pt-32">
      {error && <p className="text-red-500">{error}</p>}
      <input
        name="email"
        placeholder="Email"
        className="border border-black text-black"
        type="email"
        required
      />
      <input
        name="password"
        placeholder="Password"
        className="border border-black text-black"
        type="password"
        required
      />
      <button type="submit">Register</button>
    </form>
  );
}
