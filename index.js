// FormSubmit delivers submissions to this inbox. The first live submission may require email confirmation.
const RECIPIENT_EMAIL = "chiagoziemk@gmail.com";

// Add as many photos or videos as you like. Video entries use type: "video".
const MEMORY_MEDIA = [
  {
    type: "image",
    src: "memories/memory-01.jpg",
    caption: "A moment worth keeping",
    placeholder: "Our favorite little moments",
  },
  {
    type: "image",
    src: "memories/memory-02.jpg",
    caption: "Just being us",
    placeholder: "The days I want to relive",
  },
  {
    type: "image",
    src: "memories/memory-03.jpg",
    caption: "More memories to come",
    placeholder: "My favorite person, always",
  },
  {
    type: "image",
    src: "memories/memory-04.jpg",
    caption: "Another favorite memory",
    placeholder: "A moment to keep close",
  },
  {
    type: "video",
    src: "memories/video-01.mp4",
    caption: "A little moment in motion",
    placeholder: "Our moments in motion",
  },
  {
    type: "video",
    src: "memories/video-02.mp4",
    caption: "Another favorite moment",
    placeholder: "A memory to replay",
  },
  {
    type: "video",
    src: "memories/video-03.mp4",
    caption: "One more moment together",
    placeholder: "More memories in motion",
  },
  {
    type: "video",
    src: "memories/video-04.mp4",
    caption: "A new moment in motion",
    placeholder: "One more memory to replay",
  },
  {
    type: "video",
    src: "memories/video-05.mp4",
    caption: "A little more of us",
    placeholder: "Another moment together",
  },
  {
    type: "video",
    src: "memories/video-06.mp4",
    caption: "A memory to replay",
    placeholder: "Our moments in motion",
  },
  {
    type: "video",
    src: "memories/video-07.mp4",
    caption: "One for the memory book",
    placeholder: "A favorite moment together",
  },
];

const heartField = document.getElementById("heartField");
const stepLabel = document.getElementById("stepLabel");
const screens = [...document.querySelectorAll(".screen")];
const stepNames = {
  welcome: "A note for you",
  memories: "Our memories",
  questions: "A little keepsake",
  receipt: "With all my love",
};
const memoryImage = document.getElementById("memoryImage");
const memoryVideo = document.getElementById("memoryVideo");
const photoPlaceholder = document.getElementById("photoPlaceholder");
const photoCaption = document.getElementById("photoCaption");
const placeholderTitle = document.getElementById("placeholderTitle");
const dotsContainer = document.getElementById("carouselDots");
let slideIndex = 0;
let slideTimer;

function makeHearts() {
  const count = window.matchMedia("(max-width: 600px)").matches ? 17 : 29;
  for (let i = 0; i < count; i += 1) {
    const heart = document.createElement("span");
    heart.className = "floating-heart";
    heart.textContent = Math.random() > 0.5 ? "♥" : "♡";
    heart.style.left = `${Math.random() * 100}%`;
    heart.style.setProperty("--size", `${11 + Math.random() * 21}px`);
    heart.style.setProperty("--duration", `${13 + Math.random() * 17}s`);
    heart.style.setProperty("--delay", `${-Math.random() * 27}s`);
    heart.style.setProperty("--sway", `${-45 + Math.random() * 90}px`);
    heartField.appendChild(heart);
  }
}

function showScreen(screenId) {
  screens.forEach((screen) => {
    const active = screen.id === screenId;
    screen.classList.toggle("active", active);
    screen.setAttribute("aria-hidden", String(!active));
  });
  stepLabel.textContent = stepNames[screenId] || "";
  window.scrollTo({ top: 0, behavior: "smooth" });
  if (screenId === "memories") startCarousel();
  else {
    stopCarousel();
    memoryVideo.pause();
  }
}

document.querySelectorAll("[data-next]").forEach((button) => {
  button.addEventListener("click", () => showScreen(button.dataset.next));
});

