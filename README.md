"scripts": {
// Run both frontend and backend development servers simultaneously
"dev": "concurrently \"npm run dev:frontend\" \"npm run dev:backend\"",

// Start the frontend development server with HMR using Vite
// Points to the frontend-specific Vite config
"dev:frontend": "vite --config frontend/vite.config.js",

// Start the backend in development mode with TypeScript support
// --respawn flag automatically restarts the server when files change
"dev:backend": "ts-node-dev --respawn backend/index.ts",

// Build both frontend and backend for production deployment
"build": "npm run build:frontend && npm run build:backend",

// Build the frontend React app using Vite's production build
// Creates optimized static files in the dist directory
"build:frontend": "vite build --config frontend/vite.config.js",

// Compile TypeScript backend code to JavaScript
// Uses the backend-specific tsconfig.json for configuration
"build:backend": "tsc -p backend/tsconfig.json",

// Run the compiled backend in production mode
// Executes the compiled JS output from the build:backend script
"start": "node dist/backend/index.js",

// Build a Docker image for the application
// Tags the image as "my-first-backend" for easy reference
"docker:build": "docker build -t my-first-backend .",

// Run the Docker container from the built image
// Maps port 3000 from container to host for web access
"docker:start": "docker run -p 3000:3000 my-first-backend"
}