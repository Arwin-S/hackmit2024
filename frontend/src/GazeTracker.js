// import React, { useEffect } from 'react';

// const GazeTracker = () => {
//   useEffect(() => {
//     // Dynamically load the WebGazer script
//     const script = document.createElement('script');
//     script.src = '../webgazer_new/dist/webgazer.js';
//     script.async = true;
//     document.body.appendChild(script);

//     script.onload = () => {
//       // WebGazer is loaded, now initialize it
//       if (window.webgazer) {
//         console.log('WebGazer loaded successfully');

//         // Establish a WebSocket connection to the Python server
//         const socket = new WebSocket('ws://localhost:6789');

//         socket.onopen = () => {
//           console.log('WebSocket connection opened');
//         };

//         socket.onmessage = (event) => {
//           console.log('Server response:', event.data);
//         };

//         // Initialize WebGazer after it loads
//         window.webgazer
//           .setRegression('ridge')
//           .setGazeListener((data, clock) => {
//             if (data) {
//               const gazeData = JSON.stringify({ x: data.x, y: data.y });
//               console.log('Sending gaze data:', gazeData);
//               socket.send(gazeData); // Send gaze data to Python server
//             }
//           })
//           .begin();
//       } else {
//         console.error('WebGazer failed to load');
//       }
//     };

//     // Cleanup function
//     return () => {
//       window.webgazer?.end(); // Stop WebGazer
//       document.body.removeChild(script); // Remove the script
//     };
//   }, []); // Empty dependency array ensures this runs once on mount and cleanup on unmount

//   return null; // No UI elements to render
// };

// export default GazeTracker;


import React, { useEffect } from 'react';

const GazeTracker = ({ onLinesRead }) => { // Add destructuring here
  useEffect(() => {
    // Check if the script is already added
    if (!document.querySelector('script[src="../webgazer_new/dist/webgazer.js"]')) {
      const script = document.createElement('script');
      script.src = '../webgazer_new/dist/webgazer.js';
      script.async = true;
      document.body.appendChild(script);

      script.onload = () => {
        if (window.webgazer) {
          console.log('WebGazer loaded successfully');

          // Establish a WebSocket connection to the Python server
          const socket = new WebSocket('ws://localhost:6789');

          socket.onopen = () => {
            console.log('WebSocket connection opened');
          };

          socket.onmessage = (event) => {
            try {
              const data = JSON.parse(event.data);
              console.log(data);
              if (data.lines_read !== undefined) {
                onLinesRead(data.lines_read); // Pass the integer to the parent via callback
              }
            } catch (error) {
              console.error('Error parsing JSON from server:', error);
            }
          };

          // Initialize WebGazer
          window.webgazer
            .setRegression('ridge')
            .setGazeListener((data, clock) => {
              if (data) {
                const gazeData = JSON.stringify({ x: data.x, y: data.y });
                console.log('Sending gaze data:', gazeData);
                socket.send(gazeData); // Send gaze data to Python server

                
              }
            })
            .begin();

           

        } else {
          console.error('WebGazer failed to load');
        }
      };
    } else {
      console.log('WebGazer script already loaded');
      // If WebGazer script is already loaded, just ensure it's initialized
      if (window.webgazer) {
        window.webgazer.begin();
      }
    }

    // Cleanup function
    return () => {
      if (window.webgazer) {
        window.webgazer.end(); // Stop WebGazer
      }
    };
  }, []); // Empty dependency array ensures this runs once on mount and cleanup on unmount

  return null; // No UI elements to render
};

export default GazeTracker;
