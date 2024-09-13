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

    function createFirefly() {
        const container = document.querySelector('.container');
        const firefly = document.createElement('div');
        firefly.classList.add('firefly');

        // Random size and position within the container
        const size = Math.random() * 1 + 5; // Firefly size between 5px and 15px
        firefly.style.width = `${size}px`;
        firefly.style.height = `${size}px`;
        firefly.style.top = `${Math.random() * 100}vh`;
        firefly.style.left = `${Math.random() * 100}vw`;

        // Random flicker animation duration
        const flickerDuration = Math.random() * 1 + 1; // Between 1s and 2s
        firefly.style.animationDuration = `${flickerDuration}s`;

        // Random movement
        const movementDuration = Math.random() * 4 + 2; // Between 2s and 6s
        firefly.style.animation = `move ${movementDuration}s linear infinite alternate, flicker ${flickerDuration}s infinite`;

        // Append to container
        container.appendChild(firefly);

        // Remove firefly after its animation ends + some extra time
        setTimeout(() => {
            firefly.remove();
        }, (flickerDuration + movementDuration) * 2000); // Total duration in milliseconds
    }

    // Create multiple fireflies
    setInterval(createFirefly, 300);

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
        'https://github.com/Sane-Sunil/Authentic-tech-master-2.O',
        'https://github.com/Sane-Sunil/public-rc-car',
        'https://github.com/Sane-Sunil/Skill_Nedu'       
    ];

    const personalAccessToken = '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'; // Replace with your actual token

    async function fetchRepoDescriptions() {
        const descriptionElement = document.getElementById('descriptions');
        descriptionElement.innerHTML = ''; // Clear previous descriptions

        const maxConcurrentRequests = 5;
        const queue = [];

        for (const url of repoUrls) {
            const parts = url.split('/');
            if (parts.length < 2) {
                descriptionElement.innerHTML += `<div class="repo-description error">Invalid URL: ${url}</div>`;
                continue;
            }

            const owner = parts[parts.length - 2];
            const repo = parts[parts.length - 1];
            const apiUrl = `https://api.github.com/repos/${owner}/${repo}`;

            const fetchPromise = fetch(apiUrl, {
                headers: {
                    'Authorization': `token ${personalAccessToken}`,
                    'Accept': 'application/vnd.github.v3+json'
                }
            })
            .then(response => {
                if (!response.ok) {
                    throw new Error('Network response was not ok');
                }
                return response.json();
            })
            .then(repoData => {
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
            })
            .catch(error => {
                const errorCard = document.createElement('div');
                errorCard.className = 'repo-description error';
                errorCard.innerHTML = `
                    <h3>${owner}/${repo}</h3>
                    <p>Error fetching data: ${error.message}</p>
                `;
                descriptionElement.appendChild(errorCard);
            });

            queue.push(fetchPromise);

            if (queue.length >= maxConcurrentRequests) {
                await Promise.race(queue);
                queue.splice(queue.indexOf(await Promise.race(queue)), 1);
            }
        }

        await Promise.all(queue);

        // Add event listeners to eye icons after all cards are created
        document.querySelectorAll('.eye-icon').forEach(icon => {
            icon.addEventListener('click', showIframe);
        });

        console.log('Eye icons set up:', document.querySelectorAll('.eye-icon').length);
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
