// indexx.js — moved scripts from your HTML, unobtrusive and cross-browser friendly

// Smooth scroll behavior (kept)
document.documentElement.style.scrollBehavior = "smooth";

// Navigation + section intersection highlighting
(function () {
  const sectionIds = ["about", "resume", "projects", "case-studies", "contact"];
  const sections = sectionIds
    .map((id) => document.getElementById(id))
    .filter(Boolean);

  const navLinks = Array.from(document.querySelectorAll("aside nav a")).filter(
    (a) => a.getAttribute("href") && a.getAttribute("href").startsWith("#")
  );

  function setActiveLink(id) {
    navLinks.forEach((a) => {
      const href = a.getAttribute("href").slice(1);
      if (href === id) {
        a.classList.add("bg-primary/10", "text-primary");
        a.setAttribute("aria-current", "true");
      } else {
        a.classList.remove("bg-primary/10", "text-primary");
        a.removeAttribute("aria-current");
      }
    });
  }

  if ("IntersectionObserver" in window) {
    const io = new IntersectionObserver(
      (entries) => {
        let visible = entries
          .filter((e) => e.isIntersecting)
          .sort((a, b) => b.intersectionRatio - a.intersectionRatio)[0];
        if (visible && visible.target && visible.target.id) {
          setActiveLink(visible.target.id);
        }
      },
      {
        threshold: [0.25, 0.5, 0.75],
        root: null,
        rootMargin: "-40% 0px -40% 0px",
      }
    );
    sections.forEach((s) => io.observe(s));
  } else {
    // fallback: basic scroll listener for older browsers
    window.addEventListener(
      "scroll",
      () => {
        const inView = sections.find((s) => {
          const rect = s.getBoundingClientRect();
          return rect.top < window.innerHeight * 0.6 && rect.bottom > 40;
        });
        setActiveLink(inView ? inView.id : "about");
      },
      { passive: true }
    );
  }

  // on load set current
  window.addEventListener("load", () => {
    const inView = sections.find((s) => {
      const rect = s.getBoundingClientRect();
      return rect.top < window.innerHeight * 0.6 && rect.bottom > 40;
    });
    setActiveLink(inView ? inView.id : "about");
  });

  navLinks.forEach((a) =>
    a.addEventListener("click", (e) => {
      const id = a.getAttribute("href").slice(1);
      setActiveLink(id);
    })
  );
})();

// Contact form -> mailto behaviour
(function () {
  // set recipient here
  const recipient = "you@yourdomain.com";
  const form = document.getElementById("contactForm");
  if (!form) return;

  form.addEventListener("submit", function (e) {
    e.preventDefault();
    const name = document.getElementById("name").value.trim();
    const email = document.getElementById("email").value.trim();
    const message = document.getElementById("message").value.trim();
    const subject = `Website inquiry from ${name || "Website Visitor"}`;
    const bodyLines = [
      `Name: ${name}`,
      `Email: ${email}`,
      "",
      "Message:",
      message,
    ];
    const body = encodeURIComponent(bodyLines.join("\n"));
    const mailto = `mailto:${encodeURIComponent(
      recipient
    )}?subject=${encodeURIComponent(subject)}&body=${body}`;

    // Use location.href to open default mail client
    window.location.href = mailto;
  });
})();
