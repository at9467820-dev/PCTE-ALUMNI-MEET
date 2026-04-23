// All data arrays for the About page

export const techStackFrontend = [
  { name: "React.js 19", badge: "Core UI", desc: "A JavaScript library by Facebook for building user interfaces. It breaks the UI into small reusable pieces called 'Components'. Each component manages its own state and renders independently.", why: "Makes the app a Single Page Application (SPA) — only the changed part of the page re-renders, so the page never fully refreshes." },
  { name: "Vite", badge: "Build Tool", desc: "Vite is the development server and bundler. It replaces the old 'Create React App'. It uses ES Modules for instant server start.", why: "Vite starts the dev server in milliseconds, while CRA could take 30+ seconds. It also does Hot Module Replacement (HMR)." },
  { name: "Tailwind CSS v4", badge: "Styling", desc: "A utility-first CSS framework. Instead of writing CSS in separate files, you write small class names directly on HTML elements like 'bg-red-500', 'text-center', 'p-4'.", why: "Faster development, no CSS file switching, and the final CSS bundle only includes the classes you actually used (tree-shaking)." },
  { name: "Redux Toolkit", badge: "State Mgmt", desc: "A global state management library. It creates a single 'store' (like a central memory) that any component can read from or write to.", why: "When the admin adds a new alumni, Redux instantly updates all components showing alumni data without re-fetching from the server." },
  { name: "TanStack React Query", badge: "Server State", desc: "Handles all server-side data fetching, caching, and synchronization. It automatically refetches stale data and provides loading/error states.", why: "Used for infinite scrolling on the Talks page — it fetches the next page of data only when the user scrolls to the bottom." },
  { name: "Framer Motion", badge: "Animations", desc: "A React animation library. You wrap any element in a <motion.div> and give it animation properties like initial, animate, and exit.", why: "Creates the smooth fade-in, slide-up, and hover scale effects you see across the entire website." },
  { name: "React Router DOM v7", badge: "Navigation", desc: "Handles client-side routing. It maps URL paths like '/about' or '/talks' to specific React components without a full page reload.", why: "Enables nested routes — the Student Panel layout stays fixed while inner content (Home, Talks, About) swaps dynamically." },
  { name: "Axios", badge: "HTTP Client", desc: "A promise-based HTTP client for making API requests to the backend. It supports interceptors, automatic JSON parsing, and error handling.", why: "Every time the frontend needs data (alumni list, talks, etc.), Axios sends a GET/POST request to our Express backend." },
];

export const techStackBackend = [
  { name: "Node.js", badge: "Runtime", desc: "A JavaScript runtime built on Chrome's V8 engine. It lets you run JavaScript on the server (outside the browser).", why: "We use the same language (JavaScript/TypeScript) on both frontend and backend — no need to learn PHP or Java." },
  { name: "Express.js v5", badge: "Framework", desc: "A minimal web framework for Node.js. It handles HTTP requests, routing, middleware, and responses.", why: "It creates our REST API endpoints like GET /allMeets, POST /addNewAlumni, DELETE /deleteAlumni/:id etc." },
  { name: "TypeScript", badge: "Language", desc: "A superset of JavaScript that adds static typing. You define what type each variable should be (string, number, etc.).", why: "Catches bugs at compile time. If you pass a number where a string is expected, TypeScript shows an error before the code runs." },
  { name: "SQLite (better-sqlite3)", badge: "Database", desc: "A serverless, file-based relational database. All data is stored in a single file called 'alumni.db'. No separate DB server needed.", why: "Ultra-fast reads (synchronous), zero configuration, perfect for deployment. The WAL mode enables concurrent reads." },
  { name: "JWT (jsonwebtoken)", badge: "Auth Token", desc: "JSON Web Token — a compact, URL-safe token. After login, the server creates a signed token containing user ID and email.", why: "The token is stored in an HttpOnly cookie. On every request, the auth middleware verifies this token to check if the user is logged in." },
  { name: "Bcrypt.js", badge: "Password Security", desc: "A library that hashes passwords using the bcrypt algorithm with salt rounds (12 rounds in our project).", why: "Even if someone steals the database, they cannot reverse the hash to get the original password. Each hash is unique due to salting." },
  { name: "Multer", badge: "File Upload", desc: "A Node.js middleware for handling multipart/form-data (file uploads). It processes files from HTML forms.", why: "When admin uploads alumni photos or meet videos, Multer receives the file, then passes it to Cloudinary storage." },
  { name: "Cloudinary SDK", badge: "Cloud Storage", desc: "A cloud-based media management service. Files are uploaded via API and stored on Cloudinary's global CDN servers.", why: "Heavy videos (100MB+) are stored on Cloudinary, not our server. We only save the returned URL in our SQLite database." },
  { name: "Node-Cron", badge: "Task Scheduler", desc: "A cron job scheduler for Node.js. Cron expression '0 * * * *' means 'run every hour at minute 0'.", why: "Every hour, it checks all alumni meets — if a meet's date has passed, its status automatically changes from 'Upcoming' to 'Completed'." },
  { name: "ExcelJS", badge: "Report Gen", desc: "A library to create and style Excel spreadsheets (.xlsx files) programmatically from JavaScript.", why: "Admin can select fields (title, date, location, alumni name) and download a formatted Excel report of all talks with styled headers and colored status cells." },
];

