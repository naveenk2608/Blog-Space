# 📝 BlogSpace

A full-stack blogging platform where users can write, publish, and share posts, with authentication, secure cloud image uploads, likes, and interactive commenting.

🔗 **Live App:** [blog-space-eight-sepia.vercel.app](https://blog-space-eight-sepia.vercel.app)
📦 **Repository:** [github.com/naveenk2608/Blog-Space](https://github.com/naveenk2608/Blog-Space)

![React](https://img.shields.io/badge/Frontend-React%2018-61DAFB?logo=react)
![Vite](https://img.shields.io/badge/Bundler-Vite-646CFF?logo=vite)
![Node.js](https://img.shields.io/badge/Backend-Node.js%20%2F%20Express-339933?logo=node.js)
![MySQL](https://img.shields.io/badge/Database-MySQL-4479A1?logo=mysql)
![Cloudinary](https://img.shields.io/badge/Media-Cloudinary-3448C5?logo=cloudinary)

---

## ✨ Features

- 🔐 **JWT Authentication** — Register and login with hashed passwords (bcrypt) and protected routes
- 📝 **Draft & Publish Workflow** — Save posts as drafts or publish them; drafts stay private and visible only to their author
- 🖼️ **Cloud Image Uploads** — Cover images and profile pictures uploaded directly to Cloudinary (persists across deployments/restarts)
- 🏠 **Home Feed** — Card-based grid of all published posts with excerpt, author, likes, comments, and publish date
- 👤 **Public User Profiles** — Every user has a profile page showing bio, stats (blogs, likes received, comments received), and their published posts
- 🧑‍💻 **Author Discovery** — Click any author's avatar or name on a post to jump straight to their profile
- 💬 **Comments** — Add, edit, and delete comments on any post
- ❤️ **Likes** — Like/unlike blog posts and individual comments
- 🖊️ **Profile Editing** — Update name, username, bio, and profile picture at any time
- 📱 **Responsive UI** — Clean, mobile-friendly layout across auth, feed, and profile pages
- 🧭 **Client-Side Routing** — React Router with full support for direct-URL access and page refresh in production

---

## 🏗️ Tech Stack

| Layer          | Technology                              |
| -------------- | ---------------------------------------- |
| **Frontend**   | React 18, Vite, React Router DOM, Axios  |
| **Backend**    | Node.js, Express.js                      |
| **Database**   | MySQL (mysql2)                           |
| **Auth**       | JWT + bcrypt                             |
| **Media**      | Multer + Cloudinary                      |
| **Validation** | express-validator                        |
| **Deployment** | Frontend → Vercel · Backend → Render · DB → Aiven |

---

## 🗄️ Database Schema

A relational MySQL schema models the blogging domain across five core tables:

`users` · `blogs` · `comments` · `blog_likes` · `comment_likes`

Key design points:

- **`users`** stores profile data (`name`, `username`, `email`, `password`, `profile_pic`, `bio`) — usernames are unique and used for public profile routing.
- **`blogs`** includes a `status` column (`draft` / `published`) tied to each `user_id`, driving the private-drafts-vs-public-feed logic.
- **`blog_likes`** and **`comment_likes`** are join tables tracking which user liked which blog or comment, enabling toggle-based like/unlike behavior.
- **`comments`** links to both `blog_id` and `user_id`, supporting per-post threads with edit/delete ownership checks.

---

## 📂 Project Structure

```
Blog-Space/
├── client/                         # React frontend
│   └── src/
│       ├── components/
│       │   ├── BlogCard.jsx / .css
│       │   ├── ProfileBlogCard.jsx
│       │   ├── LikeButton.jsx
│       │   └── Navbar.jsx
│       ├── context/
│       │   └── AuthContext.jsx     # Auth state, login/register/logout
│       ├── pages/
│       │   ├── Home.jsx
│       │   ├── Login.jsx / Register.jsx
│       │   ├── Profile.jsx / EditProfile.jsx
│       │   ├── BlogDetail.jsx
│       │   ├── CreateBlog.jsx / EditBlog.jsx
│       │   └── styles/
│       ├── services/
│       │   └── api.js              # Axios instance with auth interceptor
│       └── utils/
│           └── imageUrl.js         # Cloudinary/avatar URL resolution
└── server/                          # Express backend
    ├── server.js                    # App entry point
    ├── config/
    │   ├── db.js                    # MySQL connection pool
    │   └── cloudinary.js            # Cloudinary config
    ├── controllers/
    │   ├── authController.js
    │   ├── userController.js
    │   ├── blogController.js
    │   ├── commentController.js
    │   └── likeController.js
    ├── models/
    │   ├── userModel.js
    │   └── blogModel.js
    ├── routes/
    │   ├── authRoutes.js            # /api/auth
    │   ├── userRoutes.js            # /api/users
    │   ├── blogRoutes.js            # /api/blogs
    │   ├── commentRoutes.js         # /api/comments
    │   └── likeRoutes.js            # /api/likes
    ├── middleware/
    │   ├── authMiddleware.js        # Optional/required JWT verification
    │   └── uploadMiddleware.js      # Multer + Cloudinary storage
    └── utils/
        └── validation.js            # express-validator rule sets
```

---

## 🔌 API Overview

| Route                              | Method | Auth | Description                              |
| ----------------------------------- | ------ | ---- | ----------------------------------------- |
| `/api/auth/register`                | POST   | —    | Register a new user                       |
| `/api/auth/login`                   | POST   | —    | Login, returns JWT                        |
| `/api/auth/me`                      | GET    | ✅    | Get current authenticated user            |
| `/api/users/:username`              | GET    | Optional | Public profile, stats, and blogs (drafts only shown to owner) |
| `/api/users/profile`                | PUT    | ✅    | Update name/username/bio/profile picture  |
| `/api/users/profile-picture`        | DELETE | ✅    | Remove profile picture                    |
| `/api/users/check-username`         | GET    | —    | Check username availability               |
| `/api/blogs`                        | GET    | ✅    | List published blogs                      |
| `/api/blogs`                        | POST   | ✅    | Create a blog (draft or published)        |
| `/api/blogs/:id`                    | GET    | ✅    | Get a single blog                         |
| `/api/blogs/:id`                    | PUT    | ✅    | Update a blog                             |
| `/api/blogs/:id`                    | DELETE | ✅    | Delete a blog                             |
| `/api/comments/blog/:blogId`        | POST   | ✅    | Add a comment                             |
| `/api/comments/:id`                 | PUT    | ✅    | Edit a comment                            |
| `/api/comments/:id`                 | DELETE | ✅    | Delete a comment                          |
| `/api/likes/blog/:blogId`           | POST   | ✅    | Toggle like on a blog                     |
| `/api/likes/comment/:commentId`     | POST   | ✅    | Toggle like on a comment                  |

---

## 🚀 Getting Started

### Prerequisites

- Node.js (v18+)
- MySQL (v8+)
- A Cloudinary account (for image uploads)

### 1. Clone the repository

```
git clone https://github.com/naveenk2608/Blog-Space.git
cd Blog-Space
```

### 2. Backend setup

```
cd server
npm install
```

Create a `.env` file in `server/`:

```
PORT=5000
DB_HOST=your_mysql_host
DB_USER=your_mysql_user
DB_PASSWORD=your_mysql_password
DB_NAME=your_database_name
JWT_SECRET=your_jwt_secret

# Cloudinary
CLOUDINARY_CLOUD_NAME=your_cloud_name
CLOUDINARY_API_KEY=your_api_key
CLOUDINARY_API_SECRET=your_api_secret
```

Run the server:

```
npm run dev
```

### 3. Frontend setup

```
cd ../client
npm install
```

Create a `.env` file in `client/`:

```
VITE_API_BASE_URL=http://localhost:5000
```

Run the frontend:

```
npm run dev
```

The frontend (Vite) runs on `http://localhost:5173` by default and expects the backend at the URL configured in `VITE_API_BASE_URL`.

---

## 🤝 Contributing

1. Fork the repo
2. Create a feature branch (`git checkout -b feature/new-feature`)
3. Commit your changes
4. Push and open a Pull Request

---

## 👤 Author

**Naveen Kumar** — [@naveenk2608](https://github.com/naveenk2608)
B.Tech CSE, VIT-AP University
