// ==================== MENU TOGGLE ====================
const menuIcon = document.querySelector('#menu-icon');
const navbar = document.querySelector('.navbar');

menuIcon.addEventListener('click', () => {
  navbar.classList.toggle('active');
  menuIcon.classList.toggle('bx-x'); // لو بتستخدم أيقونة من boxicons
});

// ==================== CLOSE MENU WHEN LINK CLICKED ====================
document.querySelectorAll('.navbar a').forEach(link => {
  link.addEventListener('click', () => {
    navbar.classList.remove('active');
    menuIcon.classList.remove('bx-x');
  });
});

// ==================== CHANGE HEADER BACKGROUND ON SCROLL ====================
window.addEventListener('scroll', () => {
  const header = document.querySelector('.header');
  if (window.scrollY > 50) {
    header.style.backgroundColor = "rgba(0, 0, 0, 0.7)";
  } else {
    header.style.backgroundColor = "rgba(0, 0, 0, 0.3)";
  }
});


  const cards = document.querySelectorAll('.testimonial-card');

  const observer = new IntersectionObserver(
    entries => {
      entries.forEach(entry => {
        if (entry.isIntersecting) {
          entry.target.classList.add('visible');
        }
      });
    },
    { threshold: 0.2 }
  );

  cards.forEach(card => observer.observe(card));
