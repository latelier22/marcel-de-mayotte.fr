"use client"

import { useEffect, useState } from 'react';
import { useRouter } from 'next/navigation';

const RegisterForm = () => {
    const router = useRouter();
    const [email, setEmail] = useState('');
    const [password, setPassword] = useState('');
    const [error, setError] = useState('');

    useEffect(() => {
        if (typeof window === 'undefined') {
            // Ne pas exécuter le code qui dépend du routeur côté client pendant SSR
            return;
        }

        // Vous pouvez utiliser le routeur ici, par exemple pour rediriger dès le montage du composant
        // router.push('/some-path');
    }, []);

    const handleSubmit = async (event) => {
        event.preventDefault();
        const response = await fetch('/api/register', {
            method: 'POST',
            headers: {
                'Content-Type': 'application/json',
            },
            body: JSON.stringify({ email, password }),
        });
        const data = await response.json();
        if (data.success) {
            router.push('/welcome');
        } else {
            setError(data.message || 'Failed to register');
        }
    };

    return (
        <div className='text-white flex flex-col items-center pt-64 '>
            <div className='border-white solid border-2 p-12'> 
            <h2>Inscrivez-vous : vous pourrez ainsi mémoriser vos tableaux favoris, et commenter les oeuvres</h2>
        <form onSubmit={handleSubmit}>
        <div className='text-red-700 flex flex-col justify-between items-start pt-8'>
            <div className='my-4 '>
                <label>Email</label>
                <input className='text-black bg-sky-300 ml-4 p-2 rounded-md' type="email" placeholder="votre email" value={email} onChange={(e) => setEmail(e.target.value)} required />
            </div>
            <div className='my-4'>
            <label>Mot de passe</label>
                <input className='text-black ml-4 rounded-md p-2' placeholder="votre mot de passe" type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
            </div>
            {error && <p>{error}</p>}
            <button className='bg-yellow-600 p-4 rounded-md my-4 self-center' type="submit">S&apos;inscrire</button>
        </div>
        </form>
        </div>
        </div>
    );
};

export default RegisterForm;
