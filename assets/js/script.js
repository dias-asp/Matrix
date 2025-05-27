// Main JavaScript for Matrix Colorist website

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const servicesButton = document.getElementById('services-button');
    const productsButton = document.getElementById('products-button');
    const servicesCatalog = document.getElementById('services-catalog');
    const productsCatalog = document.getElementById('products-catalog');
    const contactPurpose = document.getElementById('contact-purpose');

    // Page elements
    const mainPage = document.getElementById('main-page');
    const servicesPage = document.getElementById('services-page');
    const productsPage = document.getElementById('products-page');

    // Banner elements
    const topBanner = document.querySelector('.top-banner');
    const authorBanner = document.querySelector('.author-banner');
    const productsMainImage = document.querySelector('.products-main-image');

    // Menu elements
    const menuIcon = document.querySelector('.menu-icon');
    const menuDropdown = document.querySelector('.menu-dropdown');
    const menuServices = document.getElementById('menu-services');
    const menuProducts = document.getElementById('menu-products');

    // Initialize all carousels
    const carouselContainers = document.querySelectorAll('.carousel-container');
    carouselContainers.forEach(container => {
        initCarousel(container);
    });

    // Initialize menu
    initMenu();

    // Add event listeners to buttons
    /*servicesButton.addEventListener('click', function() {
        // Do nothing - services should only be shown from menu
    });
    productsButton.addEventListener('click', function() {
        // Do nothing - products should only be shown from menu
    });*/

    // Setup product line expandable sections
    setupProductLines();

    // Setup gamma filtering
    setupGammaFiltering();

    showMainPage();

    // Functions
    function showMainPage() {
        // Hide all pages
        hideAllPages();

        // Show main page
        mainPage.classList.add('active');
        topBanner.classList.add('active');

        // Show banners on main page
        topBanner.style.display = 'flex';
        authorBanner.style.display = 'block';

        // Add main-page-active class to body
        document.body.classList.add('main-page-active');
        document.body.classList.remove('products-page-active');

        // Hide products main image
        // productsMainImage.classList.remove('active');
    }

    function showServicesPage() {
        // Hide all pages
        hideAllPages();

        // Show services page
        servicesPage.classList.add('active');

        // Ensure services catalog is active
        servicesCatalog.classList.add('active');

        // Update active button state
        // servicesButton.classList.add('active');
        // productsButton.classList.remove('active');

        // Hide banners on services page
        topBanner.style.display = 'none';
        // authorBanner.style.display = 'none';

        // Add products-page-active class to body to apply the same font size as products page
        document.body.classList.add('products-page-active');
        document.body.classList.remove('main-page-active');

        // Hide products main image
        // productsMainImage.classList.remove('active');
    }

    function showProductsPage() {
        // Hide all pages
        hideAllPages();

        // Show products page
        productsPage.classList.add('active');

        // Ensure products catalog is active
        productsCatalog.classList.add('active');

        // Update active button state
        // productsButton.classList.add('active');
        // servicesButton.classList.remove('active');

        // Hide banners on products page
        topBanner.style.display = 'none';
        authorBanner.style.display = 'block';

        // Add products-page-active class to body
        document.body.classList.add('products-page-active');
        document.body.classList.remove('main-page-active');

        // Show products main image
        // productsMainImage.classList.add('active');
        productsMainImage.style.display = 'block';
        // setupProductLines();
    }

    function hideAllPages() {
        // Hide all pages
        mainPage.classList.remove('active');
        topBanner.classList.remove('active');
        servicesPage.classList.remove('active');
        productsPage.classList.remove('active');

        // Ensure banners are hidden by default
        topBanner.style.display = 'none';
        // authorBanner.style.display = 'none';

        // Hide products main image by default
        // productsMainImage.classList.remove('active');
        productsMainImage.style.display = 'none';

        // Remove page-specific classes from body
        document.body.classList.remove('main-page-active');
        document.body.classList.remove('products-page-active');

        // menuDropdown.classList.remove('active');
        // menuDropdown.style.display = 'none';
        // menuIcon.classList.add('active');
    }

    function setupProductLines() {
        const productLineHeaders = document.querySelectorAll('.product-line-header');
        // console.log(productLineHeaders);
        productLineHeaders.forEach(header => {
            // console.log(header);
            header.addEventListener('click', function() {
                // Get the parent product-line element
                const productLine = this.closest('.product-line');

                // Toggle the active class on the content (now it's the next sibling of the arrow)
                const content = productLine.querySelector('.product-line-content');
                content.classList.toggle('active');

                // Update the arrow icon (now it's a direct child of product-line)
                const arrow = productLine.querySelector('.arrow');
                if (content.classList.contains('active')) {
                    arrow.classList.add('up');
                } else {
                    arrow.classList.remove('up');
                }
            });
        });
    }

    // Carousel functionality
    function initCarousel(container) {
        const carouselTrack = container.querySelector('.carousel-track');
        const carouselSlides = container.querySelectorAll('.carousel-slide');
        const carouselIndicators = container.querySelectorAll('.carousel-indicator');
        const carouselNextButton = container.querySelector('.carousel-arrow');
        const carouselPrevButton = container.querySelector('.carousel-arrow-left');

        let currentSlide = 0;
        const slideCount = carouselSlides.length;
        let startX, moveX;

        // Set up indicators
        carouselIndicators.forEach((indicator, index) => {
            indicator.addEventListener('click', () => {
                goToSlide(index);
            });
        });

        // Set up next button
        if (carouselNextButton) {
            carouselNextButton.addEventListener('click', () => {
                nextSlide();
            });
        }

        // Set up prev button
        if (carouselPrevButton) {
            carouselPrevButton.addEventListener('click', () => {
                prevSlide();
            });
        }

        // Set up touch events for mobile swipe
        carouselTrack.addEventListener('touchstart', (e) => {
            startX = e.touches[0].clientX;
        }, { passive: true });

        carouselTrack.addEventListener('touchmove', (e) => {
            if (!startX) return;
            moveX = e.touches[0].clientX;
            const diff = startX - moveX;

            // Prevent default only if swiping horizontally
            if (Math.abs(diff) > 5) {
                e.preventDefault();
            }
        }, { passive: false });

        carouselTrack.addEventListener('touchend', (e) => {
            if (!startX || !moveX) return;

            const diff = startX - moveX;

            if (diff > 50) { // Swipe left
                nextSlide();
            } else if (diff < -50) { // Swipe right
                prevSlide();
            }

            startX = null;
            moveX = null;
        });

        function nextSlide() {
            currentSlide = (currentSlide + 1) % slideCount;
            goToSlide(currentSlide);
        }

        function prevSlide() {
            currentSlide = (currentSlide - 1 + slideCount) % slideCount;
            goToSlide(currentSlide);
        }

        function goToSlide(index) {
            // Calculate the percentage based on the number of slides
            const slidePercentage = 100 / slideCount;
            carouselTrack.style.transform = `translateX(-${index * slidePercentage}%)`;

            // Update indicators
            carouselIndicators.forEach((indicator, i) => {
                if (i === index) {
                    indicator.classList.add('active');
                } else {
                    indicator.classList.remove('active');
                }
            });

            currentSlide = index;
        }
    }

    // Menu functionality
    function initMenu() {
        menuIcon.addEventListener('click', () => {
            menuIcon.classList.toggle('active');
            menuDropdown.classList.toggle('active');
        });

        // Close menu when clicking outside
        document.addEventListener('click', (e) => {
            if (!menuIcon.contains(e.target) && !menuDropdown.contains(e.target)) {
                menuIcon.classList.remove('active');
                menuDropdown.classList.remove('active');
            }
        });

        // Menu links functionality
        // Home link
        const homeLink = document.querySelector('.menu-dropdown a[href="index.html"]');
        homeLink.addEventListener('click', (e) => {
            e.preventDefault();
            showMainPage();
            menuIcon.classList.remove('active');
            menuDropdown.classList.remove('active');
        });

        // Services link
        menuServices.addEventListener('click', (e) => {
            e.preventDefault();
            showServicesPage();
            menuIcon.classList.remove('active');
            menuDropdown.classList.remove('active');
        });

        // Products link - show products page but don't toggle submenu
        menuProducts.addEventListener('click', (e) => {
            // Only prevent default and show products page if it's not a submenu toggle
            if (!e.target.classList.contains('has-submenu')) {
                e.preventDefault();
                showProductsPage();
                menuIcon.classList.remove('active');
                menuDropdown.classList.remove('active');
            }
        });

        // Setup submenu toggling on click
        setupSubmenuToggle();
    }

    // Function to setup submenu toggling on click
    function setupSubmenuToggle() {
        // Find all elements with has-submenu class
        const submenuParents = document.querySelectorAll('.has-submenu');

        submenuParents.forEach(parent => {
            parent.addEventListener('click', function(e) {
                e.preventDefault();
                e.stopPropagation(); // Prevent event from bubbling up

                // Check if the click was on the arrow (pseudo-element)
                const rect = this.getBoundingClientRect();
                const isClickOnArrow = (e.clientX > rect.right - 30); // Assuming arrow is within 30px from right edge

                // For the main Products link
                if (this.id === 'menu-products') {
                    if (isClickOnArrow) {
                        // If clicking on the arrow, toggle the submenu
                        const submenu = this.nextElementSibling;
                        if (submenu) {
                            submenu.classList.toggle('active');
                        }
                    } else {
                        // If clicking on the text, show products page
                        showProductsPage();
                        menuIcon.classList.remove('active');
                        menuDropdown.classList.remove('active');
                    }
                } 
                // For the Gamma link
                else if (this.classList.contains('submenu-category-link')) {
                    // For Gamma, always toggle the submenu
                    const submenu = this.nextElementSibling;
                    if (submenu) {
                        submenu.classList.toggle('active');
                    }
                }
            });
        });
    }

    // Function to setup gamma filtering
    function setupGammaFiltering() {
        const gammaFilters = document.querySelectorAll('.gamma-filter');
        const productLines = document.querySelectorAll('.product-line');
        const allProductsLink = document.getElementById('menu-products');

        // Function to extract gamma from product line
        function getProductLineGamma(productLine) {
            // Try to get gamma from image src
            const img = productLine.querySelector('.product-line-image');
            if (img && img.src) {
                const src = img.src;
                // Check for each gamma in the src
                const gammas = [
                    'food-for-soft', 'instacure', 'curl', 'color-obsessed', 
                    'glow-mania', 'high-amplify', 'miracle-creator', 'brass-off', 
                    'so-silver', 'keep-me-vivid', 'dark-envy', 'mega-sleek', 
                    'unbreak-my-blonde', 'oil-wonders'
                ];

                for (const gamma of gammas) {
                    if (src.includes(gamma)) {
                        return gamma;
                    }
                }
            }

            // If not found in image, try to get from header text
            const header = productLine.querySelector('.product-line-header h3');
            if (header) {
                const text = header.textContent.toLowerCase();
                if (text.includes('food for soft')) return 'food-for-soft';
                if (text.includes('instacure') && !text.includes('pre-bonded')) return 'instacure';
                if (text.includes('instacure') && text.includes('pre-bonded')) return 'instacure-bond';
                if (text.includes('curl')) return 'curl';
                if (text.includes('color obsessed')) return 'color-obsessed';
                if (text.includes('glow mania')) return 'glow-mania';
                if (text.includes('high amplify')) return 'high-amplify';
                if (text.includes('miracle creator')) return 'miracle-creator';
                if (text.includes('brass off')) return 'brass-off';
                if (text.includes('so silver')) return 'so-silver';
                if (text.includes('keep me vivid')) return 'keep-me-vivid';
                if (text.includes('dark envy')) return 'dark-envy';
                if (text.includes('mega sleek')) return 'mega-sleek';
                if (text.includes('unbreak my blonde')) return 'unbreak-my-blonde';
                if (text.includes('oil wonders')) return 'oil-wonders';
            }

            return null;
        }

        // Function to filter product lines by gamma
        function filterProductsByGamma(gamma) {
            productLines.forEach(productLine => {
                const productGamma = getProductLineGamma(productLine);
                if (gamma === null || productGamma === gamma) {
                    productLine.classList.remove('filtered-out');
                } else {
                    productLine.classList.add('filtered-out');
                }
            });
        }

        // Add event listeners to gamma filters
        gammaFilters.forEach(filter => {
            filter.addEventListener('click', function(e) {
                e.preventDefault();
                const gamma = this.getAttribute('data-gamma');
                filterProductsByGamma(gamma);

                // Close menu
                menuIcon.classList.remove('active');
                menuDropdown.classList.remove('active');

                // Show products page
                showProductsPage();
            });
        });

        // Reset filter when clicking on main Products link
        allProductsLink.addEventListener('click', function(e) {
            // The original event listener will show the products page
            // We just need to reset the filter
            filterProductsByGamma(null);
        });
    }
});
