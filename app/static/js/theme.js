document.addEventListener("DOMContentLoaded", () => {
    const toggleButton = document.getElementById("theme-toggle");
    const body = document.body;
  
    // Load preference
    if (localStorage.getItem("darkMode") === "true") {
      body.classList.add("dark-mode");
      toggleButton.textContent = "Light Mode";
    }
  
    toggleButton?.addEventListener("click", () => {
      body.classList.toggle("dark-mode");
      const isDark = body.classList.contains("dark-mode");
      toggleButton.textContent = isDark ? "Light Mode" : "Dark Mode";
      localStorage.setItem("darkMode", isDark);
    });
  });
  