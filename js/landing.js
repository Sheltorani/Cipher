// Cinematic Intro Animation
function createCinematicIntro() {
  const container = document.getElementById('intro-container');
  
  container.innerHTML = `
    <div class="cinematic-intro">
      <div class="intro-content">
        <div class="intro-text-1">THEY SAID BE YOURSELF</div>
        <div class="intro-text-2">BUT THEY MEANT BE LIKE THEM</div>
        <div class="intro-text-3">WHAT IF YOU JUST... WERE?</div>
        <div class="intro-divider"></div>
        <div class="intro-text-4">CIPHER</div>
      </div>
    </div>
  `;

  // Animation sequence
  setTimeout(() => {
    const text1 = document.querySelector('.intro-text-1');
    text1.classList.add('fade-in');
  }, 300);

  setTimeout(() => {
    const text2 = document.querySelector('.intro-text-2');
    text2.classList.add('fade-in');
  }, 1500);

  setTimeout(() => {
    const text3 = document.querySelector('.intro-text-3');
    text3.classList.add('fade-in');
  }, 2700);

  setTimeout(() => {
    const divider = document.querySelector('.intro-divider');
    divider.classList.add('expand');
  }, 3800);

  setTimeout(() => {
    const text4 = document.querySelector('.intro-text-4');
    text4.classList.add('fade-in-cipher');
  }, 4300);

  // Show landing page after intro
  setTimeout(() => {
    container.classList.add('fade-out');
    document.getElementById('landing-page').classList.remove('landing-hidden');
  }, 5500);

  // Remove intro after animation
  setTimeout(() => {
    container.style.display = 'none';
  }, 6000);
}

// Initialize intro when page loads
document.addEventListener('DOMContentLoaded', () => {
  createCinematicIntro();
});

// Smooth scroll for navigation
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
  anchor.addEventListener('click', function (e) {
    e.preventDefault();
    const target = document.querySelector(this.getAttribute('href'));
    if (target) {
      target.scrollIntoView({ behavior: 'smooth' });
    }
  });
});
