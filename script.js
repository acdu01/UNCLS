const menuToggle = document.querySelector(".menu-toggle");
const siteNav = document.querySelector(".site-nav");
const navLinks = document.querySelectorAll(".site-nav a");
const revealItems = document.querySelectorAll("[data-reveal]");
const yearTarget = document.querySelector("#current-year");

if (yearTarget) {
  yearTarget.textContent = new Date().getFullYear();
}

if (menuToggle && siteNav) {
  menuToggle.addEventListener("click", () => {
    const isOpen = siteNav.classList.toggle("is-open");
    menuToggle.setAttribute("aria-expanded", String(isOpen));
  });

  navLinks.forEach((link) => {
    link.addEventListener("click", () => {
      siteNav.classList.remove("is-open");
      menuToggle.setAttribute("aria-expanded", "false");
    });
  });
}

if ("IntersectionObserver" in window) {
  const revealObserver = new IntersectionObserver(
    (entries, observer) => {
      entries.forEach((entry) => {
        if (!entry.isIntersecting) {
          return;
        }

        entry.target.classList.add("is-visible");
        observer.unobserve(entry.target);
      });
    },
    {
      threshold: 0.15,
      rootMargin: "0px 0px -32px 0px",
    }
  );

  revealItems.forEach((item) => revealObserver.observe(item));
} else {
  revealItems.forEach((item) => item.classList.add("is-visible"));
}

const supportSearch = document.querySelector("[data-support-search]");

if (supportSearch) {
  const searchInput = supportSearch.querySelector("input[type='search']");
  const searchButton = supportSearch.querySelector("[data-support-search-button]");
  const searchStatus = document.querySelector("[data-support-search-status]");
  const searchTargets = Array.from(document.querySelectorAll("[data-search-target]"));

  const clearSearchState = () => {
    searchTargets.forEach((target) => {
      target.classList.remove("search-match", "search-current", "search-dim");
    });

    if (searchStatus) {
      searchStatus.textContent = "";
      searchStatus.classList.remove("has-results", "has-no-results");
    }
  };

  const findMatches = (query) => {
    const terms = query
      .toLowerCase()
      .split(/\s+/)
      .map((term) => term.trim())
      .filter(Boolean);

    return searchTargets.filter((target) => {
      const haystack = `${target.dataset.searchKeywords || ""} ${target.textContent}`
        .toLowerCase()
        .replace(/\s+/g, " ");

      return terms.every((term) => haystack.includes(term));
    });
  };

  const runSupportSearch = () => {
    const query = searchInput.value.trim();

    clearSearchState();

    if (!query) {
      return;
    }

    const matches = findMatches(query);

    if (!matches.length) {
      if (searchStatus) {
        searchStatus.textContent = `No matching support items found for "${query}".`;
        searchStatus.classList.add("has-no-results");
      }

      return;
    }

    searchTargets.forEach((target) => {
      if (!matches.includes(target)) {
        target.classList.add("search-dim");
      }
    });

    matches.forEach((target, index) => {
      target.classList.add("search-match");

      if (index === 0) {
        target.classList.add("search-current");
      }
    });

    if (searchStatus) {
      const label =
        matches.length === 1
          ? 'Showing 1 matching support item.'
          : `Showing ${matches.length} matching support items.`;

      searchStatus.textContent = label;
      searchStatus.classList.add("has-results");
    }

    matches[0].scrollIntoView({
      behavior: "smooth",
      block: "center",
    });
  };

  if (searchButton) {
    searchButton.addEventListener("click", runSupportSearch);
  }

  if (searchInput) {
    searchInput.addEventListener("keydown", (event) => {
      if (event.key !== "Enter") {
        return;
      }

      event.preventDefault();
      runSupportSearch();
    });

    searchInput.addEventListener("input", () => {
      if (!searchInput.value.trim()) {
        clearSearchState();
      }
    });

    searchInput.addEventListener("search", () => {
      if (searchInput.value.trim()) {
        runSupportSearch();
      } else {
        clearSearchState();
      }
    });
  }
}
