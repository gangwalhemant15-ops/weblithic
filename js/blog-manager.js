// ============================================
// Blog Manager - Firebase CRUD Operations
// ============================================

class BlogManager {
    constructor() {
        this.db = window.firebaseDb;
        this.collection = 'blog_posts';
    }

    // Create a new blog post
    async createPost(postData) {
        try {
            const docRef = await this.db.collection(this.collection).add({
                ...postData,
                publishedDate: firebase.firestore.FieldValue.serverTimestamp(),
                lastModified: firebase.firestore.FieldValue.serverTimestamp(),
                views: 0
            });

            console.log('Post created with ID:', docRef.id);
            return { success: true, id: docRef.id };
        } catch (error) {
            console.error('Error creating post:', error);
            return { success: false, error: error.message };
        }
    }

    // Get all blog posts (with optional filters)
    async getAllPosts(filters = {}) {
        try {
            let query = this.db.collection(this.collection);

            // Apply filters
            if (filters.status) {
                query = query.where('status', '==', filters.status);
            }

            if (filters.category) {
                query = query.where('category', '==', filters.category);
            }

            // Order by published date (newest first)
            query = query.orderBy('publishedDate', 'desc');

            const snapshot = await query.get();

            const posts = [];
            snapshot.forEach(doc => {
                posts.push({
                    id: doc.id,
                    ...doc.data(),
                    publishedDate: doc.data().publishedDate?.toDate(),
                    lastModified: doc.data().lastModified?.toDate()
                });
            });

            return { success: true, posts };
        } catch (error) {
            console.error('Error getting posts:', error);
            return { success: false, error: error.message, posts: [] };
        }
    }

    // Get a single post by ID
    async getPostById(postId) {
        try {
            const doc = await this.db.collection(this.collection).doc(postId).get();

            if (!doc.exists) {
                return { success: false, error: 'Post not found' };
            }

            return {
                success: true,
                post: {
                    id: doc.id,
                    ...doc.data(),
                    publishedDate: doc.data().publishedDate?.toDate(),
                    lastModified: doc.data().lastModified?.toDate()
                }
            };
        } catch (error) {
            console.error('Error getting post:', error);
            return { success: false, error: error.message };
        }
    }

    // Get a post by slug (for frontend display)
    async getPostBySlug(slug) {
        try {
            const snapshot = await this.db.collection(this.collection)
                .where('slug', '==', slug)
                .where('status', '==', 'published')
                .limit(1)
                .get();

            if (snapshot.empty) {
                return { success: false, error: 'Post not found' };
            }

            const doc = snapshot.docs[0];

            // Increment view count
            this.incrementViews(doc.id);

            return {
                success: true,
                post: {
                    id: doc.id,
                    ...doc.data(),
                    publishedDate: doc.data().publishedDate?.toDate(),
                    lastModified: doc.data().lastModified?.toDate()
                }
            };
        } catch (error) {
            console.error('Error getting post by slug:', error);
            return { success: false, error: error.message };
        }
    }

    // Update an existing post
    async updatePost(postId, updates) {
        try {
            await this.db.collection(this.collection).doc(postId).update({
                ...updates,
                lastModified: firebase.firestore.FieldValue.serverTimestamp()
            });

            console.log('Post updated successfully');
            return { success: true };
        } catch (error) {
            console.error('Error updating post:', error);
            return { success: false, error: error.message };
        }
    }

    // Delete a post
    async deletePost(postId) {
        try {
            await this.db.collection(this.collection).doc(postId).delete();
            console.log('Post deleted successfully');
            return { success: true };
        } catch (error) {
            console.error('Error deleting post:', error);
            return { success: false, error: error.message };
        }
    }

    // Increment view count
    async incrementViews(postId) {
        try {
            await this.db.collection(this.collection).doc(postId).update({
                views: firebase.firestore.FieldValue.increment(1)
            });
        } catch (error) {
            console.error('Error incrementing views:', error);
        }
    }

    // Generate slug from title
    generateSlug(title) {
        return title
            .toLowerCase()
            .replace(/[^a-z0-9]+/g, '-')
            .replace(/(^-|-$)/g, '');
    }

    // Validate post data
    validatePost(postData) {
        const errors = [];

        if (!postData.title || postData.title.trim() === '') {
            errors.push('Title is required');
        }

        if (!postData.excerpt || postData.excerpt.trim() === '') {
            errors.push('Excerpt is required');
        }

        if (!postData.content || postData.content.trim() === '') {
            errors.push('Content is required');
        }

        if (!postData.category) {
            errors.push('Category is required');
        }

        if (postData.excerpt && postData.excerpt.length > 250) {
            errors.push('Excerpt must be less than 250 characters');
        }

        return {
            valid: errors.length === 0,
            errors
        };
    }
}

// Create global instance
window.blogManager = new BlogManager();
