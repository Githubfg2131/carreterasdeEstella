// eleccion y carga ligera de videos

document.addEventListener("DOMContentLoaded", () => {
  const videoElement = document.getElementById("background-video");

  if (!videoElement) {
    return;
  }

  const videoFiles = [
    { src: "jpg/video1-web.mp4", weight: "light" },
    { src: "jpg/video2-web.mp4", weight: "light" },
    { src: "jpg/video3-web.mp4", weight: "light" },
    { src: "jpg/video4-web.mp4", weight: "light" },
    { src: "jpg/video5-web.mp4", weight: "light" },
    { src: "jpg/video6-web.mp4", weight: "light" },
    { src: "jpg/video7-web.mp4", weight: "light" },
    { src: "jpg/video8-web.mp4", weight: "light" }
  ];

  const connection = navigator.connection || navigator.mozConnection || navigator.webkitConnection;
  const prefersReducedMotion = window.matchMedia("(prefers-reduced-motion: reduce)").matches;
  const smallScreen = window.matchMedia("(max-width: 600px)").matches;
  const saveData = Boolean(connection && connection.saveData);
  const slowConnection = Boolean(connection && /(^|-)2g$|slow-2g/.test(connection.effectiveType || ""));

  if (prefersReducedMotion) {
    return;
  }

  const allowedWeights = saveData || slowConnection || smallScreen
    ? ["light"]
    : ["light", "medium", "heavy"];

  let playlist = shuffle(videoFiles.filter(video => allowedWeights.includes(video.weight)));
  let currentIndex = 0;

  function shuffle(array) {
    for (let i = array.length - 1; i > 0; i--) {
      const j = Math.floor(Math.random() * (i + 1));
      [array[i], array[j]] = [array[j], array[i]];
    }
    return array;
  }

  function loadAndPlayCurrentVideo() {
    const currentVideo = playlist[currentIndex];

    videoElement.classList.remove("visible");
    videoElement.pause();
    videoElement.removeAttribute("src");
    videoElement.load();

    videoElement.src = currentVideo.src;
    videoElement.load();
    videoElement.play()
      .then(() => {
        videoElement.classList.add("visible");
      })
      .catch(() => {
        videoElement.classList.remove("visible");
      });
  }

  function playNextVideo() {
    currentIndex += 1;

    if (currentIndex >= playlist.length) {
      playlist = shuffle([...playlist]);
      currentIndex = 0;
    }

    loadAndPlayCurrentVideo();
  }

  function startVideoWhenBrowserIsReady() {
    if ("requestIdleCallback" in window) {
      window.requestIdleCallback(loadAndPlayCurrentVideo, { timeout: 2500 });
      return;
    }

    setTimeout(loadAndPlayCurrentVideo, 1200);
  }

  videoElement.addEventListener("ended", playNextVideo);

  if (document.readyState === "complete") {
    startVideoWhenBrowserIsReady();
  } else {
    window.addEventListener("load", startVideoWhenBrowserIsReady, { once: true });
  }
});

// menu lateral

const sideMenuToggle = document.querySelector(".side-menu-toggle");
const sliderMenu = document.getElementById("sliderMenu");

function hiddenMenuPosition() {
  return window.matchMedia("(max-width: 1024px)").matches ? "-240px" : "-10%";
}

function isTouchMenu() {
  return window.matchMedia("(max-width: 1024px)").matches;
}

function showMenu() {
  sliderMenu.style.left = "0";
  sliderMenu.classList.add("is-open");
  sideMenuToggle.classList.add("is-open");
  sideMenuToggle.setAttribute("aria-expanded", "true");
}

function hideMenu() {
  sliderMenu.style.left = hiddenMenuPosition();
  sliderMenu.classList.remove("is-open");
  sideMenuToggle.classList.remove("is-open");
  sideMenuToggle.setAttribute("aria-expanded", "false");
}

function toggleMenu() {
  if (sliderMenu.classList.contains("is-open")) {
    hideMenu();
  } else {
    showMenu();
  }
}

if (sideMenuToggle && sliderMenu) {
  sideMenuToggle.addEventListener("mouseenter", () => {
    if (!isTouchMenu()) {
      showMenu();
    }
  });

  sideMenuToggle.addEventListener("click", event => {
    if (isTouchMenu()) {
      event.stopPropagation();
      toggleMenu();
    }
  });

  sliderMenu.addEventListener("mouseleave", () => {
    if (!isTouchMenu()) {
      hideMenu();
    }
  });

  sliderMenu.addEventListener("click", event => {
    event.stopPropagation();
  });

  document.addEventListener("click", () => {
    if (isTouchMenu() && sliderMenu.classList.contains("is-open")) {
      hideMenu();
    }
  });

  window.addEventListener("resize", hideMenu);
}