function paintSlide() {
  const media = MEMORY_MEDIA[slideIndex];
  if (!media) return;
  memoryImage.classList.remove("loaded");
  memoryImage.onload = null;
  memoryImage.onerror = null;
  memoryVideo.classList.remove("loaded");
  memoryVideo.onloadeddata = null;
  memoryVideo.onerror = null;
  memoryVideo.onended = null;
  memoryVideo.pause();
  memoryVideo.muted = false;
  memoryVideo.loop = false;
  memoryVideo.removeAttribute("src");
  memoryVideo.load();
  memoryImage.removeAttribute("src");
  memoryImage.hidden = media.type === "video";
  memoryVideo.hidden = media.type !== "video";
  memoryImage.alt = media.caption;
  photoCaption.textContent = media.caption;
  placeholderTitle.textContent = media.placeholder || "A favorite memory";
  photoPlaceholder.hidden = false;
  if (media.type === "video") {
    memoryVideo.onended = () => {
      if (document.getElementById("memories").classList.contains("active")) {
        moveSlide(1);
      }
    };
    memoryVideo.onloadeddata = () => {
      photoPlaceholder.hidden = true;
      memoryVideo.classList.add("loaded");
      memoryVideo.play().catch(() => {});
    };
    memoryVideo.onerror = () => {
      memoryVideo.removeAttribute("src");
      memoryVideo.classList.remove("loaded");
      photoPlaceholder.hidden = false;
      slideTimer = window.setTimeout(() => moveSlide(1), 5200);
    };
    memoryVideo.src = media.src;
    memoryVideo.load();
  } else {
    memoryImage.onload = () => {
      photoPlaceholder.hidden = true;
      memoryImage.classList.add("loaded");
    };
    memoryImage.onerror = () => {
      memoryImage.removeAttribute("src");
      memoryImage.classList.remove("loaded");
      photoPlaceholder.hidden = false;
    };
    memoryImage.src = media.src;
  }
  [...dotsContainer.children].forEach((dot, index) => {
    dot.classList.toggle("current", index === slideIndex);
    dot.setAttribute("aria-current", String(index === slideIndex));
  });
}

function moveSlide(amount) {
  slideIndex =
    (slideIndex + amount + MEMORY_MEDIA.length) % MEMORY_MEDIA.length;
  paintSlide();
  startCarousel();
}

function startCarousel() {
  stopCarousel();
  const currentMedia = MEMORY_MEDIA[slideIndex];
  if (currentMedia?.type === "video") return;
  const duration = 5200;
  slideTimer = window.setTimeout(() => moveSlide(1), duration);
}

function stopCarousel() {
  window.clearTimeout(slideTimer);
}

function renderDots() {
  dotsContainer.replaceChildren();
  MEMORY_MEDIA.forEach((media, index) => {
    const dot = document.createElement("button");
    dot.className = `dot${index === slideIndex ? " current" : ""}`;
    dot.type = "button";
    dot.setAttribute(
      "aria-label",
      `Show memory ${index + 1}: ${media.caption}`,
    );
    dot.setAttribute("aria-current", String(index === slideIndex));
    dot.addEventListener("click", () => {
      slideIndex = index;
      paintSlide();
      startCarousel();
    });
    dotsContainer.appendChild(dot);
  });
}

renderDots();
document
  .getElementById("previousSlide")
  .addEventListener("click", () => moveSlide(-1));
document
  .getElementById("nextSlide")
  .addEventListener("click", () => moveSlide(1));
paintSlide();

const form = document.getElementById("relationshipForm");
const submitButton = document.getElementById("submitAnswers");
const formError = document.getElementById("formError");
const answerRecap = document.getElementById("answerRecap");
const receiptMessage = document.getElementById("receiptMessage");

form.addEventListener("submit", async (event) => {
  event.preventDefault();
  formError.classList.remove("show");
  if (!form.reportValidity()) return;

  const answers = [...form.querySelectorAll("textarea")].map((field) => ({
    question: field.labels[0].textContent.replace(/^\s*\d+\s*/, "").trim(),
    answer: field.value.trim(),
  }));
  const submission = {
    _subject: "A little anniversary keepsake 💌",
    name: "Anniversary answers",
    answers: answers
      .map(({ question, answer }) => `${question}\n${answer}`)
      .join("\n\n"),
  };

  submitButton.disabled = true;
  submitButton.innerHTML =
    'Sending with love… <span aria-hidden="true">♡</span>';
  try {
    const response = await fetch(
      `https://formsubmit.co/ajax/${encodeURIComponent(RECIPIENT_EMAIL)}`,
      {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
          Accept: "application/json",
        },
        body: JSON.stringify(submission),
      },
    );
    const result = await response.json().catch(() => ({}));
    if (!response.ok || result.success === false)
      throw new Error("The email service did not accept the answers.");

    answerRecap.replaceChildren();
    answers.forEach(({ question, answer }) => {
      const item = document.createElement("div");
      item.className = "recap-item";
      const title = document.createElement("strong");
      const text = document.createElement("span");
      title.textContent = question;
      text.textContent = answer;
      item.append(title, text);
      answerRecap.appendChild(item);
    });
    showScreen("receipt");
  } catch (error) {
    formError.textContent =
      "I couldn’t send that just now. Please check the connection and try again; your answers are still here.";
    formError.classList.add("show");
  } finally {
    submitButton.disabled = false;
    submitButton.innerHTML =
      'Send my answers <span aria-hidden="true">♡</span>';
  }
});

document.getElementById("startOver").addEventListener("click", () => {
  form.reset();
  showScreen("welcome");
});
makeHearts();
