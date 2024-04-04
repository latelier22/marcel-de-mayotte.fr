
const Section = ({ title }) => {

  return (


    <>
      {/* <section className="p-4 bg-gradient-to-r from-gold-800 via-gold-700 to-gold-800">
        <h2 className="text-4xl text-black text-center font-bold ">
          
        </h2>

      </section> */}

      <div className="flex items-center py-4">
        {/* <!-- The left line --> */}
        <div className="flex-grow h-0.5 bg-gradient-to-r from-gold-800 via-gold-600 to-gold-800"></div>

        {/* <!-- Your text here --> */}
        <span className="flex-shrink px-4 font-bold text-transparent text-3xl bg-clip-text bg-gradient-to-br from-gold-800 via-gold-400 to-gold-800 italic font-light">{title}</span>

        {/* <!-- The right line --> */}
        <div className="flex-grow h-0.5 bg-gradient-to-r from-gold-800 via-gold-600 to-gold-800"></div>
      </div>
    </>



  );
};

export default Section;




