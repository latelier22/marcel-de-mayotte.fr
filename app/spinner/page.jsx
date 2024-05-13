import React, { Suspense, lazy } from "react";


import DotLoaderSpinner from "../components/spinners/DotLoaderSpinner";

function Page() {
    return (
        <>
        <div className="absolute left-200 top-200 z-40">
            <DotLoaderSpinner/>
            </div>
        </>
    );
}

export default Page;