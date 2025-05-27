document.addEventListener('DOMContentLoaded', function() {
    // Load partials
    const loadPartials = () => {
        fetch('../partials/header.html')
            .then(res => res.text())
            .then(data => {
                document.getElementById('header').innerHTML = data;
                initNavigation();
                setActiveMenu();
                updateAuthButtons(); // Call this after header is loaded and navigation initialized
            });

        fetch('../partials/footer.html')
            .then(res => res.text())
            .then(data => document.getElementById('footer').innerHTML = data);
    };

    // Navigation management
    const initNavigation = () => {
        const hamburger = document.querySelector('.hamburger');
        const menuItems = document.querySelector('.menu-items');
        const dropdowns = document.querySelectorAll('.dropdown');
        const isMobile = window.innerWidth <= 768;

        // Hamburger menu toggle
        if (hamburger && menuItems) {
            hamburger.addEventListener('click', (e) => {
                e.stopPropagation();
                hamburger.classList.toggle('active');
                menuItems.classList.toggle('active');
            });
        }

        // Dropdown functionality
        dropdowns.forEach(dropdown => {
            const trigger = dropdown.querySelector('.dropdown-trigger');
            
            // Desktop click handler
            if (!isMobile && trigger) {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    toggleDropdown(dropdown);
                });
            }

            // Mobile touch handler
            if (isMobile && trigger) {
                trigger.addEventListener('click', (e) => {
                    e.preventDefault();
                    e.stopPropagation();
                    dropdown.classList.toggle('active');
                });
            }
        });

        // Close all dropdowns on outside click
        document.addEventListener('click', (e) => {
            if (!e.target.closest('.dropdown')) {
                closeAllDropdowns();
            }
            if (isMobile && !e.target.closest('.navbar-container')) {
                closeMobileMenu();
            }
        });

        // Resize handler
        window.addEventListener('resize', () => {
            closeAllDropdowns();
            closeMobileMenu();
            updateAuthButtons(); // Update buttons on resize in case of layout changes
        });
    };

    // Dropdown management
    const toggleDropdown = (dropdown) => {
        const isOpen = dropdown.classList.contains('active');
        closeAllDropdowns();
        if (!isOpen) {
            dropdown.classList.add('active');
        }
    };

    const closeAllDropdowns = () => {
        document.querySelectorAll('.dropdown').forEach(d => {
            d.classList.remove('active');
        });
    };

    const closeMobileMenu = () => {
        document.querySelector('.hamburger')?.classList.remove('active');
        document.querySelector('.menu-items')?.classList.remove('active');
    };

    // Active menu state
    const setActiveMenu = () => {
        const currentPath = window.location.pathname.split('/').pop();
        const menuItems = document.querySelectorAll('.menu-item');
        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        // List of feature pages that require login
        const featurePages = ['coInfo.html', 'coTrack.html', 'coSight.html', 'coBudget.html', 'coSurvive.html'];

        // Check if the current page is a feature page and if the user is not logged in
        if (featurePages.includes(currentPath) && !isLoggedIn) {
            // Redirect to login page if not logged in and trying to access a feature page
            window.location.href = '../auth/login.html';
            return; // Stop further execution of setActiveMenu
        }
        
        menuItems.forEach(item => {
            const itemPath = item.getAttribute('href')?.split('/').pop();
            const isActive = currentPath === itemPath || 
                           (currentPath.startsWith('co') && itemPath === 'features/');
            
            item.classList.toggle('active', isActive);
        });
    };

    // FAQ Accordion
    const initFAQ = () => {
        document.querySelectorAll('.faq-header').forEach(header => {
            header.addEventListener('click', () => {
                header.parentElement.classList.toggle('active');
            });
        });
    };

    // --- Authentication State Management ---
    const updateAuthButtons = () => {
        const authButtonsContainer = document.getElementById('authButtons');
        if (!authButtonsContainer) return; // Ensure the container exists

        const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';

        if (isLoggedIn) {
            // If logged in, show Log Out button
            authButtonsContainer.innerHTML = `
                <a href="#" id="logoutBtn" class="btn-outline">Log Out</a>
            `;
            document.getElementById('logoutBtn').addEventListener('click', function(e) {
                e.preventDefault();
                localStorage.removeItem('isLoggedIn'); // Clear login state
                localStorage.removeItem('userEmail'); // Clear user email
                updateAuthButtons(); // Update buttons immediately
                window.location.href = '../index.html'; // Redirect to home or login page
            });
        } else {
            // If logged out, show Log In and Sign Up buttons
            authButtonsContainer.innerHTML = `
                <a href="../auth/login.html" class="btn-outline">Log In</a>
                <a href="../auth/signup.html" class="btn-filled">Sign Up</a>
            `;
        }
    };

    // Initialize
    loadPartials();
    initFAQ();
    // updateAuthButtons is now called within loadPartials after header is rendered
});
