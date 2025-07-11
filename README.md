# AI Workspace

A modern productivity dashboard for managing notes, tasks, and AI-powered summaries. Built with Next.js, MongoDB, NextAuth, and Gemini/OpenAI for AI features.

---

## 🚀 Features

- **User Authentication**: Secure login/signup with email/password and Google OAuth.
- **Notes Tab**:
  - Create, view, edit, and delete notes
  - Summarize notes using Gemini or OpenAI (GPT-3.5) API
- **Tasks Tab**:
  - Add, edit, and mark tasks as done/undone
  - Toast notifications for actions
- **Profile**:
  - User profile picture shown in dashboard navbar
- **Beautiful UI**:
  - Responsive, mobile-friendly design
  - Spline 3D background on the home page
  - Toast notifications for feedback
- **Tech Stack**:
  - Next.js (App Router)
  - MongoDB (Mongoose)
  - NextAuth.js (Credentials & Google login)
  - Tailwind CSS
  - Toastify for notifications
  - Gemini or OpenAI for AI summarization

---

## 🛠️ Installation

1. **Clone the repo:**
   ```sh
   git clone https://github.com/your-username/ai-workspace.git
   cd ai-workspace
   ```
2. **Install dependencies:**
   ```sh
   npm install
   ```
3. **Set up environment variables:**
   - Copy `.env.example` to `.env.local` and fill in your values:
     ```env
     MONGODB_URI=your-mongodb-uri
     NEXTAUTH_SECRET=your-random-secret
     GOOGLE_CLIENT_ID=your-google-client-id
     GOOGLE_CLIENT_SECRET=your-google-client-secret
     GEMINI_API_KEY=your-gemini-api-key
     OPENAI_API_KEY=your-openai-api-key
     ```
4. **Run the development server:**
   ```sh
   npm run dev
   ```
5. **Visit** [http://localhost:3000](http://localhost:3000)

---

## 🧑‍💻 Usage

- **Sign up** with email/password or Google.
- **Create notes** and use "Summarize with AI" for instant summaries.
- **Manage tasks**: add, edit, and mark as done/undone.
- **Profile picture** is shown in the dashboard if available.
- **Logout** securely from the dashboard.

---

## 📝 Customization

- **AI Summarization**: Switch between Gemini and OpenAI by updating the API route logic and keys.
- **3D Spline Background**: Change the Spline scene URL in `app/page.js` for a different 3D effect.
- **Styling**: Tweak Tailwind classes for your own look and feel.

---

## 📂 Project Structure

- `app/` — Next.js App Router pages and API routes
- `components/` — UI components (NotesTab, TasksTab, Navbar, etc.)
- `models/` — Mongoose models (User, Note, Task)
- `lib/` — Database connection and utility scripts
- `public/` — Static assets
- `scripts/` — Utility scripts (e.g., update user images)

---

## 🤝 Contributing

Pull requests are welcome! For major changes, please open an issue first to discuss what you would like to change.

---

## 📄 License

MIT
