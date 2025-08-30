import "./Hero.css";

function Hero() {
  const scrollToNext = () => {
    const navbarHeight = 60;
    const scrollDistance = window.innerHeight - navbarHeight;

    window.scrollTo({
      top: scrollDistance,
      behavior: "smooth",
    });
  };

  return (
    <section className="hero-full">
      <h2>
        "Un peu gluant mais appétissant !"
        <br />
        Nelson Mandela
      </h2>
      <button
        type="button"
        onClick={scrollToNext}
        className="scroll-button"
        aria-label="Défiler vers le contenu suivant"
      >
        scroll <br />▼
      </button>
    </section>
  );
}

export default Hero;
