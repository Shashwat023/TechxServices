// Mobile Menu Toggle
document.addEventListener("DOMContentLoaded", () => {
  const mobileMenuBtn = document.getElementById("mobileMenuBtn")
  const nav = document.querySelector(".nav")

  if (mobileMenuBtn && nav) {
    mobileMenuBtn.addEventListener("click", () => {
      nav.classList.toggle("mobile-active")
      const icon = mobileMenuBtn.querySelector("i")
      if (nav.classList.contains("mobile-active")) {
        icon.classList.remove("fa-bars")
        icon.classList.add("fa-times")
      } else {
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
      }
    })
  }

  // Contact Form Submission
  const contactForm = document.getElementById("contactForm")
  if (contactForm) {
    contactForm.addEventListener("submit", (e) => {
      e.preventDefault()

      // Get form data
      const formData = new FormData(contactForm)
      const data = Object.fromEntries(formData)

      // Simulate form submission
      const submitBtn = contactForm.querySelector(".form-submit")
      const originalText = submitBtn.textContent

      submitBtn.textContent = "Sending..."
      submitBtn.disabled = true

      // Simulate API call
      setTimeout(() => {
        alert("Thank you for your interest! We'll contact you within 24 hours.")
        contactForm.reset()
        submitBtn.textContent = originalText
        submitBtn.disabled = false
      }, 2000)
    })
  }

  // Smooth scrolling for anchor links
  document.querySelectorAll('a[href^="#"]').forEach((anchor) => {
    anchor.addEventListener("click", function (e) {
      e.preventDefault()
      const target = document.querySelector(this.getAttribute("href"))
      if (target) {
        target.scrollIntoView({
          behavior: "smooth",
          block: "start",
        })
      }
    })
  })

  // Search functionality
  const searchInputs = document.querySelectorAll(".search-input")
  searchInputs.forEach((input) => {
    input.addEventListener("keypress", function (e) {
      if (e.key === "Enter") {
        const searchTerm = this.value.trim()
        if (searchTerm) {
          // Simulate search - in a real app, this would redirect to search results
          alert(`Searching for: ${searchTerm}`)
        }
      }
    })
  })

  // Add scroll effect to header
  let lastScrollTop = 0
  const header = document.querySelector(".header")

  window.addEventListener("scroll", () => {
    const scrollTop = window.pageYOffset || document.documentElement.scrollTop

    if (scrollTop > lastScrollTop && scrollTop > 100) {
      // Scrolling down
      header.style.transform = "translateY(-100%)"
    } else {
      // Scrolling up
      header.style.transform = "translateY(0)"
    }

    lastScrollTop = scrollTop
  })

  // Add intersection observer for animations
  const observerOptions = {
    threshold: 0.1,
    rootMargin: "0px 0px -50px 0px",
  }

  const observer = new IntersectionObserver((entries) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        entry.target.classList.add("animate-fade-in-up")
      }
    })
  }, observerOptions)

  // Observe elements for animation
  const animateElements = document.querySelectorAll(
    ".point-card, .service-card, .course-card, .testimonial-card, .team-card, .stat-item, .process-step",
  )
  animateElements.forEach((el) => {
    observer.observe(el)
  })

  // Add loading states to buttons
  document.querySelectorAll(".btn").forEach((btn) => {
    if (btn.getAttribute("href") && !btn.getAttribute("href").startsWith("#")) {
      btn.addEventListener("click", function (e) {
        // Add loading state for external links
        if (!this.classList.contains("no-loading")) {
          this.style.opacity = "0.7"
          setTimeout(() => {
            this.style.opacity = "1"
          }, 1000)
        }
      })
    }
  })

  // Form validation
  const forms = document.querySelectorAll("form")
  forms.forEach((form) => {
    const inputs = form.querySelectorAll("input[required], select[required]")

    inputs.forEach((input) => {
      input.addEventListener("blur", function () {
        validateField(this)
      })

      input.addEventListener("input", function () {
        if (this.classList.contains("error")) {
          validateField(this)
        }
      })
    })
  })

  function validateField(field) {
    const value = field.value.trim()
    const isValid = field.checkValidity()

    if (!isValid || (field.required && !value)) {
      field.classList.add("error")
      field.style.borderColor = "#dc2626"
    } else {
      field.classList.remove("error")
      field.style.borderColor = "#374151"
    }
  }

  // Add mobile navigation styles
  const style = document.createElement("style")
  style.textContent = `
        @media (max-width: 768px) {
            .nav.mobile-active {
                display: flex;
                position: absolute;
                top: 100%;
                left: 0;
                right: 0;
                background-color: rgba(0, 0, 0, 0.95);
                backdrop-filter: blur(10px);
                flex-direction: column;
                padding: 20px;
                border-radius: 0;
                gap: 16px;
                border-top: 1px solid #374151;
            }
            
            .header {
                transition: transform 0.3s ease;
            }
        }
    `
  document.head.appendChild(style)
})

// Utility functions
function debounce(func, wait) {
  let timeout
  return function executedFunction(...args) {
    const later = () => {
      clearTimeout(timeout)
      func(...args)
    }
    clearTimeout(timeout)
    timeout = setTimeout(later, wait)
  }
}

// Add resize handler for responsive adjustments
window.addEventListener(
  "resize",
  debounce(() => {
    // Close mobile menu on resize
    const nav = document.querySelector(".nav")
    const mobileMenuBtn = document.getElementById("mobileMenuBtn")

    if (window.innerWidth > 768 && nav && nav.classList.contains("mobile-active")) {
      nav.classList.remove("mobile-active")
      if (mobileMenuBtn) {
        const icon = mobileMenuBtn.querySelector("i")
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
      }
    }
  }, 250),
)

// Add keyboard navigation support
document.addEventListener("keydown", (e) => {
  // ESC key closes mobile menu
  if (e.key === "Escape") {
    const nav = document.querySelector(".nav")
    const mobileMenuBtn = document.getElementById("mobileMenuBtn")

    if (nav && nav.classList.contains("mobile-active")) {
      nav.classList.remove("mobile-active")
      if (mobileMenuBtn) {
        const icon = mobileMenuBtn.querySelector("i")
        icon.classList.remove("fa-times")
        icon.classList.add("fa-bars")
        mobileMenuBtn.focus()
      }
    }
  }
})

// Performance optimization: Lazy load images
function lazyLoadImages() {
  const images = document.querySelectorAll("img[data-src]")
  const imageObserver = new IntersectionObserver((entries, observer) => {
    entries.forEach((entry) => {
      if (entry.isIntersecting) {
        const img = entry.target
        img.src = img.dataset.src
        img.classList.remove("lazy")
        imageObserver.unobserve(img)
      }
    })
  })

  images.forEach((img) => imageObserver.observe(img))
}

// Initialize lazy loading when DOM is ready
if (document.readyState === "loading") {
  document.addEventListener("DOMContentLoaded", lazyLoadImages)
} else {
  lazyLoadImages()
}
