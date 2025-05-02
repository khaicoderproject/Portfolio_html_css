// Mobile Menu Toggle
const menuToggle = document.querySelector('.menu-toggle');
const innerMenu = document.querySelector('.inner-menu');
const body = document.body;

// Create overlay element
const overlay = document.createElement('div');
overlay.className = 'menu-overlay';
document.body.appendChild(overlay);

// Toggle menu function
function toggleMenu() {
  menuToggle.classList.toggle('active');
  innerMenu.classList.toggle('active');
  overlay.classList.toggle('active');
  body.classList.toggle('menu-open');
}

// Event listeners
menuToggle.addEventListener('click', toggleMenu);
overlay.addEventListener('click', toggleMenu);

// Close menu when clicking menu items
const menuItems = document.querySelectorAll('.inner-menu ul li a');
menuItems.forEach(item => {
  item.addEventListener('click', () => {
    if (innerMenu.classList.contains('active')) {
      toggleMenu();
    }
  });
});

// Close menu on window resize if open
window.addEventListener('resize', () => {
  if (window.innerWidth > 991 && innerMenu.classList.contains('active')) {
    toggleMenu();
  }
}); 