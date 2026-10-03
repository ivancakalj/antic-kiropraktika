(function () {
  var NS = "http://www.w3.org/2000/svg";

  // ---------- decorative vertebrae (spine) drawn into SVG groups ----------
  function vertebra(g, x, y, w, h, rot, fill, accent) {
    var grp = document.createElementNS(NS, "g");
    grp.setAttribute("transform", "translate(" + x + " " + y + ") rotate(" + rot + ")");
    var body = document.createElementNS(NS, "rect");
    body.setAttribute("x", -w / 2); body.setAttribute("y", -h / 2);
    body.setAttribute("width", w); body.setAttribute("height", h);
    body.setAttribute("rx", h / 2.4);
    body.setAttribute("fill", fill);
    grp.appendChild(body);
    var wing = document.createElementNS(NS, "path");
    wing.setAttribute("d", "M" + (-w / 2) + " 0 L" + (-w * 0.9) + " " + (-h * 0.2) + " M" + (w / 2) + " 0 L" + (w * 0.9) + " " + (-h * 0.2));
    wing.setAttribute("stroke", fill); wing.setAttribute("stroke-width", h / 3); wing.setAttribute("stroke-linecap", "round");
    grp.appendChild(wing);
    if (accent) {
      var disc = document.createElementNS(NS, "rect");
      disc.setAttribute("x", -w / 2.2); disc.setAttribute("y", h / 2 + 1);
      disc.setAttribute("width", w / 1.1); disc.setAttribute("height", h / 5);
      disc.setAttribute("rx", 3); disc.setAttribute("fill", accent);
      grp.appendChild(disc);
    }
    g.appendChild(grp);
  }

  var v1 = document.getElementById("vertebrae");
  if (v1) for (var i = 0; i < 17; i++) {
    var t = i / 16, y = 40 + t * 820;
    vertebra(v1, 200 + Math.sin(t * Math.PI * 2) * 22, y, 62 + t * 34, 26 + t * 10, Math.cos(t * 6) * 6, "url(#sp)");
  }
  var v2 = document.getElementById("vert2");
  if (v2) for (var j = 0; j < 15; j++) {
    var t2 = j / 14;
    vertebra(v2, 70 + Math.sin(t2 * 3.2) * 50, 30 + t2 * 840, 56 + t2 * 26, 24 + t2 * 8, -25 + t2 * 30, "rgba(236,240,228,.82)", "rgba(196,92,24,.75)");
  }
  var v3 = document.getElementById("vert3");
  if (v3) for (var k = 0; k < 22; k++) {
    var t3 = k / 21;
    vertebra(v3, 40 + t3 * 820, 80 + Math.sin(t3 * Math.PI * 1.6) * 50, 26 + Math.sin(t3 * Math.PI) * 14, 60 + t3 * 40, 90 + Math.cos(t3 * 5) * 10, "#cfe5c4", "#c75b17");
  }

  // ---------- mobile nav ----------
  var nav = document.querySelector(".nav"), toggle = document.querySelector(".nav__toggle");
  if (toggle) {
    toggle.addEventListener("click", function () {
      var open = nav.classList.toggle("open");
      toggle.setAttribute("aria-expanded", open);
      document.body.style.overflow = open ? "hidden" : "";
    });
    nav.querySelectorAll(".nav__links a").forEach(function (a) {
      a.addEventListener("click", function () {
        nav.classList.remove("open"); toggle.setAttribute("aria-expanded", false); document.body.style.overflow = "";
      });
    });
  }

  var reduce = window.matchMedia && window.matchMedia("(prefers-reduced-motion: reduce)").matches;

  // ---------- fixed nav: solid on scroll, highlight current section ----------
  var links = Array.prototype.slice.call(document.querySelectorAll(".nav__links a"));
  var targets = links.map(function (a) { return document.querySelector(a.getAttribute("href")); });
  function onScroll() {
    var y = window.scrollY;
    nav.classList.toggle("scrolled", y > 40);
    var cur = -1;
    targets.forEach(function (t, n) { if (t && t.getBoundingClientRect().top < 160) cur = n; });
    links.forEach(function (a, n) { a.classList.toggle("active", n === cur); });
  }

  // ---------- reveal on scroll (only what starts below the fold is hidden) ----------
  var groups = [
    [".services__grid .card", ""], [".team__grid .member", ""], [".famous__grid figure", "zoom"],
    [".videos__grid .vid", ""], [".about__img--left", "from-left"], [".about__img--right", "from-right"],
    [".book__cover", "from-left"], [".stats__lime", "from-left"], [".stats__panel", "zoom"]
  ];
  groups.forEach(function (g) {
    document.querySelectorAll(g[0]).forEach(function (el, n) {
      if (g[1]) el.classList.add(g[1]);
      el.style.setProperty("--d", (n % 4) * 0.12 + "s");
    });
  });
  var io = "IntersectionObserver" in window && !reduce ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.remove("pre"); io.unobserve(e.target); } });
  }, { threshold: 0.12, rootMargin: "0px 0px -40px 0px" }) : null;
  if (io) document.querySelectorAll(".reveal").forEach(function (el) {
    if (el.getBoundingClientRect().top > window.innerHeight * 0.92) { el.classList.add("pre"); io.observe(el); }
  });

  // ---------- count-up numbers ----------
  var cio = "IntersectionObserver" in window && !reduce ? new IntersectionObserver(function (es) {
    es.forEach(function (e) {
      if (!e.isIntersecting) return;
      cio.unobserve(e.target);
      var el = e.target, to = Number(el.dataset.count), suf = el.dataset.suffix || "", t0 = null;
      function step(t) {
        if (!t0) t0 = t;
        var p = Math.min(1, (t - t0) / 1600), v = Math.round(to * (1 - Math.pow(1 - p, 3)));
        el.textContent = v + suf;
        if (p < 1) requestAnimationFrame(step);
      }
      requestAnimationFrame(step);
    });
  }, { threshold: 0.6 }) : null;
  if (cio) document.querySelectorAll("[data-count]").forEach(function (el) { cio.observe(el); });

  // ---------- gentle parallax on decorative spines ----------
  var para = [[document.querySelector(".hero__spine"), 0.12], [document.querySelector(".services__spine"), -0.06]];
  var ticking = false;
  function parallax() {
    para.forEach(function (p) {
      if (!p[0]) return;
      var r = p[0].parentElement.getBoundingClientRect();
      p[0].style.transform = "translateY(" + (r.top * p[1]).toFixed(1) + "px)";
    });
    ticking = false;
  }
  window.addEventListener("scroll", function () {
    onScroll();
    if (!reduce && !ticking) { ticking = true; requestAnimationFrame(parallax); }
  }, { passive: true });
  onScroll();

  // ---------- framed images: blurred copy of the photo fills the frame ----------
  document.querySelectorAll(".fit img").forEach(function (img) {
    img.parentElement.style.setProperty("--bg-img", 'url("' + img.src + '")');
  });

  // ---------- marquee: duplicate content for seamless loop ----------
  document.querySelectorAll(".marquee__track").forEach(function (tr) { tr.innerHTML += tr.innerHTML; });

  // ---------- testimonials slider with tilted cards ----------
  var track = document.querySelector(".testi__track");
  if (track) {
    var cards = Array.prototype.slice.call(track.children);
    var idx = Math.floor(cards.length / 2) - 2;
    var bar = document.querySelector(".progress span");
    function layout() {
      var vw = track.parentElement.clientWidth;
      var c = cards[idx];
      var offset = c.offsetLeft + c.offsetWidth / 2 - vw / 2;
      track.style.transform = "translateX(" + (-offset) + "px)";
      cards.forEach(function (card, n) {
        var d = n - idx;
        card.style.setProperty("--r", d === 0 ? "0deg" : (d * 4) + "deg");
        card.style.setProperty("--y", Math.abs(d) * 18 + "px");
      });
      var w = 100 / cards.length;
      bar.style.width = w + "%";
      bar.style.left = idx * w + "%";
    }
    function go(dir) { idx = (idx + dir + cards.length) % cards.length; layout(); }
    document.querySelectorAll(".testi__ctrl [data-dir]").forEach(function (b) {
      b.addEventListener("click", function () { go(Number(b.dataset.dir)); restart(); });
    });
    // autoplay, paused while hovered
    var timer = null, vp = track.parentElement;
    function restart() { clearInterval(timer); if (!reduce) timer = setInterval(function () { go(1); }, 6000); }
    vp.addEventListener("mouseenter", function () { clearInterval(timer); });
    vp.addEventListener("mouseleave", restart);
    // swipe
    var sx = null;
    vp.addEventListener("touchstart", function (e) { sx = e.touches[0].clientX; }, { passive: true });
    vp.addEventListener("touchend", function (e) {
      if (sx === null) return;
      var dx = e.changedTouches[0].clientX - sx; sx = null;
      if (Math.abs(dx) > 40) { go(dx < 0 ? 1 : -1); restart(); }
    });
    window.addEventListener("resize", layout);
    window.addEventListener("load", layout);
    layout(); restart();
  }

  // ---------- videos: play inline on click ----------
  document.querySelectorAll(".vid[data-yt]").forEach(function (v) {
    var id = v.dataset.yt, thumb = v.querySelector(".vid__thumb");
    v.addEventListener("click", function (e) {
      e.preventDefault();
      var f = document.createElement("iframe");
      f.src = "https://www.youtube.com/embed/" + id + "?autoplay=1";
      f.allow = "autoplay; encrypted-media; picture-in-picture";
      f.allowFullscreen = true;
      f.title = v.querySelector("h4").textContent;
      thumb.replaceWith(f);
    }, { once: true });
  });

  // ---------- accordions: one open at a time, animated height ----------
  document.querySelectorAll("[data-accordion]").forEach(function (group) {
    var items = Array.prototype.slice.call(group.querySelectorAll(":scope > details"));
    function bodyOf(d) { return d.querySelector(".acc__body"); }
    function animate(d, open) {
      var b = bodyOf(d);
      if (d._anim) d._anim.cancel();
      if (open) d.open = true;
      var full = b.scrollHeight;
      if (reduce || !b.animate) { if (!open) d.open = false; return; }
      d.classList.toggle("closing", !open);
      var a = b.animate(
        [{ height: (open ? 0 : full) + "px", opacity: open ? 0 : 1 }, { height: (open ? full : 0) + "px", opacity: open ? 1 : 0 }],
        { duration: 420, easing: "cubic-bezier(.2,.7,.2,1)" }
      );
      d._anim = a;
      a.onfinish = function () { d._anim = null; d.classList.remove("closing"); if (!open) d.open = false; };
    }
    items.forEach(function (d) {
      d.querySelector("summary").addEventListener("click", function (e) {
        e.preventDefault();
        var opening = !d.open || d.classList.contains("closing");
        if (opening) items.forEach(function (o) { if (o !== d && o.open && !o.classList.contains("closing")) animate(o, false); });
        animate(d, opening);
      });
    });
    // enforce single-open initial state
    var first = items.filter(function (d) { return d.open; })[0];
    items.forEach(function (d) { if (d !== first) d.open = false; });
  });

  // ---------- booking modal ("Zakažite termin") ----------
  var T = {
    radomir: { name: "Radomir", dat: "Radomiru", tel: "+381641336483", show: "064 13 36 483" },
    bojan:   { name: "Bojan",   dat: "Bojanu",   tel: "+381606280088", show: "060 62 80 088" },
    ivana:   { name: "Ivana",   dat: "Ivani",    tel: "+381604041177", show: "060 40 41 177" },
    jelena:  { name: "Jelena",  dat: "Jeleni",   tel: "+38169620089",  show: "069 620 089" }
  };
  var dlg = document.getElementById("zakazivanje");
  if (dlg && dlg.showModal) {
    var form = document.getElementById("bm-form"), done = document.getElementById("bm-done");
    var err = document.getElementById("bm-error"), dan = document.getElementById("bm-dan");
    var today = new Date(); today.setMinutes(today.getMinutes() - today.getTimezoneOffset());
    dan.min = today.toISOString().slice(0, 10);

    function openBook(who) {
      if (who && T[who]) document.getElementById("t-" + who).checked = true;
      form.hidden = false; done.hidden = true; err.hidden = true;
      nav.classList.remove("open"); toggle && toggle.setAttribute("aria-expanded", false);
      dlg.showModal(); document.body.classList.add("modal-open");
      setTimeout(function () { document.getElementById("bm-ime").focus(); }, 60);
    }
    function closeBook() {
      if (!dlg.open) return;
      dlg.classList.add("closing");
      setTimeout(function () { dlg.classList.remove("closing"); dlg.close(); }, reduce ? 0 : 280);
    }
    dlg.addEventListener("close", function () { document.body.classList.remove("modal-open"); document.body.style.overflow = ""; });
    dlg.addEventListener("cancel", function (e) { e.preventDefault(); closeBook(); });
    dlg.addEventListener("click", function (e) { if (e.target === dlg) closeBook(); });
    dlg.querySelector("[data-close]").addEventListener("click", closeBook);
    document.querySelectorAll("[data-book]").forEach(function (b) {
      b.addEventListener("click", function (e) { e.preventDefault(); openBook(b.dataset.book); });
    });
    if (location.hash === "#zakazivanje") openBook();

    function fmtDate(v) {
      if (!v) return "";
      var d = new Date(v + "T12:00:00");
      var dani = ["nedelja", "ponedeljak", "utorak", "sreda", "četvrtak", "petak", "subota"];
      return dani[d.getDay()] + ", " + d.getDate() + "." + (d.getMonth() + 1) + "." + d.getFullYear() + ".";
    }
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var ime = document.getElementById("bm-ime"), tel = document.getElementById("bm-tel");
      ime.classList.toggle("invalid", !ime.value.trim());
      var telOk = tel.value.replace(/[^\d+]/g, "").length >= 8;
      tel.classList.toggle("invalid", !telOk);
      if (!ime.value.trim() || !telOk) {
        err.textContent = !ime.value.trim() ? "Upišite ime i prezime." : "Upišite ispravan broj telefona (najmanje 8 cifara).";
        err.hidden = false; (!ime.value.trim() ? ime : tel).focus(); return;
      }
      err.hidden = true;
      var who = T[form.terapeut.value];
      var lines = [
        "Poštovani, želim da zakažem tretman nameštanja kičme i zglobova.",
        "",
        "Ime i prezime: " + ime.value.trim(),
        "Telefon: " + tel.value.trim(),
        "Mesto: " + document.getElementById("bm-mesto").value,
        dan.value ? "Željeni dan: " + fmtDate(dan.value) : "Željeni dan: prvi slobodan termin",
        "Deo dana: " + form.deo.value
      ];
      var opis = document.getElementById("bm-opis").value.trim();
      if (opis) lines.push("Tegobe: " + opis);
      lines.push("", "Hvala!");
      var msg = lines.join("\n"), enc = encodeURIComponent(msg), num = who.tel.replace("+", "");
      document.getElementById("bm-msg").textContent = msg;
      document.getElementById("bm-who").textContent = who.dat;
      document.getElementById("bm-sms").href = "sms:" + who.tel + "?&body=" + enc;
      document.getElementById("bm-viber").href = "viber://chat?number=%2B" + num + "&draft=" + enc;
      document.getElementById("bm-wa").href = "https://wa.me/" + num + "?text=" + enc;
      var call = document.getElementById("bm-call"); call.href = "tel:" + who.tel; call.textContent = who.show;
      form.hidden = true; done.hidden = false;
      dlg.querySelector(".bm").scrollTop = 0;
    });
    document.getElementById("bm-back").addEventListener("click", function () { done.hidden = true; form.hidden = false; });
    document.getElementById("bm-copy").addEventListener("click", function () {
      var b = this, text = document.getElementById("bm-msg").textContent;
      function ok() { b.classList.add("ok"); b.textContent = "Kopirano ✓"; setTimeout(function () { b.classList.remove("ok"); b.textContent = "Kopiraj poruku"; }, 2200); }
      function fallback() {
        var r = document.createRange(); r.selectNodeContents(document.getElementById("bm-msg"));
        var sel = window.getSelection(); sel.removeAllRanges(); sel.addRange(r);
        b.textContent = "Označeno – kopirajte (Ctrl+C)";
      }
      if (navigator.clipboard && navigator.clipboard.writeText) navigator.clipboard.writeText(text).then(ok, fallback);
      else fallback();
    });
  }

  // ---------- footer year ----------
  var y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();
})();
