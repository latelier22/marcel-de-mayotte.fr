"use client";

import React, { useState, useEffect, useRef } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/navigation";
import Link from "next/link";
import myFetch from "../../components/myFetch";
import DotLoaderSpinner from "../../components/spinners/DotLoaderSpinner";

function ListFiles({ allFiles }) {
  
console.log("allFiles",allFiles)

  return (
    
    <>
    <div>
      {allFiles.map(f=> f.name)}
    </div>
    </>
    
  );
}

export default ListFiles;
