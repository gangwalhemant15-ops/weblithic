// ============================================
// Blog Pagination System
// Handles dynamic blog post loading with pagination
// ============================================

class BlogPagination {
    constructor() {
        this.currentPage = 1;
        this.postsPerPage = 9; // 3 rows of 3 posts
        this.allPosts = [];
        this.init();
    }

    async init() {
        console.log('%c📄 Blog Pagination Initializing...', 'color: #8b5cf6; font-size: 14px;');

        // Check if we're on blog.html page
        if (!document.getElementById('blog-posts-container')) return;

        // Load blog posts
        await this.loadBlogPosts();

        // Setup event listeners
        this.setupEventListeners();

        // Render first page
        this.renderPage(1);

        console.log('%c✓ Blog Pagination Ready', 'color: #10b981; font-size: 14px;');
    }

    async loadBlogPosts() {
        // TODO: Replace with actual API call when backend is ready
        // For now, using static data
        this.allPosts = [
            {
                id: 1,
                title: 'Latest Web Design Trends in 2026',
                excerpt: 'Discover the cutting-edge design trends that are shaping the future of web development and user experience.',
                category: 'Web Design',
                date: 'Jan 15, 2026',
                readTime: '5 min read',
                slug: 'web-design-trends-2026',
                gradient: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
                icon: 'fas fa-palette'
            },
            {
                id: 2,
                title: 'Why Choose React for Your Next Project',
                excerpt: 'Explore the benefits of using React for building modern, scalable web applications that users love.',
                category: 'Development',
                date: 'Jan 10, 2026',
                readTime: '8 min read',
                slug: 'why-choose-react',
                gradient: 'linear-gradient(135deg, #f093fb 0%, #f5576c 100%)',
                icon: 'fab fa-react'
            },
            {
                id: 3,
                title: 'The Importance of Mobile-First Design',
                excerpt: 'Learn why mobile-first approach is crucial for modern web development and how it improves user engagement.',
                category: 'Mobile',
                date: 'Jan 5, 2026',
                readTime: '6 min read',
                slug: 'mobile-first-design',
                gradient: 'linear-gradient(135deg, #4facfe 0%, #00f2fe 100%)',
                icon: 'fas fa-mobile-alt'
            }
        ];

        // When backend is ready, use this instead:
        /*
        try {
          const response = await fetch('/api/blog/posts');
          this.allPosts = await response.json();
        } catch (error) {
          console.error('Error loading blog posts:', error);
        }
        */
    }

    renderPage(pageNumber) {
        this.currentPage = pageNumber;

        const container = document.getElementById('blog-posts-container');
        if (!container) return;

        // Calculate pagination
        const startIndex = (pageNumber - 1) * this.postsPerPage;
        const endIndex = startIndex + this.postsPerPage;
        const postsToShow = this.allPosts.slice(startIndex, endIndex);

        // Clear container
        container.innerHTML = '';

        // Render posts
        postsToShow.forEach((post, index) => {
            const delay = (index % 3) * 100 + 100;
            container.innerHTML += this.createPostHTML(post, delay);
        });

        // Update pagination controls
        this.updatePaginationControls();

        // Scroll to top of blog section
        const blogSection = document.querySelector('.section-padding');
        if (blogSection) {
            blogSection.scrollIntoView({ behavior: 'smooth', block: 'start' });
        }

        // Re-initialize AOS for new elements
        if (typeof AOS !== 'undefined') {
            AOS.refresh();
        }
    }

    createPostHTML(post, delay) {
        return `
      <div class="col-lg-4 col-md-6" data-aos="fade-up" data-aos-delay="${delay}">
        <a href="blog/${post.slug}.html" style="text-decoration: none; color: inherit;">
          <article class="blog-card glass-card">
            <div class="blog-image">
              <div class="blog-image-placeholder" style="background: ${post.gradient};">
                <i class="${post.icon}" style="font-size: 4rem; color: rgba(255,255,255,0.3);"></i>
              </div>
              <div class="blog-category">${post.category}</div>
            </div>
            <div class="blog-content">
              <div class="blog-meta">
                <span><i class="far fa-calendar"></i> ${post.date}</span>
                <span><i class="far fa-clock"></i> ${post.readTime}</span>
              </div>
              <h3 class="blog-title">${post.title}</h3>
              <p class="blog-excerpt">${post.excerpt}</p>
              <span class="blog-link">
                Read More <i class="fas fa-arrow-right ms-2"></i>
              </span>
            </div>
          </article>
        </a>
      </div>
    `;
    }

