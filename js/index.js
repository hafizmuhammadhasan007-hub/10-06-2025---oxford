(function(){
    const cards = document.querySelectorAll('.category-section .card');
    if(!cards.length) return;

    cards.forEach(card=>{
      card.addEventListener('click', function(e){
        if(e.button !== 0) return;
        if(e.ctrlKey || e.metaKey || e.shiftKey || e.altKey) return;
        e.preventDefault();
        cards.forEach(c=>c.classList.remove('active'));
        card.classList.add('active');
        setTimeout(()=> {
          window.location.href = card.getAttribute('href');
        }, 120);
      });

      card.addEventListener('keydown', function(e){
        if(e.key === 'Enter' || e.key === ' '){
          e.preventDefault();
          card.click();
        }
      });

      if(!card.hasAttribute('tabindex')) card.setAttribute('tabindex', '0');
    });
  })();

const words = ["QUALITY", "DESIGN", "COMFORT", "TRUST"];
const colors = ["#FFD700", "#FF4D4D", "#4DB8FF", "#28a745"];
let index = 0;

function changeWord() {
  const wordBox = document.querySelector(".word-box");
  const wordSpan = document.getElementById("changing-word");

  wordSpan.textContent = words[index];
  wordSpan.style.animation = "none";
  wordSpan.offsetHeight;
  wordSpan.style.animation = null;

  wordBox.style.background = colors[index];

  index = (index + 1) % words.length;
}

setInterval(changeWord, 1500);

window.addEventListener("scroll", function () {
  const navbar = document.querySelector(".custom-navbar");
  if (window.scrollY > 50) {
    navbar.classList.add("scrolled");
  } else {
    navbar.classList.remove("scrolled");
  }
});

document.addEventListener("DOMContentLoaded", () => {
  const navLinks = document.querySelectorAll(".navbar-nav .nav-link");
  const navIcons = document.querySelectorAll(".navbar-icons .nav-icon");

  navLinks.forEach((link, i) => {
    link.style.animationDelay = `${i * 0.2 + 0.2}s`;
    link.classList.add("animated-link");
  });

  navIcons.forEach((icon, i) => {
    icon.style.animationDelay = `${(i + navLinks.length) * 0.2 + 0.2}s`;
    icon.classList.add("animated-icon");
  });
});

function showPopup(id) {
  const popup = document.getElementById(id);
  popup.classList.add("show");
  setTimeout(() => {
    popup.classList.remove("show");
  }, 2000);
}

function addToCart(productName) {
  console.log(productName + " added to cart");
  showPopup("cart-popup");

  const cartCount = document.getElementById("cart-count");
  if (cartCount) {
    cartCount.textContent = parseInt(cartCount.textContent) + 1;
  }
}

function addToWishlist(productName) {
  console.log(productName + " added to wishlist");
  showPopup("wishlist-popup");

  const wishCount = document.getElementById("wishlist-count");
  if (wishCount) {
    wishCount.textContent = parseInt(wishCount.textContent) + 1;
  }
}

AOS.init({
  duration: 1500,
  once: true,
});

document.querySelector(".footer-newsletter form").addEventListener("submit", function(e){
  e.preventDefault();

  const popup = document.createElement("div");
  popup.className = "subscribe-popup";
  popup.innerHTML = `
    <h4>🎉 Subscription Successful!</h4>
    <p>Thank you for subscribing to Urban Sofa updates.</p>
  `;
  document.body.appendChild(popup);

  setTimeout(() => popup.classList.add("show"), 100);

  setTimeout(() => {
    popup.classList.remove("show");
    setTimeout(() => popup.remove(), 300);
  }, 3000);
});

AOS.init({
  duration: 1000,
  once: true,
  offset: 50,
  easing: 'ease-out-cubic',
  mirror: false
});

document.addEventListener('DOMContentLoaded', function() {
  const categoryBlocks = document.querySelectorAll('.category-block');
  
  categoryBlocks.forEach((block, index) => {
    const bg = block.querySelector('.category-bg');
    const image = block.querySelector('.category-image');
    const text = block.querySelector('.category-text');
    
    if (bg) bg.setAttribute('data-aos-delay', index * 100);
    if (image) image.setAttribute('data-aos-delay', index * 100 + 200);
    if (text) text.setAttribute('data-aos-delay', index * 100 + 400);
  });
  
  setTimeout(() => {
    AOS.refresh();
  }, 100);
});