export const databaseTables = [
  { name: "alumni", columns: "_id, name, profilePic, fileName, batch, linkedIn, email, currentCompany, currentRole, careerTimeline, achievements, quote", desc: "Stores all alumni profiles. careerTimeline is a JSON array of {year, role, company, location} objects." },
  { name: "alumniMeets", columns: "_id, title, time, classJoined, organizedBy, location, alumni, media_images, media_videoLink, status, description", desc: "Stores all talk/meet events. 'status' can be Upcoming, Ongoing, or Completed. 'alumni' links to the alumni table." },
  { name: "users", columns: "_id, name, email, password, phone, avatar_url, avatar_public_id", desc: "Stores admin login credentials. Password is bcrypt-hashed. Only admins can register/login." },
  { name: "blacklist", columns: "_id, token, expiresAt", desc: "Stores invalidated JWT tokens on logout. Expired tokens are auto-deleted on server startup." },
  { name: "feedback", columns: "_id, avatar, name, company, comment", desc: "Stores testimonials/feedback from alumni. Auto-generates avatar using ui-avatars.com API if none provided." },
];

export const apiEndpoints = [
  { method: "GET", path: "/", auth: true, desc: "Fetch all alumni (Admin)" },
  { method: "POST", path: "/addNewAlumni", auth: true, desc: "Add a new alumni with profile picture upload" },
  { method: "PUT", path: "/updateAlumni/:id", auth: true, desc: "Update alumni details" },
  { method: "DELETE", path: "/deleteAlumni/:id", auth: true, desc: "Delete alumni + remove image from Cloudinary" },
  { method: "POST", path: "/addNewAlumniMeet", auth: true, desc: "Create a new meet with images + video upload" },
  { method: "PUT", path: "/meet/:id", auth: true, desc: "Update meet details, add/remove media" },
  { method: "DELETE", path: "/meet/:id", auth: true, desc: "Delete meet + cleanup all Cloudinary media" },
  { method: "GET", path: "/fetchTalksOnFrontend/:type", auth: false, desc: "Fetch Upcoming or Completed meets (Student view)" },
  { method: "GET", path: "/talkPagination", auth: false, desc: "Paginated talks list with infinite scroll support" },
  { method: "POST", path: "/admin/login", auth: false, desc: "Admin login → returns JWT in HttpOnly cookie" },
  { method: "GET", path: "/admin/logout", auth: false, desc: "Logout → blacklists current JWT token" },
  { method: "POST", path: "/report", auth: true, desc: "Generate & download styled Excel report" },
  { method: "POST", path: "/feedback", auth: false, desc: "Submit alumni feedback/testimonial" },
];

export const folderStructure = [
  { path: "reactFrontend/src/pages/", desc: "Main page-level components: About, AuthPage, AdminPanel, StudentPanel, Schedule" },
  { path: "reactFrontend/src/components/", desc: "Reusable admin components: Dashboard, AddAlumni, PlanMeet, Report, ProtectedRoute" },
  { path: "reactFrontend/src/studentPanel component/", desc: "Student-facing components: Home, Talks, TalkInsight, NavBar" },
  { path: "reactFrontend/src/redux/slices/", desc: "Redux state slices: alumniSlice, meetSlice, userSlice, uiSlice, loadingSlice" },
  { path: "reactFrontend/src/api/", desc: "Axios API functions: alumni.api, meet.api, auth.api, feedback.api" },
  { path: "backend/src/routes/", desc: "Express route definitions: alumniMeet.route, auth.route, report.route" },
  { path: "backend/src/controller/", desc: "Request handlers: alumniMeet.controller, auth.controller, report.controller" },
  { path: "backend/src/services/", desc: "Business logic layer: alumniMeet.service, auth.service" },
  { path: "backend/src/dao/", desc: "Data Access Objects — direct SQLite queries: alumniMeet.dao, auth.dao" },
  { path: "backend/src/middleware/", desc: "auth.ts (JWT verification), multer.ts (file upload handling)" },
  { path: "backend/src/utility/", desc: "jwt.ts, scheduledTask.ts (cron), customErrors.ts, globalError.ts, cloudinaryDeletion.ts" },
  { path: "backend/src/config/", desc: "database.ts (SQLite init), cloudinary.ts, cookie.config.ts" },
];

