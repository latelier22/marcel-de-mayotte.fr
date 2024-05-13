'use client';

import React from "react";

export default function FormAuth( {title, btnAction, handleSubmit }) {
 
  return (
    <form
      onSubmit={handleSubmit}
      className="flex flex-col gap-2 items-center mx-auto max-w-md pt-32  ">
        <div className='border-solid border border-neutral-200 p-8 my-16 rounded-xl flex flex-col shadow-3 sha shadow-gold-800'>
      <div className='my-8'>{title}</div>
      <div className='flex flex-row  gap-2 py-2 justify-between'>
      <label htmlFor="email"> Email</label>
      <input
        id="email"
        name="email"
        className="border border-black text-black"
        type="email"
      />
      </div>
      <div className='flex flex-row  gap-2 py-2 justify-between'>
      <label htmlFor="password"> Mot de passe</label>
      <input
        id="password"
        name="password"
        className="border border-black  text-black"
        type="password"
      />
      </div>
      <button 
      className='bg-neutral-700 hover:bg-gold-800  border-1 border-solid border border-neutral-200 p-4 mt-16 mx-16 rounded-xl items-center justify-between '
      type="submit">{btnAction}</button>
      </div>
    </form>
  );
}
