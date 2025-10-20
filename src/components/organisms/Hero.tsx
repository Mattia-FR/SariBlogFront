import heroImage from "../../assets/hero.jpg";
import ScrollButton from "../atoms/ScrollButton";
import "./Hero.css";

function Hero() {
  return (
    <section className="hero-full">
      <section className="hero-left">
        <h2>
          "Un peu gluant mais appétissant !"
          <br />
          Nelson Mandela
        </h2>
        <ScrollButton />
      </section>
      <section className="hero-right">
        <img src={heroImage} alt="Dessin en noir et blanc d'une poupée" />
      </section>
    </section>
  );
}

export default Hero;
