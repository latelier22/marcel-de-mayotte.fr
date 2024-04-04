"use client";
// Librairies
import Head from "next/head";
import { useForm } from "react-hook-form";
import { useState } from "react";

export default function Contact() {
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

	// MÃ©thode
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
			{/* <Head>
				<title>Contact | Mon Super Projet SendGrid</title>
			</Head> */}
			<div style={{ textAlign: "center" }}>
				<h1>Contact</h1>

				{/* Formulaire */}
				<form
					style={{ width: "500px", margin: "auto" }}
					onSubmit={handleSubmit(onSubmitHandler)}
				>
					{isSended && (
						<p>
							Votre message a bien été envoyé avec
							succès nous vous répondrons rapidement.
						</p>
					)}
					<div
						style={{
							backgroundColor: "#f5f5f5",
							padding: "30px",
							borderRadius: "5px",
							textAlign: "left",
						}}
					>
						<div
							style={{
								display: "grid",
								gridTemplateColumns: "repeat(2, 1fr)",
								gap: "15px",
							}}
						>
							<div style={{ margin: 0 }}>
								<label
									htmlFor="prenom"
									className="label"
								>
									Prénom
								</label>
								<input
									className="input"
									placeholder="Prénom"
									id="prenom"
									{...register("prenom", {
										required: true,
									})}
								/>
								{errors.prenom && (
									<small>
										Vous devez renseigner votre
										prénom.
									</small>
								)}
							</div>
							<div>
								<label
									htmlFor="nom"
									className="label"
								>
									Nom
								</label>
								<input
									className="input"
									placeholder="Nom"
									id="nom"
									{...register("nom", {
										required: true,
									})}
								/>
								{errors.nom && (
									<small>
										Vous devez renseigner votre
										nom.
									</small>
								)}
							</div>
						</div>
						<div style={{ marginTop: "15px" }}>
							<label htmlFor="email" className="label">
								Adresse email
							</label>
							<input
								className="input"
								placeholder="Adresse email"
								id="email"
								{...register("email", {
									required: true,
								})}
							/>
							{errors.email && (
								<small>
									Vous devez renseigner votre
									adresse email.
								</small>
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
						<div>
							<label
								htmlFor="contenu"
								className="label"
							>
								Contenu du message
							</label>
							<textarea
								className="input"
								rows="9"
								placeholder="Bonjour..."
								{...register("contenu", {
									required: true,
								})}
							></textarea>
							{errors.contenu && (
								<small>
									Vous devez renseigner le contenu
									de votre message.
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
							<button style={{ padding: "5px 10px" }}>
								Envoyer
							</button>
						)}
					</div>
				</form>
			</div>
		</>
	);
}
