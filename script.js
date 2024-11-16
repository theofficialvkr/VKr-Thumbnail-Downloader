  document.addEventListener("DOMContentLoaded", () => {
  const form = document.getElementById("thumbnailForm");
  const videoUrlInput = document.getElementById("videoUrl");
  const errorElement = document.getElementById("error");
  const resultSection = document.getElementById("result");
  const loadingElement = document.getElementById("loading");
  const thumbnailImage = document.getElementById("thumbnailImage");
  const downloadLink = document.getElementById("downloadLink");

  // Function to validate URL format
  const isValidUrl = (url) => {
    try {
      new URL(url);
      return true;
    } catch {
      return false;
    }
  };

  // Function to handle errors and update the error message display
  const handleError = (message) => {
    resultSection.classList.add("hidden");
    errorElement.textContent = message;
  };

  // AJAX request to fetch the thumbnail
  const fetchThumbnail = (url) => {
    const xhr = new XMLHttpRequest();
    const endpoint = `https://vkrdownloader.xyz/server/thumb.php?vkr=${encodeURIComponent(url)}`;

    // Show loading spinner
    loadingElement.classList.remove("hidden");

    xhr.open("GET", endpoint, true);
    
    // Set up the request callback for state changes
    xhr.onreadystatechange = () => {
      if (xhr.readyState === 4) { // Request completed
        loadingElement.classList.add("hidden");

        if (xhr.status === 200) { // Success
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
            console.error("Error parsing JSON response:", err);
            handleError("Failed to parse thumbnail data.");
          }
        } else {
          console.error(`Error ${xhr.status}: ${xhr.statusText}`);
          handleError(`Error ${xhr.status}: Unable to fetch thumbnail.`);
        }
      }
    };

    // Handle network or other errors
    xhr.onerror = () => {
      loadingElement.classList.add("hidden");
      console.error("Network error: ", xhr.statusText);
      handleError("Network error. Please try again later.");
    };

    // Send the request
    xhr.send();
  };

  // Form submit event listener
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
