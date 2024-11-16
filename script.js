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

  const fetchThumbnail = (url) => {
    const xhr = new XMLHttpRequest();
    const endpoint = `https://vkrthumb.vercel.app/fetch-thumbnail?url=${encodeURIComponent(url)}`;
    
    loadingElement.classList.remove("hidden");

    xhr.open("GET", endpoint, true);
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) { // Request is complete
        loadingElement.classList.add("hidden");

        if (xhr.status === 200) {
          try {
            const data = JSON.parse(xhr.responseText);
            if (data.image_data) {
              resultSection.classList.remove("hidden");
              thumbnailImage.src = data.image_data;
              downloadLink.href = data.image_data;
              errorElement.textContent = "";
            } else {
              throw new Error("No thumbnail found for this URL.");
            }
          } catch (err) {
            handleError(err.message);
          }
        } else {
          handleError(`Error ${xhr.status}: Unable to fetch thumbnail.`);
        }
      }
    };

    xhr.onerror = () => {
      loadingElement.classList.add("hidden");
      handleError("Network error. Please try again later.");
    };

    xhr.send();
  };

  const handleError = (message) => {
    resultSection.classList.add("hidden");
    errorElement.textContent = message;
  };

  form.addEventListener("submit", (e) => {
    e.preventDefault();
    const url = videoUrlInput.value.trim();

    if (!isValidUrl(url)) {
      handleError("Please enter a valid URL.");
      return;
    }

    fetchThumbnail(url);
  });
});
