        const editor = document.getElementById('editor');
        const lineNumbers = document.getElementById('lineNumbers');
        const brainrotPanel = document.getElementById('brainrotPanel');
        const achievement = document.getElementById('achievement');
        const autocomplete = document.getElementById('autocomplete');

        let brainrotMode = false;
        let undoStack = [];
        let redoStack = [];
        let sigmaPoints = 0;
        let achievements = new Set();

        // File management system
        let currentFileName = 'untitled.js';
        let files = {};
        const FILES_STORAGE_KEY = 'skibidiide_files';

        const brainrotPhrases = [
            "This code is bussin fr fr 🔥",
            "Nah fam, you gotta refactor this. It's giving Ohio energy 💀",
            "Add some error handling, we can't be crashin like that fr",
            "This function name is mid, make it more sigma 😤",
            "Yo this algorithm is lowkey fire though 🔥",
            "Consider using async/await here, that's the sigma way",
            "You're cookin with this implementation fr 👨‍🍳",
            "This could be more efficient ngl, optimize that loop",
            "Add some comments fam, future you will thank you",
            "That's some clean code right there, no cap 💯",
            "Bro really said nested if statements 💀 switch case exists",
            "This is giving spaghetti code vibes, clean it up",
            "Use const instead of var, we're not in 2010 anymore fr",
            "Destructuring would make this cleaner ngl",
            "This needs better variable names, be more descriptive king",
            "You've been coding for 10 mins straight, maybe watch a short? 📱",
            "Taking a brain rot break helps you code better fr",
            "Yo load up a short and come back with fresh eyes 💀",
            "Even sigma coders need TikTok breaks sometimes 🎬",
            "Watch one short then get back to grinding king 👑",
            "Put on some lofi beats, it'll help you focus fr 🎵",
            "Your code needs some background music ngl 🎧",
            "Spotify playlist might unlock your coding powers 💪",
            "Check IG for coding memes then get back to work 📸",
            "Quick reel break won't hurt (maybe) 👀",
            "GIF break time? The scroll is calling 🎭",
            "Random GIFs = random inspiration ngl 💡",
            "Scroll some GIFs, clear your mind fr 🌀",
            "Check r/ProgrammerHumor for the memes 🔴",
            "Reddit got those spicy coding takes rn 💀",
            "Twitch streams are poppin, watch some gameplay 🎮",
            "Take a Twitch break, watch some clips fr 🎬"
        ];

        const autocompleteItems = [
            { text: 'function', icon: '𝑓', type: 'keyword' },
            { text: 'const', icon: '𝑐', type: 'keyword' },
            { text: 'let', icon: '𝑙', type: 'keyword' },
            { text: 'return', icon: '↵', type: 'keyword' },
            { text: 'console.log', icon: '⊕', type: 'method' },
            { text: 'if', icon: '?', type: 'keyword' },
            { text: 'else', icon: ':', type: 'keyword' },
            { text: 'for', icon: '↻', type: 'keyword' },
            { text: 'while', icon: '∞', type: 'keyword' },
            { text: 'sigmaMale()', icon: '💪', type: 'function' },
            { text: 'rizzFunction()', icon: '😎', type: 'function' },
            { text: 'gyattCalculator()', icon: '🧮', type: 'function' }
        ];

        // Update line numbers
        function updateLineNumbers() {
            const lines = editor.value.split('\n').length;
            const lineNumbersDiv = document.getElementById('lineNumbers');

            // Create line numbers array
            let lineNumbersText = '';
            for (let i = 1; i <= lines; i++) {
                lineNumbersText += i + '\n';
            }

            lineNumbersDiv.textContent = lineNumbersText;
            document.getElementById('lineCount').textContent = lines;
            updateMinimap();
        }

        // Update minimap
        function updateMinimap() {
            const minimapContent = document.getElementById('minimapContent');
            minimapContent.textContent = editor.value;
        }

        // Update cursor position
        function updateCursorPosition() {
            const text = editor.value.substring(0, editor.selectionStart);
            const lines = text.split('\n');
            const currentLine = lines.length;
            const currentCol = lines[lines.length - 1].length + 1;

            document.getElementById('currentLine').textContent = currentLine;
            document.getElementById('currentCol').textContent = currentCol;
        }

        // Brainrot mode
        function toggleBrainrot() {
            brainrotMode = !brainrotMode;
            document.getElementById('brainrotStatus').textContent =
                brainrotMode ? 'Brainrot: ON 🧠' : 'Brainrot: OFF';

            if (brainrotMode) {
                showAchievement("Brainrot Mode Activated 🧠");
                startBrainrotComments();
            }
        }

        function startBrainrotComments() {
            if (!brainrotMode) return;

            const phrase = brainrotPhrases[Math.floor(Math.random() * brainrotPhrases.length)];
            document.getElementById('brainrotText').textContent = phrase;
            brainrotPanel.classList.add('show');

            setTimeout(() => {
                brainrotPanel.classList.remove('show');
            }, 5000);

            setTimeout(startBrainrotComments, Math.random() * 20000 + 15000);
        }

        function closeBrainrot() {
            brainrotPanel.classList.remove('show');
        }

        // Achievement system
        function showAchievement(text) {
            if (achievements.has(text)) return;
            achievements.add(text);

            achievement.textContent = `🏆 ${text}`;
            achievement.style.display = 'block';

            sigmaPoints += 10;
            document.getElementById('sigmaPoints').textContent = sigmaPoints;

            setTimeout(() => {
                achievement.style.display = 'none';
            }, 3000);
        }

        // Track typing for achievements
        let totalChars = 0;
        editor.addEventListener('input', () => {
            updateLineNumbers();
            updateCursorPosition();
            saveToUndoStack();

            totalChars++;

            if (totalChars === 1) {
                showAchievement("First Keystroke (Legendary) 💯");
            }
            if (totalChars === 100) {
                showAchievement("100 Characters (Grinding) 💪");
            }
            if (editor.value.split('\n').length >= 50) {
                showAchievement("50 Lines of Code (Sigma Developer) 🔥");
            }

            // Update gyatt meter (random fun metric)
            const gyatt = Math.min(100, Math.floor((editor.value.length / 10) % 101));
            document.getElementById('gyattMeter').textContent = gyatt;

            // Simple autocomplete
            handleAutocomplete();
        });

        function handleAutocomplete() {
            const cursorPos = editor.selectionStart;
            const textBeforeCursor = editor.value.substring(0, cursorPos);
            const words = textBeforeCursor.split(/\s+/);
            const currentWord = words[words.length - 1];

            if (currentWord.length < 2) {
                autocomplete.style.display = 'none';
                return;
            }

            const matches = autocompleteItems.filter(item =>
                item.text.toLowerCase().startsWith(currentWord.toLowerCase())
            );

            if (matches.length === 0) {
                autocomplete.style.display = 'none';
                return;
            }

            const rect = editor.getBoundingClientRect();
            const lines = editor.value.substring(0, cursorPos).split('\n');
            const lineHeight = 22.4; // 14px * 1.6 line-height

            autocomplete.innerHTML = matches.map((item, index) => `
                <div class="autocomplete-item ${index === 0 ? 'selected' : ''}" onclick="insertAutocomplete('${item.text}')">
                    <span class="autocomplete-icon">${item.icon}</span>
                    <span>${item.text}</span>
                </div>
            `).join('');

            autocomplete.style.display = 'block';
            autocomplete.style.left = rect.left + 60 + 'px';
            autocomplete.style.top = rect.top + (lines.length * lineHeight) + 16 + 'px';
        }

        function insertAutocomplete(text) {
            const cursorPos = editor.selectionStart;
            const textBefore = editor.value.substring(0, cursorPos);
            const textAfter = editor.value.substring(cursorPos);
            const words = textBefore.split(/\s+/);
            const currentWord = words[words.length - 1];
            const beforeWord = textBefore.substring(0, textBefore.length - currentWord.length);

            editor.value = beforeWord + text + textAfter;
            editor.selectionStart = editor.selectionEnd = beforeWord.length + text.length;
            autocomplete.style.display = 'none';
            editor.focus();
        }

        editor.addEventListener('keydown', (e) => {
            if (e.key === 'Tab') {
                e.preventDefault();
                const start = editor.selectionStart;
                const end = editor.selectionEnd;
                editor.value = editor.value.substring(0, start) + '    ' + editor.value.substring(end);
                editor.selectionStart = editor.selectionEnd = start + 4;
            }
        });

        editor.addEventListener('click', updateCursorPosition);
        editor.addEventListener('keyup', updateCursorPosition);

        // Undo/Redo
        function saveToUndoStack() {
            if (undoStack.length === 0 || undoStack[undoStack.length - 1] !== editor.value) {
                undoStack.push(editor.value);
                if (undoStack.length > 50) undoStack.shift();
                redoStack = [];
            }
        }

        function undo() {
            if (undoStack.length > 1) {
                redoStack.push(undoStack.pop());
                editor.value = undoStack[undoStack.length - 1];
                updateLineNumbers();
            }
        }

        function redo() {
            if (redoStack.length > 0) {
                const state = redoStack.pop();
                undoStack.push(state);
                editor.value = state;
                updateLineNumbers();
            }
        }

        // File operations
        function newFile() {
            createNewFile();
        }

        function saveFile() {
            const blob = new Blob([editor.value], { type: 'text/plain' });
            const url = URL.createObjectURL(blob);
            const a = document.createElement('a');
            a.href = url;
            a.download = 'code.js';
            a.click();
            showAchievement("File Saved (Real) 💾");
        }

        function openFile() {
            const input = document.createElement('input');
            input.type = 'file';
            input.accept = '.js,.html,.css,.txt,.md';
            input.onchange = (e) => {
                const file = e.target.files[0];
                const reader = new FileReader();
                reader.onload = (event) => {
                    editor.value = event.target.result;
                    updateLineNumbers();
                    showAchievement("File Opened 📁");
                };
                reader.readAsText(file);
            };
            input.click();
        }

        function runCode() {
            const consoleOutput = document.getElementById('consoleOutput');
            const outputStatus = document.getElementById('outputStatus');

            // Clear previous output
            consoleOutput.innerHTML = '';
            outputStatus.textContent = 'Running...';
            outputStatus.style.color = '#ffd93d';

            // Capture console.log output
            const logs = [];
            const originalLog = console.log;
            const originalError = console.error;
            const originalWarn = console.warn;

            console.log = function(...args) {
                logs.push({ type: 'log', message: args.join(' ') });
                originalLog.apply(console, args);
            };

            console.error = function(...args) {
                logs.push({ type: 'error', message: args.join(' ') });
                originalError.apply(console, args);
            };

            console.warn = function(...args) {
                logs.push({ type: 'warn', message: args.join(' ') });
                originalWarn.apply(console, args);
            };

            try {
                // Execute the code
                const result = new Function(editor.value)();

                // Show logs
                if (logs.length > 0) {
                    logs.forEach(log => {
                        const logDiv = document.createElement('div');
                        logDiv.style.marginBottom = '4px';

                        if (log.type === 'error') {
                            logDiv.style.color = '#f44336';
                            logDiv.textContent = '❌ ' + log.message;
                        } else if (log.type === 'warn') {
                            logDiv.style.color = '#ffd93d';
                            logDiv.textContent = '⚠️ ' + log.message;
                        } else {
                            logDiv.style.color = '#4caf50';
                            logDiv.textContent = '✅ ' + log.message;
                        }

                        consoleOutput.appendChild(logDiv);
                    });
                } else {
                    // If no logs but code ran successfully
                    const successDiv = document.createElement('div');
                    successDiv.style.color = '#4caf50';
                    successDiv.textContent = '✅ Code executed successfully (no output)';
                    consoleOutput.appendChild(successDiv);
                }

                // Show return value if exists
                if (result !== undefined) {
                    const returnDiv = document.createElement('div');
                    returnDiv.style.color = '#64b5f6';
                    returnDiv.style.marginTop = '8px';
                    returnDiv.textContent = '↩️ Returned: ' + JSON.stringify(result);
                    consoleOutput.appendChild(returnDiv);
                }

                outputStatus.textContent = 'Success ✅';
                outputStatus.style.color = '#4caf50';
                showAchievement("Code Executed (No Cap) ▶️");

            } catch (error) {
                const errorDiv = document.createElement('div');
                errorDiv.style.color = '#f44336';
                errorDiv.style.whiteSpace = 'pre-wrap';
                errorDiv.textContent = '💀 Error: ' + error.message + '\n\n' + error.stack;
                consoleOutput.appendChild(errorDiv);

                outputStatus.textContent = 'Error 💀';
                outputStatus.style.color = '#f44336';
            } finally {
                // Restore original console methods
                console.log = originalLog;
                console.error = originalError;
                console.warn = originalWarn;
            }
        }

        function clearConsole() {
            document.getElementById('consoleOutput').innerHTML = '<div style="color: #858585;">// Console cleared 🧹</div>';
            document.getElementById('outputStatus').textContent = 'Ready';
            document.getElementById('outputStatus').style.color = '#858585';
        }

        function formatCode() {
            // Simple indentation
            let formatted = editor.value;
            let indent = 0;
            const lines = formatted.split('\n');

            formatted = lines.map(line => {
                const trimmed = line.trim();
                if (trimmed.includes('}')) indent = Math.max(0, indent - 1);
                const indented = '    '.repeat(indent) + trimmed;
                if (trimmed.includes('{')) indent++;
                return indented;
            }).join('\n');

            editor.value = formatted;
            updateLineNumbers();
            showAchievement("Code Formatted ✨");
        }

        function find() {
            const search = prompt('Enter text to find:');
            if (search) {
                const index = editor.value.indexOf(search);
                if (index !== -1) {
                    editor.focus();
                    editor.setSelectionRange(index, index + search.length);
                } else {
                    alert('Text not found fr 🔍');
                }
            }
        }

        function switchFile(filename) {
            // All files in the sidebar are now user files
            if (files[filename]) {
                switchToFile(filename);
            }
        }

        async function loadFileContent(filename) {
            try {
                const response = await fetch(`/${filename}`);
                if (!response.ok) {
                    throw new Error(`HTTP error! status: ${response.status}`);
                }
                const content = await response.text();

                // Update editor with file content
                editor.value = content;
                updateLineNumbers();

                // Update status bar to show current file type
                updateFileType(filename);

                // Show achievement for opening useful files
                showAchievement(`Loaded ${filename} template! 📄`);

            } catch (error) {
                console.error('Error loading file:', error);
                editor.value = `// Error loading ${filename}\n// ${error.message}\n\n// This file contains useful templates and examples!\n// Check the sidebar for different file types.`;
                updateLineNumbers();
            }
        }

        function updateFileType(filename) {
            const fileTypeElement = document.querySelector('.status-item:nth-child(3)');
            if (!fileTypeElement) return;

            const extension = filename.split('.').pop().toLowerCase();
            const fileTypes = {
                'js': 'JavaScript',
                'jsx': 'React/JSX',
                'html': 'HTML',
                'css': 'CSS',
                'json': 'JSON',
                'md': 'Markdown',
                'gitignore': 'Git Ignore',
                'dockerfile': 'Docker',
                'env': 'Environment'
            };

            fileTypeElement.textContent = fileTypes[extension] || 'Text';
        }

        // Platform switching
        function switchPlatform(platform) {
            // Update tab styles
            document.querySelectorAll('.platform-tab').forEach(tab => {
                if (tab.dataset.platform === platform) {
                    tab.style.background = '#094771';
                    tab.style.borderColor = '#0e639c';
                    tab.classList.add('active');
                } else {
                    tab.style.background = '#3c3c3c';
                    tab.style.borderColor = '#555';
                    tab.classList.remove('active');
                }
            });

            // Show/hide panels
            document.getElementById('youtubePanel').style.display = platform === 'youtube' ? 'block' : 'none';
            document.getElementById('instagramPanel').style.display = platform === 'instagram' ? 'block' : 'none';
            document.getElementById('tenorPanel').style.display = platform === 'tenor' ? 'block' : 'none';
            document.getElementById('redditPanel').style.display = platform === 'reddit' ? 'block' : 'none';
            document.getElementById('twitchPanel').style.display = platform === 'twitch' ? 'block' : 'none';
            document.getElementById('terminalPanel').style.display = platform === 'terminal' ? 'block' : 'none';
            document.getElementById('snakePanel').style.display = platform === 'snake' ? 'block' : 'none';

            // Initialize Snake game when tabs are switched
            if (platform === 'snake') {
                setTimeout(initSnake, 100);
            }
        }

        // YouTube Shorts embedding
        function embedShorts() {
            const urlInput = document.getElementById('shortsUrl');
            const url = urlInput.value.trim();

            if (!url) {
                alert('Paste a YouTube Shorts URL first fr 📱');
                return;
            }

            // Extract video ID from various YouTube URL formats
            let videoId = null;

            // shorts/VIDEO_ID format
            const shortsMatch = url.match(/shorts\/([a-zA-Z0-9_-]+)/);
            if (shortsMatch) {
                videoId = shortsMatch[1];
            }

            // youtube.com/watch?v=VIDEO_ID format
            const watchMatch = url.match(/[?&]v=([a-zA-Z0-9_-]+)/);
            if (watchMatch) {
                videoId = watchMatch[1];
            }

            // youtu.be/VIDEO_ID format
            const shortUrlMatch = url.match(/youtu\.be\/([a-zA-Z0-9_-]+)/);
            if (shortUrlMatch) {
                videoId = shortUrlMatch[1];
            }

            if (!videoId) {
                alert('Invalid YouTube URL fr 💀 Try again');
                return;
            }

            // Embed the video
            const player = document.getElementById('shortsPlayer');
            player.src = `https://www.youtube.com/embed/${videoId}?autoplay=1&loop=1&playlist=${videoId}`;

            document.getElementById('shortsContainer').style.display = 'block';
            showAchievement("Brain Rot Break Activated 📱");

            // Track distraction time for achievements
            if (!window.embedStartTime) {
                window.embedStartTime = Date.now();
            }
        }

        // Quick shorts suggestions - mix of memes and coding content
        const quickShorts = [
            'dQw4w9WgXcQ', // Classic rickroll
            'jNQXAC9IVRw', // Me at the zoo (first YT video)
            '9bZkp7q19f0', // Gangnam Style (iconic)
            'kJQP7kiw5Fk', // Luis Fonsi - Despacito
            'OPf0YbXqDm0', // Mark Rober
            // Add your favorite shorts IDs here!
        ];

        function loadRandomShort() {
            const randomId = quickShorts[Math.floor(Math.random() * quickShorts.length)];
            document.getElementById('shortsUrl').value = `https://youtube.com/shorts/${randomId}`;
            embedShorts();
        }

        // Spotify floating player
        function embedFloatingSpotify() {
            const urlInput = document.getElementById('floatingSpotifyUrl');
            const url = urlInput.value.trim();

            if (!url) {
                alert('Paste a Spotify URL first fr 🎵');
                return;
            }

            // Extract Spotify URI from various URL formats
            // Format: open.spotify.com/track/ID or open.spotify.com/playlist/ID
            let spotifyMatch = url.match(/spotify\.com\/(track|playlist|album)\/([a-zA-Z0-9]+)/);

            if (!spotifyMatch) {
                alert('Invalid Spotify URL fr 💀 Try again');
                return;
            }

            const type = spotifyMatch[1];
            const id = spotifyMatch[2];

            // Spotify embed URL
            const player = document.getElementById('floatingSpotifyPlayer');
            player.src = `https://open.spotify.com/embed/${type}/${id}?utm_source=generator&theme=0`;

            document.getElementById('floatingSpotifyContainer').style.display = 'block';
            showAchievement("Coding Vibes Activated 🎵");

            if (!window.embedStartTime) {
                window.embedStartTime = Date.now();
            }
        }

        // Quick Spotify playlists
        function loadLofiBeats() {
            // Show floating player first
            document.getElementById('floatingSpotify').style.display = 'block';

            // Popular lofi hip hop playlist
            const player = document.getElementById('floatingSpotifyPlayer');
            player.src = 'https://open.spotify.com/embed/playlist/37i9dQZF1DWWQRwui0ExPn?utm_source=generator&theme=0';

            document.getElementById('floatingSpotifyContainer').style.display = 'block';
            showAchievement("Lofi Vibes Activated 🎧");

            if (!window.embedStartTime) {
                window.embedStartTime = Date.now();
            }
        }

        function loadCodingPlaylist() {
            // Show floating player first
            document.getElementById('floatingSpotify').style.display = 'block';

            // Coding/Focus playlist
            const player = document.getElementById('floatingSpotifyPlayer');
            player.src = 'https://open.spotify.com/embed/playlist/37i9dQZF1DX5trt9i14X7j?utm_source=generator&theme=0';

            document.getElementById('floatingSpotifyContainer').style.display = 'block';
            showAchievement("Coding Playlist Activated 💻");

            if (!window.embedStartTime) {
                window.embedStartTime = Date.now();
            }
        }

        function toggleFloatingSpotify() {
            const player = document.getElementById('floatingSpotify');
            if (player.style.display === 'none' || player.style.display === '') {
                player.style.display = 'block';
            } else {
                player.style.display = 'none';
            }
        }

        function closeFloatingSpotify() {
            document.getElementById('floatingSpotify').style.display = 'none';
        }

        // AI Agents System
        function toggleAIAgents() {
            const panel = document.getElementById('aiAgentsPanel');
            if (panel.style.display === 'none' || panel.style.display === '') {
                panel.style.display = 'block';
                showAchievement("AI Agents Activated 🤖");
            } else {
                panel.style.display = 'none';
            }
        }

        async function runAIAgent() {
            const agentType = document.getElementById('agentType').value;
            const task = document.getElementById('agentTask').value.trim();
            const includeCode = document.getElementById('includeCode').checked;
            const currentCode = editor.value;

            if (!task && agentType !== 'brainrot') {
                alert('Please describe what you need help with fr 🤖');
                return;
            }

            // Show loading
            const responseDiv = document.getElementById('agentResponse');
            const responseText = document.getElementById('agentResponseText');
            responseDiv.style.display = 'block';
            responseText.textContent = '🤖 Agent is thinking...';

            // If Code Generator, use real AI API
            if (agentType === 'codegen') {
                try {
                    const response = await callGeminiAPI(task, includeCode ? currentCode : null);
                    responseText.textContent = response;
                    showAchievement('Code Generator Completed ✨');
                } catch (error) {
                    responseText.textContent = `Error: ${error.message}\n\nMake sure you're viewing this from the Claude.ai interface to use real AI code generation.`;
                }
            } else {
                // Simulate AI response for other agents
                setTimeout(() => {
                    let response = generateAgentResponse(agentType, task, includeCode ? currentCode : null);
                    responseText.textContent = response;
                    showAchievement(`${getAgentName(agentType)} Completed 🤖`);
                }, 1500);
            }
        }

        async function callGeminiAPI(task, currentCode) {
            // Call our backend API endpoint
            const response = await fetch('/api/gemini', {
                method: 'POST',
                headers: {
                    'Content-Type': 'application/json',
                },
                body: JSON.stringify({
                    task: task,
                    currentCode: currentCode
                }),
            });

            if (!response.ok) {
                const errorData = await response.json();
                throw new Error(errorData.error || `API request failed: ${response.status}`);
            }

            const data = await response.json();
            return data.response;
        }

        function generateAgentResponse(agentType, task, code) {
            const responses = {
                debugger: `🐛 Debug Analysis:

Found potential issues:
1. Missing null checks on line references
2. Async operations without proper error handling
3. Potential memory leak in event listeners

Recommendations:
- Add try-catch blocks around risky operations
- Validate input parameters
- Clean up event listeners on component unmount

Pro tip: Use console.log() strategically to trace execution flow fr 💯`,

                optimizer: `⚡ Optimization Report:

Performance improvements identified:
1. Replace nested loops with more efficient algorithms
2. Cache computed values instead of recalculating
3. Use const/let instead of var for better scope

Estimated improvement: 40% faster execution
Memory reduction: ~25%

Code looks mid rn, but we can make it bussin 🔥`,

                explainer: `📚 Code Explanation:

This code implements a ${task || 'function'}.

Key concepts:
- Variables store data values
- Functions encapsulate reusable logic
- Loops iterate over collections
- Conditionals control program flow

Think of it like a recipe - each step does something specific to get the final result.

Not gonna lie, this is some clean logic fr 👨‍🍳`,

                refactor: `🔧 Refactoring Suggestions:

Improvements:
1. Extract repeated logic into helper functions
2. Rename variables for better clarity
3. Apply DRY principle (Don't Repeat Yourself)
4. Simplify complex conditionals

Before: Spaghetti code 🍝
After: Clean, maintainable architecture 🏗️

This refactor gonna be bussin no cap 💯`,

                tester: `✅ Test Cases Generated:

// Test 1: Normal case
test('should handle valid input', () => {
    expect(myFunction('valid')).toBe(expected);
});

// Test 2: Edge case
test('should handle empty input', () => {
    expect(myFunction('')).toBe(null);
});

// Test 3: Error case
test('should throw on invalid input', () => {
    expect(() => myFunction(null)).toThrow();
});

Coverage: Looking solid fr 🎯`,

                commenter: `💬 Comments Added:

/**
 * ${task || 'Main function'}
 * @param {string} input - The input parameter
 * @returns {any} The processed result
 */

// Initialize variables
// Process the data
// Return result

Comments make code readable for future you 📝`,

                brainrot: `💀 Brainrot Coder Says:

Yo fam, ${task || 'this code'} is giving major Ohio energy fr fr 💀

Real talk:
- Your function names are mid, make them more sigma
- This algorithm is bussin but could be more rizz
- Add some error handling, we can't be crashin like that
- Use async/await, that's the sigma grindset way

No cap, refactor this and you'll be cookin 🔥
Stay on that coding grind king 👑

We're so back fr fr 💯`
            };

            return responses[agentType] || "Agent is processing your request...";
        }

        function getAgentName(agentType) {
            const names = {
                codegen: 'Code Generator',
                debugger: 'Debug Master',
                optimizer: 'Code Optimizer',
                explainer: 'Code Explainer',
                refactor: 'Refactoring Pro',
                tester: 'Test Writer',
                commenter: 'Comment Generator',
                brainrot: 'Brainrot Coder'
            };
            return names[agentType] || 'AI Agent';
        }

        function clearAgentResponse() {
            document.getElementById('agentResponse').style.display = 'none';
            document.getElementById('agentResponseText').textContent = '';
        }

        function insertResponseToEditor() {
            const responseText = document.getElementById('agentResponseText').textContent;
            const insertMode = document.getElementById('insertMode').value;

            // Extract code blocks from response (anything between ``` markers)
            const codeBlockRegex = /```[\w]*\n([\s\S]*?)```/g;
            let matches = [...responseText.matchAll(codeBlockRegex)];

            let codeToInsert;
            if (matches.length > 0) {
                // If there are code blocks, use the first one
                codeToInsert = matches[0][1].trim();
            } else {
                // If no code blocks, use entire response
                codeToInsert = responseText;
            }

            if (insertMode === 'append') {
                // Append to existing code
                const currentCode = editor.value;
                if (currentCode.trim()) {
                    editor.value = currentCode + '\n\n// AI Generated Code:\n' + codeToInsert;
                } else {
                    editor.value = codeToInsert;
                }
                showAchievement('Code Appended to Editor 📝');
            } else {
                // Replace all code
                editor.value = codeToInsert;
                showAchievement('Code Replaced in Editor 🔄');
            }

            updateLineNumbers();
            editor.focus();

            // Scroll to bottom if appending
            if (insertMode === 'append') {
                editor.scrollTop = editor.scrollHeight;
            }
        }

        // Quick action functions
        function quickCodeGen() {
            document.getElementById('agentType').value = 'codegen';
            document.getElementById('agentTask').value = 'Write code based on the description I provide';
            // Don't auto-run, let user describe what they want
            document.getElementById('agentTask').focus();
        }

        function quickDebug() {
            document.getElementById('agentType').value = 'debugger';
            document.getElementById('agentTask').value = 'Find and fix bugs in my code';
            runAIAgent();
        }

        function quickOptimize() {
            document.getElementById('agentType').value = 'optimizer';
            document.getElementById('agentTask').value = 'Optimize performance and reduce complexity';
            runAIAgent();
        }

        function quickExplain() {
            document.getElementById('agentType').value = 'explainer';
            document.getElementById('agentTask').value = 'Explain what this code does';
            runAIAgent();
        }

        function quickTest() {
            document.getElementById('agentType').value = 'tester';
            document.getElementById('agentTask').value = 'Write unit tests for this code';
            runAIAgent();
        }

        // Instagram Reels embedding
        function embedReels() {
            const urlInput = document.getElementById('reelsUrl');
            const url = urlInput.value.trim();

            if (!url) {
                alert('Paste an Instagram Reel URL first fr 📸');
                return;
            }

            // Extract reel ID from Instagram URL
            // Format: instagram.com/reel/ID or instagram.com/p/ID
            let reelMatch = url.match(/(?:reel|p)\/([a-zA-Z0-9_-]+)/);

            if (!reelMatch) {
                alert('Invalid Instagram URL fr 💀 Try again');
                return;
            }

            const reelId = reelMatch[1];

            // Instagram embed URL
            const player = document.getElementById('reelsPlayer');
            player.src = `https://www.instagram.com/p/${reelId}/embed/`;

            document.getElementById('reelsContainer').style.display = 'block';
            showAchievement("Instagram Scrolling Activated 📸");

            if (!window.embedStartTime) {
                window.embedStartTime = Date.now();
            }
        }

        // Tenor GIF Scroller
        let gifInterval = null;
        let gifCount = 0;

        // Using reliable, publicly accessible GIF URLs
        const gifCollections = {
            coding: [
                'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXE3ZjBkdTBkdTBkdTBkdTBkdTBkdTBkdTBkdTBkdTBkdTBkdTBkdTBkdQ/ZVik7pBtu9dNS/giphy.gif',
                'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXE3ZjBkdTBkdTBkdTBkdTBkdTBkdTBkdTBkdTBkdTBkdTBkdTBkdTBkdQ/3oKIPnAiaMCws8nOsE/giphy.gif',
                'https://i.giphy.com/media/v1.Y2lkPTc5MGI3NjExNXE3ZjBkdTBkdTBkdTBkdTBkdTBkdTBkdTBkdTBkdTBkdTBkdTBkdTBkdQ/du3J3cXyzhj75IOgvA/giphy.gif',
                'https://media.giphy.com/media/13HgwGsXF0aiGY/giphy.gif',
                'https://media.giphy.com/media/LmNwrBhejkK9EFP504/giphy.gif',
                'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif'
            ],
            funny: [
                'https://media.giphy.com/media/3oEjI6SIIHBdRxXI40/giphy.gif',
                'https://media.giphy.com/media/l0HlvtIPzPdt2usKs/giphy.gif',
                'https://media.giphy.com/media/10JhviFuU2gWD6/giphy.gif',
                'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif',
                'https://media.giphy.com/media/Q7ozWVYCR0nyW2rvPW/giphy.gif',
                'https://media.giphy.com/media/l46Cy1rHbQ92uuLXa/giphy.gif'
            ],
            cat: [
                'https://media.giphy.com/media/JIX9t2j0ZTN9S/giphy.gif',
                'https://media.giphy.com/media/VbnUQpnihPSIgIXuZv/giphy.gif',
                'https://media.giphy.com/media/mlvseq9yvZhba/giphy.gif',
                'https://media.giphy.com/media/3oriO0OEd9QIDdllqo/giphy.gif',
                'https://media.giphy.com/media/ICOgUNjpvO0PC/giphy.gif',
                'https://media.giphy.com/media/jpbnoe3UIa8TU8LM13/giphy.gif'
            ],
            dance: [
                'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
                'https://media.giphy.com/media/l3q2XhfQ8oCkm1Ts4/giphy.gif',
                'https://media.giphy.com/media/xTiTnqUxyWbsAXq7Ju/giphy.gif',
                'https://media.giphy.com/media/13Y6LAZJqRspI4/giphy.gif',
                'https://media.giphy.com/media/6WJroWFPN2LyE/giphy.gif',
                'https://media.giphy.com/media/l41m4ODfe8PwHlsUU/giphy.gif'
            ],
            excited: [
                'https://media.giphy.com/media/5GoVLqeAOo6PK/giphy.gif',
                'https://media.giphy.com/media/kyLYXonQYYfwYDIeZl/giphy.gif',
                'https://media.giphy.com/media/yoJC2El7xJkYCadlWE/giphy.gif',
                'https://media.giphy.com/media/artj92V8o75VPL7AeQ/giphy.gif',
                'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
                'https://media.giphy.com/media/3o6Zt6ML6BklcajjsA/giphy.gif'
            ],
            confused: [
                'https://media.giphy.com/media/3o7btPCcdNniyf0ArS/giphy.gif',
                'https://media.giphy.com/media/3WmWdBzqveXaE/giphy.gif',
                'https://media.giphy.com/media/l3q2K5jinAlChoCLS/giphy.gif',
                'https://media.giphy.com/media/CDJo4EgHwbaPS/giphy.gif',
                'https://media.giphy.com/media/kaq6GnxDlJaBq/giphy.gif',
                'https://media.giphy.com/media/3o7527pa7qs9kCG78A/giphy.gif'
            ],
            tired: [
                'https://media.giphy.com/media/l0HlBO7eyXzSZkJri/giphy.gif',
                'https://media.giphy.com/media/W1xb8a7RNWv2E/giphy.gif',
                'https://media.giphy.com/media/26ufdipQqU2lhNA4g/giphy.gif',
                'https://media.giphy.com/media/hFdi31x0aTdMIydxuO/giphy.gif',
                'https://media.giphy.com/media/9Y5BbDSkSTiY8/giphy.gif',
                'https://media.giphy.com/media/xT0xeuOy2Fcl9vDGiA/giphy.gif'
            ],
            party: [
                'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif',
                'https://media.giphy.com/media/DhstvI3zZ598Nb1rFf/giphy.gif',
                'https://media.giphy.com/media/l0MYGb1LuZ3n7dRnO/giphy.gif',
                'https://media.giphy.com/media/3ohzdIuqJoo8QdKlnW/giphy.gif',
                'https://media.giphy.com/media/g9582DNuQppxC/giphy.gif',
                'https://media.giphy.com/media/l0MYt5jPR6QX5pnqM/giphy.gif'
            ],
            crying: [
                'https://media.giphy.com/media/L95W4wv8nnb9K/giphy.gif',
                'https://media.giphy.com/media/d2lcHJTG5Tscg/giphy.gif',
                'https://media.giphy.com/media/OPU6wzx8JrHna/giphy.gif',
                'https://media.giphy.com/media/ROF8OQvDmxytW/giphy.gif',
                'https://media.giphy.com/media/3o7absbD7PbTFQa0c8/giphy.gif',
                'https://media.giphy.com/media/1BXa2alBjrCXC/giphy.gif'
            ],
            screaming: [
                'https://media.giphy.com/media/l0HlPystfePnAI3G8/giphy.gif',
                'https://media.giphy.com/media/5nsiFjdgylfK3csZ5T/giphy.gif',
                'https://media.giphy.com/media/l0IylQoMkcbZSOAzm/giphy.gif',
                'https://media.giphy.com/media/14ut8PhnIwzros/giphy.gif',
                'https://media.giphy.com/media/bEVKYB487Lqxy/giphy.gif',
                'https://media.giphy.com/media/HUkOv6BNWc1HO/giphy.gif'
            ]
        };

        function updateSpeedLabel() {
            const speed = document.getElementById('gifSpeed').value;
            document.getElementById('speedLabel').textContent = speed + 's';
        }

        function getRandomGif() {
            const category = document.getElementById('gifCategory').value;
            const gifs = gifCollections[category];
            return gifs[Math.floor(Math.random() * gifs.length)];
        }

        function updateGif() {
            const gifImg = document.getElementById('tenorGif');
            const randomGif = getRandomGif();

            console.log('Loading GIF:', randomGif);

            // Add fade effect
            gifImg.style.opacity = '0';

            setTimeout(() => {
                // Force reload by adding timestamp
                gifImg.src = randomGif + '?t=' + Date.now();

                gifImg.onload = function() {
                    console.log('GIF loaded successfully');
                    gifImg.style.opacity = '1';
                    gifCount++;
                    document.getElementById('gifCounter').textContent = `GIF #${gifCount} 💀`;
                };

                gifImg.onerror = function() {
                    console.error('GIF failed to load:', randomGif);
                    // Show error but keep trying
                    gifImg.style.opacity = '1';
                    gifCount++;
                    document.getElementById('gifCounter').textContent = `GIF #${gifCount} (error) 💀`;
                };
            }, 200);
        }

        function startGifScroll() {
            if (gifInterval) return; // Already running

            const speed = parseInt(document.getElementById('gifSpeed').value) * 1000;

            // Show container and load first GIF
            document.getElementById('tenorContainer').style.display = 'block';
            document.getElementById('startGifBtn').style.display = 'none';
            document.getElementById('stopGifBtn').style.display = 'block';

            gifCount = 0;
            updateGif();

            // Start interval
            gifInterval = setInterval(updateGif, speed);

            showAchievement("GIF Scroll Activated 🎭");

            if (!window.embedStartTime) {
                window.embedStartTime = Date.now();
            }
        }

        function stopGifScroll() {
            if (gifInterval) {
                clearInterval(gifInterval);
                gifInterval = null;
            }

            document.getElementById('startGifBtn').style.display = 'block';
            document.getElementById('stopGifBtn').style.display = 'none';

            // Calculate time wasted
            if (window.embedStartTime) {
                const timeWasted = Math.floor((Date.now() - window.embedStartTime) / 1000);
                if (timeWasted > 30) {
                    showAchievement(`Watched ${gifCount} GIFs in ${timeWasted}s 💀`);
                }
                window.embedStartTime = null;
            }
        }

        // Initialize GIF image with transition
        setTimeout(() => {
            const gifImg = document.getElementById('tenorGif');
            if (gifImg) {
                gifImg.style.transition = 'opacity 0.2s ease';
            }
        }, 100);

        // Reddit embedding
        function embedReddit() {
            const urlInput = document.getElementById('redditUrl');
            const url = urlInput.value.trim();

            if (!url) {
                alert('Paste a Reddit URL first fr 🔴');
                return;
            }

            // Extract post info from Reddit URL
            // Format: reddit.com/r/subreddit/comments/id/title
            const redditMatch = url.match(/reddit\.com\/r\/([^\/]+)\/comments\/([^\/]+)/);

            if (!redditMatch) {
                alert('Invalid Reddit URL fr 💀 Try again');
                return;
            }

            // Use Reddit's embed format
            const embedUrl = url.replace('www.reddit.com', 'embed.reddit.com');

            const player = document.getElementById('redditPlayer');
            player.src = embedUrl;

            document.getElementById('redditContainer').style.display = 'block';
            showAchievement("Reddit Scrolling Activated 🔴");

            if (!window.embedStartTime) {
                window.embedStartTime = Date.now();
            }
        }

        function loadSubreddit(subreddit) {
            // Open subreddit in the iframe
            const player = document.getElementById('redditPlayer');
            player.src = `https://www.reddit.com/r/${subreddit}/`;

            document.getElementById('redditContainer').style.display = 'block';
            showAchievement(`r/${subreddit} Loaded 🔴`);

            if (!window.embedStartTime) {
                window.embedStartTime = Date.now();
            }
        }

        // Twitch embedding
        function embedTwitch() {
            const urlInput = document.getElementById('twitchUrl');
            const url = urlInput.value.trim();
            const type = document.getElementById('twitchType').value;

            if (!url) {
                alert('Paste a Twitch URL first fr 🎮');
                return;
            }

            const player = document.getElementById('twitchPlayer');

            if (type === 'clip') {
                // Extract clip slug from URL
                // Format: clips.twitch.tv/ClipSlug or twitch.tv/channel/clip/ClipSlug
                let clipMatch = url.match(/clips\.twitch\.tv\/([a-zA-Z0-9_-]+)/);
                if (!clipMatch) {
                    clipMatch = url.match(/twitch\.tv\/[^\/]+\/clip\/([a-zA-Z0-9_-]+)/);
                }

                if (!clipMatch) {
                    alert('Invalid Twitch clip URL fr 💀');
                    return;
                }

                const clipSlug = clipMatch[1];
                player.src = `https://clips.twitch.tv/embed?clip=${clipSlug}&parent=${window.location.hostname || 'localhost'}`;
            } else {
                // Extract channel name from URL
                // Format: twitch.tv/channelname
                const channelMatch = url.match(/twitch\.tv\/([a-zA-Z0-9_]+)/);

                if (!channelMatch) {
                    alert('Invalid Twitch channel URL fr 💀');
                    return;
                }

                const channel = channelMatch[1];
                player.src = `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname || 'localhost'}`;
            }

            document.getElementById('twitchContainer').style.display = 'block';
            showAchievement("Twitch Grind Activated 🎮");

            if (!window.embedStartTime) {
                window.embedStartTime = Date.now();
            }
        }

        function loadTwitchChannel(channel) {
            const player = document.getElementById('twitchPlayer');
            player.src = `https://player.twitch.tv/?channel=${channel}&parent=${window.location.hostname || 'localhost'}`;

            document.getElementById('twitchContainer').style.display = 'block';
            document.getElementById('twitchType').value = 'stream';
            showAchievement(`${channel} Stream Loaded 🎮`);

            if (!window.embedStartTime) {
                window.embedStartTime = Date.now();
            }
        }

        // Universal close function
        function closeEmbed(platform) {
            if (platform === 'youtube') {
                const player = document.getElementById('shortsPlayer');
                player.src = '';
                document.getElementById('shortsContainer').style.display = 'none';
            } else if (platform === 'instagram') {
                const player = document.getElementById('reelsPlayer');
                player.src = '';
                document.getElementById('reelsContainer').style.display = 'none';
            } else if (platform === 'spotify') {
                const player = document.getElementById('spotifyPlayer');
                player.src = '';
                document.getElementById('spotifyContainer').style.display = 'none';
            } else if (platform === 'tenor') {
                stopGifScroll();
                document.getElementById('tenorContainer').style.display = 'none';
            } else if (platform === 'reddit') {
                const player = document.getElementById('redditPlayer');
                player.src = '';
                document.getElementById('redditContainer').style.display = 'none';
            } else if (platform === 'twitch') {
                const player = document.getElementById('twitchPlayer');
                player.src = '';
                document.getElementById('twitchContainer').style.display = 'none';
            }

            // Calculate time wasted (I mean, invested)
            if (window.embedStartTime) {
                const timeWasted = Math.floor((Date.now() - window.embedStartTime) / 1000);
                if (timeWasted > 60) {
                    showAchievement(`Wasted ${timeWasted}s on Brain Rot 💀`);
                }
                window.embedStartTime = null;
            }
        }

        // Initialize
        updateLineNumbers();
        updateCursorPosition();
        saveToUndoStack();

        // File management functions
        function loadFilesFromStorage() {
            try {
                const savedFiles = localStorage.getItem(FILES_STORAGE_KEY);
                if (savedFiles) {
                    files = JSON.parse(savedFiles);
                }
            } catch (error) {
                console.warn('Could not load files from storage:', error);
                files = {};
            }
        }

        function saveFilesToStorage() {
            try {
                localStorage.setItem(FILES_STORAGE_KEY, JSON.stringify(files));
            } catch (error) {
                console.warn('Could not save files to storage:', error);
            }
        }

        function createNewFile() {
            console.log('createNewFile function called');
            showFileNameModal();
        }

        function showFileNameModal() {
            const modal = document.getElementById('fileNameModal');
            const input = document.getElementById('fileNameInput');
            const createBtn = document.getElementById('createFileBtn');
            const cancelBtn = document.getElementById('cancelFileBtn');

            // Set default value
            input.value = 'untitled.js';

            // Show modal
            modal.style.display = 'flex';

            // Focus input
            setTimeout(() => input.focus(), 100);

            // Handle create button
            const handleCreate = () => {
                const fileName = input.value.trim();
                console.log('User entered filename:', fileName);

                if (!fileName) {
                    alert('Please enter a file name');
                    return;
                }

                // Check if file exists
                if (files[fileName]) {
                    alert(`File "${fileName}" already exists and will be overwritten.`);
                }

                // Save current file content before creating new one
                saveCurrentFile();

                // Create new file
                files[fileName] = {
                    content: getDefaultContent(fileName),
                    lastModified: Date.now()
                };

                currentFileName = fileName;
                editor.value = files[fileName].content;
                updateLineNumbers();
                updateFileTabs();
                updateStatusBar();
                saveFilesToStorage();

                showAchievement(`File "${fileName}" Created 📄`);

                // Hide modal
                modal.style.display = 'none';

                // Clean up event listeners
                createBtn.removeEventListener('click', handleCreate);
                cancelBtn.removeEventListener('click', handleCancel);
                input.removeEventListener('keydown', handleKeydown);
            };

            // Handle cancel button
            const handleCancel = () => {
                modal.style.display = 'none';
                createBtn.removeEventListener('click', handleCreate);
                cancelBtn.removeEventListener('click', handleCancel);
                input.removeEventListener('keydown', handleKeydown);
            };

            // Handle Enter key
            const handleKeydown = (e) => {
                if (e.key === 'Enter') {
                    handleCreate();
                } else if (e.key === 'Escape') {
                    handleCancel();
                }
            };

            // Attach event listeners
            createBtn.addEventListener('click', handleCreate);
            cancelBtn.addEventListener('click', handleCancel);
            input.addEventListener('keydown', handleKeydown);
        }

        function getDefaultContent(fileName) {
            const extension = fileName.split('.').pop().toLowerCase();

            const defaults = {
                'js': '// JavaScript file\n\nfunction example() {\n    console.log("Hello, World!");\n}\n\nexample();',
                'jsx': 'import React from \'react\';\n\nconst Component = () => {\n    return (\n        <div>\n            <h1>Hello, World!</h1>\n        </div>\n    );\n};\n\nexport default Component;',
                'html': '<!DOCTYPE html>\n<html lang="en">\n<head>\n    <meta charset="UTF-8">\n    <meta name="viewport" content="width=device-width, initial-scale=1.0">\n    <title>Document</title>\n</head>\n<body>\n    <h1>Hello, World!</h1>\n    <p>This is a new HTML file.</p>\n</body>\n</html>',
                'css': '/* CSS Styles */\n\nbody {\n    font-family: Arial, sans-serif;\n    margin: 0;\n    padding: 20px;\n    background-color: #f5f5f5;\n}\n\n.container {\n    max-width: 1200px;\n    margin: 0 auto;\n}',
                'json': '{\n    "name": "project",\n    "version": "1.0.0",\n    "description": "Project description",\n    "main": "index.js",\n    "scripts": {\n        "start": "node index.js",\n        "test": "jest"\n    }\n}',
                'md': '# Project Title\n\n## Description\n\nA brief description of the project.\n\n## Features\n\n- Feature 1\n- Feature 2\n- Feature 3\n\n## Installation\n\n```bash\nnpm install\n```\n\n## Usage\n\n```javascript\nconst project = require(\'project\');\n```\n',
                'py': '# Python file\n\ndef hello_world():\n    print("Hello, World!")\n\nif __name__ == "__main__":\n    hello_world()',
                'txt': 'This is a text file.\n\nYou can write anything here.',
                'sql': '-- SQL file\n\nCREATE TABLE users (\n    id INTEGER PRIMARY KEY,\n    name TEXT NOT NULL,\n    email TEXT UNIQUE\n);\n\nINSERT INTO users (name, email) VALUES (\'John Doe\', \'john@example.com\');'
            };

            return defaults[extension] || '// New file\n\n// Start coding here...';
        }

        function saveCurrentFile() {
            if (currentFileName && files[currentFileName]) {
                files[currentFileName].content = editor.value;
                files[currentFileName].lastModified = Date.now();
                saveFilesToStorage();
            }
        }

        function switchToFile(fileName) {
            if (!files[fileName]) return;

            // Save current file
            saveCurrentFile();

            // Switch to new file
            currentFileName = fileName;
            editor.value = files[fileName].content;
            updateLineNumbers();
            updateFileTabs();
            updateStatusBar();

            showAchievement(`Switched to "${fileName}" 🔄`);
        }

        function updateStatusBar() {
            const currentFileElement = document.getElementById('currentFile');
            if (currentFileElement) {
                currentFileElement.textContent = currentFileName;
            }

            // Also update the file type
            updateFileType(currentFileName);
        }

        function deleteFile(fileName) {
            if (!files[fileName]) return;

            if (!confirm(`Delete "${fileName}"? This action cannot be undone.`)) {
                return;
            }

            delete files[fileName];
            saveFilesToStorage();

            // If we deleted the current file, switch to another one or create a new one
            if (fileName === currentFileName) {
                const remainingFiles = Object.keys(files);
                if (remainingFiles.length > 0) {
                    switchToFile(remainingFiles[0]);
                } else {
                    createNewFile();
                }
            }

            updateFileTabs();
            showAchievement(`File "${fileName}" Deleted 🗑️`);
        }

        function renameFile(oldName) {
            if (!files[oldName]) return;

            const newName = prompt('Enter new file name:', oldName);
            if (!newName || newName === oldName) return;

            if (files[newName]) {
                alert('A file with that name already exists.');
                return;
            }

            files[newName] = files[oldName];
            delete files[oldName];

            if (currentFileName === oldName) {
                currentFileName = newName;
            }

            saveFilesToStorage();
            updateFileTabs();
            showAchievement(`File renamed to "${newName}" 📝`);
        }

        function updateFileTabs() {
            // This will update the file tabs in the UI
            // For now, we'll update the sidebar to show user files
            updateSidebarFiles();
        }

        function updateSidebarFiles() {
            const userFilesList = document.getElementById('user-files-list');

            if (!userFilesList) return;

            // Clear existing user files
            userFilesList.innerHTML = '';

            const fileCount = Object.keys(files).length;

            if (fileCount === 0) {
                // Show "no files" message
                const noFilesItem = document.createElement('li');
                noFilesItem.className = 'no-files';
                noFilesItem.style.cssText = 'padding: 8px; color: #666; font-style: italic;';
                noFilesItem.textContent = 'No files yet. Click "New" to create one!';
                userFilesList.appendChild(noFilesItem);
                return;
            }

            // Add user-created files
            Object.keys(files).forEach(fileName => {
                const fileItem = document.createElement('li');
                fileItem.className = `file-item user-file ${fileName === currentFileName ? 'active' : ''}`;

                // Create file content
                fileItem.innerHTML = `
                    <span>${getFileIcon(fileName)} ${fileName}</span>
                    <div class="file-actions" style="margin-left: auto; display: none;">
                        <button onclick="renameFile('${fileName.replace(/'/g, "\\'")}')" style="background: none; border: none; color: #ccc; font-size: 11px; cursor: pointer;">✏️</button>
                        <button onclick="deleteFile('${fileName.replace(/'/g, "\\'")}')" style="background: none; border: none; color: #f44336; font-size: 11px; cursor: pointer;">🗑️</button>
                    </div>
                `;

                // Add click handler
                fileItem.addEventListener('click', (e) => {
                    if (!e.target.closest('.file-actions')) {
                        switchToFile(fileName);
                    }
                });

                // Show/hide actions on hover
                fileItem.addEventListener('mouseenter', () => {
                    const actions = fileItem.querySelector('.file-actions');
                    if (actions) actions.style.display = 'flex';
                });

                fileItem.addEventListener('mouseleave', () => {
                    const actions = fileItem.querySelector('.file-actions');
                    if (actions) actions.style.display = 'none';
                });

                userFilesList.appendChild(fileItem);
            });
        }

        function getFileIcon(fileName) {
            const extension = fileName.split('.').pop().toLowerCase();

            const icons = {
                'js': '📜',
                'jsx': '⚛️',
                'html': '🌐',
                'css': '🎨',
                'json': '📦',
                'md': '📝',
                'py': '🐍',
                'txt': '📄',
                'sql': '🗃️',
                'dockerfile': '🐳'
            };

            return icons[extension] || '📄';
        }

        // Click outside to close autocomplete
        document.addEventListener('click', (e) => {
            if (!autocomplete.contains(e.target) && e.target !== editor) {
                autocomplete.style.display = 'none';
            }
        });

        // Make functions globally available for HTML onclick handlers
        // Make all functions globally available for HTML onclick handlers
        window.createNewFile = createNewFile;
        window.openFile = openFile;
        window.saveCurrentFile = saveCurrentFile;
        window.undo = undo;
        window.redo = redo;
        window.find = find;
        window.runCode = runCode;
        window.toggleBrainrot = toggleBrainrot;
        window.formatCode = formatCode;
        window.toggleFloatingSpotify = toggleFloatingSpotify;
        window.toggleAIAgents = toggleAIAgents;
        window.clearConsole = clearConsole;
        window.closeBrainrot = closeBrainrot;
        window.closeFloatingSpotify = closeFloatingSpotify;
        window.embedFloatingSpotify = embedFloatingSpotify;
        window.loadLofiBeats = loadLofiBeats;
        window.loadCodingPlaylist = loadCodingPlaylist;
        window.runAIAgent = runAIAgent;
        window.insertResponseToEditor = insertResponseToEditor;
        window.clearAgentResponse = clearAgentResponse;
        window.quickCodeGen = quickCodeGen;
        window.quickDebug = quickDebug;
        window.quickOptimize = quickOptimize;
        window.quickExplain = quickExplain;
        window.quickTest = quickTest;
        window.switchPlatform = switchPlatform;
        window.embedShorts = embedShorts;
        window.loadRandomShort = loadRandomShort;
        window.closeEmbed = closeEmbed;
        window.embedReels = embedReels;
        window.startGifScroll = startGifScroll;
        window.stopGifScroll = stopGifScroll;
        window.embedReddit = embedReddit;
        window.loadSubreddit = loadSubreddit;
        window.embedTwitch = embedTwitch;
        window.loadTwitchChannel = loadTwitchChannel;
        window.switchFile = switchFile;
        window.renameFile = renameFile;
        window.deleteFile = deleteFile;

        // Add event listeners for buttons that need direct access
        function setupButtonListeners() {
            console.log('Setting up event listeners...');
            const newFileBtn = document.getElementById('newFileBtn');
            console.log('newFileBtn found:', newFileBtn);
            if (newFileBtn) {
                newFileBtn.addEventListener('click', () => {
                    console.log('New file button clicked!');
                    createNewFile();
                });
                console.log('Event listener attached to newFileBtn');
            } else {
                console.error('newFileBtn not found!');
            }

            const openFileBtn = document.getElementById('openFileBtn');
            if (openFileBtn) {
                openFileBtn.addEventListener('click', openFile);
            }

            const saveFileBtn = document.getElementById('saveFileBtn');
            if (saveFileBtn) {
                saveFileBtn.addEventListener('click', saveCurrentFile);
            }

            // Modal should be hidden by default (already set in HTML)
        }

        // Wait for DOM to be ready before attaching event listeners
        if (document.readyState === 'loading') {
            document.addEventListener('DOMContentLoaded', setupButtonListeners);
        } else {
            setupButtonListeners();
        }

        // Initialize file system
        loadFilesFromStorage();

        // Create a default file if no files exist
        if (Object.keys(files).length === 0) {
            files['welcome.js'] = {
                content: `// Welcome to Slopify
// This is your first file. Start coding!

console.log("Hello, World!");
console.log("We're so back fr fr 🚀");

// Try the AI assistant - click the 🤖 button!
// Or create a new file with the 📄 New button!

function testFunction() {
    return "hello";
}

console.log(testFunction());`,
                lastModified: Date.now()
            };
            currentFileName = 'welcome.js';
            saveFilesToStorage();
        } else {
            // Load the first available file
            const firstFile = Object.keys(files)[0];
            currentFileName = firstFile;
            editor.value = files[firstFile].content;
        }

        updateLineNumbers();
        updateStatusBar();
        updateSidebarFiles(); // Update sidebar with existing files

        // Terminal System
        let terminalHistory = [];
        let historyIndex = -1;
        let fileSystem = {
            '/': {
                'home': {
                    'user': {
                        'code.js': editor.value
                    }
                },
                'README.txt': 'Welcome to Slopify Terminal fr fr 💀'
            }
        };
        let currentPath = '/home/user';

        function executeCommand() {
            const input = document.getElementById('terminalInput');
            const command = input.value.trim();

            if (!command) return;

            const output = document.getElementById('terminalOutput');

            // Add command to output
            const commandLine = document.createElement('div');
            commandLine.style.color = '#4caf50';
            commandLine.textContent = '$ ' + command;
            output.appendChild(commandLine);

            // Add to history
            terminalHistory.push(command);
            historyIndex = terminalHistory.length;

            // Execute command
            const result = processCommand(command);

            // Add result to output
            const resultLine = document.createElement('div');
            resultLine.style.color = result.error ? '#f44336' : '#d4d4d4';
            resultLine.innerHTML = result.output;
            output.appendChild(resultLine);

            // Scroll to bottom
            output.scrollTop = output.scrollHeight;

            // Clear input
            input.value = '';
        }

        function processCommand(cmd) {
            const parts = cmd.trim().split(' ');
            const command = parts[0].toLowerCase();
            const args = parts.slice(1);

            switch(command) {
                case 'help':
                    return {
                        output: `Available commands:
<span style="color: #4caf50;">help</span> - Show this help message
<span style="color: #4caf50;">clear</span> - Clear terminal
<span style="color: #4caf50;">echo</span> [text] - Print text
<span style="color: #4caf50;">date</span> - Show current date/time
<span style="color: #4caf50;">whoami</span> - Show current user
<span style="color: #4caf50;">pwd</span> - Print working directory
<span style="color: #4caf50;">ls</span> - List files
<span style="color: #4caf50;">cat</span> [file] - Show file content
<span style="color: #4caf50;">code</span> - Show current editor code
<span style="color: #4caf50;">run</span> - Execute editor code
<span style="color: #4caf50;">cowsay</span> [text] - Cow says something
<span style="color: #4caf50;">fortune</span> - Random quote
<span style="color: #4caf50;">calc</span> [expression] - Calculator`,
                        error: false
                    };

                case 'clear':
                    clearTerminal();
                    return { output: '', error: false };

                case 'echo':
                    return { output: args.join(' '), error: false };

                case 'date':
                    return { output: new Date().toString(), error: false };

                case 'whoami':
                    return { output: 'sigma-coder 💀', error: false };

                case 'pwd':
                    return { output: currentPath, error: false };

                case 'ls':
                    return { output: 'code.js  README.txt  docs/  src/', error: false };

                case 'cat':
                    if (!args[0]) {
                        return { output: 'cat: missing file operand', error: true };
                    }
                    if (args[0] === 'code.js') {
                        return { output: editor.value || '// Empty file', error: false };
                    }
                    return { output: `cat: ${args[0]}: No such file or directory`, error: true };

                case 'code':
                    return { output: editor.value || '// No code in editor', error: false };

                case 'run':
                    try {
                        runCode();
                        return { output: 'Code executed! Check console output below editor.', error: false };
                    } catch (e) {
                        return { output: 'Error: ' + e.message, error: true };
                    }

                case 'cowsay':
                    const message = args.join(' ') || 'moo fr fr';
                    return {
                        output: `
 ${'_'.repeat(message.length + 2)}
< ${message} >
 ${'-'.repeat(message.length + 2)}
        \\   ^__^
         \\  (oo)\\_______
            (__)\\       )\\/\\
                ||----w |
                ||     ||`,
                        error: false
                    };

                case 'fortune':
                    const fortunes = [
                        'Your code will compile on the first try (cap) 💀',
                        'A bug-free day awaits you... jk fr fr',
                        'Stack Overflow has the answer you seek 📚',
                        'Today is a good day to refactor 🔧',
                        'Your pull request will be approved (trust) ✅',
                        'The sigma grindset leads to better code 👑',
                        'Console.log is your best friend no cap 🤝',
                        'Rubber duck debugging > AI fr fr 🦆'
                    ];
                    return { output: fortunes[Math.floor(Math.random() * fortunes.length)], error: false };

                case 'calc':
                    if (!args[0]) {
                        return { output: 'Usage: calc [expression]', error: true };
                    }
                    try {
                        const result = eval(args.join(' '));
                        return { output: `= ${result}`, error: false };
                    } catch (e) {
                        return { output: 'Invalid expression', error: true };
                    }

                case '':
                    return { output: '', error: false };

                default:
                    return { output: `Command not found: ${command}. Type 'help' for available commands.`, error: true };
            }
        }

        function clearTerminal() {
            const output = document.getElementById('terminalOutput');
            output.innerHTML = `
                <div style="color: #858585;">Slopify Terminal v1.0.0</div>
                <div style="color: #858585;">Type 'help' for available commands fr fr 💀</div>
                <div style="color: #858585;">---</div>
            `;
        }

        // Terminal keyboard shortcuts
        document.getElementById('terminalInput').addEventListener('keydown', (e) => {
            if (e.key === 'ArrowUp') {
                e.preventDefault();
                if (historyIndex > 0) {
                    historyIndex--;
                    document.getElementById('terminalInput').value = terminalHistory[historyIndex];
                }
            } else if (e.key === 'ArrowDown') {
                e.preventDefault();
                if (historyIndex < terminalHistory.length - 1) {
                    historyIndex++;
                    document.getElementById('terminalInput').value = terminalHistory[historyIndex];
                } else {
                    historyIndex = terminalHistory.length;
                    document.getElementById('terminalInput').value = '';
                }
            }
        });

        // Snake Game State
        let snakeGame = {
            canvas: null,
            ctx: null,
            snake: [],
            food: {},
            direction: 'right',
            nextDirection: 'right',
            score: 0,
            highScore: 0,
            gameLoop: null,
            gridSize: 10,
            tileCount: 20,
            speed: 100,
            running: false
        };

        // Initialize Snake Game
        window.initSnake = function() {
            snakeGame.canvas = document.getElementById('snakeCanvas');
            if (!snakeGame.canvas) return;
            snakeGame.ctx = snakeGame.canvas.getContext('2d');
            snakeGame.highScore = parseInt(localStorage.getItem('snakeHighScore') || '0');
            document.getElementById('snakeHigh').textContent = snakeGame.highScore;
        };

        // Start Game
        window.startSnake = function() {
            if (snakeGame.running) return;
            // Initialize game state
            snakeGame.snake = [
                {x: 10, y: 10},
                {x: 9, y: 10},
                {x: 8, y: 10}
            ];
            snakeGame.direction = 'right';
            snakeGame.nextDirection = 'right';
            snakeGame.score = 0;
            snakeGame.running = true;
            document.getElementById('snakeScore').textContent = '0';
            document.getElementById('snakeStartBtn').style.display = 'none';
            document.getElementById('snakePauseBtn').style.display = 'block';
            spawnFood();
            snakeGame.gameLoop = setInterval(updateSnake, snakeGame.speed);
        };

        // Pause/Resume Game
        window.pauseSnake = function() {
            if (snakeGame.gameLoop) {
                clearInterval(snakeGame.gameLoop);
                snakeGame.gameLoop = null;
                snakeGame.running = false;
                document.getElementById('snakePauseBtn').textContent = '▶️ Resume';
            } else {
                snakeGame.gameLoop = setInterval(updateSnake, snakeGame.speed);
                snakeGame.running = true;
                document.getElementById('snakePauseBtn').textContent = '⏸️ Pause';
            }
        };

        // Update Game State
        function updateSnake() {
            // Update direction
            snakeGame.direction = snakeGame.nextDirection;

            // Move snake
            const head = {...snakeGame.snake[0]};
            switch(snakeGame.direction) {
                case 'up': head.y--; break;
                case 'down': head.y++; break;
                case 'left': head.x--; break;
                case 'right': head.x++; break;
            }

            // Check wall collision
            if (head.x < 0 || head.x >= snakeGame.tileCount || head.y < 0 || head.y >= snakeGame.tileCount) {
                gameOver();
                return;
            }

            // Check self collision
            for (let segment of snakeGame.snake) {
                if (head.x === segment.x && head.y === segment.y) {
                    gameOver();
                    return;
                }
            }

            // Add new head
            snakeGame.snake.unshift(head);

            // Check food collision
            if (head.x === snakeGame.food.x && head.y === snakeGame.food.y) {
                snakeGame.score++;
                document.getElementById('snakeScore').textContent = snakeGame.score;
                spawnFood();
                if (snakeGame.score > snakeGame.highScore) {
                    snakeGame.highScore = snakeGame.score;
                    document.getElementById('snakeHigh').textContent = snakeGame.highScore;
                    localStorage.setItem('snakeHighScore', snakeGame.highScore);
                }
            } else {
                snakeGame.snake.pop();
            }

            drawSnake();
        }

        // Spawn Food
        function spawnFood() {
            snakeGame.food = {
                x: Math.floor(Math.random() * snakeGame.tileCount),
                y: Math.floor(Math.random() * snakeGame.tileCount)
            };
        }

        // Draw Game
        function drawSnake() {
            const ctx = snakeGame.ctx;
            const size = snakeGame.gridSize;

            // Clear canvas
            ctx.fillStyle = '#000';
            ctx.fillRect(0, 0, snakeGame.canvas.width, snakeGame.canvas.height);

            // Draw snake
            snakeGame.snake.forEach((segment, index) => {
                ctx.fillStyle = index === 0 ? '#4caf50' : '#8bc34a';
                ctx.fillRect(segment.x * size, segment.y * size, size - 1, size - 1);
            });

            // Draw food
            ctx.fillStyle = '#f44336';
            ctx.fillRect(snakeGame.food.x * size, snakeGame.food.y * size, size - 1, size - 1);
        }

        // Game Over
        function gameOver() {
            clearInterval(snakeGame.gameLoop);
            snakeGame.gameLoop = null;
            snakeGame.running = false;
            document.getElementById('snakeStartBtn').style.display = 'block';
            document.getElementById('snakePauseBtn').style.display = 'none';
        }

        // Keyboard Controls
        document.addEventListener('keydown', (e) => {
            if (!snakeGame.running) return;
            switch(e.key) {
                case 'ArrowUp':
                    if (snakeGame.direction !== 'down') snakeGame.nextDirection = 'up';
                    e.preventDefault();
                    break;
                case 'ArrowDown':
                    if (snakeGame.direction !== 'up') snakeGame.nextDirection = 'down';
                    e.preventDefault();
                    break;
                case 'ArrowLeft':
                    if (snakeGame.direction !== 'right') snakeGame.nextDirection = 'left';
                    e.preventDefault();
                    break;
                case 'ArrowRight':
                    if (snakeGame.direction !== 'left') snakeGame.nextDirection = 'right';
                    e.preventDefault();
                    break;
            }
        });

        // Initialize snake when page loads
        setTimeout(initSnake, 100);

        // Auto-save every 5 seconds
        setInterval(saveCurrentFile, 5000);