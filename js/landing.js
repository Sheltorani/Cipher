// ==========================================
// CIPHER - Landing Page & Cinematic Intro
// ==========================================

function createCinematicIntro() {
  const container = document.getElementById('intro-container');
  
  container.innerHTML = `
    <div class="cinematic-intro">
      <div class="intro-content">
        <div class="intro-text intro-text-1">THEY SAID BE YOURSELF</div>
        <div class="intro-text intro-text-2">BUT THEY MEANT BE LIKE THEM</div>
        <div class="intro-text intro-text-3">WHAT IF YOU JUST... WERE?</div>
        <div class="intro-divider"></div>
        <div class="intro-text intro-text-4">CIPHER</div>
      </div>
    </div>
  `;

  // Animation timing
  setTimeout(() => {
    document.querySelector('.intro-text-1').classList.add('fade-in');
  }, 300);

  setTimeout(() => {
    document.querySelector('.intro-text-2').classList.add('fade-in');
  }, 1500);

  setTimeout(() => {
    document.querySelector('.intro-text-3').classList.add('fade-in');
  }, 2700);

  setTimeout(() => {
    document.querySelector('.intro-divider').classList.add('expand');
  }, 3800);

  setTimeout(() => {
    document.querySelector('.intro-text-4').classList.add('fade-in-cipher');
  }, 4300);

  setTimeout(() => {
    container.classList.add('fade-out');
    document.getElementById('landing-page').classList.remove('landing-hidden');
  }, 5500);

  setTimeout(() => {
    container.style.display = 'none';
  }, 6000);
}

function navigateToApp() {
  window.location.href = 'app.html';
}

// Initialize when page loads
document.addEventListener('DOMContentLoaded', () => {
  createCinematicIntro();
  
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
});
