(function () {
  const log = function (msg) {
    const debug = document.getElementById("debug");
    if (debug) {
      debug.innerHTML += msg + "<br>";
    }
  };

  log("📦 Script chargé avec succès.");

  function calculerTVA(siren) {
    log("🔢 SIREN reçu : " + siren);
    const sirenInt = parseInt(siren, 10);
    const mod97 = sirenInt % 97;
    log("📏 siren % 97 = " + mod97);
    const cle = (12 + 3 * mod97) % 97;
    log("🔐 Clé calculée : " + cle);
    const tva = "FR" + cle.toString().padStart(2, "0") + siren;
    log("✅ TVA générée : " + tva);
    return tva;
  }

  const inputSiren = document.getElementById("siren");
  const inputTVA = document.getElementById("vat");

  if (!inputSiren || !inputTVA) {
    log("❌ Champs non trouvés dans le DOM.");
    return;
  }

  inputSiren.addEventListener("input", function () {
    const s = inputSiren.value.trim();
    if (/^\d{9}$/.test(s)) {
      inputTVA.value = calculerTVA(s);
    } else {
      inputTVA.value = "";
      log("⚠️ SIREN invalide (9 chiffres requis)");
    }
  });
})();
