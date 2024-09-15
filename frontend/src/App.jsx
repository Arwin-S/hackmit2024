import React, { useEffect, useRef, useState } from 'react';
import GazeTracker from './GazeTracker';
import './App.css';

function App() {
  const [selectedFairyTale, setSelectedFairyTale] = useState({
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis labore eius recusandae deleniti sed incidunt quam, iste deserunt qui animi maiores quasi quod voluptatum unde ducimus quas. Vero totam neque dolores, quia minus voluptate vel, molestiae doloremque mollitia ducimus fuga culpa nisi ea harum tempora eaque placeat facere quidem asperiores quisquam iusto? Explicabo expedita atque, cumque iusto delectus earum reiciendis optio nesciunt quam voluptate ab, molestiae magni dicta. Praesentium deserunt porro eveniet eius, iusto nihil libero asperiores nam itaque?'
  });

  const [isReading, setIsReading] = useState(true);
  const [linesHidden, setLinesHidden] = useState(0); // State to keep track of hidden lines
  const textBoxRef = useRef(null); // Reference for scrolling
  const mainContentRef = useRef(null);
  const fontSize = 16; // Constant font size
  const lineHeight = fontSize * 1.5; // Estimate line height as 1.5x font size for better readability
  const charsPerLine = 120; // Define how many characters should be in each line

  // Helper function to split text into chunks of fixed character length
  const splitTextIntoChunks = (text, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
  };

  // Split the text into chunks (lines) based on character count
  const textLines = splitTextIntoChunks(selectedFairyTale.text, charsPerLine);


  // hide one line at a time (moves line up)
  const hideOneLine = () => {
    if (linesHidden < textLines.length) {
      setLinesHidden((prev) => prev + 1);
    }
  };

  // show one line at a time (moves line down)
  const showOneLine = () => {
    if (linesHidden > 0) {
      setLinesHidden((prev) => prev - 1);
    }
  };

  // Callback function that will be triggered when 'lines_read' is received
  const onLinesRead = (linesRead) => {
    hideOneLine();
  };

  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>
      <GazeTracker onLinesRead={onLinesRead} /> {/* Pass the callback here */}
      {/* Left Sidebar */}
      <div style={{ width: '10%', backgroundColor: '#f5f5f5', padding: '10px', boxSizing: 'border-box' }}>
        {/* Add your sidebar content here */}
      </div>

      {/* Main Content Area */}
      <div
        ref={mainContentRef}
        style={{
          width: '100vw',
          height: '100vh',
          padding: '0px',
          boxSizing: 'border-box',
          display: 'flex',
          // flexDirection: 'column',
          alignItems: 'center',
          justifyContent: 'center', // Center vertically
          backgroundColor: '#333', // Dark background color
          overflow: 'hidden',
          color: '#fff',
        }}
      >
        {/* Top Control Bar */}
        <div style={{
          width: '100%',
          display: 'flex',
          justifyContent: 'space-between',
          alignItems: 'center',
          backgroundColor: '#333',
          color: '#fff',
          padding: '10px',
          position: 'absolute',
          top: 0
        }}>
          <div>Section 1</div>
          <div>
            <span>$21.00</span>
          </div>
          <div>
            1/10
          </div>
        </div>

        {/* Yellow line to indicate the current line */}
        <div style={{
          width: '80%',
          borderBottom: '3px solid yellow',
          position: 'absolute',
          top: '50%',
          transform: 'translateY(-50%)', // Place line in the middle of the container,
          zIndex:1
        }}></div>

        {/* Content Box */}
        <div
          ref={textBoxRef}
          style={{
            fontSize: `${fontSize}px`,
            lineHeight: `${lineHeight}px`,
            textAlign: 'justify',
            width: '100%',
            backgroundColor: '#333',
            position: 'relative',
            color: '#fff',
            overflow: 'hidden',
            height: '80%', // Limit height of the text area
            paddingTop: `${50 - linesHidden * (lineHeight / 6.5)}%`, // Dynamic padding to start text in the middle and move it up
            transition: 'padding 0.5s', // Smooth transition of lines moving up
          }}
        >
          {/* Loop through each line and apply style based on visibility */}
          {textLines.map((line, index) => (
            <div
              key={index}
              style={{
                color: index < linesHidden ? 'grey' : 'white', // Grey out the "read" lines
                opacity: index === linesHidden ? 1 : 0.7, // Make the read lines slightly transparent
                transition: 'color 0.3s, opacity 0.3s', // Smooth transition
              }}
            >
              {line}
            </div>
          ))}
        </div>

        {/* Hide/Show Line Buttons */}
        <div style={{ display: 'flex', gap: '10px', marginTop: '20px' }}>
          <button onClick={hideOneLine} disabled={linesHidden >= textLines.length}>
            Hide One Line
          </button>
          <button onClick={showOneLine} disabled={linesHidden === 0}>
            Show One Line
          </button>
        </div>
      </div>

      
    </div>
  );
}

export default App;