    updatePaginationControls() {
        const totalPages = Math.ceil(this.allPosts.length / this.postsPerPage);

        // Update info text
        const start = (this.currentPage - 1) * this.postsPerPage + 1;
        const end = Math.min(this.currentPage * this.postsPerPage, this.allPosts.length);

        document.getElementById('showing-start').textContent = start;
        document.getElementById('showing-end').textContent = end;
        document.getElementById('total-posts').textContent = this.allPosts.length;

        // Update prev/next buttons
        const prevBtn = document.getElementById('prev-page');
        const nextBtn = document.getElementById('next-page');

        if (prevBtn) {
            if (this.currentPage === 1) {
                prevBtn.classList.add('disabled');
            } else {
                prevBtn.classList.remove('disabled');
            }
        }

        if (nextBtn) {
            if (this.currentPage === totalPages) {
                nextBtn.classList.add('disabled');
            } else {
                nextBtn.classList.remove('disabled');
            }
        }

        // Generate page numbers
        this.renderPageNumbers(totalPages);
    }

    renderPageNumbers(totalPages) {
        const pageNumbersContainer = document.getElementById('page-numbers');
        if (!pageNumbersContainer) return;

        pageNumbersContainer.innerHTML = '';

        // Show max 5 page numbers at a time
        let startPage = Math.max(1, this.currentPage - 2);
        let endPage = Math.min(totalPages, startPage + 4);

        // Adjust if we're near the end
        if (endPage - startPage < 4) {
            startPage = Math.max(1, endPage - 4);
        }

        for (let i = startPage; i <= endPage; i++) {
            const pageItem = document.createElement('li');
            pageItem.className = 'page-item' + (i === this.currentPage ? ' active' : '');

            const pageLink = document.createElement('a');
            pageLink.className = 'page-link';
            pageLink.href = '#';
            pageLink.textContent = i;
            pageLink.onclick = (e) => {
                e.preventDefault();
                this.renderPage(i);
            };

            pageItem.appendChild(pageLink);
            pageNumbersContainer.appendChild(pageItem);
        }
    }

    setupEventListeners() {
        // Previous button
        const prevBtn = document.getElementById('prev-page');
        if (prevBtn) {
            prevBtn.querySelector('a').onclick = (e) => {
                e.preventDefault();
                if (this.currentPage > 1) {
                    this.renderPage(this.currentPage - 1);
                }
            };
        }

        // Next button
        const nextBtn = document.getElementById('next-page');
        if (nextBtn) {
            nextBtn.querySelector('a').onclick = (e) => {
                e.preventDefault();
                const totalPages = Math.ceil(this.allPosts.length / this.postsPerPage);
                if (this.currentPage < totalPages) {
                    this.renderPage(this.currentPage + 1);
                }
            };
        }
    }

    // Method to add new posts dynamically (for backend integration)
    addPost(post) {
        this.allPosts.unshift(post); // Add to beginning
        this.renderPage(1); // Show first page with new post
    }

    // Method to delete a post
    deletePost(postId) {
        this.allPosts = this.allPosts.filter(p => p.id !== postId);
        // Stay on current page if possible
        const totalPages = Math.ceil(this.allPosts.length / this.postsPerPage);
        const page = Math.min(this.currentPage, totalPages || 1);
        this.renderPage(page);
    }

    // Method to update posts from backend
    async refreshPosts() {
        await this.loadBlogPosts();
        this.renderPage(this.currentPage);
    }
}

// Initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', () => {
        window.blogPagination = new BlogPagination();
    });
} else {
    window.blogPagination = new BlogPagination();
}
