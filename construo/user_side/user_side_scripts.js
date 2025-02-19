// Get references to all DOM elements
const menuButton = document.getElementById("menuButton"); // Menu toggle button
const closeButton = document.getElementById("closeButton"); // Sidebar close button
const sidebar = document.getElementById("sidebar"); // Sidebar navigation
const shareButton = document.getElementById("shareButton"); // Share menu button
const shareMenu = document.getElementById("shareMenu"); // Share menu container
const copyLinkButton = document.getElementById("copyLinkButton"); // Copy link button
const bridgeImage = document.getElementById("bridgeImage"); // Event poster image
const modal = document.getElementById("modal"); // Image modal
const modalImage = document.getElementById("modalImage"); // Modal image
const closeModalButton = document.getElementById("closeModalButton"); // Modal close button
const downloadButton = document.getElementById("downloadButton"); // Image download button

let holdTimeout; // Timer for long press on image

// Handle menu button click to open sidebar
if (menuButton) {
  menuButton.addEventListener("click", () => {
    sidebar.classList.add("open");
  });
}

// Handle close button click to close sidebar
if (closeButton) {
  closeButton.addEventListener("click", () => {
    sidebar.classList.remove("open");
  });
}

// Close sidebar when any navigation link is clicked
document.querySelectorAll("#sidebar a").forEach((link) => {
  link.addEventListener("click", () => {
    sidebar.classList.remove("open");
  });
});

// Close sidebar when clicking outside of it
document.addEventListener("click", (event) => {
  if (!sidebar.contains(event.target) && !menuButton.contains(event.target)) {
    sidebar.classList.remove("open");
  }
});

// Toggle share menu visibility
if (shareButton) {
  shareButton.addEventListener("click", () => {
    shareMenu.classList.toggle("open");
  });
}

// Handle copy link button click
if (copyLinkButton) {
  copyLinkButton.addEventListener("click", () => {
    navigator.clipboard.writeText("www.construosrmvec.com").then(() => {
      alert("Link copied to clipboard");
    });
  });
}

// Close share menu when clicking outside of it
document.addEventListener("click", (event) => {
  if (
    !shareMenu.contains(event.target) &&
    !shareButton.contains(event.target)
  ) {
    shareMenu.classList.remove("open");
  }
});

// Handle image interactions for modal display
if (bridgeImage) {
  // Show modal after long press (300ms)
  bridgeImage.addEventListener("mousedown", () => {
    holdTimeout = setTimeout(() => {
      if (modalImage && modal && downloadButton) {
        modalImage.src = bridgeImage.src;
        modal.classList.add("open");
        downloadButton.href = bridgeImage.src;
        downloadButton.classList.add("show");
      }
    }, 300);
  });

  // Clear timeout if mouse is released
  bridgeImage.addEventListener("mouseup", () => {
    clearTimeout(holdTimeout);
  });

  // Clear timeout if mouse leaves image
  bridgeImage.addEventListener("mouseleave", () => {
    clearTimeout(holdTimeout);
  });
}

// Handle modal close button click
if (closeModalButton) {
  closeModalButton.addEventListener("click", () => {
    if (modal && downloadButton) {
      modal.classList.remove("open");
      downloadButton.classList.remove("show");
    }
  });
}

// Close modal when clicking outside of image or close button
modal.addEventListener("click", (event) => {
  if (
    !modalImage.contains(event.target) &&
    !closeModalButton.contains(event.target)
  ) {
    modal.classList.remove("open");
    downloadButton.classList.remove("show");
  }
});

// Scroll animation functionality
const scrollElements = document.querySelectorAll(".scroll-animation");

// Check if element is in viewport
const elementInView = (el, dividend = 1) => {
  const elementTop = el.getBoundingClientRect().top;
  return (
    elementTop <=
    (window.innerHeight || document.documentElement.clientHeight) / dividend
  );
};

// Show element with animation
const displayScrollElement = (element) => {
  element.classList.add("visible");
};

// Hide element
const hideScrollElement = (element) => {
  element.classList.remove("visible");
};

// Handle scroll animation for all elements
const handleScrollAnimation = () => {
  scrollElements.forEach((el) => {
    if (elementInView(el, 1.25)) {
      displayScrollElement(el);
    } else {
      hideScrollElement(el);
    }
  });
};

// Add scroll event listener
window.addEventListener("scroll", () => {
  handleScrollAnimation();
});

// Handle home link click for smooth scroll to top
const homeLink = document.querySelector('a[href="#home"]');
if (homeLink) {
  homeLink.addEventListener("click", (event) => {
    event.preventDefault();
    window.scrollTo({ top: 0, behavior: "smooth" });
  });
}

