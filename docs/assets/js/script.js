/* ==========================================================================
   MARTHA Y. SAMBO — ATTORNEY WEBSITE — shared behaviour
   ========================================================================== */
(function () {
  "use strict";

  /* ---------- Header: solid state on scroll ---------- */
  var header = document.querySelector(".site-header");
  var lastY = window.scrollY;
  function onScroll() {
    if (!header) return;
    if (window.scrollY > 40) header.classList.add("scrolled");
    else header.classList.remove("scrolled");
    lastY = window.scrollY;
  }
  document.addEventListener("scroll", onScroll, { passive: true });
  onScroll();

  /* ---------- Mobile menu ---------- */
  var toggle = document.querySelector(".nav-toggle");
  var menu = document.querySelector(".mobile-menu");
  if (toggle && menu) {
    toggle.addEventListener("click", function () {
      var open = toggle.getAttribute("aria-expanded") === "true";
      toggle.setAttribute("aria-expanded", String(!open));
      menu.classList.toggle("open", !open);
      document.body.style.overflow = !open ? "hidden" : "";
    });
    menu.querySelectorAll("a").forEach(function (a) {
      a.addEventListener("click", function () {
        toggle.setAttribute("aria-expanded", "false");
        menu.classList.remove("open");
        document.body.style.overflow = "";
      });
    });
  }

  /* ---------- Side rail dot nav: highlight active section (index page) ---------- */
  var railLinks = document.querySelectorAll(".rail-nav a");
  if (railLinks.length) {
    var targets = Array.prototype.map.call(railLinks, function (a) {
      return document.querySelector(a.getAttribute("href"));
    }).filter(Boolean);

    var io = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry) {
        var id = "#" + entry.target.id;
        var link = document.querySelector('.rail-nav a[href="' + id + '"]');
        if (!link) return;
        if (entry.isIntersecting) {
          railLinks.forEach(function (l) { l.classList.remove("active"); });
          link.classList.add("active");
        }
      });
    }, { rootMargin: "-45% 0px -45% 0px", threshold: 0 });

    targets.forEach(function (t) { io.observe(t); });
  }

  /* ---------- Scroll reveal (one restrained pattern) ---------- */
  var revealEls = document.querySelectorAll("[data-reveal]");
  if (revealEls.length && "IntersectionObserver" in window) {
    var revealIO = new IntersectionObserver(function (entries) {
      entries.forEach(function (entry, i) {
        if (entry.isIntersecting) {
          setTimeout(function () { entry.target.classList.add("in"); }, i * 40);
          revealIO.unobserve(entry.target);
        }
      });
    }, { threshold: 0.15 });
    revealEls.forEach(function (el) { revealIO.observe(el); });
  } else {
    revealEls.forEach(function (el) { el.classList.add("in"); });
  }

  /* ---------- Consultation form ---------- */
  var form = document.getElementById("consult-form");
  if (form) {
    var status = document.getElementById("form-status");
    form.addEventListener("submit", function (e) {
      e.preventDefault();
      var required = form.querySelectorAll("[required]");
      var valid = true;
      required.forEach(function (field) {
        if (!field.value.trim()) valid = false;
      });
      var email = form.querySelector('[name="email"]');
      if (email && email.value && !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email.value)) {
        valid = false;
      }

      status.classList.remove("ok", "err");
      if (!valid) {
        status.textContent = "Please complete all required fields with a valid email address before sending.";
        status.classList.add("show", "err");
        return;
      }

      /* No backend is connected in this build — this simulates a
         successful hand-off so the interaction can be reviewed end to end.
         Wire this up to your mail service, form endpoint, or CRM. */
      var submitBtn = form.querySelector('button[type="submit"]');
      var originalText = submitBtn.textContent;
      submitBtn.textContent = "Sending…";
      submitBtn.disabled = true;

      setTimeout(function () {
        status.textContent = "Thank you — your message has been received. Martha or a member of her team will be in touch within one business day.";
        status.classList.add("show", "ok");
        form.reset();
        submitBtn.textContent = originalText;
        submitBtn.disabled = false;
      }, 900);
    });
  }

  /* ---------- Footer year ---------- */
  var yearEls = document.querySelectorAll("[data-year]");
  yearEls.forEach(function (el) { el.textContent = new Date().getFullYear(); });

})();
