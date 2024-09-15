import React, { useEffect, useRef, useState } from 'react';
import GazeTracker from './GazeTracker';
import './App.css';
import { Modal, Box, Typography, Button } from '@mui/material';

function App() {
  const [selectedFairyTale, setSelectedFairyTale] = useState({
    text: 'Lorem ipsum dolor sit amet consectetur adipisicing elit. Perspiciatis labore eius recusandae deleniti sed incidunt quam, iste deserunt qui animi maiores quasi quod voluptatum unde ducimus quas. Vero totam neque dolores, quia minus voluptate vel, molestiae doloremque mollitia ducimus fuga culpa nisi ea harum tempora eaque placeat facere quidem asperiores quisquam iusto? Explicabo expedita atque, cumque iusto delectus earum reiciendis optio nesciunt quam voluptate ab, molestiae magni dicta. Praesentium deserunt porro eveniet eius, iusto nihil libero asperiores nam itaque?'
  });

  const [isReading, setIsReading] = useState(true);
  const [linesHidden, setLinesHidden] = useState(0); // State to keep track of hidden lines
  const [open, setOpen] = useState(true); // Modal open state, defaults to true on page load
  const textBoxRef = useRef(null); // Reference for scrolling
  const mainContentRef = useRef(null);
  const fontSize = 16; // Constant font size
  const lineHeight = fontSize * 1.5; // Estimate line height as 1.5x font size for better readability
  const charsPerLine = 120; // Define how many characters should be in each line

  // Handle modal open/close
  const handleOpen = () => setOpen(true);
  const handleClose = (event, reason) => {
    if (reason === 'backdropClick') return; // Prevent closing on backdrop click
    setOpen(false);
  };

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

  // Hide one line at a time (moves line up)
  const hideOneLine = () => {
    if (linesHidden < textLines.length) {
      setLinesHidden((prev) => prev + 1);
    }
  };

  // Show one line at a time (moves line down)
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
      {/* Add the four dots for calibration */
      open && (<> 
  <div
    style={{
      position: 'absolute',
      width: '100%',
      height: '100%',
      top: 0,
      left: 0,
      pointerEvents: 'none',
    }}
  >
    {/* Top-left corner */}
    <div style={{ position: 'absolute', top: '50%', left: '2%', width: '20px', height: '20px', backgroundColor: 'red', borderRadius: '50%' }}></div>
    
    {/* Top-right corner */}
    <div >

    <div style={{ position: 'absolute', top: '50%', right: '2%', width: '20px', height: '20px', backgroundColor: 'red', borderRadius: '50%' }}></div>
    </div>
  </div>
</>)}
      {/* Modal to display instructions */}
      <Modal
        open={open}
        onClose={handleClose}
        aria-labelledby="modal-modal-title"
        aria-describedby="modal-modal-description"
      >
        
        <Box
          sx={{
            position: 'absolute',
            top: '50%',
            left: '50%',
            transform: 'translate(-50%, -50%)',
            width: 400,
            bgcolor: 'background.paper',
            border: '2px solid #000',
            boxShadow: 24,
            p: 4,
            color: 'text.primary',
          }}
        >
          
          <Typography id="modal-modal-title" variant="h6" component="h2">
            Welcome to the Reading App!
          </Typography>
          <Typography id="modal-modal-description" sx={{ mt: 2 }}>
            This app tracks your reading progress using eye movement. Please ensure your camera is enabled and click on the <b>two red dots</b> while looking at the cursor to calibrate.
          </Typography>
          <Button onClick={handleClose} style={{ marginTop: '20px' }} variant="contained" color="primary">
            Got it!
          </Button>
          
        </Box>
        
          
      </Modal>

      {/* Main Content Area */}
      <div
        ref={mainContentRef}
        style={{
          width: '100vw',
          height: '100vh',
          padding: '0px',
          boxSizing: 'border-box',
          display: 'flex',
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
          zIndex: 1
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
