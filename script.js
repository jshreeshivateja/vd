// ========== Floating Hearts Background ==========
const heartsBg = document.getElementById('heartsBg');
const heartEmojis = ['💕', '💖', '💗', '💓', '❤️', '💘', '💝', '🩷'];

function createBackgroundHeart() {
  const heart = document.createElement('span');
  heart.classList.add('heart-float');
  heart.textContent = heartEmojis[Math.floor(Math.random() * heartEmojis.length)];
  heart.style.left = Math.random() * 100 + '%';
  heart.style.fontSize = (Math.random() * 1.5 + 0.8) + 'rem';
  heart.style.animationDuration = (Math.random() * 5 + 5) + 's';
  heart.style.animationDelay = (Math.random() * 3) + 's';
  heartsBg.appendChild(heart);

  setTimeout(() => heart.remove(), 10000);
}

// Start floating hearts
setInterval(createBackgroundHeart, 600);
for (let i = 0; i < 10; i++) createBackgroundHeart();

// ========== No Button Escape Logic ==========
const noBtn = document.getElementById('noBtn');
const card = document.getElementById('card');
const yesBtn = document.getElementById('yesBtn');
const celebration = document.getElementById('celebration');

const funnyTexts = [
  "No 💔",
  "Are you sure? 🥺",
  "Last chance! 😤",
  "Think again! 😢",
  "Don't do this! 😭",
  "Please? 🥹",
  "I'll be sad 😿",
  "You're breaking my heart! 💔",
  "Pretty please? 🌹",
  "Reconsider? 💕",
];
let textIndex = 0;

function moveNoButton() {
  // Switch to fixed positioning so it escapes near the Yes button
  if (!noBtn.classList.contains('escaping')) {
    noBtn.classList.add('escaping');
  }

  // Update text FIRST so we measure the correct size
  textIndex = (textIndex + 1) % funnyTexts.length;
  noBtn.textContent = funnyTexts[textIndex];

  // Force a reflow so offsetWidth/Height reflect the new text
  const btnWidth = noBtn.offsetWidth;
  const btnHeight = noBtn.offsetHeight;

  const yesRect = yesBtn.getBoundingClientRect();
  const yesCenterX = yesRect.left + yesRect.width / 2;
  const yesCenterY = yesRect.top + yesRect.height / 2;

  const viewW = document.documentElement.clientWidth;
  const viewH = document.documentElement.clientHeight;
  const margin = 10;

  // Radius around the Yes button to place the No button (very close)
  const minDist = 20;
  const maxDist = 40;

  let newX, newY;
  let attempts = 0;
  const gap = 15; // minimum gap between No and Yes buttons

  do {
    // Pick a random angle and distance from the Yes button center
    const angle = Math.random() * Math.PI * 2;
    const dist = minDist + Math.random() * (maxDist - minDist);

    newX = yesCenterX + Math.cos(angle) * dist - btnWidth / 2;
    newY = yesCenterY + Math.sin(angle) * dist - btnHeight / 2;

    attempts++;

    // Check if within viewport
    const inBounds = newX >= margin && newY >= margin &&
      newX + btnWidth <= viewW - margin && newY + btnHeight <= viewH - margin;

    // Check if overlapping the Yes button (with gap)
    const overlapsYes = newX < yesRect.right + gap &&
      newX + btnWidth > yesRect.left - gap &&
      newY < yesRect.bottom + gap &&
      newY + btnHeight > yesRect.top - gap;

    if (inBounds && !overlapsYes) break;
  } while (attempts < 80);

  // Final safety clamp
  newX = Math.max(margin, Math.min(newX, viewW - btnWidth - margin));
  newY = Math.max(margin, Math.min(newY, viewH - btnHeight - margin));

  // Final overlap check — if still behind Yes, push it away
  const overlapsYesFinal = newX < yesRect.right + gap &&
    newX + btnWidth > yesRect.left - gap &&
    newY < yesRect.bottom + gap &&
    newY + btnHeight > yesRect.top - gap;

  if (overlapsYesFinal) {
    // Push the No button to the opposite side of the Yes button
    if (newX + btnWidth / 2 < yesCenterX) {
      newX = yesRect.left - btnWidth - gap;
    } else {
      newX = yesRect.right + gap;
    }
    // Clamp again after push
    newX = Math.max(margin, Math.min(newX, viewW - btnWidth - margin));
  }

  noBtn.style.left = newX + 'px';
  noBtn.style.top = newY + 'px';
}

