// Active navigation state management
const navLinks = document.querySelectorAll('.nav-links a');
const sections = document.querySelectorAll('.section');

// Function to update active nav link
function updateActiveNav() {
    let current = '';
    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.clientHeight;
        if (window.scrollY >= (sectionTop - 200)) {
            current = section.getAttribute('id');
        }
    });

    navLinks.forEach(link => {
        link.classList.remove('active');
        if (link.getAttribute('href') === `#${current}`) {
            link.classList.add('active');
        }
    });
}

// Listen for scroll events
window.addEventListener('scroll', updateActiveNav);

// Mobile menu toggle functionality
const menuToggle = document.getElementById('menuToggle');
const navLinksContainer = document.getElementById('navLinks');

menuToggle.addEventListener('click', () => {
    navLinksContainer.classList.toggle('active');
});

// Close mobile menu when clicking on a link
navLinks.forEach(link => {
    link.addEventListener('click', () => {
        navLinksContainer.classList.remove('active');
    });
});

// Close mobile menu when clicking outside
document.addEventListener('click', (e) => {
    if (!menuToggle.contains(e.target) && !navLinksContainer.contains(e.target)) {
        navLinksContainer.classList.remove('active');
    }
});

// Founders Carousel Functionality
const founders = [
    { name: "GILGAMESH", role: "CEO & FOUNDER" },
    { name: "GAARA", role: "CREATIVE DIRECTOR" },
    { name: "KIM DOKJA", role: "CTO & TECH LEAD" },
    { name: "NAGI", role: "MARKETING HEAD" },
    { name: "NAGUMO", role: "OPERATIONS DIRECTOR" },
    { name: "SHADOW", role: "DATA SCIENTIST" }
];

const foundersCards = document.querySelectorAll(".founders-card");
const foundersDots = document.querySelectorAll(".founders-dot");
const foundersName = document.querySelector(".founders-name");
const foundersRole = document.querySelector(".founders-role");
const leftBtn = document.querySelector(".founders-left");
const rightBtn = document.querySelector(".founders-right");

let foundersIndex = 0;
let foundersAnimating = false;

function updateFoundersCarousel(newIndex) {
    if (foundersAnimating) return;
    foundersAnimating = true;

    foundersIndex = (newIndex + foundersCards.length) % foundersCards.length;

    foundersCards.forEach((card, i) => {
        const offset = (i - foundersIndex + foundersCards.length) % foundersCards.length;
        card.classList.remove("center", "left-1", "left-2", "right-1", "right-2", "hidden");

        if (offset === 0) card.classList.add("center");
        else if (offset === 1) card.classList.add("right-1");
        else if (offset === 2) card.classList.add("right-2");
        else if (offset === foundersCards.length - 1) card.classList.add("left-1");
        else if (offset === foundersCards.length - 2) card.classList.add("left-2");
        else card.classList.add("hidden");
    });

    foundersDots.forEach((dot, i) => {
        dot.classList.toggle("active", i === foundersIndex);
    });

    foundersName.style.opacity = "0";
    foundersRole.style.opacity = "0";

    setTimeout(() => {
        foundersName.textContent = founders[foundersIndex].name;
        foundersRole.textContent = founders[foundersIndex].role;
        foundersName.style.opacity = "1";
        foundersRole.style.opacity = "1";
    }, 300);

    setTimeout(() => {
        foundersAnimating = false;
    }, 800);
}

// ========================================
//   AUTO-ROTATE CAROUSEL FUNCTIONALITY
// ========================================

// متغير للتحكم في التمرير التلقائي
let autoRotateInterval;
const autoRotateDelay = 5000; // 5 ثواني بين كل بطاقة

// دالة التمرير التلقائي
function startAutoRotate() {
    autoRotateInterval = setInterval(() => {
        updateFoundersCarousel(foundersIndex + 1);
    }, autoRotateDelay);
}

// دالة إيقاف التمرير التلقائي
function stopAutoRotate() {
    clearInterval(autoRotateInterval);
}

// بدء التمرير التلقائي
startAutoRotate();

