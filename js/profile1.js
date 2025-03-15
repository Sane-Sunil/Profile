document.addEventListener("DOMContentLoaded", function() {

    console.log('DOM fully loaded');

    // Hamburger menu functionality
    const hamburger = document.querySelector('.hamburger');
    const nav = document.querySelector('.nav');

    console.log('Hamburger element:', hamburger);
    console.log('Nav element:', nav);

    if (hamburger && nav) {
        hamburger.addEventListener('click', function() {
            console.log('Hamburger clicked');
            nav.classList.toggle('show');
            console.log('Nav classes after toggle:', nav.classList);
        });

        // Close menu when a link is clicked
        document.querySelectorAll('.nav a').forEach(link => {
            link.addEventListener('click', () => {
                nav.classList.remove('show');
                console.log('Link clicked, menu closed');
            });
        });
    } else {
        console.error('Hamburger or nav element not found');
    }

    // Typewriter effect
    class TxtType {
        constructor(el, toRotate, period) {
            this.toRotate = toRotate;
            this.el = el;
            this.loopNum = 0;
            this.period = parseInt(period, 10) || 2000;
            this.txt = '';
            this.isDeleting = false;
            this.tick();
        }

        tick() {
            const i = this.loopNum % this.toRotate.length;
            const fullTxt = this.toRotate[i];

            this.txt = this.isDeleting
                ? fullTxt.substring(0, this.txt.length - 1)
                : fullTxt.substring(0, this.txt.length + 1);

            this.el.querySelector('.wrap').innerHTML = this.txt;

            let delta = 200 - Math.random() * 100;

            if (this.isDeleting) delta /= 2;

            if (!this.isDeleting && this.txt === fullTxt) {
                delta = this.period;
                this.isDeleting = true;
            } else if (this.isDeleting && this.txt === '') {
                this.isDeleting = false;
                this.loopNum++;
                delta = 500;
            }

            setTimeout(() => this.tick(), delta);
        }
    }

    document.querySelectorAll('.typewrite').forEach(element => {
        const toRotate = element.getAttribute('data-type');
        const period = element.getAttribute('data-period');
        if (toRotate) {
            new TxtType(element, JSON.parse(toRotate), period);
        }
    });

    // Inject CSS for typewriter effect
    const css = document.createElement("style");
    css.type = "text/css";
    css.innerHTML = `
        .typewrite > .wrap {
            border-right: 0.08em solid #fff;
            animation: blink-caret 0.75s step-end infinite;
        }
        @keyframes blink-caret {
            from, to {
                border-color: transparent;
            }
            50% {
                border-color: #fff; /* Ensure this matches the cursor color */
            }
        }
    `;
    document.head.appendChild(css);

    // Firefly effect
    function createFirefly(container) {
        const firefly = document.createElement('div');
        firefly.classList.add('firefly');

        const size = Math.random() * 5 + 3; // Firefly size between 2px and 5px
        firefly.style.width = `${size}px`;
        firefly.style.height = `${size}px`;

        // Set initial position
        firefly.style.top = `${Math.random() * 100}%`;
        firefly.style.left = `${Math.random() * 100}%`;

        container.appendChild(firefly);

        // Animate the firefly
        animateFirefly(firefly, container);

        // setTimeout(() => {
        //     firefly.remove();
        // }, 15000); // Remove after 15 seconds
    }

    function animateFirefly(firefly, container) {
        const containerRect = container.getBoundingClientRect();
        const fireflyRect = firefly.getBoundingClientRect();

        const maxX = containerRect.width - fireflyRect.width;
        const maxY = containerRect.height - fireflyRect.height;

        const newX = Math.random() * maxX;
        const newY = Math.random() * maxY;

        const duration = Math.random() * 3000 + 2000; // Movement duration between 2-5 seconds

        firefly.animate([
            { transform: `translate(${firefly.offsetLeft}px, ${firefly.offsetTop}px)` },
            { transform: `translate(${newX}px, ${newY}px)` }
        ], {
            duration: duration,
            easing: 'ease-in-out',
            fill: 'forwards'
        });

        firefly.style.left = `${newX}px`;
        firefly.style.top = `${newY}px`;

        // Schedule the next animation
        setTimeout(() => animateFirefly(firefly, container), duration);
    }

    function addFirefliesToSection(sectionId, count) {
        const section = document.getElementById(sectionId);
        if (section) {
            section.style.position = 'relative';
            section.style.overflow = 'hidden';

            for (let i = 0; i < count; i++) {
                createFirefly(section);
            }

            // Create new fireflies periodically
            setInterval(() => createFirefly(section), 2000);
        }
    }

    // Add fireflies to specific sections
    addFirefliesToSection('aboutdiv', 200);
    addFirefliesToSection('servicesdiv', 150);
    addFirefliesToSection('skills', 100);
    addFirefliesToSection('projects', 150);
    addFirefliesToSection('contact', 100);

    const scrollers = document.querySelectorAll(".scroller");

    // If a user hasn't opted in for reduced motion, then we add the animation
    if (!window.matchMedia("(prefers-reduced-motion: reduce)").matches) {
        addAnimation();
    }

    function addAnimation() {
        scrollers.forEach((scroller) => {
            // Add data-animated="true" to every `.scroller` on the page
            scroller.setAttribute("data-animated", true);

            // Make an array from the elements within `.scroller-inner`
            const scrollerInner = scroller.querySelector(".scroller__inner");
            const scrollerContent = Array.from(scrollerInner.children);

            // For each item in the array, clone it
            // Add aria-hidden to it
            // Add it into the `.scroller-inner`
            scrollerContent.forEach((item) => {
                const duplicatedItem = item.cloneNode(true);
                duplicatedItem.setAttribute("aria-hidden", true);
                scrollerInner.appendChild(duplicatedItem);
            });
        });
    }

    const repoUrls = [
        'https://github.com/Sane-Sunil/Personal-weather-data',
        'https://github.com/Sane-Sunil/public-rc-car',
        'https://github.com/Sane-Sunil/Skill_Nedu'       
    ];

    async function fetchRepoDescriptions() {
        const descriptionElement = document.getElementById('descriptions');
        descriptionElement.innerHTML = ''; // Clear previous descriptions

        try {
            // First, get the token from config.json
            const configResponse = await fetch('/js/config.json');
            const config = await configResponse.json();
            const token = config.githubToken;

            // Fetch data for each repository
            const repositories = await Promise.all(repoUrls.map(async (url) => {
                const parts = url.split('/');
                const owner = parts[3];
                const repo = parts[4];
                const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;
                
                const response = await fetch(apiUrl, {
                    headers: {
                        'Authorization': `token ${token}`,
                        'Accept': 'application/vnd.github.v3+json'
                    }
                });
                
                if (!response.ok) {
                    throw new Error(`GitHub API responded with ${response.status}`);
                }
                
                return response.json();
            }));
            
            repositories.forEach(repoData => {
                let description = repoData.description || 'No description available';
                const words = description.split(' ');
                if (words.length > 20) {
                    description = words.slice(0, 20).join(' ') + '...';
                }
                
                const card = document.createElement('div');
                card.className = 'repo-description';
                card.style.opacity = '0';
                card.style.transform = 'translateY(20px)';
                card.innerHTML = `
                    <h3>${repoData.name}</h3>
                    <p>${description}</p>
                    <div class="card-actions">
                        <a href="${repoData.html_url}" target="_blank">View on GitHub</a>
                        <button class="eye-icon" data-homepage="${repoData.homepage}">👁️</button>
                    </div>
                `;
                descriptionElement.appendChild(card);
                
                setTimeout(() => {
                    card.style.transition = 'opacity 0.5s ease, transform 0.5s ease';
                    card.style.opacity = '1';
                    card.style.transform = 'translateY(0)';
                }, 100);
            });
        } catch (error) {
            console.error('Error fetching repository data:', error);
            descriptionElement.innerHTML = `<div class="repo-description error">Error fetching repository data: ${error.message}</div>`;
        }

        // Add event listeners to eye icons after all cards are created
        document.querySelectorAll('.eye-icon').forEach(icon => {
            icon.addEventListener('click', showIframe);
        });
    }

    // Fetch descriptions when the page loads
    fetchRepoDescriptions().then(() => {
        console.log('Descriptions fetched and displayed');
    });

    function showIframe(event) {
        console.log('showIframe called');
        const homepage = event.currentTarget.dataset.homepage;
        
        console.log('Homepage URL:', homepage);

        // Create modal
        const modal = document.createElement('div');
        modal.className = 'iframe-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <button class="close-modal">&times;</button>
                <div class="fancy-loader">
                    <div class="cube">
                        <div class="cube-face cube-face-front"></div>
                        <div class="cube-face cube-face-back"></div>
                        <div class="cube-face cube-face-right"></div>
                        <div class="cube-face cube-face-left"></div>
                        <div class="cube-face cube-face-top"></div>
                        <div class="cube-face cube-face-bottom"></div>
                    </div>
                </div>
                <iframe src="about:blank" frameborder="0" style="opacity: 0;"></iframe>
            </div>
        `;

        // Add modal to body
        document.body.appendChild(modal);

        // Close modal when clicking on close button or outside the iframe
        modal.querySelector('.close-modal').addEventListener('click', () => modal.remove());
        modal.addEventListener('click', (e) => {
            if (e.target === modal) modal.remove();
        });

        // Get the iframe and loader elements
        const iframe = modal.querySelector('iframe');
        const loader = modal.querySelector('.fancy-loader');

        if (!homepage) {
            console.log('No homepage URL available for this repository');
            iframe.srcdoc = '<html><body style="display: flex; justify-content: center; align-items: center; height: 100%; margin: 0; font-family: Arial, sans-serif; background-color: #f0f0f0;"><h2 style="color: #666;">Site not available</h2></body></html>';
            loader.style.display = 'none';
            iframe.style.opacity = 1;
        } else {
            console.log('Attempting to load:', homepage);
            iframe.src = homepage;
            
            iframe.onload = () => {
                loader.style.display = 'none';
                iframe.style.opacity = 1;
            };
            
            iframe.onerror = () => {
                console.error('Failed to load iframe content');
                iframe.srcdoc = '<html><body style="display: flex; justify-content: center; align-items: center; height: 100%; margin: 0; font-family: Arial, sans-serif; background-color: #f0f0f0;"><h2 style="color: #666;">Site not available</h2></body></html>';
                loader.style.display = 'none';
                iframe.style.opacity = 1;
            };
        }
    }

    document.addEventListener('DOMContentLoaded', function() {
        const hamburger = document.querySelector('.hamburger');
        const nav = document.querySelector('.nav');

        console.log('Hamburger element:', hamburger);
        console.log('Nav element:', nav);

        if (hamburger && nav) {
            hamburger.addEventListener('click', function() {
                console.log('Hamburger clicked');
                nav.classList.toggle('show');
                console.log('Nav classes after toggle:', nav.classList);
            });

            // Close menu when a link is clicked
            document.querySelectorAll('.nav a').forEach(link => {
                link.addEventListener('click', () => {
                    nav.classList.remove('show');
                    console.log('Link clicked, menu closed');
                });
            });
        } else {
            console.error('Hamburger or nav element not found');
        }
    });

    // Contact form handling
    const contactForm = document.getElementById('contact-form');
    if (contactForm) {
        contactForm.addEventListener('submit', function(e) {
            e.preventDefault();
            const name = this.elements.name.value;
            const email = this.elements.email.value;
            const message = this.elements.message.value;

            const mailtoLink = `mailto:sanesunil.falseofficial@gmail.com?subject=Message from ${encodeURIComponent(name)}&body=${encodeURIComponent(`${message}`)}`;

            window.location.href = mailtoLink;

            // Optionally, reset the form
            this.reset();

            // Optionally, show a message to the user
            alert('Thank you for your message! Your default email client should now open with a pre-filled email. Please send the email to complete the process.');
        });
    }
});
