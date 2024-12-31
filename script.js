// Initialize EmailJS
(function() {
    emailjs.init("YOUR_PUBLIC_KEY"); // Replace with your EmailJS public key
})();

// Initialize Rellax for parallax effect
const rellax = new Rellax('.rellax');

// Initialize typewriter effect
const typewriter = new Typewriter('#typewriter', {
    loop: true,
    delay: 75,
    deleteSpeed: 50
});

typewriter
    .typeString('UI/UX Designer')
    .pauseFor(2000)
    .deleteAll()
    .typeString('Web Developer')
    .pauseFor(2000)
    .deleteAll()
    .typeString('Creative Thinker')
    .pauseFor(2000)
    .start();

// Form validation and submission
class ContactForm {
    constructor() {
        this.form = document.getElementById('contactForm');
        this.statusDiv = document.getElementById('formStatus');
        this.submitButton = document.getElementById('submitButton');
        this.buttonText = this.submitButton.querySelector('.button-text');
        this.loadingSpinner = this.submitButton.querySelector('.loading-spinner');
        
        this.fields = {
            name: {
                element: document.getElementById('name'),
                validate: (value) => value.length >= 2 || 'Name must be at least 2 characters long'
            },
            email: {
                element: document.getElementById('email'),
                validate: (value) => {
                    const emailRegex = /^[^\s@]+@[^\s@]+\.[^\s@]+$/;
                    return emailRegex.test(value) || 'Please enter a valid email address'
                }
            },
            message: {
                element: document.getElementById('message'),
                validate: (value) => value.length >= 10 || 'Message must be at least 10 characters long'
            }
        };

        this.initializeEventListeners();
    }

    initializeEventListeners() {
        // Real-time validation
        Object.keys(this.fields).forEach(fieldName => {
            const field = this.fields[fieldName];
            field.element.addEventListener('input', () => this.validateField(fieldName));
            field.element.addEventListener('blur', () => this.validateField(fieldName));
        });

        // Form submission
        this.form.addEventListener('submit', (e) => this.handleSubmit(e));
    }

    validateField(fieldName) {
        const field = this.fields[fieldName];
        const value = field.element.value.trim();
        const errorElement = field.element.nextElementSibling;
        const validationResult = field.validate(value);

        if (validationResult === true || value === '') {
            errorElement.textContent = '';
            field.element.classList.remove('border-red-500');
            return true;
        } else {
            errorElement.textContent = validationResult;
            field.element.classList.add('border-red-500');
            return false;
        }
    }

    validateAll() {
        let isValid = true;
        Object.keys(this.fields).forEach(fieldName => {
            if (!this.validateField(fieldName)) {
                isValid = false;
            }
        });
        return isValid;
    }

    showStatus(message, isError = false) {
        this.statusDiv.textContent = message;
        this.statusDiv.className = `rounded-lg p-4 mb-4 ${
            isError ? 'bg-red-100 text-red-700' : 'bg-green-100 text-green-700'
        }`;
        this.statusDiv.classList.remove('hidden');
    }

    setLoading(isLoading) {
        this.submitButton.disabled = isLoading;
        this.buttonText.classList.toggle('hidden', isLoading);
        this.loadingSpinner.classList.toggle('hidden', !isLoading);
    }

    async handleSubmit(e) {
        e.preventDefault();

        if (!this.validateAll()) {
            this.showStatus('Please fix the errors in the form.', true);
            return;
        }

        this.setLoading(true);

        try {
            const response = await emailjs.sendForm(
                'YOUR_SERVICE_ID', // Replace with your EmailJS service ID
                'YOUR_TEMPLATE_ID', // Replace with your EmailJS template ID
                this.form
            );

            if (response.status === 200) {
                this.showStatus('Message sent successfully! I\'ll get back to you soon.');
                this.form.reset();
            } else {
                throw new Error('Failed to send message');
            }
        } catch (error) {
            console.error('Error sending email:', error);
            this.showStatus('Failed to send message. Please try again later.', true);
        } finally {
            this.setLoading(false);
        }
    }
}

// Project filtering functionality
document.addEventListener('DOMContentLoaded', () => {
    const filterButtons = document.querySelectorAll('.filter-btn');
    const projectCards = document.querySelectorAll('.project-card');

    filterButtons.forEach(button => {
        button.addEventListener('click', () => {
            // Remove active class from all buttons
            filterButtons.forEach(btn => btn.classList.remove('active'));
            // Add active class to clicked button
            button.classList.add('active');

            // Get the filter value
            const filter = button.getAttribute('data-filter');
            console.log('Selected filter:', filter);

            // Show/hide projects based on filter
            projectCards.forEach(card => {
                const category = card.getAttribute('data-category');
                console.log('Card category:', category);

                if (filter === 'all' || filter === category) {
                    card.style.display = 'block';
                } else {
                    card.style.display = 'none';
                }
            });
        });
    });
});

