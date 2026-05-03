const fs = require('fs');
const data = JSON.parse(fs.readFileSync('prisma/questions_data.json', 'utf8'));

data.unshift({
  id: 9999,
  question: "How does the 'useEffect' hook in React work? What is the purpose of its 'dependency array', and what happens if you omit it?",
  answer: `The \`useEffect\` hook runs a **side effect** function after the component has rendered. It is used for tasks like data fetching, subscriptions, or manually changing the DOM.

The **dependency array** (the second argument) controls exactly when the effect function re-runs:

1. **Array with variables \`[a, b]\`**:
   The effect will only re-run if \`a\` or \`b\` has changed since the last render.
   \`\`\`jsx
   useEffect(() => {
     console.log('User ID changed to:', userId);
     fetchUserData(userId);
   }, [userId]); // Only re-runs if userId changes
   \`\`\`

2. **Empty array \`[]\`**:
   The effect will run **only once**, after the initial render (mimicking \`componentDidMount\` in class components).
   \`\`\`jsx
   useEffect(() => {
     console.log('Component mounted! Fetching initial data...');
     initializeAnalytics();
   }, []); // Never re-runs
   \`\`\`

3. **No array (omitted)**:
   The effect will run after **every single render**. This is usually undesirable and can cause infinite loops if your effect updates a state variable.
   \`\`\`jsx
   useEffect(() => {
     console.log('This runs after EVERY render!');
   }); // Missing dependency array!
   \`\`\`

### Installing ESLint Plugin
To catch missing dependency array bugs early, it is highly recommended to use the React hooks lint rules:

\`\`\`terminal
npm install eslint-plugin-react-hooks --save-dev
\`\`\``,
  difficulty: "Hard",
  section: "Frontend Developer"
});

fs.writeFileSync('prisma/questions_data.json', JSON.stringify(data, null, 2));
console.log("Added new useEffect question!");