// Desktop: mouseover
noBtn.addEventListener('mouseover', (e) => {
  e.preventDefault();
  moveNoButton();
});

// Mobile: touchstart (since there's no hover)
noBtn.addEventListener('touchstart', (e) => {
  e.preventDefault();
  moveNoButton();
});

// Also prevent click just in case
noBtn.addEventListener('click', (e) => {
  e.preventDefault();
  moveNoButton();
});

// ========== Yes Button Click ==========
yesBtn.addEventListener('click', () => {
  card.style.display = 'none';
  noBtn.style.display = 'none';
  celebration.classList.remove('hidden');
  // Allow scrolling for the celebration/gallery content
  document.body.classList.add('scrollable');
  document.documentElement.style.overflow = 'auto';
  launchHearts();
  initGallery();
});

function launchHearts() {
  const container = document.getElementById('floatingHearts');
  const celebrationEmojis = ['💖', '💕', '🎉', '✨', '💗', '🥰', '💘', '🩷', '❤️', '🌹', '🎊'];

  for (let i = 0; i < 60; i++) {
    setTimeout(() => {
      const heart = document.createElement('span');
      heart.classList.add('confetti-heart');
      heart.textContent = celebrationEmojis[Math.floor(Math.random() * celebrationEmojis.length)];
      heart.style.left = Math.random() * 100 + '%';
      heart.style.fontSize = (Math.random() * 2 + 1) + 'rem';
      heart.style.animationDuration = (Math.random() * 3 + 2) + 's';
      heart.style.animationDelay = '0s';
      container.appendChild(heart);

      setTimeout(() => heart.remove(), 5000);
    }, i * 100);
  }
}

// ========== Auto-scrolling Image Gallery ==========
// Add your image filenames here (place images in the "images/" folder)
const images = [
  'images/IMG-20251124-WA0057.jpg',
  'images/1764915294125.jpg',
  'images/IMG-20251124-WA0003.jpg',
  'images/IMG_20260103_175015557.jpg',
  'images/IMG-20251124-WA0004.jpg',
  'images/IMG-20251124-WA0036 (1).jpg',
  'images/IMG-20251124-WA0043.jpg',
  'images/IMG-20251127-WA0006.jpg',
  'images/IMG_20251229_181940690.jpg',
  'images/IMG_20260104_191939898.jpg',
];

const NUM_COLUMNS = 3;

function initGallery() {
  const gallery = document.getElementById('gallery');
  if (images.length === 0) return;

  // Distribute images across columns
  const columns = Array.from({ length: NUM_COLUMNS }, () => []);
  images.forEach((src, i) => {
    columns[i % NUM_COLUMNS].push(src);
  });

  columns.forEach((colImages, colIndex) => {
    const column = document.createElement('div');
    column.classList.add('gallery-column');

    const inner = document.createElement('div');
    inner.classList.add('gallery-column-inner');

    // Duplicate images for seamless infinite loop
    const doubled = [...colImages, ...colImages];
    doubled.forEach((src) => {
      const img = document.createElement('img');
      img.src = src;
      img.alt = 'Our memory 💕';
      img.loading = 'lazy';
      inner.appendChild(img);
    });

    // Vary speed per column for a natural feel
    const duration = 18 + colIndex * 5;
    inner.style.animationDuration = duration + 's';

    column.appendChild(inner);
    gallery.appendChild(column);
  });
}
