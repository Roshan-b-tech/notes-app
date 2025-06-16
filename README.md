# Notes App (Svelte + TailwindCSS)

A beautiful, modern note-taking web app built with **Svelte**, **TypeScript**, **Vite**, and **TailwindCSS**. Create, view, edit, and delete notes with a stunning UI, multiple color themes, search, pagination, and sorting.

## ✨ Features

- **CRUD**: Create, read, update, and delete notes
- **Search**: Filter notes by title or content
- **Sorting**: Sort notes by date or title, ascending/descending
- **Pagination**: 20 notes per page, with Prev/Next controls
- **Responsive Design**: Works great on mobile and desktop
- **Multiple Themes**: Dark, Red, Blue, Green (with smooth transitions)
- **Animated Header**: Typing effect and sticky note decorations
- **Async Feedback**: Loading spinner, error messages, confirmation modals

## 🧰 Tech Stack
- [Svelte](https://svelte.dev/)
- [TypeScript](https://www.typescriptlang.org/)
- [Vite](https://vitejs.dev/)
- [TailwindCSS](https://tailwindcss.com/)
- [mockapi.io](https://mockapi.io/) (for the notes API)

## 🚀 Getting Started

1. **Clone the repo:**
   ```bash
   git clone https://github.com/your-username/your-repo.git
   cd your-repo
   ```
2. **Install dependencies:**
   ```bash
   npm install
   ```
3. **Configure the API endpoint:**
   - Edit `src/services/notesApi.ts` and set your [mockapi.io](https://mockapi.io/) endpoint.
4. **Run the app locally:**
   ```bash
   npm run dev
   ```
   The app will be available at [http://localhost:5173](http://localhost:5173)

## 🌐 Deployment (Vercel)

1. **Push your code to GitHub.**
2. **Go to [vercel.com](https://vercel.com/), sign in, and import your repo.**
3. **Framework Preset:** Svelte (or SvelteKit if you use it)
4. **Build Command:** `npm run build`
5. **Output Directory:** `dist`
6. **Click Deploy!**

Or use the Vercel CLI:
```bash
npm i -g vercel
vercel
```

## 📄 API Example (mockapi.io)
Each note:
```json
{
  "id": 30,
  "title": "Water Bottle",
  "content": "It hydrates you and keeps you healthy",
  "createdAt": "2025-06-03T11:38:28.192Z"
}


Made with ❤️ using Svelte and TailwindCSS.

---

## 🚀 What I'd Do With More Time

- Add infinite scroll as an alternative to pagination
- Implement user authentication (login/signup)
- Add note categories/tags and filtering by tag
- Allow image/file attachments in notes
- Add drag-and-drop note reordering
- Add collaborative editing (real-time sync)
- Polish accessibility (a11y) and keyboard navigation
- Add more theme options and user-customizable themes
- Add unit and integration tests
- Polish animations and micro-interactions
- Add offline support (PWA)
- Improve error handling and API fallback
- Add a public demo and more documentation/screenshots

## ⚖️ Trade-offs & Assumptions

- Used mockapi.io for the backend to focus on frontend features and speed up development.
- Assumed all users share the same notes (no authentication/multi-user support).
- Pagination is client-driven and based on API's page/limit, but total note count is estimated (mockapi.io does not always return total count).
- Sorting is limited to fields supported by the API (title, createdAt).
- Theme system uses Tailwind utility classes and is not persisted across sessions.
- Optimistic UI is not fully implemented for all async actions.
- Accessibility (a11y) is improved but not fully audited.
- No unit or integration tests due to time constraints.
- Assumed modern browsers and devices (no legacy browser support).
- File structure and code style optimized for clarity and learning, not for large-scale production.
