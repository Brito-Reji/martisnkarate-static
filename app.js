// get elements
const mobileMenuBtn = document.getElementById('mobile-menu-btn');
const mobileMenu = document.getElementById('mobile-menu');
const yearSpan = document.getElementById('year');
const dojoContainer = document.getElementById('dojo-container');
const dojoError = document.getElementById('dojo-error');

// set year
if (yearSpan) {
    yearSpan.textContent = new Date().getFullYear();
}

// toggle mobile menu
mobileMenuBtn.addEventListener('click', () => {
    mobileMenu.classList.toggle('hidden');
});

// smooth reveal on scroll
function reveal() {
    const reveals = document.querySelectorAll('.reveal');
    for (let i = 0; i < reveals.length; i++) {
        const windowHeight = window.innerHeight;
        const elementTop = reveals[i].getBoundingClientRect().top;
        const elementVisible = 150;
        
        if (elementTop < windowHeight - elementVisible) {
            reveals[i].classList.add('active');
        }
    }
}

window.addEventListener('scroll', reveal);

// stats count-up
function countUp(el) {
    const target = +el.dataset.target;
    const suffix = el.dataset.suffix || '';
    const duration = 1800;
    const start = performance.now();

    function step(now) {
        const progress = Math.min((now - start) / duration, 1);
        const ease = 1 - Math.pow(1 - progress, 3);
        el.textContent = Math.floor(ease * target) + suffix;
        if (progress < 1) requestAnimationFrame(step);
    }
    requestAnimationFrame(step);
}

const statsObserver = new IntersectionObserver((entries) => {
    entries.forEach(entry => {
        if (entry.isIntersecting) {
            entry.target.querySelectorAll('[data-target]').forEach(countUp);
            statsObserver.unobserve(entry.target);
        }
    });
}, { threshold: 0.3 });

document.querySelectorAll('.stat-item').forEach(el => statsObserver.observe(el.closest('section')));

// fetch dojos
async function fetchDojos() {
    try {
        const res = await fetch('https://karate-management-nu.vercel.app/api/dojos');

        if (!res.ok) throw new Error(`HTTP ${res.status}`);

        const data = await res.json();
        renderDojos(data);
    } catch (error) {
        console.error('fetchDojos:', error);
        dojoContainer.innerHTML = '';
        dojoError.classList.remove('hidden');
    }
}

// render dojos
function renderDojos(dojos) {
    dojoContainer.innerHTML = '';
    
    dojos.forEach(dojo => {
        const dojoCard = document.createElement('div');
        dojoCard.className = 'bg-karate-dark p-6 rounded-xl border border-karate-gray hover:border-karate-red transition-all duration-300 transform hover:-translate-y-2 hover:shadow-xl hover:shadow-karate-red/10 group';
        
        const instructorList = (dojo.instructors && dojo.instructors.length)
            ? dojo.instructors.map(i => `<span class="inline-block bg-karate-gray text-gray-300 text-xs px-2 py-0.5 rounded mr-1">${i}</span>`).join('')
            : dojo.instructor;

        dojoCard.innerHTML = `
            <p class="text-karate-red text-xs font-bold uppercase tracking-widest mb-1">${dojo.dojoId}</p>
            <h4 class="text-xl font-bold text-white mb-2 font-heading uppercase tracking-wide">${dojo.name}</h4>
            <div class="flex items-start mb-3 text-gray-400">
                <svg class="h-5 w-5 mr-2 text-karate-red flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M17.657 16.657L13.414 20.9a1.998 1.998 0 01-2.827 0l-4.244-4.243a8 8 0 1111.314 0z" />
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M15 11a3 3 0 11-6 0 3 3 0 016 0z" />
                </svg>
                <p class="text-sm">${dojo.location}</p>
            </div>
            <div class="flex items-start mb-6 text-gray-400">
                <svg class="h-5 w-5 mr-2 text-karate-red flex-shrink-0 mt-0.5" fill="none" viewBox="0 0 24 24" stroke="currentColor">
                    <path stroke-linecap="round" stroke-linejoin="round" stroke-width="2" d="M16 7a4 4 0 11-8 0 4 4 0 018 0zM12 14a7 7 0 00-7 7h14a7 7 0 00-7-7z" />
                </svg>
                <div class="text-sm flex flex-wrap gap-1">${instructorList}</div>
            </div>
            <a href="#contact" class="inline-block w-full text-center border border-karate-red text-karate-red hover:bg-karate-red hover:text-white font-bold py-2 px-4 rounded transition-colors duration-300 uppercase text-sm tracking-wider">
                Book Visit
            </a>
        `;
        
        dojoContainer.appendChild(dojoCard);
    });
}

// form submit → WhatsApp
document.getElementById('contact-form')?.addEventListener('submit', (e) => {
    e.preventDefault();

    const name    = document.getElementById('name').value.trim();
    const email   = document.getElementById('email').value.trim();
    const message = document.getElementById('message').value.trim();

    const text = `Hi, I'm interested in joining Martin's Karate Academy!\n\n*Name:* ${name}\n*Email:* ${email}\n*Message:* ${message}`;

    const url = `https://wa.me/919747925759?text=${encodeURIComponent(text)}`;
    window.open(url, '_blank');

    e.target.reset();
});

// init
document.addEventListener('DOMContentLoaded', () => {
    // start fetch
    fetchDojos();
    
    // apply reveal classes initially
    const sections = document.querySelectorAll('section');
    sections.forEach(section => {
        section.classList.add('reveal');
    });
    // initial check
    reveal();
});
