document.getElementById("uploadForm").addEventListener("submit", async function (e) {
    e.preventDefault();
    const file = document.getElementById("fileInput").files[0];
    const formData = new FormData();
    formData.append("file", file);
  
    const resultDiv = document.getElementById("result");
    resultDiv.innerHTML = '<div class="spinner-border text-danger" role="status"></div>';
  
    const response = await fetch("/predict", {
      method: "POST",
      body: formData,
    });
  
    const data = await response.json();
    if (data.error) {
      resultDiv.innerHTML = `<p class="text-danger">Error: ${data.error}</p>`;
    } else {
      resultDiv.innerHTML = `<p class="text-success">${data.result}</p><p class="text-muted">Confidence: ${data.confidence}</p>`;
    }
  });
  