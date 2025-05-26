document.addEventListener('DOMContentLoaded', function() {
    // Load partials
    const loadPartials = () => {
        fetch('../partials/header.html')
            .then(res => res.text())
            .then(data => {
                document.getElementById('header').innerHTML = data;
                initNavigation();
                setActiveMenu();
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

    // Initialize
    loadPartials();
    initFAQ();
});