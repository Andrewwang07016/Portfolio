document.addEventListener('DOMContentLoaded', function() {
    const navbar = document.querySelector('.navbar');
    const scrollThreshold = 50; // Number of pixels to scroll before shrinking

    function handleScroll() {
        if (window.scrollY > scrollThreshold) {
            navbar.classList.add('shrink');
        } else {
            navbar.classList.remove('shrink');
        }
    }

    // Initial check in case page is loaded with scroll position
    handleScroll();

    // Throttle scroll event for better performance
    let isScrolling;
    window.addEventListener('scroll', function() {
        window.clearTimeout(isScrolling);
        isScrolling = setTimeout(handleScroll, 10);
    });
});
