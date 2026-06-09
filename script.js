// ========== THEME TOGGLE ==========
const themeToggle = document.getElementById('themeToggle');
const htmlElement = document.documentElement;

// Initialize theme from localStorage or system preference
function initializeTheme() {
    const savedTheme = localStorage.getItem('theme');
    if (savedTheme) {
        htmlElement.setAttribute('data-theme', savedTheme);
    } else {
        const prefersDark = window.matchMedia('(prefers-color-scheme: dark)').matches;
        htmlElement.setAttribute('data-theme', prefersDark ? 'dark' : 'light');
    }
}

// Toggle theme
function toggleTheme() {
    const currentTheme = htmlElement.getAttribute('data-theme');
    const newTheme = currentTheme === 'dark' ? 'light' : 'dark';
    htmlElement.setAttribute('data-theme', newTheme);
    localStorage.setItem('theme', newTheme);
}

themeToggle.addEventListener('click', toggleTheme);

// Detect system theme changes
window.matchMedia('(prefers-color-scheme: dark)').addEventListener('change', (e) => {
    if (!localStorage.getItem('theme')) {
        htmlElement.setAttribute('data-theme', e.matches ? 'dark' : 'light');
    }
});

// ========== SEARCH FUNCTIONALITY ==========
const searchInput = document.getElementById('search');
const searchClear = document.getElementById('searchClear');
const filterChips = document.querySelectorAll('.chip');

// Show/hide clear button
searchInput.addEventListener('input', function() {
    searchClear.style.display = this.value ? 'block' : 'none';
    filterApps(this.value);
});

// Clear search
searchClear.addEventListener('click', function() {
    searchInput.value = '';
    this.style.display = 'none';
    filterApps('');
});

// Filter chips
filterChips.forEach(chip => {
    chip.addEventListener('click', function() {
        filterChips.forEach(c => c.classList.remove('active'));
        this.classList.add('active');
        const category = this.dataset.filter;
        const searchTerm = searchInput.value;
        filterApps(searchTerm, category);
    });
});

// Filter apps based on search and category
function filterApps(searchTerm = '', category = 'all') {
    const appCards = document.querySelectorAll('.app-card, .trending-card, .category-card');
    
    appCards.forEach(card => {
        const text = card.textContent.toLowerCase();
        const matches = text.includes(searchTerm.toLowerCase());
        
        if (searchTerm === '' && category === 'all') {
            card.style.display = '';
        } else if (matches || searchTerm === '') {
            card.style.display = '';
        } else {
            card.style.display = 'none';
        }
    });
}

// ========== SMOOTH SCROLLING ==========
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function (e) {
        const href = this.getAttribute('href');
        if (href !== '#' && document.querySelector(href)) {
            e.preventDefault();
            const target = document.querySelector(href);
            target.scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========== BUTTON CLICK EFFECTS ==========
const buttons = document.querySelectorAll('.btn');
buttons.forEach(button => {
    button.addEventListener('click', function(e) {
        // Create ripple effect
        const ripple = document.createElement('span');
        const rect = this.getBoundingClientRect();
        const size = Math.max(rect.width, rect.height);
        const x = e.clientX - rect.left - size / 2;
        const y = e.clientY - rect.top - size / 2;
        
        ripple.style.width = ripple.style.height = size + 'px';
        ripple.style.left = x + 'px';
        ripple.style.top = y + 'px';
        
        // Visual feedback
        if (this.classList.contains('btn-primary')) {
            this.style.transform = 'scale(0.98)';
            setTimeout(() => {
                this.style.transform = '';
            }, 100);
        }
    });
});

// ========== NEWSLETTER SUBSCRIPTION ==========
const newsletterForm = document.querySelector('.newsletter-form');
if (newsletterForm) {
    newsletterForm.addEventListener('submit', function(e) {
        e.preventDefault();
        const emailInput = this.querySelector('.input-email');
        if (emailInput.value) {
            showNotification('✅ Successfully subscribed to IPABD newsletter!');
            emailInput.value = '';
        }
    });
    
    // Handle subscribe button click
    const subscribeBtn = newsletterForm.querySelector('.btn-primary');
    if (subscribeBtn) {
        subscribeBtn.addEventListener('click', function(e) {
            e.preventDefault();
            const emailInput = newsletterForm.querySelector('.input-email');
            const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
            
            if (!emailInput.value) {
                showNotification('⚠️ Please enter your email address');
            } else if (!emailRegex.test(emailInput.value)) {
                showNotification('⚠️ Please enter a valid email address');
            } else {
                showNotification('✅ Successfully subscribed to IPABD newsletter!');
                emailInput.value = '';
            }
        });
    }
}

// ========== NOTIFICATIONS ==========
function showNotification(message) {
    const notification = document.createElement('div');
    notification.className = 'notification';
    notification.textContent = message;
    notification.style.cssText = `
        position: fixed;
        bottom: 20px;
        right: 20px;
        background: linear-gradient(135deg, #00D4FF, #6B5FFF);
        color: white;
        padding: 12px 20px;
        border-radius: 8px;
        font-size: 14px;
        font-weight: 500;
        box-shadow: 0 4px 12px rgba(0, 212, 255, 0.3);
        animation: slideIn 0.3s ease;
        z-index: 1000;
        max-width: 300px;
    `;
    
    document.body.appendChild(notification);
    
    setTimeout(() => {
        notification.style.animation = 'slideOut 0.3s ease';
        setTimeout(() => notification.remove(), 300);
    }, 3000);
}

// ========== APP CARD INTERACTIONS ==========
const appGetButtons = document.querySelectorAll('.trending-card .btn, .app-card .btn');
appGetButtons.forEach(button => {
    button.addEventListener('click', function(e) {
        e.preventDefault();
        const appCard = this.closest('.app-card, .trending-card');
        const appName = appCard.querySelector('.app-name')?.textContent || 'App';
        
        if (this.textContent.includes('Get')) {
            this.textContent = '✓ Added';
            this.style.opacity = '0.8';
            showNotification(`✅ ${appName} added to your library!`);
            
            setTimeout(() => {
                this.textContent = 'Get';
                this.style.opacity = '1';
            }, 2000);
        }
    });
});

// ========== PAGE LOAD ANIMATIONS ==========
window.addEventListener('load', function() {
    initializeTheme();
    
    // Animate elements on scroll
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.style.opacity = '1';
                entry.target.style.transform = 'translateY(0)';
            }
        });
    }, { threshold: 0.1 });
    
    document.querySelectorAll('.trending-card, .category-card, .app-card').forEach(el => {
        el.style.opacity = '0';
        el.style.transform = 'translateY(10px)';
        el.style.transition = 'opacity 0.3s ease, transform 0.3s ease';
        observer.observe(el);
    });
});

