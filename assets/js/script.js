// Main JavaScript for Matrix Colorist website

document.addEventListener('DOMContentLoaded', function() {
    // Get DOM elements
    const servicesButton = document.getElementById('services-button');
    const productsButton = document.getElementById('products-button');
    const servicesCatalog = document.getElementById('services-catalog');
    const productsCatalog = document.getElementById('products-catalog');
    const contactPurpose = document.getElementById('contact-purpose');
    const catalogTitle = document.getElementById('catalog-title');

    // Initialize the page with services view
    showServices();

    // Add event listeners to buttons
    servicesButton.addEventListener('click', showServices);
    productsButton.addEventListener('click', showProducts);

    // Setup product line expandable sections
    setupProductLines();

    // Functions
    function showServices() {
        // Update active button
        servicesButton.classList.add('active');
        productsButton.classList.remove('active');

        // Show services catalog, hide products catalog
        servicesCatalog.classList.add('active');
        productsCatalog.classList.remove('active');

        // Update text
        contactPurpose.textContent = 'записи';
        catalogTitle.textContent = 'услуг';

        // Animation
        animateCatalogChange();
    }

    function showProducts() {
        // Update active button
        productsButton.classList.add('active');
        servicesButton.classList.remove('active');

        // Show products catalog, hide services catalog
        productsCatalog.classList.add('active');
        servicesCatalog.classList.remove('active');

        // Update text
        contactPurpose.textContent = 'покупки';
        catalogTitle.textContent = 'продукции Matrix';

        // Animation
        animateCatalogChange();
    }

    function animateCatalogChange() {
        const catalogSection = document.querySelector('.catalog-section');
        catalogSection.style.animation = 'none';
        setTimeout(() => {
            catalogSection.style.animation = 'fadeIn 0.5s';
        }, 10);
    }

    function setupProductLines() {
        const productLineHeaders = document.querySelectorAll('.product-line-header');

        productLineHeaders.forEach(header => {
            header.addEventListener('click', function() {
                // Toggle the active class on the content
                const content = this.nextElementSibling;
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

});
