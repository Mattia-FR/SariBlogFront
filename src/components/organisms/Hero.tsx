import ScrollButton from "../atoms/ScrollButton";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero-full">
      <h2>
        "Un peu gluant mais appétissant !"
        <br />
        Nelson Mandela
      </h2>
      <ScrollButton />
    </section>
  );
}

export default Hero;
