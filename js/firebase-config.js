// ============================================
// Firebase Configuration - Using Environment Variables
// Configuration is loaded from Vercel serverless function
// ============================================

// NOTE: This file now fetches configuration from /api/firebase-config
// which reads from Vercel environment variables.
//
// For local development, you can create a .env.local file with:
// FIREBASE_API_KEY=your-api-key
// FIREBASE_AUTH_DOMAIN=your-auth-domain
// FIREBASE_PROJECT_ID=your-project-id
// FIREBASE_STORAGE_BUCKET=your-storage-bucket
// FIREBASE_MESSAGING_SENDER_ID=your-sender-id
// FIREBASE_APP_ID=your-app-id
// FIREBASE_MEASUREMENT_ID=your-measurement-id (optional)

let firebaseApp = null;
let auth = null;
let db = null;

// Initialize Firebase with configuration from API
async function initializeFirebase() {
    try {
        // Fetch Firebase configuration from serverless function
        const response = await fetch('/api/firebase-config');

        if (!response.ok) {
            throw new Error(`Failed to fetch Firebase config: ${response.statusText}`);
        }

        const firebaseConfig = await response.json();

        // Initialize Firebase
        firebaseApp = firebase.initializeApp(firebaseConfig);

        // Initialize services
        auth = firebase.auth();
        db = firebase.firestore();

        // Enable offline persistence
        await db.enablePersistence().catch((err) => {
            if (err.code === 'failed-precondition') {
                console.warn('⚠️ Persistence failed: Multiple tabs open');
            } else if (err.code === 'unimplemented') {
                console.warn('⚠️ Persistence not available in this browser');
            }
        });

        // Set auth persistence
        await auth.setPersistence(firebase.auth.Auth.Persistence.LOCAL);

        console.log('%c✓ Firebase initialized successfully', 'color: #10b981; font-weight: bold;');

        // Export to window for global access
        window.firebaseApp = firebaseApp;
        window.firebaseAuth = auth;
        window.firebaseDb = db;

        // Dispatch event to notify other scripts that Firebase is ready
        window.dispatchEvent(new CustomEvent('firebaseReady', { detail: { auth, db } }));

        return { app: firebaseApp, auth, db };
    } catch (error) {
        console.error('%c✗ Firebase initialization failed:', 'color: #ef4444; font-weight: bold;', error);

        // For local development fallback (if API endpoint not available)
        if (window.location.hostname === 'localhost' || window.location.hostname === '127.0.0.1') {
            console.warn('⚠️ Using fallback for local development');
            console.warn('⚠️ Make sure to set up /api/firebase-config endpoint for production');
        }

        throw error;
    }
}

// Export initialization function
window.initializeFirebase = initializeFirebase;

// Auto-initialize when DOM is ready
if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', initializeFirebase);
} else {
    initializeFirebase();
}
