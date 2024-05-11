'use client';


import { FormEvent, useState, useEffect } from 'react';
import { useRouter } from 'next/navigation';

export default function CitationForm() {
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
      const response = await fetch(`/api/citations/createCitation`, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          texte: formData.get('texte'),
          auteur: formData.get('auteur'),
          etat: formData.get('etat'),
        })
      }
      );

      const data = await response.json();
      console.log(data.message, "lors de l'ajout de la citation", data.content)
      if (data.message === "success") {
        router.push('/admin/citations')
      } else {
        setError(data.message || 'Une erreur est survenue lors de la création de la citation.');
      }
    } catch (err) {
      setError('Le serveur ne répond pas.');
    }
  };


  return (
    <form onSubmit={handleSubmit} className="flex flex-col gap-2 mx-auto max-w-md pt-32">
      {error && <p className="text-red-500">{error}</p>}
      <div className='my-4 w-full'>
                            <label>Texte</label>
                            <textarea className='text-black bg-sky-300 ml-4 p-2 rounded-md w-full' placeholder="Entrez le texte de la citation" name="texte" required />
                        </div>
                        <div className='w-1/2 mr-2 gap-4'>
                                <label>Auteur</label>
                                <input className='text-black bg-sky-300 ml-4 p-2 mt-4 rounded-md w-full' type="text" placeholder="Entrez l'auteur de la citation" name="auteur" required />
                            </div>
       <div className='w-1/2 ml-2 '>
                                <label className='mt-4'>État</label>
                                <div>
                                    <input type="radio" id="published" name="etat" value="publiee" />
                                    <label htmlFor="published" className="ml-2">Publiée</label>
                                </div>
                                <div>
                                    <input type="radio" id="draft" name="etat" value="brouillon" />
                                    <label htmlFor="draft" className="ml-2">Brouillon</label>
                                </div>
                            </div>
      <button type="submit">Register</button>
    </form>
  );
}
