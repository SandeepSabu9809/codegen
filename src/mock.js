// Mock data for AI Code Generator
export const mockCodeExamples = [
  {
    id: 1,
    title: "React Component",
    description: "Generate functional React components",
    prompt: "Create a React button component with props for text, onClick, and variant",
    code: `import React from 'react';

const Button = ({ text, onClick, variant = 'primary' }) => {
  const baseClass = 'px-6 py-3 rounded-full font-semibold transition-all duration-200';
  const variants = {
    primary: 'bg-green-500 hover:bg-green-600 text-white',
    secondary: 'bg-gray-100 hover:bg-gray-200 text-gray-800'
  };

  return (
    <button 
      className={\`\${baseClass} \${variants[variant]}\`}
      onClick={onClick}
    >
      {text}
    </button>
  );
};

export default Button;`,
    language: "jsx"
  },
  {
    id: 2,
    title: "API Route Handler",
    description: "Generate Next.js API routes",
    prompt: "Create a Next.js API route for user authentication with JWT",
    code: `import jwt from 'jsonwebtoken';
import bcrypt from 'bcryptjs';

export default async function handler(req, res) {
  if (req.method !== 'POST') {
    return res.status(405).json({ message: 'Method not allowed' });
  }

  const { email, password } = req.body;

  if (!email || !password) {
    return res.status(400).json({ message: 'Missing credentials' });
  }

  try {
    // Mock user validation
    const user = await validateUser(email, password);
    
    const token = jwt.sign(
      { userId: user.id, email: user.email },
      process.env.JWT_SECRET,
      { expiresIn: '24h' }
    );

    res.status(200).json({ token, user: { id: user.id, email: user.email } });
  } catch (error) {
    res.status(401).json({ message: 'Invalid credentials' });
  }
}`,
    language: "javascript"
  },
  {
    id: 3,
    title: "State Management",
    description: "Generate React hooks and context",
    prompt: "Create a React context for theme management with dark/light mode toggle",
    code: `import React, { createContext, useContext, useState, useEffect } from 'react';

const ThemeContext = createContext();

export const useTheme = () => {
  const context = useContext(ThemeContext);
  if (!context) {
    throw new Error('useTheme must be used within ThemeProvider');
  }
  return context;
};

export const ThemeProvider = ({ children }) => {
  const [theme, setTheme] = useState('light');

  useEffect(() => {
    const savedTheme = localStorage.getItem('theme') || 'light';
    setTheme(savedTheme);
    document.documentElement.classList.toggle('dark', savedTheme === 'dark');
  }, []);

  const toggleTheme = () => {
    const newTheme = theme === 'light' ? 'dark' : 'light';
    setTheme(newTheme);
    localStorage.setItem('theme', newTheme);
    document.documentElement.classList.toggle('dark', newTheme === 'dark');
  };

  return (
    <ThemeContext.Provider value={{ theme, toggleTheme }}>
      {children}
    </ThemeContext.Provider>
  );
};`,
    language: "jsx"
  }
];

export const mockFeatures = [
  {
    id: 1,
    title: "AI-Powered Generation",
    description: "Generate high-quality code using advanced AI models trained on millions of code repositories",
    icon: "Brain"
  },
  {
    id: 2,
    title: "Multi-Language Support",
    description: "Support for React, JavaScript, TypeScript, Python, Java, and more programming languages",
    icon: "Code"
  },
  {
    id: 3,
    title: "Instant Preview",
    description: "See your generated code with syntax highlighting and formatting in real-time",
    icon: "Zap"
  },
  {
    id: 4,
    title: "Smart Context",
    description: "AI understands your project context and generates relevant, production-ready code",
    icon: "Target"
  },
  {
    id: 5,
    title: "Code Optimization",
    description: "Generated code follows best practices and is optimized for performance and readability",
    icon: "Gauge"
  },
  {
    id: 6,
    title: "Export & Share",
    description: "Easily copy, download, or share your generated code snippets with your team",
    icon: "Share"
  }
];

export const mockSupportedLanguages = [
  { name: "React/JSX", icon: "Component", color: "#61DAFB" },
  { name: "JavaScript", icon: "FileText", color: "#F7DF1E" },
  { name: "TypeScript", icon: "FileCode", color: "#3178C6" },
  { name: "Python", icon: "Code2", color: "#3776AB" },
  { name: "Java", icon: "Coffee", color: "#ED8B00" },
  { name: "Node.js", icon: "Server", color: "#339933" },
  { name: "HTML/CSS", icon: "Layout", color: "#E34F26" },
  { name: "SQL", icon: "Database", color: "#4479A1" }
];

export const mockTemplates = [
  {
    id: 1,
    title: "CRUD Operations",
    description: "Complete Create, Read, Update, Delete operations",
    tags: ["React", "API", "Database"],
    complexity: "Intermediate"
  },
  {
    id: 2,
    title: "Authentication System",
    description: "Full user authentication with JWT and protected routes",
    tags: ["Security", "JWT", "Auth"],
    complexity: "Advanced"
  },
  {
    id: 3,
    title: "Form Validation",
    description: "React forms with comprehensive validation and error handling",
    tags: ["Forms", "Validation", "UX"],
    complexity: "Beginner"
  },
  {
    id: 4,
    title: "API Integration",
    description: "REST API integration with error handling and loading states",
    tags: ["API", "HTTP", "State"],
    complexity: "Intermediate"
  },
  {
    id: 5,
    title: "Data Visualization",
    description: "Interactive charts and graphs for data representation",
    tags: ["Charts", "Data", "UI"],
    complexity: "Advanced"
  },
  {
    id: 6,
    title: "Real-time Features",
    description: "WebSocket implementation for real-time updates",
    tags: ["WebSocket", "Real-time", "Events"],
    complexity: "Advanced"
  }
];

// Mock function to simulate code generation
export const mockGenerateCode = (prompt, language = "jsx") => {
  return new Promise((resolve) => {
    setTimeout(() => {
      const example = mockCodeExamples.find(ex => 
        ex.prompt.toLowerCase().includes(prompt.toLowerCase().split(' ')[0]) ||
        ex.language === language
      ) || mockCodeExamples[0];
      
      resolve({
        code: example.code,
        language: example.language,
        explanation: `Generated ${example.title.toLowerCase()} based on your prompt: "${prompt}"`
      });
    }, 2000); // Simulate API delay
  });
};