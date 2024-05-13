"use client"

import { DotLoader } from 'react-spinners';


const DotLoaderSpinner = ( {isLoading}) => {

    return (

        <div className="spinner">
            <DotLoader
                loading ={isLoading}
                color="#36d7b7"
                speedMultiplier={2}
            />
        </div>
    )
}

export default DotLoaderSpinner