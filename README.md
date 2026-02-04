# Here are your Instructions

Here's the complete tech stack used in this Josh W Comeau clone:

## Frontend Stack

| Category          | Technology                                                           |
| ----------------- | -------------------------------------------------------------------- |
| **Framework**     | React 19 with Create React App (via Craco)                           |
| **Routing**       | React Router DOM v7                                                  |
| **Styling**       | Tailwind CSS 3.4 + CSS Variables for theming                         |
| **Animations**    | Framer Motion (spring physics, page transitions, micro-interactions) |
| **UI Components** | shadcn/ui (built on Radix UI primitives)                             |
| **Icons**         | Lucide React                                                         |
| **Typography**    | Poppins (headings/body) + Fira Code (code blocks) via @fontsource    |

## Key Features Implementation

| Feature                 | Implementation                                          |
| ----------------------- | ------------------------------------------------------- |
| **Dark/Light Mode**     | CSS Variables + localStorage persistence                |
| **Sound Effects**       | Web Audio API (synthesized sounds, no external files)   |
| **Syntax Highlighting** | Custom regex-based highlighter (inline styles)          |
| **MDX-like Content**    | JSON-structured content + custom MDXRenderer component  |
| **Like Button**         | Framer Motion animations + localStorage for persistence |

## Project Structure

```
/app/frontend/
├── src/
│   ├── components/      # React components
│   │   ├── Header.jsx
│   │   ├── HeroSection.jsx
│   │   ├── BlogPostPage.jsx
│   │   ├── CategoryPage.jsx
│   │   ├── LikeButton.jsx
│   │   ├── CodeBlock.jsx
│   │   ├── MDXRenderer.jsx
│   │   └── ...
│   ├── data/
│   │   ├── mock.js          # Categories, posts metadata
│   │   └── blogContent.js   # Full blog post content
│   ├── hooks/
│   │   └── useSoundEffect.js
│   └── App.js
```

## Backend (Available but not used yet)

| Technology | Purpose                           |
| ---------- | --------------------------------- |
| FastAPI    | Python web framework              |
| MongoDB    | Database (via Motor async driver) |
| Pydantic   | Data validation                   |
