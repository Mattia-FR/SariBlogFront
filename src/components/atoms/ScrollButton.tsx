import { MoveDown } from "lucide-react";
import "./ScrollButton.css";

function ScrollButton() {
  // const scrollToNext = () => {
  //   const navbarHeight = 60;
  //   const scrollDistance = window.innerHeight - navbarHeight;

  //   window.scrollTo({
  //     top: scrollDistance,
  //     behavior: "smooth",
  //   });
  // };

  const scrollToNext = () => {
    // On calcule la hauteur de la navbar de manière dynamique.
    // On récupère l'élément <nav> en le typant au passage.
    const navbarElement = document.querySelector("nav") as HTMLElement | null;
    // On utilise un opérateur de chainage optionnel et on définit à 0 si null.
    const navbarHeight = navbarElement?.offsetHeight ?? 0;
    // On utilise cette hauteur pour calculer la distance de scroll.
    const scrollDistance = window.innerHeight - navbarHeight;

    window.scrollTo({
      top: window.scrollY + scrollDistance,
      behavior: "smooth",
    });
  };

  return (
    <button type="button" onClick={scrollToNext} className="scroll-button">
      <MoveDown />
    </button>
  );
}

export default ScrollButton;
