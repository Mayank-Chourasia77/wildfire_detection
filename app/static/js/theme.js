document.addEventListener("DOMContentLoaded", () => {
  const toggleButton = document.getElementById("theme-toggle");
  const body = document.body;

  // Load theme preference from localStorage
  if (localStorage.getItem("darkMode") === "true") {
    body.classList.add("dark-mode");
    toggleButton.textContent = "Light Mode";  // Set button text to "Light Mode" if dark mode is enabled
  } else {
    body.classList.remove("dark-mode");
    toggleButton.textContent = "Dark Mode";  // Set button text to "Dark Mode" if light mode is enabled
  }

  // Toggle theme on button click
  toggleButton?.addEventListener("click", () => {
    body.classList.toggle("dark-mode");
    const isDark = body.classList.contains("dark-mode");
    toggleButton.textContent = isDark ? "Light Mode" : "Dark Mode";  // Update button text based on theme
    localStorage.setItem("darkMode", isDark);  // Save theme preference to localStorage
  });
});