// ========== CATEGORY NAVIGATION ==========
const categoryCards = document.querySelectorAll('.category-card');
categoryCards.forEach(card => {
    card.addEventListener('click', function(e) {
        e.preventDefault();
        const category = this.textContent.split('\n')[1].toLowerCase();
        document.querySelector('.chip[data-filter="all"]')?.classList.remove('active');
        const matchingChip = document.querySelector(`.chip[data-filter="${category}"]`);
        if (matchingChip) {
            matchingChip.click();
            document.querySelector('#featured').scrollIntoView({ behavior: 'smooth' });
        }
    });
});

// ========== KEYBOARD SHORTCUTS ==========
document.addEventListener('keydown', function(e) {
    // Ctrl/Cmd + K to focus search
    if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        document.getElementById('search').focus();
    }
    
    // Escape to clear search
    if (e.key === 'Escape' && document.activeElement.id === 'search') {
        searchInput.value = '';
        searchClear.style.display = 'none';
        filterApps('');
    }
});

// ========== RESPONSIVE MENU ==========
function handleMobileMenu() {
    const navLinks = document.querySelector('.nav-links');
    if (window.innerWidth < 768) {
        // Mobile optimizations
        navLinks.style.gap = '4px';
    } else {
        navLinks.style.gap = '6px';
    }
}

window.addEventListener('resize', handleMobileMenu);
handleMobileMenu();

// ========== STYLE ANIMATIONS ==========
const style = document.createElement('style');
style.textContent = `
    @keyframes slideIn {
        from {
            transform: translateX(400px);
            opacity: 0;
        }
        to {
            transform: translateX(0);
            opacity: 1;
        }
    }
    
    @keyframes slideOut {
        from {
            transform: translateX(0);
            opacity: 1;
        }
        to {
            transform: translateX(400px);
            opacity: 0;
        }
    }
    
    .btn {
        position: relative;
        overflow: hidden;
    }
    
    .btn::after {
        content: '';
        position: absolute;
        top: var(--y, 0);
        left: var(--x, 0);
        width: var(--size, 0);
        height: var(--size, 0);
        background: rgba(255, 255, 255, 0.5);
        border-radius: 50%;
        transform: translate(-50%, -50%);
        pointer-events: none;
    }
`;
document.head.appendChild(style);

// ========== ACCESSIBILITY ==========
// Enhance keyboard navigation
document.addEventListener('keydown', function(e) {
    if (e.key === 'Tab') {
        document.body.classList.add('keyboard-nav');
    }
});

document.addEventListener('click', function() {
    document.body.classList.remove('keyboard-nav');
});

// ========== CONSOLE MESSAGE ==========
console.log('%cWelcome to IPABD! 🚀', 'font-size: 20px; color: #00D4FF; font-weight: bold; text-shadow: 0 0 10px #00D4FF;');
console.log('%cDiscover premium iOS apps and libraries', 'font-size: 14px; color: #6B5FFF;');
