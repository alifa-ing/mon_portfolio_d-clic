
/*
=========================================
    FICHIER JAVASCRIPT PRINCIPAL
    Portfolio de Philippe ALIFA
=========================================
*/

// 1. MESSAGE DE VÉRIFICATION

console.log("Le fichier JavaScript est correctement chargé.");

// 2. ANNÉE AUTOMATIQUE DU COPYRIGHT
const anneeActuelle = new Date().getFullYear();

const elementAnnee = document.getElementById("annee");

if (elementAnnee) {
    elementAnnee.textContent = anneeActuelle;
}

// 3. RÉCUPÉRATION DU FORMULAIRE
const formulaireContact = document.getElementById("contactForm");

// Clé utilisée pour enregistrer les messages
const CLE_MESSAGES = "messagesPortfolio";

// 4. FONCTIONS DE VALIDATION
// Afficher une erreur sous un champ
function afficherErreur(idErreur, message, idChamp) {
    const elementErreur = document.getElementById(idErreur);
    const elementChamp = document.getElementById(idChamp);

    if (elementErreur) {
        elementErreur.textContent = message;
    }

    if (elementChamp) {
        elementChamp.classList.add("input-error");
    }
}

// Supprimer une erreur
function supprimerErreur(idErreur, idChamp) {
    const elementErreur = document.getElementById(idErreur);
    const elementChamp = document.getElementById(idChamp);

    if (elementErreur) {
        elementErreur.textContent = "";
    }

    if (elementChamp) {
        elementChamp.classList.remove("input-error");
    }
}

// Supprimer toutes les erreurs du formulaire
function supprimerToutesLesErreurs() {
    supprimerErreur("nomErreur", "nom");
    supprimerErreur("emailErreur", "email");
    supprimerErreur("objetErreur", "objet");
    supprimerErreur("messageErreur", "message");
}

// 5. ENREGISTREMENT DU FORMULAIRE
if (formulaireContact) {

    formulaireContact.addEventListener("submit", function (event) {

        // Empêcher le rechargement de la page
        event.preventDefault();

        // Supprimer les anciennes erreurs
        supprimerToutesLesErreurs();

        const nom = document.getElementById("nom").value.trim();
        const email = document.getElementById("email").value.trim();
        const objet = document.getElementById("objet").value.trim();
        const message = document.getElementById("message").value.trim();

        let formulaireValide = true;

        // VALIDATION DU NOM
        if (nom === "") {
            afficherErreur(
                "nomErreur",
                "Veuillez saisir votre nom.",
                "nom"
            );

            formulaireValide = false;

        } else if (nom.length < 2) {
            afficherErreur(
                "nomErreur",
                "Le nom doit contenir au moins 2 caractères.",
                "nom"
            );

            formulaireValide = false;
        }

        // VALIDATION DE L'EMAIL
        const expressionEmail = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;

        if (email === "") {
            afficherErreur(
                "emailErreur",
                "Veuillez saisir votre adresse email.",
                "email"
            );

            formulaireValide = false;

        } else if (!expressionEmail.test(email)) {
            afficherErreur(
                "emailErreur",
                "Veuillez saisir une adresse email valide.",
                "email"
            );

            formulaireValide = false;
        }

        // VALIDATION DE L'OBJET
        if (objet === "") {
            afficherErreur(
                "objetErreur",
                "Veuillez saisir l'objet du message.",
                "objet"
            );

            formulaireValide = false;
        }

        // VALIDATION DU MESSAGE
        if (message === "") {
            afficherErreur(
                "messageErreur",
                "Veuillez saisir votre message.",
                "message"
            );

            formulaireValide = false;

        } else if (message.length < 10) {
            afficherErreur(
                "messageErreur",
                "Le message doit contenir au moins 10 caractères.",
                "message"
            );

            formulaireValide = false;
        }

        // Arrêter le traitement si le formulaire est invalide
        if (!formulaireValide) {
            return;
        }

        // CRÉATION DU MESSAGE
        const nouveauMessage = {
            id: Date.now(),
            nom: nom,
            email: email,
            objet: objet,
            message: message,
            date: new Date().toLocaleString("fr-FR"),
            lu: false
        };

        // RÉCUPÉRATION DES ANCIENS MESSAGES
        let messages = JSON.parse(
            localStorage.getItem(CLE_MESSAGES)
        ) || [];

        // Ajouter le nouveau message au tableau
        messages.push(nouveauMessage);

        // Enregistrer les messages dans le navigateur
        localStorage.setItem(
            CLE_MESSAGES,
            JSON.stringify(messages)
        );

        // MESSAGE DE CONFIRMATION
        const messageResultat = document.getElementById("formMessage");

        if (messageResultat) {
            messageResultat.textContent =
                "Votre message a été enregistré avec succès.";

            messageResultat.className = "form-message success";
        }

        // Vider les champs du formulaire
        formulaireContact.reset();

        console.log("Nouveau message enregistré :", nouveauMessage);
    });
}

// 6. AFFICHAGE DES MESSAGES
const zoneMessages = document.getElementById("listeMessages");

if (zoneMessages) {

    afficherMessages();

    function afficherMessages() {

        const messages = JSON.parse(
            localStorage.getItem(CLE_MESSAGES)
        ) || [];

        // Effacer le contenu actuel
        zoneMessages.innerHTML = "";

        // Vérifier s'il existe des messages
        if (messages.length === 0) {

            zoneMessages.innerHTML = `
                <p class="form-message">
                    Aucun message reçu pour le moment.
                </p>
            `;

            return;
        }

        // Afficher les messages du plus récent au plus ancien
        messages.reverse().forEach(function (message) {

            const carteMessage = document.createElement("article");

            carteMessage.className = "message-card";

            carteMessage.innerHTML = `
                <div class="message-card-header">
                    <h3>${echapperHTML(message.objet)}</h3>
                    <span>${echapperHTML(message.date)}</span>
                </div>

                <p>
                    <strong>Nom :</strong>
                    ${echapperHTML(message.nom)}
                </p>

                <p>
                    <strong>Email :</strong>
                    ${echapperHTML(message.email)}
                </p>

                <p>
                    <strong>Message :</strong><br>
                    ${echapperHTML(message.message)}
                </p>

                <button
                    class="btn btn-danger"
                    data-id="${message.id}">
                    Supprimer
                </button>
            `;

            zoneMessages.appendChild(carteMessage);
        });

        // Ajouter les événements aux boutons Supprimer
        const boutonsSuppression = document.querySelectorAll(
            ".message-card .btn-danger"
        );

        boutonsSuppression.forEach(function (bouton) {

            bouton.addEventListener("click", function () {

                const idMessage = Number(bouton.dataset.id);

                supprimerMessage(idMessage);
            });
        });
    }

    // 7. SUPPRIMER UN MESSAGE
    function supprimerMessage(idMessage) {

        const confirmation = confirm(
            "Voulez-vous vraiment supprimer ce message ?"
        );

        if (!confirmation) {
            return;
        }

        let messages = JSON.parse(
            localStorage.getItem(CLE_MESSAGES)
        ) || [];

        messages = messages.filter(function (message) {
            return message.id !== idMessage;
        });

        localStorage.setItem(
            CLE_MESSAGES,
            JSON.stringify(messages)
        );

        afficherMessages();
    }
}

// 8. SUPPRIMER LES BALISES HTML DANGEREUSES
function echapperHTML(texte) {

    const element = document.createElement("div");

    element.textContent = texte;

    return element.innerHTML;
}