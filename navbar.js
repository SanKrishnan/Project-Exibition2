document.addEventListener("DOMContentLoaded", () => {
  const sideBar = document.querySelector(".side-bar");
  const profile = document.querySelector(".profile");

  document.getElementById("menu-btn")?.addEventListener("click", () => {
      sideBar?.classList.toggle("active");
  });

  document.getElementById("close-btn")?.addEventListener("click", () => {
      sideBar?.classList.remove("active");
  });
});
