'use client';

import { signIn } from 'next-auth/react';
import { useRouter } from 'next/navigation';
import { FormEvent } from 'react';

import FormAuth from '../components/UI/FormAuth'

export default function Form() {
  const router = useRouter();
  const handleSubmit = async (e: FormEvent<HTMLFormElement>) => {
    e.preventDefault();
    const formData = new FormData(e.currentTarget);
    const response = await signIn('credentials', {
      email: formData.get('email'),
      password: formData.get('password'),
      redirect: false,
    });

    console.log({ response });
    if (!response?.error) {
      router.push('/accueil');
      router.refresh();
    }
  };
  return (
    <>
    <FormAuth title={"CONNECTEZ VOUS AVEC VOTRE EMAIL"} btnAction={"SE CONNECTER"} handleSubmit={handleSubmit}/>
    </>
  );
}
