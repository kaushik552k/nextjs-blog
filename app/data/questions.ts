import { Question } from '../types/question';

export const questions: Question[] = [
  {
    id: 'q1',
    title: 'Build a Counter App',
    slug: 'build-counter-app',
    difficulty: 'Easy',
    tags: ['React', 'Hooks', 'State'],
    companies: ['Meta', 'Uber'],
    description: `
# Build a Counter App

Create a simple counter application with the following features:

1. Display the current count (starts at 0).
2. A button to increment the count by 1.
3. A button to decrement the count by 1.
4. A button to reset the count to 0.

## Requirements
- Use generic functional components and React hooks.
- Ensure the UI is accessible.
- Styling is optional but recommended for a better look.

## Example
- Initial state: \`0\`
- Click "+": \`1\`
- Click "Reset": \`0\`
`,
    starterCode: `import React, { useState } from 'react';

export default function Counter() {
  return (
    <div className="p-4 flex flex-col gap-4 text-center">
      <h1 className="text-2xl font-bold">Counter</h1>
      {/* Your code here */}
    </div>
  );
}`,
    solutionCode: `import React, { useState } from 'react';

export default function Counter() {
  const [count, setCount] = useState(0);
  
  return (
    <div className="p-4 flex flex-col gap-4 text-center items-center">
      <h1 className="text-2xl font-bold">Counter: {count}</h1>
      <div className="flex gap-2">
        <button 
          onClick={() => setCount(count - 1)}
          className="px-4 py-2 bg-red-500 text-white rounded"
        >
          -
        </button>
        <button 
          onClick={() => setCount(0)}
          className="px-4 py-2 bg-gray-500 text-white rounded"
        >
          Reset
        </button>
        <button 
          onClick={() => setCount(count + 1)}
          className="px-4 py-2 bg-green-500 text-white rounded"
        >
          +
        </button>
      </div>
    </div>
  );
}`,
    testCases: [],
    testCode: `
import React from 'react';
import { render, screen, fireEvent } from '@testing-library/react';
import Counter from './App';

describe('Counter App', () => {
  test('renders initial count of 0', () => {
    render(<Counter />);
    const counterText = screen.getByText(/Counter/i);
    expect(counterText).toBeInTheDocument();
  });

  test('increments count when + is clicked', () => {
    render(<Counter />);
    const incrementBtn = screen.getByText('+');
    fireEvent.click(incrementBtn);
    expect(screen.getByText('Counter: 1')).toBeInTheDocument();
  });

  test('decrements count when - is clicked', () => {
    render(<Counter />);
    const incrementBtn = screen.getByText('+');
    const decrementBtn = screen.getByText('-');
    fireEvent.click(incrementBtn); // 1
    fireEvent.click(incrementBtn); // 2
    fireEvent.click(decrementBtn); // 1
    expect(screen.getByText('Counter: 1')).toBeInTheDocument();
  });

  test('resets count when Reset is clicked', () => {
    render(<Counter />);
    const incrementBtn = screen.getByText('+');
    const resetBtn = screen.getByText('Reset');
    fireEvent.click(incrementBtn);
    fireEvent.click(resetBtn);
    expect(screen.getByText('Counter: 0')).toBeInTheDocument();
  });
});
`
  },
  {
    id: 'q2',
    title: 'Fetch and Display Users',
    slug: 'fetch-display-users',
    difficulty: 'Medium',
    tags: ['React', 'API', 'Async'],
    companies: ['Google', 'Amazon'],
    description: `
# Fetch and Display Users

Fetch users from the given API endpoint and display them in a list.

**API Endpoint**: \`https://jsonplaceholder.typicode.com/users\`

## Requirements
1. Fetch data on component mount.
2. Display a loading state while fetching.
3. Handle errors gracefully.
4. Render a card for each user showing their **Name**, **Email**, and **Company Name**.

`,
    starterCode: `import React from 'react';

export default function UserList() {
  return (
    <div>
      <h1>Users</h1>
      {/* Fetch and display users here */}
    </div>
  );
}`,
    solutionCode: `import React, { useEffect, useState } from 'react';

export default function UserList() {
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState(null);

  useEffect(() => {
    fetch('https://jsonplaceholder.typicode.com/users')
      .then(res => res.json())
      .then(data => {
        setUsers(data);
        setLoading(false);
      })
      .catch(err => {
        setError(err.message);
        setLoading(false);
      });
  }, []);

  if (loading) return <div>Loading...</div>;
  if (error) return <div>Error: {error}</div>;

  return (
    <div className="grid gap-4 p-4">
      {users.map(user => (
        <div key={user.id} className="border p-4 rounded shadow">
          <h3 className="font-bold">{user.name}</h3>
          <p className="text-gray-600">{user.email}</p>
          <p className="text-sm text-gray-500">{user.company.name}</p>
        </div>
      ))}
    </div>
  );
}`,
    testCases: []
  },
  {
    id: 'q3',
    title: 'Holy Grail Layout',
    slug: 'holy-grail-layout',
    difficulty: 'Easy',
    tags: ['CSS', 'Layout', 'Flexbox'],
    companies: ['Airbnb'],
    description: `
# Holy Grail Layout

Create a classic "Holy Grail" layout using CSS Grid or Flexbox.

The layout consists of:
- **Header** (Top, 100% width)
- **Main Content** (Center, fluid width)
- **Left Sidebar** (Fixed width: 200px)
- **Right Sidebar** (Fixed width: 200px)
- **Footer** (Bottom, 100% width)

Ensure the footer stays at the bottom even if content is short.
`,
    starterCode: `import React from 'react';

export default function HolyGrail() {
  return (
    <div className="min-h-screen">
      <header className="bg-blue-500 p-4">Header</header>
      <div className="flex">
        <aside className="bg-red-200">Left</aside>
        <main className="bg-white flex-1">Main</main>
        <aside className="bg-red-200">Right</aside>
      </div>
      <footer className="bg-gray-800 text-white p-4">Footer</footer>
    </div>
  );
}`,
    solutionCode: `import React from 'react';

export default function HolyGrail() {
  return (
    <div className="flex flex-col min-h-screen">
      <header className="bg-blue-500 p-4 text-white">Header</header>
      <div className="flex flex-1">
        <aside className="bg-red-200 w-[200px] p-4">Left Sidebar</aside>
        <main className="bg-white flex-1 p-4">Main Content</main>
        <aside className="bg-green-200 w-[200px] p-4">Right Sidebar</aside>
      </div>
      <footer className="bg-gray-800 text-white p-4">Footer</footer>
    </div>
  );
}`,
    testCases: []
  },
  {
    id: 'q4',
    title: 'Build A Mini Clone Of Google Calendar View',
    slug: 'google-calendar-clone',
    difficulty: 'Medium',
    tags: ['HTML', 'React'],
    companies: ['Sprinklr', 'Flipkart'],
    description: `
# Build A Mini Clone Of Google Calendar View

In this question, we have to create the functionality of a day calendar. This is somewhat similar to what see in solutions like Google Calendar. Implement a Calendar, that shows the events for a given day.

## Requirements
- Render events on a timeline based on their start and end times.
- Handle overlapping events visually.
- Use the provided data structure.
`,
    starterCode: `const NON_CONFLICTING_DATA = [
  {
    startTime: '00:00',
    endTime: '01:30',
    color: '#f6be23',
    title: '#TeamDevtoolsTech',
  },
  {
    startTime: '4:30',
    endTime: '7:30',
    color: '#f6501e',
    title: '#TeamDevtoolsTech',
  },
  {
    startTime: '12:00',
    endTime: '13:30',
    color: '#029be5',
    title: '#TeamDevtoolsTech',
  },
  {
    startTime: '9:00',
    endTime: '10:00',
    color: '#029be5',
    title: '#TeamDevtoolsTech',
  },
];

export default function Calendar() {
  return (
    <div className="p-4">
      <h1>Calendar</h1>
      {/* Build your calendar here */}
    </div>
  );
}`,
    solutionCode: ``,
    testCases: []
  },
  {
    id: 'q5',
    title: 'Implement Debounce Function',
    slug: 'implement-debounce-function',
    difficulty: 'Easy',
    tags: ['JavaScript', 'TypeScript'],
    companies: ['Flipkart'],
    description: `
# Implement Debounce Function

In many interviews, Interviewers often ask questions related to web performance. One way to improve performance is to use Debouncing. Implement a debounce function which takes a function and a delay as parameters.

## Requirements
- The returned function should delay the execution of the original function.
- If called again within the delay, the timer should reset.
`,
    starterCode: `export default function App() {
  
  function debounce(func, delay) {
    // write your code here
  }

  const handleClick = debounce(() => {
    console.log('Debounced Click');
  }, 1000);

  return (
    <div className="p-4">
      <h1 className="text-xl mb-4">Debounce Implementation</h1>
      <button 
        onClick={handleClick}
        className="px-4 py-2 bg-blue-500 text-white rounded"
      >
        Click me (check console)
      </button>
    </div>
  );
}`,
    solutionCode: ``,
    testCases: []
  },
  {
    id: 'q6',
    title: 'Implement Accordion Component',
    slug: 'implement-accordion-component',
    difficulty: 'Medium',
    tags: ['React'],
    companies: [],
    description: `
# Implement Accordion Component

In the Machine Coding rounds, the candidates are usually asked to come up with a solution for a given problem statement or they might be asked to implement a UI component from the ground up. In this question, we have to create a custom Accordion component.

## Requirements
- Display a list of items.
- Clicking a header should toggle the content.
- Support allowing multiple sections to be open at once (optional).
`,
    starterCode: `import React from 'react';

const data = [
  { id: 1, title: 'Item 1', content: 'Content for item 1' },
  { id: 2, title: 'Item 2', content: 'Content for item 2' },
  { id: 3, title: 'Item 3', content: 'Content for item 3' },
];

export default function Accordion() {
  return (
    <div className="p-4 max-w-md mx-auto">
      <h1 className="text-2xl font-bold mb-4">Accordion</h1>
      {/* Implement Accordion here */}
    </div>
  );
}`,
    solutionCode: ``,
    testCases: []
  },
  {
    id: 'q7',
    title: 'Implement DOM-like Structure Tree',
    slug: 'dom-structure-tree',
    difficulty: 'Hard',
    tags: ['JavaScript', 'DOM', 'Algorithms'],
    companies: [],
    description: `
# Implement DOM-like Structure Tree

In this question, you need to implement a VDocument class that can render a DOM-like structure as a string with proper indentation. It should support adding elements, text nodes, and nested structures.

## Requirements
- Implement \`createElement(tagName)\`
- Implement \`createTextNode(value)\`
- Implement \`appendChild(child)\`
- Implement \`render()\` which returns the string representation.
`,
    starterCode: `class VNode {
  // Implement VNode if needed
}

class VDocument {
  constructor() {
    // your code here
  }

  createElement(tagName) {
    // return element
  }
  
  createTextNode(value) {
    // return text node
  }

  render() {
    // return string
  }
}

export default function App() {
  const vCheck = () => {
     // Test your VDocument here
     return "Check console/implementation";
  }

  return (
    <div className="p-4">
      <h1>DOM Tree Implementation</h1>
      <p>{vCheck()}</p>
    </div>
  );
}`,
    solutionCode: ``,
    testCases: []
  },
  {
    id: 'q8',
    title: 'Build a File Explorer',
    slug: 'build-file-explorer',
    difficulty: 'Medium',
    tags: ['React', 'Recursion', 'System Design'],
    companies: ['Atlassian', 'Postman', 'Swiggy'],
    description: `
# Build a File Explorer

In this machine coding challenge, you need to build a fully functional File Explorer similar to VS Code or Windows Explorer. It should support folder/file creation, nested structures, and toggling visibility.

## Requirements
- Display a nested structure of files and folders.
- Allow expanding/collapsing folders.
- (Optional) Allow creating new files/folders.
`,
    starterCode: `import React, { useState } from 'react';

const initialData = {
  id: 'root',
  name: 'root',
  isFolder: true,
  items: [
    {
      id: 'src',
      name: 'src',
      isFolder: true,
      items: [
        { id: 'App.js', name: 'App.js', isFolder: false },
        { id: 'index.js', name: 'index.js', isFolder: false },
      ]
    },
    { id: 'package.json', name: 'package.json', isFolder: false },
  ]
};

export default function FileExplorer() {
  const [explorerData, setExplorerData] = useState(initialData);

  return (
    <div className="p-4 w-64 border-r h-screen">
      <h3 className="font-bold mb-2">File Explorer</h3>
      {/* Render explorer here */}
    </div>
  );
}`,
    solutionCode: ``,
    testCases: []
  },
  {
    id: 'q9',
    title: 'OTP Input Component',
    slug: 'otp-input-component',
    difficulty: 'Medium',
    tags: ['React', 'Forms', 'Focus Management'],
    companies: [],
    description: `
# OTP Input Component

Create a functional OTP (One-Time Password) input component. Specifications: The input field should take exactly 6 numbers. Only numbers should be allowed as valid input. It should support auto-focus on the next field and backspace to move to the previous field.

## Requirements
- 6 input fields.
- Auto-focus next input on typing.
- Backspace support to delete and move previous.
- Paste support (optional but recommended).
`,
    starterCode: `import React, { useState, useRef } from 'react';

export default function OTPInput() {
  const [otp, setOtp] = useState(new Array(6).fill(""));

  return (
    <div className="flex flex-col items-center gap-4 p-8">
      <h2 className="text-2xl font-bold">Enter OTP</h2>
      <div className="flex gap-2">
        {otp.map((data, index) => {
          return (
            <input
              className="w-12 h-12 border rounded text-center text-xl"
              type="text"
              name="otp"
              maxLength={1}
              key={index}
              value={data}
              onChange={e => {}}
              onFocus={e => e.target.select()}
            />
          );
        })}
      </div>
      <button className="px-6 py-2 bg-black text-white rounded">
        Verify
      </button>
    </div>
  );
}`,
    solutionCode: ``,
    testCases: []
  }
];
