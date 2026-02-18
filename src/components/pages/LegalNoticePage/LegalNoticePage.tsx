import "./LegalNoticePage.css";

function LegalNoticePage() {
  return (
    <main className="legal-page">
      <h1>Mentions légales</h1>
      <p className="legal-page-updated">
        Dernière mise à jour : [À REMPLIR - ex. 18 février 2026]
      </p>

      <section>
        <h2>1. Éditeur du site</h2>
        <p>
          Le site <strong>Le blog de Sari</strong> (Sariblog) est édité par :
        </p>
        <ul>
          <li><strong>Nom / Raison sociale :</strong> [À REMPLIR - ex. Sari Eliott]</li>
          <li><strong>Adresse :</strong> [À REMPLIR - adresse postale complète]</li>
          <li><strong>Email :</strong> [À REMPLIR - ex. contact@exemple.com]</li>
          {/*
            Si activité économique, décommenter et remplir :
          <li><strong>Numéro SIRET / SIREN :</strong> [À REMPLIR]</li>
          <li><strong>Numéro de TVA intracommunautaire :</strong> [À REMPLIR si assujetti]</li>
          */}
        </ul>
      </section>

      <section>
        <h2>2. Directeur de la publication</h2>
        <p>
          Le directeur de la publication du site est : [À REMPLIR - ex. Sari Eliott].
        </p>
      </section>

      <section>
        <h2>3. Hébergeur</h2>
        <p>
          Le site est hébergé par :
        </p>
        <ul>
          <li><strong>Raison sociale :</strong> [À REMPLIR - ex. OVH, Hostinger, etc.]</li>
          <li><strong>Adresse :</strong> [À REMPLIR - adresse de l’hébergeur]</li>
          <li><strong>Téléphone :</strong> [À REMPLIR - si disponible]</li>
        </ul>
      </section>

      <section>
        <h2>4. Propriété intellectuelle</h2>
        <p>
          L’ensemble du site (textes, images, mise en page, structure, design) est protégé par le droit d’auteur et les dispositions du Code de propriété intellectuelle. Toute reproduction, représentation ou utilisation non autorisée des contenus peut constituer une contrefaçon.
        </p>
        <p>
          [Optionnel : préciser si certains contenus sont sous licence Creative Commons ou autre.]
        </p>
      </section>

      <section>
        <h2>5. Liens externes</h2>
        <p>
          Les liens vers des sites externes (notamment les réseaux sociaux) sont proposés à titre informatif. L’éditeur du site n’exerce aucun contrôle sur ces sites et décline toute responsabilité quant à leur contenu, leur accessibilité ou leurs pratiques en matière de données personnelles.
        </p>
      </section>

      <section>
        <h2>6. Crédits</h2>
        <p>
          [À REMPLIR - ex. Conception et développement : MattiaFR. Illustrations / photographies : Sari Eliott.]
        </p>
      </section>
    </main>
  );
}

export default LegalNoticePage;
