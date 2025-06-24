document.getElementById("siren").addEventListener("input", function () {
  const siren = this.value.trim();
  if (/^\d{9}$/.test(siren)) {
    const cle = (12 + 3 * (parseInt(siren) % 97)) % 97;
    document.getElementById("tva").value = "FR" + cle.toString().padStart(2, '0') + siren;
  } else {
    document.getElementById("tva").value = "";
  }
});

document.getElementById("btn").addEventListener("click", async () => {
  const siren = document.getElementById("siren").value.trim();
  const result = document.getElementById("result");
  result.textContent = "🧪 Recherche en cours...";
  const res = await fetch(`https://TON_BACKEND_PROXY/api/verifier?siren=${siren}`);
  const data = await res.json();
  result.textContent = JSON.stringify(data, null, 2);
});
