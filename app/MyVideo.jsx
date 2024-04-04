const myComponent = () => {
  return (
    <>
     <header>
 
 <div>
 <div className="container mx-auto px-5 py-2 lg:pt-4 ">
      <h1>Ma vidéo</h1>
      <video controls>
        <source
          src="https://marcel-de-mayotte.latelier22.fr/videos/videomarcel-sd.mp4"
          type="video/mp4"
        />
        Votre navigateur ne prend pas en charge la vidéo.
      </video>
      </div>
      </div>
      </header>
    </>
  );
};

export default myComponent;
