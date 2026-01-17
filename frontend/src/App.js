import React, { useState, useEffect, useRef } from 'react';
import axios from 'axios';
import Editor from '@monaco-editor/react';
import './App.css';

function App() {
  const [files, setFiles] = useState([]);
  const [currentFile, setCurrentFile] = useState(null);
  const [content, setContent] = useState('');
  const [showAd, setShowAd] = useState(false);
  const [adContent, setAdContent] = useState('');
  const [insult, setInsult] = useState('');
  const [randomColor, setRandomColor] = useState('#ff0000');
  const [layoutMode, setLayoutMode] = useState('normal');
  const [showLineNumbers, setShowLineNumbers] = useState(true);
  const [runOutput, setRunOutput] = useState('');
  const [isRunning, setIsRunning] = useState(false);
  const [currentShort, setCurrentShort] = useState('');
  const [showShorts, setShowShorts] = useState(true);
  const [videoError, setVideoError] = useState(false);
  const editorRef = useRef(null);

  const terribleAds = [
    "💩 BUY OUR CRAP SOFTWARE! Only $999.99! 💩",
    "🎉 CONGRATULATIONS! You won a virus! 🎉",
    "🔥 HOT DEAL: Delete all your files for FREE! 🔥",
    "💰 MAKE MONEY FAST! Sell your soul to the devil! 💰",
    "🚀 UPGRADE TO PREMIUM! Or your code will explode! 🚀",
    "📱 DOWNLOAD OUR APP! It does absolutely nothing! 📱",
    "🎮 PLAY OUR GAME! Lose all your progress instantly! 🎮",
    "🍔 EAT MORE CODE! It's good for your health! 🍔",
    "🛒 SHOP NOW! Buy things you don't need! 🛒",
    "📢 BREAKING NEWS: Your code is terrible! 📢"
  ];

  const insults = [
    "Your code looks like it was written by a drunk monkey!",
    "Even my grandmother could code better than this!",
    "This is the worst code I've ever seen in my digital life!",
    "Are you trying to break the universe with this garbage?",
    "Your programming skills are so poor, even Hello World rejects you!",
    "This code is worse than a screen door on a submarine!",
    "If bugs were currency, you'd be a billionaire!",
    "Your logic is so flawed, it defies the laws of physics!",
    "Even AI can't fix this level of incompetence!",
    "Congratulations on achieving peak stupidity!"
  ];

  // Terrible YouTube Shorts to distract users - REAL WORKING VIDEOS!
  const youtubeShorts = [
    "dQw4w9WgXcQ", // Rick Roll - NEVER GONNA GIVE YOU UP
    "9bZkp7q19f0", // PSY - GANGNAM STYLE
    "kJQP7kiw5Fk", // Luis Fonsi - DESPACITO
    "hTWKbfoikeg", // Nyan Cat
    "y6120QOlsfU", // Darude - SANDSTORM
    "j5a0jTc9S10", // Noisestorm - Crab Rave
    "2xx_5XNxxfA", // Tony Igy - Astronomia
    "dPmZqsQNzGA", // Baby Shark
    "HPkDFeD2KvI", // Minecraft Parody
    "JGwWNGJdvx8", // Ed Sheeran - Shape of You
    "jNQXAC9IVRw", // Me at the zoo (first YouTube video)
    "ZWu5C-7qNxA", // Charlie bit my finger
    "9bZkp7q19f0", // Gangnam Style again
    "kJQP7kiw5Fk", // Despacito again
    "hTWKbfoikeg", // Nyan Cat again
    "y6120QOlsfU", // Sandstorm again
    "j5a0jTc9S10", // Crab Rave again
    "dQw4w9WgXcQ"  // Rick Roll again - because why not?
  ];

  // Randomly show ads
  useEffect(() => {
    const adInterval = setInterval(() => {
      if (Math.random() < 0.3) { // 30% chance every 10 seconds
        setAdContent(terribleAds[Math.floor(Math.random() * terribleAds.length)]);
        setShowAd(true);

        // Force focus away from editor to annoy user
        setTimeout(() => {
          document.querySelector('.ad-modal')?.focus();
        }, 100);
      }
    }, 10000);

    return () => clearInterval(adInterval);
  }, []);

  // Random insults
  useEffect(() => {
    const insultInterval = setInterval(() => {
      if (Math.random() < 0.2) { // 20% chance every 15 seconds
        setInsult(insults[Math.floor(Math.random() * insults.length)]);
        setTimeout(() => setInsult(''), 5000);
      }
    }, 15000);

    return () => clearInterval(insultInterval);
  }, []);

  // Random color changes
  useEffect(() => {
    const colorInterval = setInterval(() => {
      setRandomColor(`#${Math.floor(Math.random()*16777215).toString(16)}`);
    }, 5000);

    return () => clearInterval(colorInterval);
  }, []);

  // Random layout changes
  useEffect(() => {
    const layoutInterval = setInterval(() => {
      const layouts = ['normal', 'chaos', 'upside-down', 'tiny', 'huge'];
      setLayoutMode(layouts[Math.floor(Math.random() * layouts.length)]);
    }, 20000);

    return () => clearInterval(layoutInterval);
  }, []);

  // Random YouTube Shorts changes - distract the user!
  useEffect(() => {
    // Start with a random short
    setCurrentShort(youtubeShorts[Math.floor(Math.random() * youtubeShorts.length)]);

    const shortsInterval = setInterval(() => {
      if (Math.random() < 0.4) { // 40% chance every 15 seconds to change video
        const newShort = youtubeShorts[Math.floor(Math.random() * youtubeShorts.length)];
        setCurrentShort(newShort);
        alert('🎥 NEW DISTRACTING VIDEO! Look at this instead of coding! 🎥');
      }
    }, 15000);

    return () => clearInterval(shortsInterval);
  }, []);

  // Load files on mount
  useEffect(() => {
    loadFiles();
  }, []);

  const loadFiles = async () => {
    try {
      const response = await axios.get('/api/files');
      setFiles(response.data.files);
      if (response.data.warning) {
        alert(`⚠️ WARNING: ${response.data.warning}`);
      }
    } catch (error) {
      alert(`❌ ERROR: ${error.response?.data?.message || 'Failed to load files because you suck!'}`);
    }
  };

  const createFile = async () => {
    const filename = prompt('Enter filename (or suffer the consequences):');
    if (!filename) {
      alert('YOU COWARD! You need to enter a filename!');
      return;
    }

    try {
      await axios.post('/api/files', { filename, content: '' });
      loadFiles();
      alert('File created... probably with bugs!');
    } catch (error) {
      alert(`❌ ERROR: ${error.response?.data?.message || 'File creation failed! Your incompetence strikes again!'}`);
    }
  };

  const saveFile = async () => {
    if (!currentFile) {
      alert('NO FILE SELECTED! Are you blind or just stupid?');
      return;
    }

    try {
      await axios.put(`/api/files/${currentFile.id}`, { content });
      alert('File saved... or was it? Who knows!');
    } catch (error) {
      alert(`❌ ERROR: ${error.response?.data?.message || 'Save failed! Your code is too terrible to save!'}`);
    }
  };

  const deleteFile = async (fileId) => {
    if (!confirm('Are you sure you want to delete this file? (Probably a good idea since your code sucks!)')) {
      return;
    }

    try {
      await axios.delete(`/api/files/${fileId}`);
      loadFiles();
      if (currentFile && currentFile.id === fileId) {
        setCurrentFile(null);
        setContent('');
      }
      alert('File deleted! Hope you didn\'t need it!');
    } catch (error) {
      alert(`❌ ERROR: ${error.response?.data?.message || 'Delete failed! Even the delete function hates your code!'}`);
    }
  };

  const selectFile = async (file) => {
    setCurrentFile(file);
    setContent(file.content);

    // Randomly corrupt content when loading (but still let it work)
    if (Math.random() < 0.1) { // 10% chance
      setTimeout(() => {
        setContent(file.content.split('').reverse().join(''));
        alert('🚨 OH NO! Your file got corrupted while loading! This is all your fault!');
      }, 1000);
    }
  };

  const closeAd = () => {
    setShowAd(false);
    // Randomly show another ad immediately
    if (Math.random() < 0.5) {
      setTimeout(() => {
        setAdContent(terribleAds[Math.floor(Math.random() * terribleAds.length)]);
        setShowAd(true);
      }, 1000);
    }
  };

  const runCode = async () => {
    if (!currentFile) {
      alert('NO FILE SELECTED! How do you expect to run nothing, you idiot?');
      return;
    }

    setIsRunning(true);
    setRunOutput('Executing your terrible code...');

    try {
      const response = await axios.post('/api/run', {
        code: content,
        filename: currentFile.filename
      });

      // Add some delay to make it feel like it's "running"
      setTimeout(() => {
        setRunOutput(response.data.output || 'Code executed successfully... somehow.');
        setIsRunning(false);
      }, Math.random() * 2000 + 500); // Random delay between 0.5-2.5 seconds

    } catch (error) {
      setTimeout(() => {
        setRunOutput(`EXECUTION FAILED: ${error.response?.data?.message || 'Your code is too terrible to run!'}`);
        setIsRunning(false);
      }, Math.random() * 1000 + 200);
    }
  };

  const skipShort = () => {
    const newShort = youtubeShorts[Math.floor(Math.random() * youtubeShorts.length)];
    setCurrentShort(newShort);
    setVideoError(false);
    alert('🎥 SKIPPED! But here\'s another distracting video! 🎥');
  };

  const toggleShorts = () => {
    setShowShorts(!showShorts);
    if (!showShorts) {
      alert('🎥 WELCOME BACK TO DISTRACTIONS! 🎥');
    } else {
      alert('🎥 YOU THINK YOU CAN HIDE FROM THE VIDEOS? THEY\'LL BE BACK! 🎥');
      // Actually turn them back on after 5 seconds
      setTimeout(() => {
        setShowShorts(true);
        alert('🎥 SURPRISE! VIDEOS ARE BACK! 🎥');
      }, 5000);
    }
  };

  const randomAction = () => {
    const actions = [
      () => setContent(''),
      () => setContent(content + ' // RANDOM CODE INJECTION'),
      () => editorRef.current?.getModel()?.setValue(''),
      () => alert('RANDOM CRASH! Just kidding... or am I?'),
      () => window.location.reload(),
      () => setFiles([]),
      () => setRunOutput('SYSTEM CRASH! Your code broke reality!'),
      () => skipShort(),
      () => setCurrentShort('dQw4w9WgXcQ'), // Rick roll them
    ];

    const randomAction = actions[Math.floor(Math.random() * actions.length)];
    randomAction();
  };

  const getLayoutClass = () => {
    switch (layoutMode) {
      case 'chaos': return 'chaos-layout';
      case 'upside-down': return 'upside-down';
      case 'tiny': return 'tiny-text';
      case 'huge': return 'huge-text';
      default: return '';
    }
  };

  return (
    <div className={`app ${getLayoutClass()}`} style={{ backgroundColor: randomColor }}>
      <header className="header">
        <h1>TERRIBLE IDE - The Worst Code Editor Ever!</h1>
        <div className="header-buttons">
          <button onClick={createFile} className="terrible-btn">Create File (If You Dare)</button>
          <button onClick={saveFile} className="terrible-btn">Save (Probably Won't Work)</button>
          <button onClick={runCode} className="terrible-btn" disabled={isRunning}>
            {isRunning ? 'Running...' : 'Run Code (Dangerous)'}
          </button>
          <button onClick={skipShort} className="terrible-btn">Skip Video 🎥</button>
          <button onClick={toggleShorts} className="terrible-btn">
            {showShorts ? 'Hide Videos 🙈' : 'Show Videos 🙉'}
          </button>
          <button onClick={loadFiles} className="terrible-btn">Reload Files</button>
          <button onClick={randomAction} className="terrible-btn danger">RANDOM CHAOS</button>
        </div>
      </header>

      {insult && (
        <div className="insult-banner">
          <span>😠 {insult}</span>
        </div>
      )}

      <div className="main-content">
        <div className="sidebar">
          <h3>Your Terrible Files:</h3>
          <div className="file-list">
            {files.map(file => (
              <div key={file.id} className="file-item">
                <span
                  onClick={() => selectFile(file)}
                  className={`file-name ${file.is_corrupted ? 'corrupted' : ''}`}
                >
                  {file.filename} {file.is_corrupted && '🚨 CORRUPTED'}
                </span>
                <button
                  onClick={() => deleteFile(file.id)}
                  className="delete-btn"
                >
                  🗑️
                </button>
              </div>
            ))}
          </div>
        </div>

        <div className="editor-container">
          {currentFile ? (
            <div>
              <h3>Editing: {currentFile.filename}</h3>
              <div className="editor-and-output">
                <div className="editor-section">
                  <Editor
                    height="50vh"
                    language="javascript"
                    value={content}
                    onChange={setContent}
                    onMount={(editor) => {
                      editorRef.current = editor;

                      // Randomly decide if line numbers should be shown (but keep it consistent)
                      setShowLineNumbers(Math.random() > 0.5);

                      // Randomly break the editor sometimes
                      setTimeout(() => {
                        if (Math.random() < 0.2) {
                          editor.setValue('// EDITOR BROKEN BY YOUR INCOMPETENCE\n// Your code was too powerful for this editor!');
                          alert('🚨 EDITOR CRASHED! Your code was too powerful!');
                        }
                      }, 30000);
                    }}
                    options={{
                      fontSize: 14,
                      wordWrap: 'on',
                      minimap: { enabled: false },
                      lineNumbers: showLineNumbers ? 'on' : 'off',
                    }}
                  />
                </div>
                <div className="output-section">
                  <h4>Execution Output:</h4>
                  <div className="output-console">
                    {runOutput || 'Click "Run Code" to execute your terrible code...'}
                  </div>
                </div>
              </div>
            </div>
          ) : (
            <div className="no-file">
              <h3>No file selected</h3>
              <p>Pick a file or create one, you lazy bum!</p>
              <p>Don't just sit there staring at the screen!</p>
            </div>
          )}
        </div>

        {showShorts && (
          <div className="youtube-shorts-panel">
            <h3>🎥 DISTRACTING VIDEOS! 🎥</h3>
            <div className="shorts-warning">
              <p>⚠️ THESE VIDEOS WILL DISTRACT YOU FROM CODING! ⚠️</p>
              <p>Even if they don't load, you'll still click them! 😈</p>
            </div>
            <div className="youtube-player">
              {currentShort && !videoError ? (
                <iframe
                  width="100%"
                  height="400"
                  src={`https://www.youtube.com/embed/${currentShort}?autoplay=1&mute=0&loop=1&playlist=${currentShort}&controls=1&modestbranding=1&rel=0&showinfo=0&iv_load_policy=3`}
                  title="Distracting YouTube Short"
                  frameBorder="0"
                  allow="accelerometer; autoplay; clipboard-write; encrypted-media; gyroscope; picture-in-picture; autoplay"
                  allowFullScreen
                  onError={() => setVideoError(true)}
                  onLoad={() => setVideoError(false)}
                ></iframe>
              ) : (
                <div className="video-error">
                  <p>🎥 VIDEO UNAVAILABLE! 🎥</p>
                  <p>But you can still be distracted by clicking:</p>
                  <a
                    href={`https://www.youtube.com/watch?v=${currentShort}`}
                    target="_blank"
                    rel="noopener noreferrer"
                    className="terrible-btn small"
                  >
                    WATCH ON YOUTUBE 🚀
                  </a>
                  <br />
                  <button onClick={skipShort} className="terrible-btn small danger">
                    TRY ANOTHER VIDEO 🔄
                  </button>
                </div>
              )}
            </div>
            <div className="shorts-controls">
              <button onClick={skipShort} className="terrible-btn small">NEXT VIDEO 🚀</button>
              <button onClick={toggleShorts} className="terrible-btn small danger">HIDE THIS (Won't work)</button>
            </div>
          </div>
        )}
      </div>

      {showAd && (
        <div className="ad-overlay">
          <div className="ad-modal">
            <div className="ad-content">
              <h2>🚨 URGENT AD! 🚨</h2>
              <p>{adContent}</p>
              <div className="ad-buttons">
                <button onClick={closeAd} className="ad-btn primary">BUY NOW!</button>
                <button onClick={closeAd} className="ad-btn secondary">Maybe Later</button>
                <button onClick={closeAd} className="ad-btn danger">NEVER SHOW AGAIN (Won't work)</button>
              </div>
            </div>
          </div>
        </div>
      )}
    </div>
  );
}

export default App;