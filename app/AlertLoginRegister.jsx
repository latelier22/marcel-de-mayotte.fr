import React from "react";

const AlertLoginRegister = () => {
  return (
    <div
      className={`container mx-auto my-8 p-4 flex text-center justify-center items-center  flex-row gap-8 rounded-md dark:bg-black border-gold-500 border-solid border-2 animate-fadeInOut`}
    >
      <div>
        <h1 className="text-xl">
          Pensez à vous connecter ou vous inscrire pour pouvoir commenter les
          articles du blog, et mémoriser vos tableaux favoris
        </h1>
        <h2 className=" pt-4 text-gold-500">
          Une fois effectuée l&apos;inscription est permanente et n&apos;a pas
          besoin d&apos;être renouvelée.
        </h2>
      </div>
      <a
        className="font-note md:self-stop rounded-2xl   bg-black dark:bg-gold-900 px-6  py-3 text-md font-medium  leading-normal text-gold-200 shadow-[0_4px_9px_-4px_#FFB200] transition duration-150 ease-in-out hover:text-black hover:bg-gold-500 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-gold-200 focus:shadow-[0_8px_9px_-4px_rgba(59,113,0,0.3),0_4px_18px_0_rgba(59,113,0,0.2)] focus:text-gold-500 focus:outline-none focus:ring-0 active:bg-lime-100 active:shadow-[0_8px_9px_-4px_rgba(59,113,0,0.3),0_4px_18px_0_rgba(59,113,0,0.2)]"
        data-te-ripple-init
        data-te-ripple-color="light"
        href="/login"
        role="button"
      >
        Se connecter
      </a>
      <a
        className="font-note md:self-stop rounded-2xl  bg-black dark:bg-gold-900 px-6  py-3 text-md font-medium  leading-normal text-gold-200 shadow-[0_4px_9px_-4px_#FFB200] transition duration-150 ease-in-out hover:text-black hover:bg-gold-500 hover:shadow-[0_8px_9px_-4px_rgba(59,113,202,0.3),0_4px_18px_0_rgba(59,113,202,0.2)] focus:bg-gold-200 focus:shadow-[0_8px_9px_-4px_rgba(59,113,0,0.3),0_4px_18px_0_rgba(59,113,0,0.2)] focus:text-gold-500 focus:outline-none focus:ring-0 active:bg-lime-100 active:shadow-[0_8px_9px_-4px_rgba(59,113,0,0.3),0_4px_18px_0_rgba(59,113,0,0.2)]"
        data-te-ripple-init
        data-te-ripple-color="light"
        href="/inscription"
        role="button"
      >
        S&apos;inscrire
      </a>
    </div>
  );
};

export default AlertLoginRegister;