const technicalSlides = [
  {
    pic: "https://storage.googleapis.com/a1aa/image/tYbMAlIWcnb1YUYSXQjSKx99PwOXyheOdGPE6JxSJWo.jpg",
    quote: "“Paper Presentation”",
    author: "Joe Smith: Fjcgnvhjbvgg",
  },
  {
    pic: "https://placehold.co/200x200",
    quote: "“Technical Event 2”",
    author: "Jane Doe: Example",
  },
  {
    pic: "https://placehold.co/200x200",
    quote: "“Technical Event 3”",
    author: "John Doe: Example",
  },
  {
    pic: "https://placehold.co/200x200",
    quote: "“Technical Event 4”",
    author: "Alice Doe: Example",
  },
  {
    pic: "https://placehold.co/200x200",
    quote: "“Technical Event 5”",
    author: "Bob Doe: Example",
  },
  {
    pic: "https://placehold.co/200x200",
    quote: "“Technical Event 6”",
    author: "Charlie Doe: Example",
  },
  {
    pic: "https://placehold.co/200x200",
    quote: "“Technical Event 7”",
    author: "David Doe: Example",
  },
  {
    pic: "https://placehold.co/200x200",
    quote: "“Technical Event 8”",
    author: "Eve Doe: Example",
  },
];

const nonTechnicalSlides = [
  {
    pic: "https://storage.googleapis.com/a1aa/image/YcVDlS2dTQFgu5VD1nLcMQXNPwgr4o6rAllJNDEK-8s.jpg",
    quote: "“Hanging Brick”",
    author: "Joe Smith: Mohan",
  },
  {
    pic: "https://placehold.co/200x200",
    quote: "“Non-Technical Event 2”",
    author: "Jane Doe: Example",
  },
  {
    pic: "https://placehold.co/200x200",
    quote: "“Non-Technical Event 3”",
    author: "John Doe: Example",
  },
  {
    pic: "https://placehold.co/200x200",
    quote: "“Non-Technical Event 4”",
    author: "Alice Doe: Example",
  },
  {
    pic: "https://placehold.co/200x200",
    quote: "“Non-Technical Event 5”",
    author: "Bob Doe: Example",
  },
  {
    pic: "https://placehold.co/200x200",
    quote: "“Non-Technical Event 6”",
    author: "Charlie Doe: Example",
  },
  {
    pic: "https://placehold.co/200x200",
    quote: "“Non-Technical Event 7”",
    author: "David Doe: Example",
  },
  {
    pic: "https://placehold.co/200x200",
    quote: "“Non-Technical Event 8”",
    author: "Eve Doe: Example",
  },
];

const guestLecturerSlides = [
  {
    pic: "https://storage.googleapis.com/a1aa/image/A59fEa7Ucqrp-ajNezkHj4yQlWmA7AYVS1CNImKm73U.jpg",
    quote: "“Civil engineering”",
    author: "Joe Smith: Sir....",
  },
  {
    pic: "https://placehold.co/200x200",
    quote: "“Guest Lecture 2”",
    author: "Jane Doe: Example",
  },
  {
    PeriodicWave: "https://placehold.co/200x200",
    quote: "“Guest Lecture 3”",
    author: "John Doe: Example",
  },
  {
    pic: "https://placehold.co/200x200",
    quote: "“Guest Lecture 4”",
    author: "Alice Doe: Example",
  },
  {
    pic: "https://placehold.co/200x200",
    quote: "“Guest Lecture 5”",
    author: "Bob Doe: Example",
  },
  {
    pic: "https://placehold.co/200x200",
    quote: "“Guest Lecture 6”",
    author: "Charlie Doe: Example",
  },
  {
    pic: "https://placehold.co/200x200",
    quote: "“Guest Lecture 7”",
    author: "David Doe: Example",
  },
  {
    pic: "https://placehold.co/200x200",
    quote: "“Guest Lecture 8”",
    author: "Eve Doe: Example",
  },
];

const slides = {
  technical: technicalSlides,
  "non-technical": nonTechnicalSlides,
  "guest-lecturer": guestLecturerSlides,
};

const currentIndex = {
  technical: 0,
  "non-technical": 0,
  "guest-lecturer": 0,
};

function updateSlide(category) {
  const slide = slides[category][currentIndex[category]];
  document.getElementById(`${category}-pic`).src = slide.pic;
  document.getElementById(`${category}-quote`).textContent = slide.quote;
  document.getElementById(`${category}-author`).textContent = slide.author;

  document.querySelectorAll(`#${category}-dots .dot`).forEach((dot, index) => {
    dot.classList.toggle("active", index === currentIndex[category]);
  });
}

function showSlide(category, index) {
  currentIndex[category] = index;
  updateSlide(category);
}

function nextSlide(category) {
  if (!slides[category]) return;
  currentIndex[category] =
    (currentIndex[category] + 1) % slides[category].length;
  updateSlide(category);
}

function prevSlide(category) {
  if (!slides[category]) return;
  currentIndex[category] =
    (currentIndex[category] - 1 + slides[category].length) %
    slides[category].length;
  updateSlide(category);
}

function goToSlide(category, index) {
  if (!slides[category] || index < 0 || index >= slides[category].length)
    return;
  currentIndex[category] = index;
  updateSlide(category);
}

document.addEventListener("DOMContentLoaded", () => {
  showSlide("technical", 0);
  showSlide("non-technical", 0);
  showSlide("guest-lecturer", 0);
});

setInterval(() => nextSlide("technical"), 4800);
setInterval(() => nextSlide("non-technical"), 4800);
setInterval(() => nextSlide("guest-lecturer"), 4800);
