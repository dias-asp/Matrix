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
        authorBanner.style.display = 'none';

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
                // Toggle the active class on the content
                const _ = this.nextElementSibling;
                const content = _.nextElementSibling;
                content.classList.toggle('active');

                // Update the arrow icon
                const arrow = this.querySelector('.arrow');
                if (content.classList.contains('active')) {
                    arrow.textContent = '▲';
                } else {
                    arrow.textContent = '▼';
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

        // Products link
        menuProducts.addEventListener('click', (e) => {
            e.preventDefault();
            showProductsPage();
            menuIcon.classList.remove('active');
            menuDropdown.classList.remove('active');
        });
    }

});
