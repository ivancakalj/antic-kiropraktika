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

  // ---------- reveal on scroll ----------
  var io = "IntersectionObserver" in window ? new IntersectionObserver(function (es) {
    es.forEach(function (e) { if (e.isIntersecting) { e.target.classList.add("in"); io.unobserve(e.target); } });
  }, { threshold: 0.12 }) : null;
  document.querySelectorAll(".reveal").forEach(function (el) { io ? io.observe(el) : el.classList.add("in"); });

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
      var c = cards[idx], gap = 26;
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
    document.querySelectorAll(".testi__ctrl [data-dir]").forEach(function (b) {
      b.addEventListener("click", function () {
        idx = (idx + Number(b.dataset.dir) + cards.length) % cards.length;
        layout();
      });
    });
    window.addEventListener("resize", layout);
    window.addEventListener("load", layout);
    layout();
  }

  // ---------- videos: thumbnails, play inline on click ----------
  document.querySelectorAll(".vid[data-yt]").forEach(function (v) {
    var id = v.dataset.yt, thumb = v.querySelector(".vid__thumb");
    thumb.style.backgroundImage = "url(https://img.youtube.com/vi/" + id + "/hqdefault.jpg)";
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

  // ---------- footer year ----------
  var y = document.getElementById("y");
  if (y) y.textContent = new Date().getFullYear();
})();
