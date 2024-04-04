<!DOCTYPE html>
<html lang="en">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Feather Blog - Front-End Readme</title>
</head>
<body>
  <h1>Feather Blog 🪶</h1>

  <h2>Front-End (Feather Blog)</h2>

  <p>This repository houses the front-end code for Feather Blog, a feature-rich blogging platform built with Next.js 14.</p>

  <h3>Tech Stack</h3>
  <ul>
    <li>Next.js 14 (Server Components & Server Actions)</li>
    <li>Redux (State Management)</li>
    <li>Lodash.debounce (User Interaction Optimization)</li>
    <li>React Hot Toast (Notification System)</li>
    <li>Tailwind CSS (Styling)</li>
    <li>Shade UI (UI Components)</li>
    <li>Editor.js (Rich Text Editor)</li>
    <li>Mongoose (through Backend API)</li>
  </ul>

  <h3>Key Features</h3>
  <ul>
    <li>User Interface for creating, reading, searching (titles & tags), and liking blog posts.</li>
    <li>Engaging commenting system with nested replies.</li>
    <li>Author profiles with social media links, bios, and avatar upload functionality (image resizing with Sharp handled by backend).</li>
    <li>Search functionality for users and articles.</li>
    <li>Beautiful toast notifications for user feedback.</li>
    <li>Smooth user interactions.</li>
  </ul>

  <h3>Getting Started</h3>
  <ol>
    <li>Clone this repository.</li>
    <li>Install dependencies: <code>npm install</code></li>
    <li>(Optional) Set up a development environment for Next.js: <a href="https://nextjs.org/docs/getting-started/installation">Next.js Installation Guide</a></li>
    <li>Start the development server: <code>npm run dev</code></li>
  </ol>

  <h3>Development</h3>
  <p>Code resides within the <code>src</code> directory.</p>
  <p>Follow recommended Next.js directory structure for components, pages, etc.</p>
  <p>Redux store and actions are located in the <code>redux</code> directory.</p>

  <h3>Deployment</h3>
  <p>Instructions for deploying a Next.js application can be found here: <a href="https://nextjs.org/learn-pages-router/basics/deploying-nextjs-app">Deploying a Next.js App</a></p>

  <p><strong>Note:</strong> This front-end application relies on a separate backend API (NestJS) for data persistence and server-side logic.</p>
</body>
</html>
