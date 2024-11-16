document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("thumbnailForm");
  const videoUrlInput = document.getElementById("videoUrl");
  const errorElement = document.getElementById("error");
  const resultSection = document.getElementById("result");
  const loadingElement = document.getElementById("loading");
  const thumbnailImage = document.getElementById("thumbnailImage");
  const downloadLink = document.getElementById("downloadLink");

  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  const fetchThumbnail = async (url) => {
    try {
      loadingElement.classList.remove("hidden");
      const response = await fetch(
        `https://vkrthumb.vercel.app/fetch-thumbnail?url=${encodeURIComponent(url)}`
      );
      const data = await response.json();

      loadingElement.classList.add("hidden");

      if (data.image_data) {
        resultSection.classList.remove("hidden");
        thumbnailImage.src = data.image_data;
        downloadLink.href = data.image_data;
        errorElement.textContent = "";
      } else {
        throw new Error("No thumbnail found for this URL.");
      }
    } catch (error) {
      loadingElement.classList.add("hidden");
      resultSection.classList.add("hidden");
      errorElement.textContent = error.message;
    }
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = videoUrlInput.value.trim();

    if (!isValidUrl(url)) {
      errorElement.textContent = "Please enter a valid URL.";
      resultSection.classList.add("hidden");
      return;
    }

    fetchThumbnail(url);
  });
});
