import React, { useState, useEffect } from 'react';
import reactLogo from './assets/react.svg'
import viteLogo from '/vite.svg'
import './App.css';

function App() {
  const [fontSize, setFontSize] = useState(16); // Default font size
  const [selectedFairyTale, setSelectedFairyTale] = useState(null); // To hold the selected fairy tale
  const [fairyTales, setFairyTales] = useState([]); // To hold list of fairy tales
  const [isReading, setIsReading] = useState(true); // To track if reading is active
  const [stats, setStats] = useState({ changes: 0, finalFontSize: fontSize }); // Track statistics

  // fetch fairy tales data
  useEffect(() => {
    // fetch fairy tales from a JSON file or API endpoint
    const fetchFairyTales = async () => {
      try {
        const response = await fetch('/fairyTales.json'); // Adjust path as needed
        if (!response.ok) throw new Error('Network response was not ok');
        const data = await response.json();
        setFairyTales(data);
      } catch (error) {
        console.error('Error fetching fairy tales:', error);
      }
    };
    fetchFairyTales();
  }, []);

  // handle fairy tale selection
  const handleFairyTaleSelection = (fairyTale) => {
    if (isReading) {
      setSelectedFairyTale(fairyTale);
    }
  };

  // increase font size
  const increaseFontSize = () => {
    if (isReading) {
      setFontSize((prevSize) => prevSize + 2);
      setStats((prevStats) => ({ ...prevStats, changes: prevStats.changes + 1 }));
    }
  };

  // decrease font size
  const decreaseFontSize = () => {
    if (isReading) {
      setFontSize((prevSize) => (prevSize > 10 ? prevSize - 2 : prevSize)); // Minimum size 10px
      setStats((prevStats) => ({ ...prevStats, changes: prevStats.changes + 1 }));
    }
  };

  // terminate reading and show stats
  const terminateReading = () => {
    setIsReading(false);
    setStats((prevStats) => ({ ...prevStats, finalFontSize: fontSize }));
  };

  return (
    <>
      <div style={{ padding: '20px' }}>
        {/* render the selection boxes only if no fairy tale is selected */}
        {!selectedFairyTale && isReading && (
          <div>
            <h2>Select a Fairy Tale:</h2>
            {fairyTales.map((fairyTale) => (
              <div
                key={fairyTale.id}
                style={{
                  border: '1px solid black',
                  padding: '10px',
                  marginTop: '10px',
                  cursor: 'pointer',
                }}
                onClick={() => handleFairyTaleSelection(fairyTale)}
              >
                <h3>{fairyTale.title}</h3>
                <p>{fairyTale.description}</p>
              </div>
            ))}
          </div>
        )}

        {/* only show text box and font size toggles if a tale is selected */}
        {selectedFairyTale && isReading && (
          <>
            {/* Title Box (constant) */}
            <div
              style={{
                border: '1px solid black',
                padding: '10px',
                marginTop: '20px',
                backgroundColor: '#f0f0f0', 
              }}
            >
              <h2>{selectedFairyTale.title}</h2>
            </div>

            {/* font size buttons */}
            <button onClick={decreaseFontSize}>-</button>
            <button onClick={increaseFontSize}>+</button>

            {/* text box */}
            <div
              style={{
                border: '1px solid black',
                padding: '10px',
                marginTop: '20px',
                fontSize: `${fontSize}px`,
              }}
            >
              {selectedFairyTale.text} {/* Display the selected JSON text */}
            </div>

            {/* display current font size */}
            <p>Current font size: {fontSize}px</p>
          </>
        )}

        {/* terminate reading button */}
        {selectedFairyTale && isReading && (
          <button onClick={terminateReading} style={{ marginTop: '20px' }}>
            Terminate Reading
          </button>
        )}

        {/* Show stats if reading is terminated */}
        {!isReading && (
          <div style={{ marginTop: '20px' }}>
            <h2>Statistics</h2>
            <p>Number of changes to font size: {stats.changes}</p>
            <p>Final font size: {stats.finalFontSize}px</p>
          </div>
        )}
      </div>
    </>
  );
}

export default App;
