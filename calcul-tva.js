(function () {
  const sirenInput = document.getElementById("siren");
  const vatInput = document.getElementById("vat");
  const checkBtn = document.getElementById("checkBtn");
  const resultDiv = document.getElementById("result");

  function log(msg) {
    resultDiv.innerText += "\n" + msg;
  }

  function calculerTVA(siren) {
    const n = parseInt(siren, 10);
    const cle = (12 + 3 * (n % 97)) % 97;
    return "FR" + cle.toString().padStart(2, "0") + siren;
  }

  sirenInput.addEventListener("input", () => {
    const s = sirenInput.value.trim();
    vatInput.value = /^\d{9}$/.test(s) ? calculerTVA(s) : "";
  });

  checkBtn.addEventListener("click", async () => {
    resultDiv.innerText = "🧪 Résultat :";

    const siren = sirenInput.value.trim();
    const vat = vatInput.value;

    if (!/^\d{9}$/.test(siren)) {
      log("❌ SIREN invalide (9 chiffres requis)");
      return;
    }

    log(`✅ SIREN : ${siren}`);
    log(`🔢 TVA générée : ${vat}`);

    // VIES (validation TVA intracom)
    try {
      const res = await fetch("https://ec.europa.eu/taxation_customs/vies/rest-api/check-vat-number", {
        method: "POST",
        headers: { "Content-Type": "application/json" },
        body: JSON.stringify({ countryCode: "FR", vatNumber: vat.slice(2) })
      });
      const data = await res.json();
      log(`📄 Numéro TVA intracom : ${data.valid ? "✅ Valide" : "❌ Invalide"}`);
    } catch (e) {
      log("⚠️ Erreur lors de la vérification VIES");
    }

    // SIRENE (données INSEE)
    try {
      const res = await fetch(`https://entreprise.api.gouv.fr/api/sirene/v3/unites_legales/${siren}`);
      const data = await res.json();
      const u = data.unite_legale;
      log(`🏢 Nom : ${u.nom_raison_sociale || u.denomination}`);
      log(`📆 Création : ${u.date_creation}`);
      log(`⚖️ Forme juridique : ${u.libelle_nature_juridique_unite_legale}`);
      log(`📊 Code APE : ${u.activite_principale}`);
      log(`🟢 Statut : ${u.etat_administratif_unite_legale === "A" ? "Active" : "Cessée"}`);
    } catch (e) {
      log("⚠️ Erreur lors de la requête SIRENE");
    }
  });
})();