// Modal functionality
const initModal = () => {
    const modal = document.getElementById('projectModal');
    const modalContent = document.getElementById('modalContent');
    const closeModal = document.getElementById('closeModal');
    const portfolioLinks = document.querySelectorAll('.portfolio-link');

    portfolioLinks.forEach(link => {
        link.addEventListener('click', (e) => {
            e.preventDefault();
            const projectId = link.getAttribute('data-project');
            const projectData = getProjectData(projectId);
            openModal(projectData);
        });
    });

    closeModal.addEventListener('click', () => {
        modal.classList.add('modal-hide');
        setTimeout(() => {
            modal.style.display = 'none';
            modal.classList.remove('modal-hide');
        }, 300);
    });

    // Close modal on outside click
    modal.addEventListener('click', (e) => {
        if (e.target === modal) {
            closeModal.click();
        }
    });

    // Close modal on escape key
    document.addEventListener('keydown', (e) => {
        if (e.key === 'Escape' && modal.style.display === 'flex') {
            closeModal.click();
        }
    });
};

function openModal(projectData) {
    const modalContent = document.getElementById('modalContent');
    modalContent.innerHTML = `
        <h2 class="text-2xl font-bold mb-4">${projectData.title}</h2>
        <img src="${projectData.image}" alt="${projectData.title}" class="w-full rounded-lg mb-4">
        <p class="text-gray-600 mb-4">${projectData.description}</p>
        <div class="flex flex-wrap gap-2 mb-4">
            ${projectData.technologies.map(tech => 
                `<span class="px-3 py-1 bg-purple-100 text-purple-600 rounded-full">${tech}</span>`
            ).join('')}
        </div>
        <a href="${projectData.link}" target="_blank" 
           class="inline-block bg-purple-600 text-white px-6 py-2 rounded-lg hover:bg-purple-700 transition">
            View Project
        </a>
    `;
    modal.style.display = 'flex';
}

function getProjectData(projectId) {
    // Sample project data - replace with your actual project information
    const projects = {
        'project1': {
            title: 'E-commerce Platform',
            image: 'https://via.placeholder.com/600x400',
            description: 'A full-featured online store with cart functionality and payment integration.',
            technologies: ['React', 'Node.js', 'MongoDB', 'Stripe'],
            link: '#'
        },
        'project2': {
            title: 'Portfolio Website',
            image: 'https://via.placeholder.com/600x400',
            description: 'A responsive portfolio website showcasing creative work and projects.',
            technologies: ['HTML', 'TailwindCSS', 'JavaScript'],
            link: '#'
        },
        'project3': {
            title: 'Blog Platform',
            image: 'https://via.placeholder.com/600x400',
            description: 'A modern blogging platform with CMS integration and social features.',
            technologies: ['Next.js', 'GraphQL', 'PostgreSQL'],
            link: '#'
        }
    };
    return projects[projectId];
}

// Scroll spy functionality
const sections = document.querySelectorAll('section[id]');
const navLinks = document.querySelectorAll('nav a');

function updateActiveNavLink() {
    const scrollPosition = window.scrollY + 100; // Offset for better accuracy

    sections.forEach(section => {
        const sectionTop = section.offsetTop;
        const sectionHeight = section.offsetHeight;
        const sectionId = section.getAttribute('id');
        
        if (scrollPosition >= sectionTop && scrollPosition < sectionTop + sectionHeight) {
            navLinks.forEach(link => {
                link.classList.remove('nav-active');
                if (link.getAttribute('href') === `#${sectionId}`) {
                    link.classList.add('nav-active');
                }
            });
        }
    });
}

// Smooth scroll functionality
document.querySelectorAll('a[href^="#"]').forEach(anchor => {
    anchor.addEventListener('click', function(e) {
        e.preventDefault();
        const targetId = this.getAttribute('href');
        const targetSection = document.querySelector(targetId);
        
        if (targetSection) {
            const navHeight = document.querySelector('nav').offsetHeight;
            const targetPosition = targetSection.offsetTop - navHeight;
            
            window.scrollTo({
                top: targetPosition,
                behavior: 'smooth'
            });
        }
    });
});

// Add scroll event listener for scroll spy
window.addEventListener('scroll', updateActiveNavLink);
window.addEventListener('load', updateActiveNavLink);

// Initialize all components
document.addEventListener('DOMContentLoaded', () => {
    // Initialize AOS
    AOS.init({
        duration: 800,
        easing: 'ease-in-out',
        once: true,
        mirror: false
    });

    // Initialize Particles.js
    particlesJS.load('particles-js', 'particles.json', function() {
        console.log('particles.js loaded');
    });

    // Initialize other components
    new ContactForm();
    initModal();

    // Initialize smooth scroll behavior for navigation links
    document.querySelectorAll('a[href^="#"]').forEach(anchor => {
        anchor.addEventListener('click', function (e) {
            e.preventDefault();
            const target = document.querySelector(this.getAttribute('href'));
            if (target) {
                target.scrollIntoView({
                    behavior: 'smooth',
                    block: 'start'
                });
            }
        });
    });

    // Intersection Observer for fade-in animations
    const observerOptions = {
        threshold: 0.1
    };

    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('fade-in');
            }
        });
    }, observerOptions);

    document.querySelectorAll('.animate-on-scroll').forEach((element) => {
        observer.observe(element);
    });
});
