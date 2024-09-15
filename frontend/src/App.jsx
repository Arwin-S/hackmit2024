import React, { useEffect, useRef, useState } from 'react';
import GazeTracker from './GazeTracker';
import './App.css';
import { Modal, Box, Typography, Button } from '@mui/material';
import demo_text from './assets/demo_text.json'
import coinIcon from './assets/coin.webp'; // Path to your coin icon


function App() {
  const [selectedFairyTale, setSelectedFairyTale] = useState({
    text: demo_text.text
  });

  const [isReading, setIsReading] = useState(true);
  const [linesHidden, setLinesHidden] = useState(0); // State to keep track of hidden lines
  let [open, setOpen] = useState(true); // Modal open state, defaults to true on page load
  const textBoxRef = useRef(null); // Reference for scrolling
  const mainContentRef = useRef(null);
  const fontSize = 20; // Constant font size
  const lineHeight = fontSize * 2.5; // Estimate line height as 1.5x font size for better readability
  const charsPerLine = 120; // Define how many characters should be in each line

  const [coins, setCoins] = useState(0); // Initialize coins with 0

  // Handle modal open/close
  const handleOpen = () => setOpen(true);
  const handleClose = (event, reason) => {
    if (reason === 'backdropClick') return; // Prevent closing on backdrop click
    setOpen(false);
    open = false;
  };

  // Helper function to split text into chunks of fixed character length
  const splitTextIntoChunks = (text, chunkSize) => {
    const chunks = [];
    for (let i = 0; i < text.length; i += chunkSize) {
      chunks.push(text.slice(i, i + chunkSize));
    }
    return chunks;
  };

  const read_text = demo_text.text.split('\n').map((line, index) => (
    <React.Fragment key={index}>
      {line}
      <br />
    </React.Fragment>
  ));
  // Split the text into chunks (lines) based on character count
  // const textLines = splitTextIntoChunks(selectedFairyTale.text, charsPerLine);

  // Hide one line at a time (moves line up)
  const hideOneLine = () => {
    if (textBoxRef.current) {
      const scrollAmount = lineHeight; // Scroll by the estimated line height
      textBoxRef.current.scrollBy({ top: scrollAmount, behavior: 'smooth' });
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
    if (open !== true) {
      setCoins((prevCoins) => prevCoins + 1); // Update the state
      hideOneLine();
      console.log(coins);
    }
  };
  
  return (
    <div style={{ display: 'flex', height: '100vh', overflow: 'hidden' }}>

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
            <div style={{zIndex:1, position: 'absolute', top: '50%', left: '2%', width: '20px', height: '20px', backgroundColor: 'red', borderRadius: '50%' }}></div>

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
            This app tracks your reading using eye movement. Please enable your camera, wait 5 seconds, then align your face with the box in the top left then click each <b>red dot</b> at least 3 times while looking at the cursor for better calibration.          </Typography>
          <Button onClick={handleClose} style={{ marginTop: '20px' }} variant="contained" color="primary">
            Got it!
          </Button>

        </Box>

      </Modal>

      <div className='row ps-5 pe-5 '>
        <div className='row  mb-5' > 
          <div className='col-3 pt-0' >      
            <GazeTracker onLinesRead={onLinesRead} /> {/* Pass the callback here */}        </div>
          <nav style={{ marginBottom: '60px' }}className="col-9 mt-5 navbar navbar-expand-lg bg-body-tertiary" data-bs-theme="dark">
            <div className="container-fluid">
              <img
                src={coinIcon}
                alt="Coin Icon"
                style={{ width: '20px', height: '20px', marginRight: '10px' }}
              />
              <a className="navbar-brand" href="#">ReadCoins Earned:</a>
              <div
                style={{color: 'white'}

                }>
                {coins}
              </div>
              <button
                className="navbar-toggler"
                type="button"
                data-bs-toggle="collapse"
                data-bs-target="#navbarSupportedContent"
                aria-controls="navbarSupportedContent"
                aria-expanded="false"
                aria-label="Toggle navigation"
              >
                <span className="navbar-toggler-icon"></span>
              </button>
              <div className="collapse navbar-collapse" id="navbarSupportedContent">
                <ul className="navbar-nav me-auto mb-2 mb-lg-0">
                  <li className="nav-item">
                    {/* <a className="nav-link active" aria-current="page" href="#">Home</a> */}
                  </li>
                  <li className="nav-item">
                    {/* <a className="nav-link" href="#">Link</a> */}
                  </li>
                  <li className="nav-item dropdown">
                    <a
                      className="nav-link dropdown-toggle"
                      href="#"
                      role="button"
                      data-bs-toggle="dropdown"
                      aria-expanded="false"
                    >
                      {/* Dropdown */}
                    </a>
                    {/* <ul className="dropdown-menu"> */}
                    {/* <li><a className="dropdown-item" href="#">Action</a></li> */}
                    {/* <li><a className="dropdown-item" href="#">Another action</a></li> */}
                    {/* <li><hr className="dropdown-divider" /></li> */}
                    {/* <li><a className="dropdown-item" href="#">Something else here</a></li> */}
                    {/* </ul> */}
                  </li>
                  <li className="nav-item">
                    {/* <a className="nav-link disabled" aria-disabled="true">Disabled</a> */}
                  </li>
                </ul>
                <form className="d-flex" role="search">
                  <input
                    className="form-control me-2"
                    type="search"
                    placeholder="Search (coming soon...)"
                    aria-label="Search"
                  />
                  {/* <button className="btn btn-outline-success" type="submit">Search</button> */}
                </form>
              </div>
            </div>
          </nav>
        </div>

        <div className='row pb-5'>
  
          <div className=' col-12'
            ref={mainContentRef}
            style={{
              width: '90vw',
              height: '100vh',
              boxSizing: 'border-box',
              display: 'flex',
              justifyContent: 'center', // Horizontally center
              alignItems: 'center', // Vertically center
              backgroundColor: '#333', // Dark background color
              overflow: 'hidden',
              color: '#fff',
              position: 'relative'
            }}
          >
            {/* Content Box */}
            <div
              ref={textBoxRef}
              style={{
                fontSize: `${fontSize}px`,
                lineHeight: `${lineHeight}px`,
                textAlign: 'justify',
                width: '100%',
                backgroundColor: '#333',
                color: '#fff',
                overflowY: 'scroll', // Add Y-axis scroll if needed
                maxHeight: '90%',  // Ensure the height does not overflow the parent
                padding: '20px', // Padding around the content                
                scrollbarWidth: 'none', // For Firefox
              }}
            >
              {read_text}
            </div>
          </div>

        </div>

      </div>
    </div>
  );
}

export default App;
