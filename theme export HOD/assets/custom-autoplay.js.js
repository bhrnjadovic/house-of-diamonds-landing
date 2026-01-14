<script>
  document.addEventListener("DOMContentLoaded", function () {
      const container = document.getElementById("JotFormIFrame-250617831878871");
      if (!container) return;

      function autoplayVideos() {
          const videos = container.querySelectorAll("video");
          videos.forEach((video) => {
              video.muted = true; // Required for autoplay
              video.play().catch((err) => console.warn("Autoplay failed:", err));
          });
      }

      autoplayVideos();

      // Detect new videos added dynamically
      const observer = new MutationObserver(autoplayVideos);
      observer.observe(container, { childList: true, subtree: true });
  });
</script>
