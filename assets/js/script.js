// Main JavaScript for Matrix Colorist website

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const servicesButton = document.getElementById('services-button');
    const productsButton = document.getElementById('products-button');
    const servicesCatalog = document.getElementById('services-catalog');
    const productsCatalog = document.getElementById('products-catalog');
    const contactPurpose = document.getElementById('contact-purpose');

    // Main navigation buttons
    const mainPriceButton = document.getElementById('main-price-button');
    const mainCatalogButton = document.getElementById('main-catalog-button');

    // Page elements
    const mainPage = document.getElementById('main-page');
    const servicesPage = document.getElementById('services-page');
    const productsPage = document.getElementById('products-page');

    // Banner elements
    const topBanner = document.querySelector('.top-banner');
    const authorBanner = document.querySelector('.author-banner');
    const productsMainImage = document.querySelector('.products-main-image');
    const breadcrumbPath = document.querySelector('.breadcrumb-path');

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

    // Add event listeners to main navigation buttons
    mainPriceButton.addEventListener('click', function() {
        showServicesPage();
    });

    mainCatalogButton.addEventListener('click', function() {
        showProductsPage();
    });

    // Setup product line expandable sections
    setupProductLines();

    // Define global variables for filtering
    let resetCategoryFilteringFunc = null;
    let resetHairTypeFilteringFunc = null;

    // Setup gamma filtering
    setupGammaFiltering();

    // Setup category filtering
    setupCategoryFiltering();

    // Setup hair type filtering
    setupHairTypeFiltering();

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
        // authorBanner.style.display = 'block';

        breadcrumbPath.style.display = 'block';

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

        // Hide breadcrumb path by default
        breadcrumbPath.style.display = 'none';

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
        // Function to close all open submenus
        function closeAllSubmenus() {
            const activeSubmenus = document.querySelectorAll('.submenu.active, .submenu-items.active');
            activeSubmenus.forEach(submenu => {
                submenu.classList.remove('active');
            });
        }

        menuIcon.addEventListener('click', () => {
            menuIcon.classList.toggle('active');
            menuDropdown.classList.toggle('active');

            // If menu is being closed, close all submenus
            if (!menuDropdown.classList.contains('active')) {
                closeAllSubmenus();
            }
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
        const socialIcons = document.querySelector('.social-icons');

        // Function to ensure social icons are at the bottom
        function updateSocialIconsPosition() {
            // Get the height of the menu dropdown content
            const menuDropdownHeight = menuDropdown.scrollHeight;
            const viewportHeight = window.innerHeight;

            // If the menu dropdown content is taller than the viewport,
            // make sure the social icons are at the bottom of the content
            if (menuDropdownHeight > viewportHeight) {
                socialIcons.style.position = 'relative';
                socialIcons.style.bottom = 'auto';
            } else {
                socialIcons.style.position = 'sticky';
                socialIcons.style.bottom = '0';
            }
        }

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
                            // Update social icons position after submenu toggle
                            setTimeout(updateSocialIconsPosition, 100);
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
                        // Update social icons position after submenu toggle
                        setTimeout(updateSocialIconsPosition, 100);
                    }
                }
            });
        });

        // Initial update of social icons position
        updateSocialIconsPosition();

        // Update social icons position on window resize
        window.addEventListener('resize', updateSocialIconsPosition);
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
                    'unbreak-my-blonde', 'oil-wonders', 'total-treat', 'styling', 'vavoom'
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
                if (text.includes('total treat')) return 'total-treat';
                if (text.includes('styling')) return 'styling';
                if (text.includes('vavoom')) return 'vavoom';
            }

            return null;
        }

        // Function to determine if a product belongs to a specific gamma
        function isProductForGamma(productItem, gamma) {
            const productDetails = productItem.querySelector('.product-details h4');
            const productImage = productItem.querySelector('.product-image');

            if (!productDetails || !productImage) return false;

            const title = productDetails.textContent.toLowerCase();
            const imageSrc = productImage.src.toLowerCase();

            // For "Mx Styling" gamma
            if (gamma === 'styling') {
                // Check if the product is in the styling folder
                if (imageSrc.includes('styling')) return true;

                // Add high amplify spray to Mx Styling
                if (imageSrc.includes('high-amplify') && imageSrc.includes('spray')) return true;

                // Add high amplify dry shampoo to Mx Styling
                if (imageSrc.includes('high-amplify') && imageSrc.includes('dry')) return true;

                return false;
            }

            // For other gammas, use the product line gamma
            const productLine = productItem.closest('.product-line');
            if (productLine) {
                const productLineGamma = getProductLineGamma(productLine);
                return productLineGamma === gamma;
            }

            return false;
        }

        // Function to filter product lines by gamma
        function filterProductsByGamma(gamma) {
            // If not filtering by gamma, show all product lines
            if (gamma === null) {
                productLines.forEach(productLine => {
                    productLine.classList.remove('filtered-out');
                });

                // Hide breadcrumb path
                breadcrumbPath.style.display = 'none';

                // Show author banner
                authorBanner.style.display = 'block';
                return;
            }

            // Hide author banner for subcategories
            authorBanner.style.display = 'none';

            // Update breadcrumb path
            breadcrumbPath.style.display = 'block';

            // Force the breadcrumb to be visible by setting important flag
            breadcrumbPath.style.setProperty('display', 'block', 'important');

            // Get the gamma name from the filter element
            let gammaName = '';
            gammaFilters.forEach(filter => {
                if (filter.getAttribute('data-gamma') === gamma) {
                    gammaName = filter.textContent;
                }
            });

            // Set breadcrumb content
            breadcrumbPath.innerHTML = 'Продукция Matrix/Гамма/<span class="final">' + gammaName + '</span>';
            authorBanner.style.display = 'none';

            // For "styling" gamma, filter individual products
            if (gamma === 'styling') {
                // First, hide all product lines
                productLines.forEach(productLine => {
                    productLine.classList.add('filtered-out');

                    // Hide product line headers
                    const header = productLine.querySelector('.product-line-header');
                    if (header) {
                        header.style.display = 'none';
                    }

                    // Show the content container
                    const content = productLine.querySelector('.product-line-content');
                    if (content) {
                        content.classList.add('active');
                        content.style.marginTop = '0';

                        // Hide product descriptions
                        const productDescription = content.querySelector('.product-description');
                        if (productDescription) {
                            productDescription.style.display = 'none';
                        }
                    }
                });

                // Then, show only products for the selected gamma
                const productItems = document.querySelectorAll('.product-item');
                const stylingProducts = [];
                const highAmplifyProducts = [];
                const otherProducts = [];

                // First, categorize products
                productItems.forEach(productItem => {
                    const isForGamma = isProductForGamma(productItem, gamma);
                    const productLine = productItem.closest('.product-line');
                    const productImage = productItem.querySelector('.product-image');
                    const imageSrc = productImage ? productImage.src.toLowerCase() : '';

                    if (isForGamma) {
                        // Hide the product initially
                        productItem.style.display = 'none';

                        // Show the product line
                        if (productLine) {
                            productLine.classList.remove('filtered-out');
                        }

                        // Categorize the product
                        if (imageSrc.includes('styling')) {
                            stylingProducts.push(productItem);
                        } else if (imageSrc.includes('high-amplify')) {
                            highAmplifyProducts.push(productItem);
                        } else {
                            otherProducts.push(productItem);
                        }
                    } else {
                        // Hide products not in this gamma
                        productItem.style.display = 'none';
                    }
                });

                // Get the container for the products
                const productContainer = document.querySelector('.product-line:not(.filtered-out) .product-line-content');
                if (productContainer) {
                    // Clear the container
                    const originalChildren = Array.from(productContainer.children);
                    const nonProductItems = originalChildren.filter(child => !child.classList.contains('product-item'));

                    // Remove all product items
                    originalChildren.forEach(child => {
                        if (child.classList.contains('product-item')) {
                            productContainer.removeChild(child);
                        }
                    });

                    // First append styling products
                    stylingProducts.forEach(product => {
                        product.style.display = 'flex';
                        productContainer.appendChild(product);
                    });

                    // Then append high amplify products
                    highAmplifyProducts.forEach(product => {
                        product.style.display = 'flex';
                        productContainer.appendChild(product);
                    });

                    // Finally append other products
                    otherProducts.forEach(product => {
                        product.style.display = 'flex';
                        productContainer.appendChild(product);
                    });
                }

                // Make sure product containers use flexbox
                const productContainers = document.querySelectorAll('.product-line:not(.filtered-out) .product-line-content');
                productContainers.forEach(container => {
                    container.style.display = 'flex';
                    container.style.flexWrap = 'wrap';
                });
            } else {
                // For other gammas, filter by product line
                productLines.forEach(productLine => {
                    const productGamma = getProductLineGamma(productLine);
                    if (productGamma === gamma) {
                        productLine.classList.remove('filtered-out');

                        // Auto-expand the product line
                        const content = productLine.querySelector('.product-line-content');
                        const arrow = productLine.querySelector('.arrow');

                        // Expand the product line
                        content.classList.add('active');
                        if (arrow) {
                            arrow.classList.add('up');
                        }
                    } else {
                        productLine.classList.add('filtered-out');
                    }
                });
            }
            // authorBanner.style.display = 'none';
        }

        // Add event listeners to gamma filters
        gammaFilters.forEach(filter => {
            filter.addEventListener('click', function(e) {
                e.preventDefault();
                const gamma = this.getAttribute('data-gamma');

                // Reset category filtering if it's active
                if (resetCategoryFilteringFunc) {
                    resetCategoryFilteringFunc();
                }

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

            // Collapse all product lines
            productLines.forEach(productLine => {
                productLine.classList.remove('filtered-out');

                // Show product line headers
                const header = productLine.querySelector('.product-line-header');
                if (header) {
                    header.style.display = 'flex';
                }

                // Reset content container
                const content = productLine.querySelector('.product-line-content');
                if (content) {
                    content.classList.remove('active');
                    content.style.marginTop = '';

                    // Show product descriptions again
                    const productDescription = content.querySelector('.product-description');
                    if (productDescription) {
                        productDescription.style.display = '';
                    }
                }

                // Collapse the product line
                const arrow = productLine.querySelector('.arrow');
                if (arrow) {
                    arrow.classList.remove('up');
                }
            });

            // Show all products and reset order
            const productItems = document.querySelectorAll('.product-item');
            productItems.forEach(productItem => {
                productItem.style.display = '';
                productItem.style.order = '';
            });

            // Restore original DOM order if needed
            // This will be handled by page reload when clicking on main Products link
        });
    }
    // Function to setup category filtering
    function setupCategoryFiltering() {
        const categoryFilters = document.querySelectorAll('.category-filter');
        const productLines = document.querySelectorAll('.product-line');
        const productItems = document.querySelectorAll('.product-item');
        const allProductsLink = document.getElementById('menu-products');

        // Function to determine the category of a product
        function getProductCategory(productItem) {
            const productDetails = productItem.querySelector('.product-details h4');
            const productDescription = productItem.querySelector('.product-details p');
            const productImage = productItem.querySelector('.product-image');

            if (!productDetails) return null;

            const title = productDetails.textContent.toLowerCase();
            const description = productDescription ? productDescription.textContent.toLowerCase() : '';
            const imageSrc = productImage ? productImage.src.toLowerCase() : '';

            // Check for shampoo
            if (title.includes('шампунь') || imageSrc.includes('sham')) {
                return 'shampoo';
            }

            // Check for conditioner
            if (title.includes('кондиционер') || imageSrc.includes('cond')) {
                return 'conditioner';
            }

            // Check for mask
            if (title.includes('маска') || imageSrc.includes('mask')) {
                return 'mask';
            }

            // Check for leave-in products
            if (title.includes('несмываемый') || title.includes('спрей') || 
                title.includes('крем') || title.includes('бальзам') || 
                description.includes('несмываемый') || 
                imageSrc.includes('spray') || imageSrc.includes('cream') || 
                imageSrc.includes('balm')) {
                return 'leave-in';
            }

            // Check for oil
            if (title.includes('масло') || imageSrc.includes('oil')) {
                return 'oil';
            }

            // Check for spray
            if (title.includes('спрей') || imageSrc.includes('spray')) {
                return 'spray';
            }

            return null;
        }

        // Function to filter products by category
        function filterProductsByCategory(category) {
            // Reset hair type filtering if it's active
            if (resetHairTypeFilteringFunc) {
                resetHairTypeFilteringFunc();
            }

            // Hide author banner for subcategories
            authorBanner.style.display = 'none';

            // Update breadcrumb path
            breadcrumbPath.style.display = 'block';

            // Force the breadcrumb to be visible by setting important flag
            breadcrumbPath.style.setProperty('display', 'block', 'important');

            // Get the category name from the filter element
            let categoryName = '';
            categoryFilters.forEach(filter => {
                if (filter.getAttribute('data-category') === category) {
                    categoryName = filter.textContent;
                }
            });

            // Set breadcrumb content
            breadcrumbPath.innerHTML = 'Продукция Matrix/Тип продукта/<span class="final">' + categoryName + '</span>';

            authorBanner.style.display = 'none';
            // First, hide all product lines
            productLines.forEach(productLine => {
                productLine.classList.add('filtered-out');

                // Hide product line headers
                const header = productLine.querySelector('.product-line-header');
                if (header) {
                    header.style.display = 'none';
                }

                // Show the content container
                const content = productLine.querySelector('.product-line-content');
                if (content) {
                    content.classList.add('active');
                    content.style.marginTop = '0';

                    // Hide product descriptions
                    const productDescription = content.querySelector('.product-description');
                    if (productDescription) {
                        productDescription.style.display = 'none';
                    }
                }
            });

            // Then, show only products of the selected category
            productItems.forEach(productItem => {
                const productCategory = getProductCategory(productItem);
                const productLine = productItem.closest('.product-line');

                if (productCategory === category) {
                    productItem.style.display = 'flex';
                    if (productLine) {
                        productLine.classList.remove('filtered-out');
                    }
                } else {
                    productItem.style.display = 'none';
                }
            });

            // Show products page
            showProductsPage();
        }

        // Function to reset category filtering
        function resetCategoryFiltering() {
            // Show author banner
            authorBanner.style.display = 'block';

            // Show all product lines
            productLines.forEach(productLine => {
                productLine.classList.remove('filtered-out');

                // Show product line headers
                const header = productLine.querySelector('.product-line-header');
                if (header) {
                    header.style.display = 'flex';
                }

                // Reset content container
                const content = productLine.querySelector('.product-line-content');
                if (content) {
                    content.classList.remove('active');
                    content.style.marginTop = '';
                    content.style.display = ''; // Reset flexbox display

                    // Show product descriptions again
                    const productDescription = content.querySelector('.product-description');
                    if (productDescription) {
                        productDescription.style.display = '';
                    }
                }
            });

            // Show all products and reset order
            productItems.forEach(productItem => {
                productItem.style.display = '';
                productItem.style.order = ''; // Reset order property
            });
        }

        // Assign the resetCategoryFiltering function to the global variable
        resetCategoryFilteringFunc = resetCategoryFiltering;

        // Add event listeners to category filters
        categoryFilters.forEach(filter => {
            filter.addEventListener('click', function(e) {
                e.preventDefault();
                const category = this.getAttribute('data-category');
                filterProductsByCategory(category);

                // Close menu
                menuIcon.classList.remove('active');
                menuDropdown.classList.remove('active');
            });
        });

        // Reset filter when clicking on main Products link
        allProductsLink.addEventListener('click', function(e) {
            // Only reset if it's not a submenu toggle
            if (!e.target.classList.contains('has-submenu')) {
                resetCategoryFiltering();
            }
        });
    }

    // Function to setup hair type filtering
    function setupHairTypeFiltering() {
        const hairTypeFilters = document.querySelectorAll('.hair-type-filter');
        const productLines = document.querySelectorAll('.product-line');
        const productItems = document.querySelectorAll('.product-item');
        const allProductsLink = document.getElementById('menu-products');

        // Function to determine if a product belongs to a specific hair type
        function isProductForHairType(productItem, hairType) {
            const productDetails = productItem.querySelector('.product-details h4');
            const productImage = productItem.querySelector('.product-image');

            if (!productDetails || !productImage) return false;

            const title = productDetails.textContent.toLowerCase();
            const imageSrc = productImage.src.toLowerCase();

            // Check product line and specific product based on requirements

            // For "Окрашенные волосы"
            if (hairType === 'colored') {
                // oil wonders egyptian hibiscus
                if (imageSrc.includes('oil-wonders') && title.includes('egyptian hibiscus')) return true;

                // Unbreak my blonde шампунь, кондиционер только 300, и маску
                if (imageSrc.includes('unbreak-my-blonde')) {
                    if (imageSrc.includes('mask')) return true;
                    if ((imageSrc.includes('sham') || imageSrc.includes('cond')) && imageSrc.includes('300')) return true;
                    return false;
                }

                // So silver все товары без литровых форматов
                if (imageSrc.includes('so-silver') && !imageSrc.includes('1000')) return true;

                // brass off все товары без литровых форматов
                if (imageSrc.includes('brass-off') && !imageSrc.includes('1000')) return true;

                // miracle creator маску и спрей
                if (imageSrc.includes('miracle-creator')) return true;

                // color obsessed все товары без литровых форматов
                if (imageSrc.includes('color-obsessed') && !imageSrc.includes('1000')) return true;

                return false;
            }

            // For "Поврежденные волосы"
            if (hairType === 'damaged') {
                // total treat mask
                if (imageSrc.includes('total-treat')) return true;

                // instacure build-a-bond все товары без литровых форматов
                if (imageSrc.includes('instacure-bond') && !imageSrc.includes('1000')) return true;

                // instacure все товары без литровых форматов и без спрея 500 мл
                if (imageSrc.includes('instacure') && !imageSrc.includes('1000') && !imageSrc.includes('spray 500')) return true;

                // miracle creator mask and spray
                if (imageSrc.includes('miracle-creator')) return true;

                return false;
            }

            // For "Ломкие и секущиеся кончики"
            if (hairType === 'brittle') {
                // oil wonders amazonian murumuru
                if (imageSrc.includes('oil-wonders') && title.includes('amazonian murumuru')) return true;

                // oil wonders indian amla
                if (imageSrc.includes('oil-wonders') && title.includes('indian amla')) return true;

                // A curl can dream mask
                if (imageSrc.includes('curl') && imageSrc.includes('mask')) return true;

                // food for soft все товары без литровых форматов
                if (imageSrc.includes('food-for-soft') && !imageSrc.includes('1000')) return true;

                // instacure все товары без литровых форматов
                if (imageSrc.includes('instacure') && !imageSrc.includes('1000')) return true;

                // miracle creator mask and spray
                if (imageSrc.includes('miracle-creator')) return true;

                return false;
            }

            // For "Пушащиеся и непослушные волосы"
            if (hairType === 'frizzy') {
                // Mega sleek все товары без литровых форматов
                if (imageSrc.includes('mega-sleek') && !imageSrc.includes('1000')) return true;

                // A curl can dream cream, mask, oil, gel
                if (imageSrc.includes('curl') && (imageSrc.includes('cream') || imageSrc.includes('mask') || imageSrc.includes('oil') || imageSrc.includes('gel'))) return true;

                // miracle creator mask, spray
                if (imageSrc.includes('miracle-creator')) return true;

                // oil wonders amazonian murumuru
                if (imageSrc.includes('oil-wonders') && title.includes('amazonian murumuru')) return true;

                // instacure spray 500ml
                if (imageSrc.includes('instacure') && (imageSrc.includes('spray 500') || imageSrc.includes('spray%20500'))) return true;

                return false;
            }

            // For "Сухие волосы"
            if (hairType === 'dry') {
                // food for soft все товары без литровых форматов
                if (imageSrc.includes('food-for-soft') && !imageSrc.includes('1000')) return true;

                // a curl can dream cream, oil, mask
                if (imageSrc.includes('curl') && (imageSrc.includes('cream') || imageSrc.includes('oil') || imageSrc.includes('mask'))) return true;

                // high amplify water
                if (imageSrc.includes('high-amplify') && imageSrc.includes('water')) return true;

                return false;
            }

            // For "Кудрявые волосы"
            if (hairType === 'curly') {
                // a curl can dream все товары без литровых форматов
                if (imageSrc.includes('curl') && !imageSrc.includes('1000')) return true;

                return false;
            }

            // For "Блонд"
            if (hairType === 'blonde') {
                // unbreak my blonde все товары без литровых форматов
                if (imageSrc.includes('unbreak-my-blonde') && !imageSrc.includes('1000')) return true;

                // so silver все товары без литровых форматов
                if (imageSrc.includes('so-silver') && !imageSrc.includes('1000')) return true;

                return false;
            }

            // For "Тонкие и редеющие волосы"
            if (hairType === 'thin') {
                // high amplify все товары без литровых форматов и без сухого шампуня
                if (imageSrc.includes('high-amplify') && !imageSrc.includes('1000') && !imageSrc.includes('dry')) return true;

                return false;
            }

            return false;
        }

        // Function to filter products by hair type
        function filterProductsByHairType(hairType) {
            // Reset category filtering if it's active
            if (resetCategoryFilteringFunc) {
                resetCategoryFilteringFunc();
            }

            // Hide author banner for subcategories
            authorBanner.style.display = 'none';

            // Update breadcrumb path
            breadcrumbPath.style.display = 'block';

            // Force the breadcrumb to be visible by setting important flag
            breadcrumbPath.style.setProperty('display', 'block', 'important');

            // Get the hair type name from the filter element
            let hairTypeName = '';
            hairTypeFilters.forEach(filter => {
                if (filter.getAttribute('data-hair-type') === hairType) {
                    hairTypeName = filter.textContent;
                }
            });

            // Set breadcrumb content
            breadcrumbPath.innerHTML = 'Продукция Matrix/Тип волос/<span class="final">' + hairTypeName + '</span>';

            authorBanner.style.display = 'none';
            // First, hide all product lines
            productLines.forEach(productLine => {
                productLine.classList.add('filtered-out');

                // Hide product line headers
                const header = productLine.querySelector('.product-line-header');
                if (header) {
                    header.style.display = 'none';
                }

                // Show the content container
                const content = productLine.querySelector('.product-line-content');
                if (content) {
                    content.classList.add('active');
                    content.style.marginTop = '0';

                    // Hide product descriptions
                    const productDescription = content.querySelector('.product-description');
                    if (productDescription) {
                        productDescription.style.display = 'none';
                    }
                }
            });

            // Then, show only products for the selected hair type
            productItems.forEach(productItem => {
                const isForHairType = isProductForHairType(productItem, hairType);
                const productLine = productItem.closest('.product-line');

                if (isForHairType) {
                    productItem.style.display = 'flex';
                    if (productLine) {
                        productLine.classList.remove('filtered-out');
                    }
                } else {
                    productItem.style.display = 'none';
                }
            });

            // Show products page
            showProductsPage();
        }

        // Function to reset hair type filtering
        function resetHairTypeFiltering() {
            // Hide breadcrumb path
            breadcrumbPath.style.display = 'none';

            // Show all product lines
            productLines.forEach(productLine => {
                productLine.classList.remove('filtered-out');

                // Show product line headers
                const header = productLine.querySelector('.product-line-header');
                if (header) {
                    header.style.display = 'flex';
                }

                // Reset content container
                const content = productLine.querySelector('.product-line-content');
                if (content) {
                    content.classList.remove('active');
                    content.style.marginTop = '';
                    content.style.display = ''; // Reset flexbox display

                    // Show product descriptions again
                    const productDescription = content.querySelector('.product-description');
                    if (productDescription) {
                        productDescription.style.display = '';
                    }
                }
            });

            // Show all products and reset order
            productItems.forEach(productItem => {
                productItem.style.display = '';
                productItem.style.order = ''; // Reset order property
            });
        }

        // Assign the resetHairTypeFiltering function to the global variable
        resetHairTypeFilteringFunc = resetHairTypeFiltering;

        // Add event listeners to hair type filters
        hairTypeFilters.forEach(filter => {
            filter.addEventListener('click', function(e) {
                e.preventDefault();
                const hairType = this.getAttribute('data-hair-type');
                filterProductsByHairType(hairType);

                // Close menu
                menuIcon.classList.remove('active');
                menuDropdown.classList.remove('active');
            });
        });

        // Reset filter when clicking on main Products link
        allProductsLink.addEventListener('click', function(e) {
            // Only reset if it's not a submenu toggle
            if (!e.target.classList.contains('has-submenu')) {
                resetHairTypeFiltering();
            }
        });
    }
});
