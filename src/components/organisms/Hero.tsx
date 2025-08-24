import heroImg from "../../assets/hero.jpg";

import "./Hero.css";

function Hero() {
  return (
    <section>
      <img src={heroImg} alt={"Dessin en noir et blanc d'une poupée"} />
      <h2>Catch phrase</h2>
      <p>
        scroll <br />▼
      </p>
    </section>
  );
}

export default Hero;
