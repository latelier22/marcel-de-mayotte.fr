"use client"

import React from 'react';
import { Inter } from 'next/font/google';
import { useForm } from 'react-hook-form';
import { useState } from 'react';

const inter = Inter({ subsets: ['latin'] });

const FormContact = () => {
  // Variables
  const {
    register,
    handleSubmit,
    reset,
    formState: { errors },
  } = useForm();

  // States
  const [isLoading, setIsLoading] = useState(false);
  const [isSended, setIsSended] = useState(false);

  // Méthode
  const onSubmitHandler = async (data) => {
    if (!isLoading) {
      setIsLoading(true);

      const response = await fetch("/api/email", {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });

      const result = await response.json();

      setIsLoading(false);

      if (!response.ok) {
        console.log("error");
      } else {
        console.log("ok");
        reset();
        setIsSended(true);
      }
    }
  };

  return (
    <>
      <div className ="text-black pt-32" style={{ textAlign: "center" }}>
        <h1 className="text-white">FORMULAIRE DE CONTACT:</h1>

        {/* Formulaire */}
        <form
          style={{ width: "500px", margin: "auto" }}
          onSubmit={handleSubmit(onSubmitHandler)}
        >
          {isSended && (
            <p className="text-white">
              Votre message a bien été envoyé avec succès, nous vous répondrons rapidement.
            </p>
          )}
          <div style={{ backgroundColor: "#f5f5f5", padding: "30px", borderRadius: "5px", textAlign: "left" }}>
            <div style={{ display: "grid", gridTemplateColumns: "repeat(2, 1fr)", gap: "15px" }}>
              <div style={{ margin: 0 }}>
                <label htmlFor="prenom" className="label text-black">
                  Prénom
                </label>
                <input
                  className="input border-2 border-neutral-500"
                  placeholder="Prénom"
                  id="prenom"
                  {...register("prenom", { required: true })}
                />
                {errors.prenom && (
                  <small>Vous devez renseigner votre prénom.</small>
                )}
              </div>
              <div>
                <label htmlFor="nom" className="label text-black">
                  Nom
                </label>
                <input
                  className="input border-2 border-neutral-500"
                  placeholder="Nom"
                  id="nom"
                  {...register("nom", { required: true })}
                />
                {errors.nom && (
                  <small>Vous devez renseigner votre nom.</small>
                )}
              </div>
            </div>
            <div  className="flex  justify-between" style={{ marginTop: "15px" }}>
              <label htmlFor="email" className="label text-black">
                Adresse email
              </label>
              <input
                className="input w-2/3 border-2 border-neutral-500 bg-sky-100"
                placeholder="Adresse email"
                id="email"
                {...register("email", { required: true })}
              />
              {errors.email && (
                <small>Vous devez renseigner votre adresse email.</small>
              )}
            </div>
          </div>

          <div
            style={{
              backgroundColor: "#f5f5f5",
              padding: "30px",
              borderRadius: "5px",
              textAlign: "left",
              marginTop: "15px",
            }}
          >
            <div className="flex flex-col items-center justify-center">
              <label htmlFor="contenu" className="label text-black ">
                Contenu du message
              </label>
              <textarea
                className="input text-black w-full border-2 border-neutral-500"
                rows="9"
                placeholder="Votre message..."
                {...register("contenu", { required: true })}
              ></textarea>
              {errors.contenu && (
                <small>
                  Vous devez renseigner le contenu de votre message.
                </small>
              )}
            </div>
          </div>

          <div
            style={{
              display: "flex",
              justifyContent: "end",
              marginTop: "15px",
            }}
          >
            {!isLoading && (
              <button className="text-white" style={{ padding: "5px 10px" }}>Envoyer</button>
            )}
          </div>
        </form>
      </div>
    </>
  );
};

export default FormContact;
