/**
 * Central shared landing-page section scroll utility.
 * Calculates exact dynamic sticky navbar height + comfortable visual padding gap.
 */
export const scrollToSection = (sectionId) => {
  if (!sectionId || sectionId === "home" || sectionId === "landing") {
    window.scrollTo({ top: 0, behavior: "smooth" });
    return;
  }

  const element = document.getElementById(sectionId);
  if (!element) return;

  const navbar = document.querySelector(".navbar-container") || document.querySelector("nav");
  const navbarHeight = navbar?.offsetHeight || 80;
  const extraGap = 20;

  const targetPosition =
    element.getBoundingClientRect().top +
    window.pageYOffset -
    navbarHeight -
    extraGap;

  window.scrollTo({
    top: targetPosition,
    behavior: "smooth",
  });
};
