# TERRIBLE IDE - The Worst Code Editor Ever Created

## ⚠️ WARNING ⚠️
This IDE is intentionally terrible, aggressive, and designed to frustrate users. However, basic file operations DO work (most of the time). It will:
- ✅ Create, save, and load files (with occasional random failures)
- ✅ Let you write code (but may corrupt it randomly)
- ✅ Run JavaScript code (but with terrible delays and failures)
- ❌ Insult you constantly with popup messages
- ❌ Show aggressive popup ads every 10 seconds
- ❌ Play auto-changing YouTube Shorts to distract you from coding
- ❌ Corrupt your files randomly (but you can still use them)
- ❌ Change layouts unexpectedly (normal → chaos → upside-down → tiny text)
- ❌ Randomly crash or break the editor
- ❌ Hide your files sometimes
- ❌ Use terrible colors, fonts, and animations
- ❌ Mock your coding skills relentlessly

**DO NOT USE THIS FOR REAL CODING!** This is a joke project designed to be terrible while still mostly functional.

## Features

### ✅ Working Features (Most of the Time)
- **File Creation**: Create new files (may be corrupted randomly)
- **Code Writing**: Monaco editor works for writing code
- **File Saving**: Save files (15% chance of random failure)
- **File Loading**: Load and edit existing files
- **Code Execution**: Run JavaScript code (15% chance of random failure)
- **Basic CRUD**: Create, read, update, delete operations work

### ❌ Terrible Features
- **Aggressive Error Messages**: Every error comes with personal attacks
- **Random File Corruption**: 20% chance your files get corrupted when saved
- **Hidden Files**: Files randomly disappear from the file list (10% chance)
- **Failed Operations**: Saves, deletes, updates, and code execution randomly fail (15% chance)
- **Code Corruption**: Code may be randomly corrupted before execution (10% chance)
- **YouTube Shorts Panel**: Auto-playing distracting videos on the side (shows error screen with YouTube links when videos fail)
- **Server Crashes**: The backend can crash randomly (but usually doesn't)

### Confusing UI
- **Random Color Changes**: Background changes every 5 seconds
- **Layout Chaos**: Interface rearranges itself randomly (normal, chaos, upside-down, tiny text, huge text)
- **Terrible Fonts**: Comic Sans everywhere with rainbow animations
- **YouTube Shorts Panel**: Third column with auto-playing distracting videos (with fallback to YouTube links)
- **Broken Responsiveness**: Mobile view is even worse (videos still play)
- **Flashing Elements**: Random blinking and shaking

### Popup Ads
- **Random Interruption**: Ads appear every 10 seconds (30% chance)
- **Aggressive Marketing**: Fake ads for terrible products
- **Multiple Ads**: Sometimes shows another ad immediately after closing
- **Can't Be Disabled**: "Never show again" button doesn't work

### Random Behavior
- **Insult Banners**: Random insults appear every 15 seconds
- **Cursor Changes**: Mouse cursor is a poop emoji everywhere
- **Line Numbers**: May or may not show (randomly decided per editor)
- **Editor Breaks**: Monaco editor randomly breaks after 30 seconds
- **Execution Delays**: Code execution has random delays (0.5-2.5 seconds)
- **YouTube Shorts**: Auto-playing distracting videos change every 15 seconds (40% chance), with error screens that still distract you
- **Chaos Button**: Performs random destructive actions including rickrolling you

## Installation

```bash
# Install all dependencies
npm run install-all

# Or install manually:
npm install
cd backend && npm install
cd ../frontend && npm install
```

## Running the Terrible IDE

```bash
# Start both frontend and backend
npm start

# Or run separately:
# Terminal 1 - Backend
npm run server

# Terminal 2 - Frontend
npm run client
```

The IDE will be available at `http://localhost:3000`

## API Endpoints

The backend has intentionally terrible API responses:

- `GET /api/files` - Lists files (some may be hidden)
- `POST /api/files` - Creates files (may corrupt them)
- `GET /api/files/:id` - Gets a specific file
- `PUT /api/files/:id` - Updates a file (may fail randomly)
- `DELETE /api/files/:id` - Deletes a file (may refuse)
- `POST /api/run` - Executes JavaScript code (may fail or corrupt randomly)
- `GET /api/status` - Shows terrible server status
- `GET /api/crash` - 50% chance to crash the server

## Database

Uses SQLite with a terrible schema that includes:
- Files table with corruption flags
- User insults table for random messages

## Technologies Used

- **Frontend**: React, Monaco Editor, Terrible CSS
- **Backend**: Node.js, Express, SQLite
- **Styling**: Pure CSS with animations and chaos

## Contributing

Please don't contribute to this project. It's supposed to be terrible.

## License

MIT - But you probably shouldn't use this anyway.

---

**Remember**: This IDE exists to demonstrate how NOT to design software. Use it to learn what terrible UX looks like, then go build something actually good!