const HOST = new URL(window.location.href);

// Les actions possibles du formulaire
const ACTIONS = {
    Creer: '/api/utilisateur/creer',
    Generer: '/api/utilisateur/modifier/cle',
};

/**
 * Utilise le formulaire pour créer un nouveau utilisateur avec le courriel et le mot de passe
 */
const contacterAPI = async (event) => {
    event.preventDefault();
    const action = event.submitter.getAttribute("data-action") === 'creer' ? ACTIONS.Creer : ACTIONS.Generer;

    const courriel = document.querySelector("#courriel-input").value;
    const password = document.querySelector("#password-input").value;
    const cle_api_span = document.querySelector("#cle-api");

    const resultat = await fetch(HOST.origin + action, {
        method: action === ACTIONS.Creer ? 'post' : 'put',
        headers: {
            'Accept': 'application/json',
            'Content-Type': 'application/json'
        },
        body: JSON.stringify({ courriel: courriel, password: password })
    });

    try {
        const data = await resultat.json();

        if (resultat.status >= 400) {
            const erreur = data.erreur;

            if (erreur) {
                alert(erreur);
            } else {
                alert(resultat.statusText);
            }
        } else {
            const cle_api = data.cle_api;

            if (cle_api != "" && cle_api.length > 0) {
                cle_api_span.innerHTML = cle_api;
            } else {
                throw new Error("La clé reçu n'est pas d'un format valide: " + cle_api);
            }
        }
    } catch (erreur) {
        console.error(erreur);
        alert("Une erreur inconnue est survenue, veuillez réessayer plus tard");
    }
}