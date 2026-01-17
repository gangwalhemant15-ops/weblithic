// Vercel Serverless Function to serve Firebase configuration
// This reads from Vercel environment variables and serves them securely

export default function handler(req, res) {
    // Set CORS headers to allow requests from your domain
    res.setHeader('Access-Control-Allow-Origin', '*'); // In production, set this to your domain
    res.setHeader('Access-Control-Allow-Methods', 'GET');
    res.setHeader('Access-Control-Allow-Headers', 'Content-Type');

    // Handle preflight requests
    if (req.method === 'OPTIONS') {
        res.status(200).end();
        return;
    }

    // Only allow GET requests
    if (req.method !== 'GET') {
        res.status(405).json({ error: 'Method not allowed' });
        return;
    }

    // Firebase configuration from environment variables
    const firebaseConfig = {
        apiKey: process.env.FIREBASE_API_KEY,
        authDomain: process.env.FIREBASE_AUTH_DOMAIN,
        projectId: process.env.FIREBASE_PROJECT_ID,
        storageBucket: process.env.FIREBASE_STORAGE_BUCKET,
        messagingSenderId: process.env.FIREBASE_MESSAGING_SENDER_ID,
        appId: process.env.FIREBASE_APP_ID,
        measurementId: process.env.FIREBASE_MEASUREMENT_ID
    };

    // Validate that all required environment variables are set
    const missingVars = [];
    Object.entries(firebaseConfig).forEach(([key, value]) => {
        if (!value && key !== 'measurementId') { // measurementId is optional
            missingVars.push(key);
        }
    });

    if (missingVars.length > 0) {
        console.error('Missing environment variables:', missingVars);
        res.status(500).json({
            error: 'Server configuration error',
            message: 'Missing required environment variables'
        });
        return;
    }

    // Return the configuration
    res.status(200).json(firebaseConfig);
}