// إيقاف التمرير التلقائي عند تفاعل المستخدم
leftBtn.addEventListener("click", () => {
    stopAutoRotate();
    updateFoundersCarousel(foundersIndex - 1);
    setTimeout(startAutoRotate, 5000); // إعادة التشغيل بعد 5 ثواني
});

rightBtn.addEventListener("click", () => {
    stopAutoRotate();
    updateFoundersCarousel(foundersIndex + 1);
    setTimeout(startAutoRotate, 5000); // إعادة التشغيل بعد 5 ثواني
});

foundersDots.forEach((dot, i) => dot.addEventListener("click", () => {
    stopAutoRotate();
    updateFoundersCarousel(i);
    setTimeout(startAutoRotate, 5000); // إعادة التشغيل بعد 5 ثواني
}));

foundersCards.forEach((card, i) => card.addEventListener("click", () => {
    stopAutoRotate();
    updateFoundersCarousel(i);
    setTimeout(startAutoRotate, 5000); // إعادة التشغيل بعد 5 ثواني
}));

// إيقاف التمرير التلقائي عند استخدام لوحة المفاتيح
document.addEventListener("keydown", (e) => {
    if (e.key === "ArrowLeft" || e.key === "ArrowRight") {
        stopAutoRotate();
        if (e.key === "ArrowLeft") updateFoundersCarousel(foundersIndex - 1);
        else if (e.key === "ArrowRight") updateFoundersCarousel(foundersIndex + 1);
        setTimeout(startAutoRotate, 5000); // إعادة التشغيل بعد 5 ثواني
    }
});

let touchStart = 0;
let touchEnd = 0;

document.addEventListener("touchstart", (e) => {
    touchStart = e.changedTouches[0].screenX;
});

document.addEventListener("touchend", (e) => {
    touchEnd = e.changedTouches[0].screenX;
    const diff = touchStart - touchEnd;
    if (Math.abs(diff) > 50) {
        stopAutoRotate();
        if (diff > 0) updateFoundersCarousel(foundersIndex + 1);
        else updateFoundersCarousel(foundersIndex - 1);
        setTimeout(startAutoRotate, 5000); // إعادة التشغيل بعد 5 ثواني
    }
});

// Initialize the static button with visual effects
const chaosButton = document.querySelector('.chaos-button');

chaosButton.addEventListener('click', function(e) {
    // Create ripple effect
    const ripple = document.createElement('span');
    ripple.classList.add('ripple');
    this.appendChild(ripple);
    
    // Position ripple
    const rect = this.getBoundingClientRect();
    const size = Math.max(rect.width, rect.height);
    const x = e.clientX - rect.left - size / 2;
    const y = e.clientY - rect.top - size / 2;
    
    ripple.style.width = ripple.style.height = size + 'px';
    ripple.style.left = x + 'px';
    ripple.style.top = y + 'px';
    
    // Remove ripple after animation
    setTimeout(() => {
        ripple.remove();
    }, 600);
});

// Initialize carousel
updateFoundersCarousel(0);

// ========================================
//   ANIMATED COUNTER FUNCTIONALITY
// ========================================

function animateCounters() {
    const counters = document.querySelectorAll('.stat-number[data-target]');
    
    counters.forEach(counter => {
        const target = parseInt(counter.getAttribute('data-target'));
        const duration = 2000; // 2 seconds
        const step = target / (duration / 16); // 60fps
        let current = 0;
        
        const updateCounter = () => {
            current += step;
            if (current < target) {
                counter.textContent = Math.floor(current);
                requestAnimationFrame(updateCounter);
            } else {
                counter.textContent = target + '+';
                // Add animation class
                counter.classList.add('counted');
                observer.unobserve(entry.target);
            }
        };
        
        // Start animation when element is in viewport
        const observer = new IntersectionObserver((entries) => {
            entries.forEach(entry => {
                if (entry.isIntersecting) {
                    updateCounter();
                    observer.unobserve(entry.target);
                }
            });
        });
        
        observer.observe(counter);
    });
}

// Initialize counters when page loads
document.addEventListener('DOMContentLoaded', animateCounters);
