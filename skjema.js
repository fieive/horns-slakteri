// Meld inn dyr: rader for dyr og behandlinger, ja/nei på medisinbruk og trinnvelger.
// Forslag: skjemaet sender ingenting ennå. Mottaker (e-post/Webflow-skjema) avklares med Horns.
(function () {
  var dyrListe = document.getElementById('dyr');
  var mal = document.getElementById('dyr-rad');
  var teller = 0;

  function leggTilDyr() {
    teller += 1;
    var rad = mal.content.firstElementChild.cloneNode(true);
    rad.querySelectorAll('input[type=radio]').forEach(function (r) { r.name = 'dyr_kjonn_' + teller; });
    rad.querySelector('legend').textContent = 'Kjønn, dyr ' + teller;
    dyrListe.appendChild(rad);
    return rad;
  }
  leggTilDyr();
  leggTilDyr();
  document.getElementById('legg-til-dyr').addEventListener('click', function () {
    leggTilDyr().querySelector('input').focus();
  });

  var behandlinger = document.getElementById('behandlinger');
  document.querySelectorAll('input[name=medisin]').forEach(function (r) {
    r.addEventListener('change', function () { behandlinger.hidden = r.value !== 'ja' || !r.checked; });
  });
  document.getElementById('legg-til-behandling').addEventListener('click', function (e) {
    var forste = behandlinger.querySelector('.behandling');
    var ny = forste.cloneNode(true);
    ny.querySelectorAll('input').forEach(function (i) { i.value = ''; });
    e.currentTarget.before(ny);
    ny.querySelector('input').focus();
  });

  // Trinnvelger: markerer trinnet du er i.
  var lenker = document.querySelectorAll('.trinnvelger a');
  var trinn = Array.prototype.map.call(lenker, function (a) { return document.querySelector(a.getAttribute('href')); });
  if ('IntersectionObserver' in window) {
    var obs = new IntersectionObserver(function (oppf) {
      oppf.forEach(function (o) {
        if (!o.isIntersecting) return;
        var i = trinn.indexOf(o.target);
        lenker.forEach(function (a, j) {
          a.classList.toggle('ferdig', j < i);
          a.classList.toggle('aktiv', j === i);
          if (j === i) a.setAttribute('aria-current', 'step'); else a.removeAttribute('aria-current');
        });
      });
    }, { rootMargin: '-45% 0px -50% 0px' });
    trinn.forEach(function (t) { obs.observe(t); });
  }

  var skjema = document.getElementById('innmelding');
  var melding = document.getElementById('melding');
  skjema.addEventListener('submit', function (e) {
    e.preventDefault();
    var mangler = Array.prototype.filter.call(skjema.querySelectorAll('[required]'), function (f) {
      return f.type === 'checkbox' ? !f.checked : !f.value.trim();
    });
    skjema.querySelectorAll('[aria-invalid]').forEach(function (f) { f.removeAttribute('aria-invalid'); });
    if (mangler.length) {
      mangler.forEach(function (f) { f.setAttribute('aria-invalid', 'true'); });
      melding.textContent = 'Fyll ut leverandør og telefon, og kryss av for bekreftelsen.';
      mangler[0].focus();
      return;
    }
    melding.textContent = 'Takk! Dette er et designforslag, så innmeldingen er ikke sendt. Ring 76 05 54 00 for å melde inn dyr i dag.';
  });
})();
