import "./LegalNoticePage.css";

function LegalNoticePage() {
  return (
    <main className="legal-page">
      <h1 className="legal-page-title">Mentions légales</h1>
      <p className="legal-page-updated">
        Dernière mise à jour : [À REMPLIR - ex. 18 février 2026]
      </p>

      <section>
        <h2>1. Éditeur du site</h2>
        <p>Le site Le blog de Sari (Sariblog) est édité par :</p>
        <ul>
          <li>Nom / Raison sociale : [À REMPLIR - ex. Sari Eliott]</li>
          <li>Adresse : [À REMPLIR - adresse postale complète]</li>
          <li>Email : [À REMPLIR - ex. contact@exemple.com]</li>
          {/*
            Si activité économique, décommenter et remplir :
          <li>Numéro SIRET / SIREN : [À REMPLIR]</li>
          <li>Numéro de TVA intracommunautaire : [À REMPLIR si assujetti]</li>
          */}
        </ul>
      </section>

      <section>
        <h2>2. Directeur de la publication</h2>
        <p>
          Le directeur de la publication du site est : [À REMPLIR - ex. Sari
          Eliott].
        </p>
      </section>

      <section>
        <h2>3. Hébergeur</h2>
        <p>Le site est hébergé par :</p>
        <ul>
          <li>Raison sociale : [À REMPLIR - ex. OVH, Hostinger, etc.]</li>
          <li>Adresse : [À REMPLIR - adresse de l’hébergeur]</li>
          <li>Téléphone : [À REMPLIR - si disponible]</li>
        </ul>
      </section>

      <section>
        <h2>4. Propriété intellectuelle</h2>
        <p>
          L’ensemble du site (textes, images, mise en page, structure, design)
          est protégé par le droit d’auteur et les dispositions du Code de
          propriété intellectuelle. Toute reproduction, représentation ou
          utilisation non autorisée des contenus peut constituer une
          contrefaçon.
        </p>
        <p>
          [Optionnel : préciser si certains contenus sont sous licence Creative
          Commons ou autre.]
        </p>
      </section>

      <section>
        <h2>5. Liens externes</h2>
        <p>
          Les liens vers des sites externes (notamment les réseaux sociaux) sont
          proposés à titre informatif. L’éditeur du site n’exerce aucun contrôle
          sur ces sites et décline toute responsabilité quant à leur contenu,
          leur accessibilité ou leurs pratiques en matière de données
          personnelles.
        </p>
      </section>

      <section>
        <h2>6. Crédits</h2>
        <p>
          [À REMPLIR - ex. Conception et développement : MattiaFR. Illustrations
          / photographies : Sari Eliott.]
        </p>
      </section>
    </main>
  );
}

export default LegalNoticePage;
