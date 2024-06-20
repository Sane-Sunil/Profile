// JavaScript to make services visible when scrolled into view

document.addEventListener("DOMContentLoaded", function() {
    // Select all service items
    const serviceItems = document.querySelectorAll("#servicesdiv ul li");

    // Function to check if element is in viewport
    function isInViewport(element) {
        const rect = element.getBoundingClientRect();
        return (
            rect.top >= 0 &&
            rect.left >= 0 &&
            rect.bottom <= (window.innerHeight || document.documentElement.clientHeight) &&
            rect.right <= (window.innerWidth || document.documentElement.clientWidth)
        );
    }

    // Function to loop through service items and add visible class if in viewport
    function checkVisibility() {
        serviceItems.forEach(item => {
            if (isInViewport(item)) {
                item.classList.add("visible");
            } else {
                item.classList.remove("visible");
            }
        });
    }

    // Event listener for scroll and resize to check visibility
    window.addEventListener("scroll", checkVisibility);
    window.addEventListener("resize", checkVisibility);

    // Initial check on page load
    checkVisibility();
});