export const vivaQA = [
  { q: "What is this project about?", a: "AlumniTalks is a full-stack web application that bridges the gap between current students and alumni. Students can browse career journeys and watch past talks, while admins can add alumni profiles, plan meets, upload media to Cloudinary, and generate Excel reports." },
  { q: "What is React.js? Why use it?", a: "React is a JavaScript library by Facebook for building UIs using reusable components. We used it because it creates a Single Page Application (SPA) — only the changed component re-renders, making navigation feel instant without full page reloads." },
  { q: "What is Vite? How is it different from CRA?", a: "Vite is a modern build tool that uses native ES modules for instant dev server startup. Unlike Create React App (which bundles everything first), Vite serves files on-demand, making it 10-100x faster for development." },
  { q: "Explain the authentication flow.", a: "Admin submits email+password → Express receives it → bcrypt.compare() checks the hashed password → If valid, jwt.sign() creates a token with user ID → Token is sent in an HttpOnly cookie (maxAge: 24h) → On each request, auth middleware reads the cookie, calls jwt.verify(), and if valid, allows access." },
  { q: "What is JWT? How does it work here?", a: "JWT (JSON Web Token) is a digitally signed token containing user data (payload). We sign it with a secret key. It has 3 parts: Header (algorithm), Payload (user id, email), Signature (verification). It expires in 1 day. On logout, the token is added to a 'blacklist' table." },
  { q: "What is Bcrypt? Why not store plain passwords?", a: "Bcrypt is a one-way hashing algorithm. Plain passwords can be stolen if the database is compromised. Bcrypt adds a random 'salt' and hashes 12 rounds, making it computationally expensive to crack. Even two identical passwords produce different hashes." },
  { q: "What is Redux Toolkit? Why not just useState?", a: "Redux Toolkit provides a centralized global store. With useState, data is local to one component — if 5 components need the same alumni list, each would need its own API call. With Redux, one fetch stores data in the global store, and all 5 components read from it instantly." },
  { q: "How does file upload work?", a: "Frontend sends a FormData object via Axios POST → Multer middleware intercepts the multipart request → CloudinaryStorage (multer-storage-cloudinary) automatically uploads the file to Cloudinary → Cloudinary returns a URL and public_id → We save these in SQLite." },
  { q: "What is the CRON job doing?", a: "node-cron runs the expression '0 * * * *' meaning every hour at minute 0. The function alumniTalkStatus() queries all meets where the date has passed and updates their status from 'Upcoming' to 'Completed' automatically." },
  { q: "What is SQLite? Why not MongoDB/MySQL?", a: "SQLite is a serverless, file-based relational database. All data lives in one file 'alumni.db'. No separate database server is needed. We enabled WAL (Write-Ahead Logging) mode for concurrent read performance. It's perfect for this project size." },
  { q: "What is Tailwind CSS? How is it different from normal CSS?", a: "Tailwind is a utility-first CSS framework. Instead of writing '.button { background: red; padding: 16px; }' in a CSS file, you write '<button class=\"bg-red-500 p-4\">'. It's faster to develop with, and unused classes are automatically removed in production." },
  { q: "Explain the MVC architecture in your backend.", a: "Our backend follows a layered pattern: Routes → Controller → Service → DAO. Routes define URL endpoints. Controller handles the request/response. Service contains business logic (validation). DAO (Data Access Object) writes actual SQL queries to the SQLite database." },
  { q: "What is CORS? Why did you configure it?", a: "CORS (Cross-Origin Resource Sharing) is a security feature. Our frontend runs on localhost:5173 and backend on localhost:3000 — different origins. Without CORS config, the browser blocks requests. We whitelist our frontend URLs in the cors() middleware." },
  { q: "How do you handle errors globally?", a: "We created custom error classes (ValidationError 422, NotFoundError 404, UnauthorizedError 401) extending a base ApiError class. A globalErrorHandler middleware catches all errors thrown from any route and sends a consistent JSON response with the status code and message." },
  { q: "What is an HttpOnly cookie? Why use it over localStorage?", a: "An HttpOnly cookie cannot be accessed by JavaScript (document.cookie returns nothing). This prevents XSS attacks from stealing the token. localStorage is accessible via JS, making it vulnerable. Our cookie also has 'secure: true' (HTTPS only) and 'sameSite: none' for cross-origin requests." },
  { q: "What is the ProtectedRoute component?", a: "It's a React component that wraps admin pages. Before rendering the admin panel, it checks if the user is authenticated by calling the /admin/me endpoint. If not authenticated, it redirects to the login page. This prevents unauthorized access to admin routes." },
  { q: "How does the Excel report generation work?", a: "Admin selects which fields to include → POST /report sends selectedFields to the backend → ExcelJS creates a Workbook with styled headers (bold, centered, gray background) → Status column cells are color-coded (yellow=Upcoming, green=Completed) → The .xlsx file is streamed back as a download." },
  { q: "What is Cloudinary? Why not store files locally?", a: "Cloudinary is a cloud media management platform with a global CDN. Local storage fills up server disk space and is slow for large videos. Cloudinary handles image optimization, video transcoding, and serves files from the nearest server worldwide for fast loading." },
  { q: "What is infinite scrolling? How did you implement it?", a: "Instead of loading all talks at once, we load 3 at a time. TanStack React Query's useInfiniteQuery fetches page 1 first. When the user scrolls to the bottom, it automatically calls the next page (/talkPagination?page=2&limit=3). This improves performance." },
  { q: "How is the project deployed?", a: "Frontend is deployed on Vercel (auto-deploys from Git). Backend runs on a server with the SQLite database file. The CORS config includes the Vercel production URL. Environment variables (JWT_SECRET, Cloudinary keys) are set on the hosting platform." },
];
