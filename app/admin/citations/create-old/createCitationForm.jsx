"use client"
import { useState } from 'react';
import { useRouter } from 'next/navigation';
import myFetch from "../../../components/myFech";

const CreateCitationForm = () => {
    const router = useRouter();
    const [texte, setTexte] = useState('');
    const [auteur, setAuteur] = useState('');
    const [etat, setEtat] = useState('');
    const [error, setError] = useState('');

    const handleSubmit = async (event) => {
        event.preventDefault();

        try {
            const response = await fetch('/api/citations/createCitation', {
              method: 'POST',
              headers: {
                'Content-Type': 'application/json',
              },
              body: JSON.stringify({ texte, auteur, etat }),
            });
        
            if (!response.ok) {
              throw new Error(`HTTP error! Status: ${response.status}`);
            }
        
            return await response.json();  // Ensure you wait for the JSON parsing
          } catch (error) {
            console.error("Error creating Citation:", error);
            throw error;  // Rethrow to handle it in the calling function
          }
    };

    return (
        <div className='text-white flex flex-col items-center pt-64'>
            <div className='border-white solid w-1/2 border-2 p-12'> 
                <h2>Créer une nouvelle citation</h2>
                <form onSubmit={(event) => handleSubmit()}>
                    <div className='text-red-700 flex flex-col items-start pt-8'>
                        <div className='my-4 w-full'>
                            <label>Texte</label>
                            <textarea className='text-black bg-sky-300 ml-4 p-2 rounded-md w-full' placeholder="Entrez le texte de la citation" value={texte} onChange={(e) => setTexte(e.target.value)} required />
                        </div>
                        <div className='my-4 w-full flex flex-row gap-8 justify-arround'>
                            <div className='w-1/2 mr-2 gap-4'>
                                <label>Auteur</label>
                                <input className='text-black bg-sky-300 ml-4 p-2 mt-4 rounded-md w-full' type="text" placeholder="Entrez l'auteur de la citation" value={auteur} onChange={(e) => setAuteur(e.target.value)} required />
                            </div>
                            <div className='w-1/2 ml-2 '>
                                <label className='mt-4'>État</label>
                                <div>
                                    <input type="radio" id="published" name="etat" value="publiee" checked={etat === "publiee"} onChange={() => setEtat("publiee")} />
                                    <label htmlFor="published" className="ml-2">Publiée</label>
                                </div>
                                <div>
                                    <input type="radio" id="draft" name="etat" value="brouillon" checked={etat === "brouillon"} onChange={() => setEtat("brouillon")} />
                                    <label htmlFor="draft" className="ml-2">Brouillon</label>
                                </div>
                            </div>
                        </div>
                        {error && <p>{error}</p>}
                        <button className='bg-yellow-600 p-4 rounded-md my-4 self-center' type="submit">Créer la citation</button>
                    </div>
                </form>
            </div>
        </div>
    );
}    

export default CreateCitationForm;
