import Image from "next/image";
import Link from "next/link";

export default function Book3d() {
    return (
        <div className="container mx-auto my-8 p-4 flex flex-col md:flex-row justify-center items-stretch gap-4 rounded-md dark:bg-black border-gold-500 border-solid border-2 animate-fadeInOut">
            {/* Colonne gauche - Affiche */}
            <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-4">
                <h2 className="text-lg md:text-xl font-bold text-center text-gold-500 mb-4">
                    Affiche de la prochaine expo
                </h2>
                <div className="relative w-full h-64 md:h-[800px]">
                    <Image 
                        src="/images/afficheExpoMarcelAvril2025.png" 
                        alt="Affiche de la prochaine exposition" 
                        layout="fill" 
                        objectFit="contain"
                        className="rounded-lg shadow-lg"
                    />
                </div>
            </div>

            {/* Colonne droite - Livre */}
            <div className="flex flex-col items-center justify-center w-full md:w-1/2 p-4">
                <Link 
                href="livre/6?n=48&w=600&h=600">
                <h2 className="text-lg md:text-xl font-bold text-center text-gold-500 mb-4">
                    Découvrez le dernier ouvrage de Marcel
                </h2>
                </Link>
                <div className="relative w-full h-64 md:h-[800px] border border-gray-300 shadow-lg rounded-lg overflow-hidden">
                    <iframe
                        src="https://book.marcel-de-mayotte.fr/"
                        className="w-full h-full"
                    >
                    </iframe>
                </div>
            </div>
        </div>
    );
}
