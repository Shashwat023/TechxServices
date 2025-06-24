class CoursesSlider {
    constructor() {
        this.currentSlide = 0;
        this.totalSlides = 0;
        this.slidesPerView = this.getSlidesPerView();
        this.slideWidth = 0;
        this.isAnimating = false;
        this.autoPlayInterval = null;
        this.autoPlayDelay = 5000;
        this.touchStartX = 0;
        this.touchEndX = 0;
        this.isDragging = false;
        
        this.init();
    }
    
    init() {
        this.cacheElements();
        this.calculateDimensions();
        this.bindEvents();
        this.initializeCards();
        this.updateDots();
        this.startAutoPlay();
    }
    
    cacheElements() {
        this.slider = document.getElementById('coursesSlider');
        this.track = document.getElementById('coursesTrack');
        this.cards = document.querySelectorAll('.course-card');
        this.prevBtn = document.getElementById('prevBtn');
        this.nextBtn = document.getElementById('nextBtn');
        this.dots = document.querySelectorAll('.dot');
        this.viewAllBtn = document.querySelector('.view-all-btn');
    }
    
    calculateDimensions() {
        this.totalSlides = Math.ceil(this.cards.length / this.slidesPerView);
        this.slideWidth = this.slider.offsetWidth;
    }
    
    getSlidesPerView() {
        const width = window.innerWidth;
        if (width >= 1200) return 3;
        if (width >= 768) return 2;
        return 1;
    }
    
    bindEvents() {
        // Navigation buttons
        this.prevBtn?.addEventListener('click', () => this.prevSlide());
        this.nextBtn?.addEventListener('click', () => this.nextSlide());
        
        // Dots navigation
        this.dots.forEach((dot, index) => {
            dot.addEventListener('click', () => this.goToSlide(index));
        });
        
        // Touch events
        this.initTouchEvents();
        
        // Mouse events for desktop dragging
        this.initMouseEvents();
        
        // Auto-play controls
        this.slider?.addEventListener('mouseenter', () => this.pauseAutoPlay());
        this.slider?.addEventListener('mouseleave', () => this.resumeAutoPlay());
        
        // Course card interactions
        this.initCardInteractions();
        
        // View all button
        this.viewAllBtn?.addEventListener('click', () => this.handleViewAll());
        
        // Keyboard navigation
        document.addEventListener('keydown', (e) => {
            if (e.key === 'ArrowLeft') {
                e.preventDefault();
                this.prevSlide();
            } else if (e.key === 'ArrowRight') {
                e.preventDefault();
                this.nextSlide();
            }
        });
        
        // Resize handler
        window.addEventListener('resize', this.debounce(() => {
            this.handleResize();
        }, 250));
        
        // Visibility change
        document.addEventListener('visibilitychange', () => {
            if (document.hidden) {
                this.pauseAutoPlay();
            } else {
                this.resumeAutoPlay();
            }
        });
    }
    
    initTouchEvents() {
        this.slider?.addEventListener('touchstart', (e) => {
            this.touchStartX = e.touches[0].clientX;
            this.isDragging = false;
            this.pauseAutoPlay();
        }, { passive: true });
        
        this.slider?.addEventListener('touchmove', (e) => {
            if (Math.abs(e.touches[0].clientX - this.touchStartX) > 10) {
                this.isDragging = true;
            }
        }, { passive: true });
        
        this.slider?.addEventListener('touchend', (e) => {
            this.touchEndX = e.changedTouches[0].clientX;
            this.handleSwipe();
            setTimeout(() => {
                this.isDragging = false;
                this.resumeAutoPlay();
            }, 100);
        }, { passive: true });
    }
    
    initMouseEvents() {
        let isMouseDown = false;
        let startX = 0;
        
        this.slider?.addEventListener('mousedown', (e) => {
            isMouseDown = true;
            startX = e.clientX;
            this.isDragging = false;
            this.slider.style.cursor = 'grabbing';
            e.preventDefault();
        });
        
        this.slider?.addEventListener('mousemove', (e) => {
            if (!isMouseDown) return;
            if (Math.abs(e.clientX - startX) > 10) {
                this.isDragging = true;
            }
        });
        
        this.slider?.addEventListener('mouseup', (e) => {
            if (isMouseDown) {
                this.touchStartX = startX;
                this.touchEndX = e.clientX;
                this.handleSwipe();
                isMouseDown = false;
                this.isDragging = false;
                this.slider.style.cursor = 'grab';
            }
        });
        
        this.slider?.addEventListener('mouseleave', () => {
            isMouseDown = false;
            this.isDragging = false;
            this.slider.style.cursor = 'grab';
        });
    }
    
    initCardInteractions() {
        this.cards.forEach((card, index) => {
            // Card click handler
            card.addEventListener('click', (e) => {
                if (!this.isDragging) {
                    this.handleCardClick(index);
                }
            });
            
            // CTA button handler
            const ctaBtn = card.querySelector('.course-cta');
            ctaBtn?.addEventListener('click', (e) => {
                e.stopPropagation();
                this.handleEnrollment(index);
            });
            
            // Add hover effects
            card.addEventListener('mouseenter', () => {
                this.pauseAutoPlay();
            });
            
            card.addEventListener('mouseleave', () => {
                this.resumeAutoPlay();
            });
        });
    }
    
    handleSwipe() {
        const deltaX = this.touchEndX - this.touchStartX;
        const minSwipeDistance = 50;
        
        if (Math.abs(deltaX) > minSwipeDistance) {
            if (deltaX > 0) {
                this.prevSlide();
            } else {
                this.nextSlide();
            }
        }
    }
    
    nextSlide() {
        if (this.isAnimating) return;
        this.currentSlide = (this.currentSlide + 1) % this.totalSlides;
        this.updateSlider();
    }
    
    prevSlide() {
        if (this.isAnimating) return;
        this.currentSlide = (this.currentSlide - 1 + this.totalSlides) % this.totalSlides;
        this.updateSlider();
    }
    
    goToSlide(index) {
        if (this.isAnimating || index === this.currentSlide) return;
        this.currentSlide = index;
        this.updateSlider();
    }
    
    updateSlider() {
        this.isAnimating = true;
        
        const cardWidth = 350 + 32; // card width + gap
        const offset = -this.currentSlide * cardWidth * this.slidesPerView;
        
        this.track.style.transform = `translateX(${offset}px)`;
        this.updateDots();
        
        // Reset animation flag
        setTimeout(() => {
            this.isAnimating = false;
        }, 600);
    }
    
    updateDots() {
        this.dots.forEach((dot, index) => {
            dot.classList.toggle('active', index === this.currentSlide);
        });
    }
    
    initializeCards() {
        this.cards.forEach((card, index) => {
            card.classList.add('loading');
            setTimeout(() => {
                card.classList.remove('loading');
                card.classList.add('loaded');
            }, index * 100);
        });
    }
    
    handleCardClick(index) {
        const courses = [
            'Cybersecurity Fundamentals',
            'Cloud Architecture Mastery',
            'Data Science & Analytics',
            'DevOps Engineering',
            'Full Stack Development',
            'AI & Machine Learning'
        ];
        
        this.showCourseModal(courses[index], index);
    }
    
    handleEnrollment(index) {
        const courses = [
            { name: 'Cybersecurity Fundamentals', price: '$99' },
            { name: 'Cloud Architecture Mastery', price: '$149' },
            { name: 'Data Science & Analytics', price: '$129' },
            { name: 'DevOps Engineering', price: '$179' },
            { name: 'Full Stack Development', price: '$199' },
            { name: 'AI & Machine Learning', price: '$249' }
        ];
        
        const course = courses[index];
        this.showEnrollmentNotification(course.name, course.price);
    }
    
    showCourseModal(courseName, index) {
        const modal = document.createElement('div');
        modal.className = 'course-modal';
        modal.innerHTML = `
            <div class="modal-content">
                <div class="modal-header">
                    <h3>${courseName}</h3>
                    <button class="modal-close">&times;</button>
                </div>
                <div class="modal-body">
                    <img src="/placeholder.svg?height=200&width=400" alt="${courseName}" />
                    <p>Get detailed information about this course, including curriculum, prerequisites, and learning outcomes.</p>
                    <div class="modal-features">
                        <div class="feature">
                            <i class="fas fa-clock"></i>
                            <span>40+ Hours of Content</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-certificate"></i>
                            <span>Certificate of Completion</span>
                        </div>
                        <div class="feature">
                            <i class="fas fa-users"></i>
                            <span>Expert Instructors</span>
                        </div>
                    </div>
                </div>
                <div class="modal-footer">
                    <button class="modal-btn primary">Enroll Now</button>
                    <button class="modal-btn secondary">Learn More</button>
                </div>
            </div>
        `;
        
        this.addModalStyles();
        document.body.appendChild(modal);
        
        setTimeout(() => modal.classList.add('show'), 10);
        
        // Close modal events
        const closeBtn = modal.querySelector('.modal-close');
        const primaryBtn = modal.querySelector('.modal-btn.primary');
        const secondaryBtn = modal.querySelector('.modal-btn.secondary');
        
        const closeModal = () => {
            modal.classList.remove('show');
            setTimeout(() => document.body.removeChild(modal), 300);
        };
        
        closeBtn.addEventListener('click', closeModal);
        modal.addEventListener('click', (e) => {
            if (e.target === modal) closeModal();
        });
        
        primaryBtn.addEventListener('click', () => {
            closeModal();
            this.handleEnrollment(index);
        });
        
        secondaryBtn.addEventListener('click', () => {
            closeModal();
            this.showNotification('Redirecting to course details page...');
        });
    }
    
    addModalStyles() {
        if (document.querySelector('#modal-styles')) return;
        
        const styles = `
            .course-modal {
                position: fixed;
                top: 0;
                left: 0;
                width: 100%;
                height: 100%;
                background: rgba(0, 0, 0, 0.8);
                display: flex;
                align-items: center;
                justify-content: center;
                z-index: 1000;
                opacity: 0;
                transition: opacity 0.3s ease;
            }
            
            .course-modal.show {
                opacity: 1;
            }
            
            .modal-content {
                background: rgba(255, 107, 107, 0.1);
                backdrop-filter: blur(20px);
                border: 1px solid rgba(255, 107, 107, 0.2);
                border-radius: 20px;
                padding: 0;
                max-width: 500px;
                width: 90%;
                transform: scale(0.7);
                transition: transform 0.3s ease;
                overflow: hidden;
            }
            
            .course-modal.show .modal-content {
                transform: scale(1);
            }
            
            .modal-header {
                padding: 1.5rem;
                border-bottom: 1px solid rgba(255, 107, 107, 0.2);
                display: flex;
                justify-content: space-between;
                align-items: center;
            }
            
            .modal-header h3 {
                color: #ffffff;
                margin: 0;
                font-size: 1.5rem;
            }
            
            .modal-close {
                background: none;
                border: none;
                color: #ffffff;
                font-size: 2rem;
                cursor: pointer;
                padding: 0;
                width: 30px;
                height: 30px;
                display: flex;
                align-items: center;
                justify-content: center;
                border-radius: 50%;
                transition: background-color 0.3s ease;
            }
            
            .modal-close:hover {
                background-color: rgba(255, 107, 107, 0.2);
            }
            
            .modal-body {
                padding: 1.5rem;
                color: #e0e0e0;
                line-height: 1.6;
            }
            
            .modal-body img {
                width: 100%;
                height: 150px;
                object-fit: cover;
                border-radius: 10px;
                margin-bottom: 1rem;
            }
            
            .modal-features {
                display: flex;
                flex-direction: column;
                gap: 0.8rem;
                margin-top: 1rem;
            }
            
            .feature {
                display: flex;
                align-items: center;
                gap: 0.8rem;
                color: #b0b0b0;
            }
            
            .feature i {
                color: #ff6b6b;
                width: 20px;
            }
            
            .modal-footer {
                padding: 1.5rem;
                display: flex;
                gap: 1rem;
                justify-content: flex-end;
            }
            
            .modal-btn {
                padding: 0.75rem 1.5rem;
                border: none;
                border-radius: 25px;
                cursor: pointer;
                font-weight: 600;
                transition: all 0.3s ease;
            }
            
            .modal-btn.primary {
                background: linear-gradient(135deg, #ff6b6b 0%, #dc2626 100%);
                color: #ffffff;
            }
            
            .modal-btn.primary:hover {
                transform: translateY(-2px);
                box-shadow: 0 5px 15px rgba(255, 107, 107, 0.4);
            }
            
            .modal-btn.secondary {
                background: transparent;
                color: #ffffff;
                border: 1px solid rgba(255, 107, 107, 0.3);
            }
            
            .modal-btn.secondary:hover {
                background: rgba(255, 107, 107, 0.1);
            }
        `;
        
        const styleSheet = document.createElement('style');
        styleSheet.id = 'modal-styles';
        styleSheet.textContent = styles;
        document.head.appendChild(styleSheet);
    }
    
    showEnrollmentNotification(courseName, price) {
        this.showNotification(`🎉 Ready to enroll in ${courseName} for ${price}? Redirecting to checkout...`);
    }
    
    showNotification(message) {
        const notification = document.createElement('div');
        notification.className = 'course-notification';
        notification.textContent = message;
        
        Object.assign(notification.style, {
            position: 'fixed',
            top: '20px',
            right: '20px',
            background: 'rgba(255, 107, 107, 0.9)',
            backdropFilter: 'blur(10px)',
            color: 'white',
            padding: '1rem 1.5rem',
            borderRadius: '10px',
            boxShadow: '0 10px 30px rgba(255, 107, 107, 0.3)',
            zIndex: '10000',
            transform: 'translateX(400px)',
            transition: 'transform 0.3s cubic-bezier(0.25, 0.1, 0.25, 1)',
            maxWidth: '350px',
            fontSize: '0.9rem',
            fontWeight: '500',
            border: '1px solid rgba(255, 107, 107, 0.3)'
        });
        
        document.body.appendChild(notification);
        
        requestAnimationFrame(() => {
            notification.style.transform = 'translateX(0)';
        });
        
        setTimeout(() => {
            notification.style.transform = 'translateX(400px)';
            setTimeout(() => {
                document.body.removeChild(notification);
            }, 300);
        }, 4000);
    }
    
    handleViewAll() {
        this.showNotification('Redirecting to all courses page...');
    }
    
    handleResize() {
        const newSlidesPerView = this.getSlidesPerView();
        if (newSlidesPerView !== this.slidesPerView) {
            this.slidesPerView = newSlidesPerView;
            this.calculateDimensions();
            this.currentSlide = 0;
            this.updateSlider();
        }
    }
    
    startAutoPlay() {
        this.stopAutoPlay();
        this.autoPlayInterval = setInterval(() => {
            if (!this.isDragging && !document.hidden) {
                this.nextSlide();
            }
        }, this.autoPlayDelay);
    }
    
    stopAutoPlay() {
        if (this.autoPlayInterval) {
            clearInterval(this.autoPlayInterval);
            this.autoPlayInterval = null;
        }
    }
    
    pauseAutoPlay() {
        this.stopAutoPlay();
    }
    
    resumeAutoPlay() {
        if (!this.isDragging) {
            this.startAutoPlay();
        }
    }
    
    debounce(func, wait) {
        let timeout;
        return function executedFunction(...args) {
            const later = () => {
                clearTimeout(timeout);
                func(...args);
            };
            clearTimeout(timeout);
            timeout = setTimeout(later, wait);
        };
    }
    
    // Public API
    destroy() {
        this.stopAutoPlay();
    }
    
    pause() {
        this.pauseAutoPlay();
    }
    
    resume() {
        this.resumeAutoPlay();
    }
}

// Initialize when DOM is loaded
document.addEventListener('DOMContentLoaded', function() {
    const coursesSlider = new CoursesSlider();
    
    // Make globally accessible
    window.coursesSlider = coursesSlider;
    
    // Add intersection observer for performance
    const observerOptions = {
        threshold: 0.1,
        rootMargin: '50px'
    };
    
    const observer = new IntersectionObserver((entries) => {
        entries.forEach(entry => {
            if (entry.isIntersecting) {
                entry.target.classList.add('in-view');
            }
        });
    }, observerOptions);
    
    const coursesSection = document.querySelector('.courses-section');
    if (coursesSection) {
        observer.observe(coursesSection);
    }
});