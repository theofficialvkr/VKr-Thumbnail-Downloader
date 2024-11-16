      document.addEventListener("DOMContentLoaded", () => {
      const form = document.getElementById("thumbnailForm");
      const videoUrlInput = document.getElementById("videoUrl");
      const errorElement = document.getElementById("error");
      const loadingElement = document.getElementById("loading");
      const popup = document.getElementById("popup");
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
        errorElement.textContent = message;
        errorElement.style.display = "block";
        loadingElement.style.opacity = "0";
      };

      // Function to handle loading state and show spinner
      const showLoading = () => {
        loadingElement.style.opacity = "1";
        errorElement.style.display = "none";
      };

      // Function to fetch the thumbnail and display it
      const fetchThumbnail = async (url) => {
        showLoading();

        try {
          // Replace this with your actual API call or scraping logic
          const response = await fetch(`https://vkrdownloader.xyz/server/thumb.php?vkr=${encodeURIComponent(url)}`);
          const data = await response.json();

          if (data && data.image_data) {
            // Set thumbnail preview and display popup
            thumbnailImage.src = data.image_data;
            downloadLink.href = data.image_data;

            // Dynamically rename file based on title or video URL
            const fileName = data.title ? `${data.title}.jpg` : `${url.split('/').pop()}.jpg`;
            downloadLink.setAttribute('download', fileName);

            // Show popup with the fetched thumbnail
            popup.classList.add("active");
          } else {
            handleError("Thumbnail not found or invalid URL.");
          }
        } catch (error) {
          handleError("Error fetching the thumbnail. Please try again.");
          console.error(error);
        }
      };

      // Event listener for form submission
      form.addEventListener("submit", (event) => {
        event.preventDefault();
        const url = videoUrlInput.value.trim();

        if (isValidUrl(url)) {
          fetchThumbnail(url);
        } else {
          handleError("Please enter a valid URL.");
        }
      });

      // Close popup on clicking outside the popup content
      popup.addEventListener("click", (event) => {
        if (event.target === popup) {
          popup.classList.remove("active");
          loadingElement.style.opacity = "0";
        }
      });
    });
