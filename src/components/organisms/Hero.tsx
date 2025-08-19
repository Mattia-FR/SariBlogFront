import heroImg from "../../assets/hero.jpg";
import Image from "../atoms/Image";

import "./Hero.css";

function Hero() {
  return (
    <section>
      <Image src={heroImg} alt={"Dessin en noir et blanc d'une poupée"} />
      <h2>Catch phrase</h2>
      <p>
        scroll <br />▼
      </p>
    </section>
  );
}

export default Hero;
