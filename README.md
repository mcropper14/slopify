# Hackathon Project




## Project Structure


```

├── frontend/           # Client-side code
│   ├── index.html      # Main HTML file
│   ├── css/
│   │   └── styles.css  # All styling (extracted from original HTML)
│   ├── js/
│   │   └── app.js      # All JavaScript functionality (extracted from original HTML)
│   └── assets/         # Future assets (images, fonts, etc.)
├── backend/            # Server-side code
│   ├── server.js       # Express server to serve frontend files
│   └── package.json    # Node.js dependencies
├── main.html           # Original monolithic file (kept for reference)
└── README.md           # This file
```

## 🚀 Getting Started

### Prerequisites
- Node.js (v14 or higher)
- npm (comes with Node.js)
- Gemini API key (optional, for AI code generation)

### Installation

1. **Clone or navigate to the project directory**


2. **Install backend dependencies**
   ```bash
   cd backend
   npm install
   ```

3. **Set up Gemini AI (optional, for AI code generation)**
   ```bash
   # Get your API key from https://makersuite.google.com/app/apikey
   # Create a .env file in the root directory
   cp env.example .env
   # Edit .env and add your GEMINI_API_KEY
   ```

3. **Start the server**
   ```bash
   npm start
   ```

4. **Open your browser**
   Navigate to: `http://localhost:3000`

That's it! The IDE will load and you're ready to grind that code fr fr. 💀

## 📄 File Creation

Create new files with **smart templates** based on file extension:

- **`.js`** → JavaScript function template with console.log
- **`.jsx`** → React component with hooks and PropTypes
- **`.html`** → Complete HTML5 template with semantic structure
- **`.css`** → Modern CSS framework with utilities and responsive design
- **`.json`** → Package.json structure for Node.js projects
- **`.md`** → README documentation template
- **`.py`** → Python script template
- **`.sql`** → SQL queries template
- **And more!**

## 🔥 Features

### Core IDE Features
- **Code Editor**: Syntax highlighting, line numbers, minimap
- **File Management**: Create, rename, delete, and switch between files
- **Auto-save**: Files are automatically saved every 5 seconds
- **Persistent Storage**: All files are saved locally in your browser
- **File Operations**: New, Open, Save files
- **Undo/Redo**: Full history support
- **Code Formatting**: Automatic indentation
- **Find & Replace**: Search through your code
- **Code Execution**: Run JavaScript directly in the browser


### Distraction Features (Brain Rot Breaks) 📱
- **Terminal**: Command-line interface with fun commands (Platform tab)
- **YouTube Shorts**: Watch random viral shorts
- **Instagram Reels**: Scroll through reels
- **GIF Scroller**: Infinite random GIFs by category
- **Reddit Browser**: Browse programming memes and posts
- **Twitch Streams**: Watch live coding/game streams

### AI Agents 🤖 (Requires Gemini API Key)
- **Code Generator**: AI-powered code writing using Gemini 3 Flash Preview
- **Debug Master**: Finds and explains bugs
- **Code Optimizer**: Performance improvements
- **Code Explainer**: Explains what code does
- **Refactoring Pro**: Cleans up messy code
- **Test Writer**: Generates unit tests
- **Comment Generator**: Adds documentation
- **Brainrot Coder**: Gives coding advice

### Music & Vibes 🎵
- **Spotify Player**: Integrated music player
- **Lofi Beats**: Curated coding playlists
- **Background Music**: Set the mood for grinding

## 🛠️ Development

### File Structure Details

- **`frontend/index.html`**: Clean HTML with external CSS/JS references
- **`frontend/css/styles.css`**: All styling extracted from original HTML
- **`frontend/js/app.js`**: All JavaScript functionality extracted from original HTML
- **`backend/server.js`**: Simple Express server for serving static files
- **`backend/package.json`**: Node.js dependencies and scripts

### Adding New Features

1. **Frontend changes**: Edit files in the `frontend/` directory
2. **Backend changes**: Modify `backend/server.js` if needed
3. **Dependencies**: Add to `backend/package.json` if server-side packages needed

### Building/Deployment

Since this is a client-side application, you can:
- Serve directly from any static file server
- Deploy to Netlify, Vercel, or any static hosting
- The backend server is optional - you can open `frontend/index.html` directly in a browser

## 🎮 How to Use

1. **Start coding**: Type in the editor area
2. **Run code**: Click the ▶️ Run button to execute JavaScript
3. **Take breaks**: Use the Brain Rot Break panel for "inspiration"
4. **Create & manage files**: Use the file management system to create, rename, and delete files
5. **Get AI help**: Use AI Agents for code assistance (requires Gemini API key)
6. **Listen to music**: Open the Spotify player for coding vibes
7. **Earn achievements**: Unlock sigma points by being productive

## 📁 File Management

The IDE now supports full file management with persistent storage:

- **Create Files**: Click "📄 New" and enter a filename (e.g., `script.js`, `component.jsx`)
- **Auto-templates**: New files come with appropriate templates based on file extension
- **Persistent Storage**: All files are automatically saved to your browser's local storage
- **File Operations**: Rename (✏️) and delete (🗑️) files using hover actions in the sidebar
- **Auto-save**: Files are saved every 5 seconds automatically
- **File Switching**: Click any file in the sidebar to switch between them

Your files persist between browser sessions!

## 🤖 Gemini AI Setup

### Getting Your API Key
1. Visit [Google AI Studio](https://makersuite.google.com/app/apikey)
2. Sign in with your Google account
3. Create a new API key
4. Copy the API key

### Configuration
1. Create a `.env` file in the root directory:
   ```bash
   cp env.example .env
   ```

2. Edit the `.env` file and add your API key:
   ```
   GEMINI_API_KEY=your_actual_gemini_api_key_here
   ```

3. Restart the server:
   ```bash
   cd backend
   npm start
   ```

### Testing AI Features
- Open the IDE at `http://localhost:3000`
- Click the 🤖 AI Agents button
- Select "Code Generator" from the dropdown
- Try generating some code!

### Troubleshooting
- **"Gemini API key not configured"**: Make sure your `.env` file has the correct API key
- **"API request failed"**: Check your internet connection and API key validity
- **"models/gemini-X.X-X is not found"**: The model might not be available. The code uses `'gemini-pro'` which should work. If issues persist, check your API key and Google AI Studio access.
- **"No response generated"**: The AI might be having issues, try again later

## 💀 Philosophy

This IDE embraces the chaos of modern development. Sometimes you need to watch a YouTube short to clear your mind. Sometimes you need AI to write your code. Sometimes you need to scroll Reddit instead of debugging. We're so back. 🔥

## 📝 License

MIT License 

## 🤝Contributing



---

**Remember**: We're not in 2010 anymore fr. Use modern tools. 

why did we make this 
