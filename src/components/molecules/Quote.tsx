import "./Quote.css";

function Quote() {
  return (
    <figure className="quote">
      <blockquote className="quote-text">
        <p>
          «&nbsp;Le dessin, c&apos;est un{" "}
          <span className="quote-emphasis">outil à raconter.&nbsp;»</span>
        </p>
      </blockquote>
      <figcaption className="quote-author">— Christophe Chabouté</figcaption>
    </figure>
  );
}

export default Quote;
