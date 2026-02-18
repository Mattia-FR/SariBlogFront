import "./PrivacyPolicyPage.css";

function PrivacyPolicyPage() {
  return (
    <main className="legal-page">
      <h1>Politique de confidentialité</h1>
      <p className="legal-page-updated">
        Dernière mise à jour : [À REMPLIR - ex. 18 février 2026]
      </p>

      <section>
        <h2>1. Responsable du traitement</h2>
        <p>
          Le responsable du traitement des données personnelles collectées sur ce site est :
        </p>
        <ul>
          <li><strong>Identité :</strong> [À REMPLIR - ex. Sari Eliott]</li>
          <li><strong>Adresse :</strong> [À REMPLIR - adresse postale]</li>
          <li><strong>Email :</strong> [À REMPLIR - pour exercer vos droits]</li>
        </ul>
      </section>

      <section>
        <h2>2. Données collectées et finalités</h2>
        <p>Les données suivantes peuvent être collectées :</p>
        <ul>
          <li>
            <strong>Compte utilisateur (inscription / connexion)</strong> : identifiant, adresse email, mot de passe (stocké de manière sécurisée), prénom et nom si renseignés. Finalité : création et gestion du compte, authentification.
          </li>
          <li>
            <strong>Formulaire de contact</strong> : prénom, nom, email, sujet, message. L’adresse IP est également enregistrée à des fins de sécurité et de preuve en cas d’abus. Finalité : traitement de votre demande et réponse.
          </li>
          <li>
            <strong>Commentaires</strong> : contenu du commentaire et identité (via le compte connecté). Finalité : affichage des commentaires et modération.
          </li>
          <li>
            <strong>Navigation</strong> : un cookie technique (refresh token) est utilisé pour maintenir votre session connectée. Aucun cookie publicitaire ni outil de mesure d’audience n’est utilisé sur ce site.
          </li>
        </ul>
      </section>

      <section>
        <h2>3. Base légale</h2>
        <p>
          Le traitement est fondé sur : l’exécution du contrat (compte, commentaires), l’intérêt légitime (sécurité, modération, preuve), et le cas échéant sur votre consentement pour des usages spécifiques.
        </p>
      </section>

      <section>
        <h2>4. Durée de conservation</h2>
        <ul>
          <li><strong>Données de compte :</strong> [À REMPLIR - ex. tant que le compte est actif, puis X ans après clôture].</li>
          <li><strong>Messages de contact :</strong> [À REMPLIR - ex. 3 ans à compter du dernier contact].</li>
          <li><strong>Adresse IP (formulaire de contact) :</strong> [À REMPLIR - ex. 1 an].</li>
          <li><strong>Cookie de session :</strong> 7 jours (durée technique du cookie).</li>
        </ul>
      </section>

      <section>
        <h2>5. Destinataires</h2>
        <p>
          Les données sont hébergées chez [À REMPLIR - nom de l’hébergeur]. Elles ne sont pas vendues ni cédées à des tiers à des fins commerciales. Elles peuvent être communiquées aux seuls sous-traitants nécessaires au fonctionnement du site (hébergement, envoi d’emails le cas échéant), dans le respect des garanties prévues par la réglementation.
        </p>
      </section>

      <section>
        <h2>6. Transferts hors UE</h2>
        <p>
          [À REMPLIR - ex. « Aucun transfert de données en dehors de l’Union européenne (ou de l’EEE). » Ou, si hébergeur hors UE : préciser les garanties (clauses types, décision d’adéquation, etc.).]
        </p>
      </section>

      <section>
        <h2>7. Vos droits</h2>
        <p>
          Vous disposez d’un droit d’accès, de rectification, d’effacement, à la limitation du traitement, à la portabilité (lorsque c’est applicable) et d’opposition. Pour les exercer, contactez-nous à l’adresse : [À REMPLIR - email].
        </p>
        <p>
          Vous avez également le droit d’introduire une réclamation auprès de la CNIL (Commission nationale de l’informatique et des libertés) : <a href="https://www.cnil.fr" target="_blank" rel="noopener noreferrer">www.cnil.fr</a>.
        </p>
      </section>

      <section>
        <h2>8. Cookies</h2>
        <p>
          Le site utilise un cookie strictement nécessaire à l’authentification (refresh token), sécurisé (httpOnly), d’une durée de 7 jours. Aucun cookie publicitaire ou de mesure d’audience n’est utilisé. Si d’autres cookies sont ajoutés à l’avenir, cette politique sera mise à jour et une information ou un bandeau de consentement sera mis en place si la loi l’exige.
        </p>
      </section>

      <section>
        <h2>9. Sécurité</h2>
        <p>
          Les mesures suivantes sont mises en œuvre : mots de passe hashés (Algorithme Argon2), échanges sécurisés en production (HTTPS), sécurisation des en-têtes HTTP (Helmet), accès à l’administration réservé et protégé.
        </p>
      </section>

      <section>
        <h2>10. Modifications</h2>
        <p>
          Cette politique peut être modifiée. La date de dernière mise à jour sera indiquée en tête de page. Nous vous invitons à la consulter régulièrement.
        </p>
      </section>
    </main>
  );
}

export default PrivacyPolicyPage;
