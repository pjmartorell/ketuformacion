import React from 'react';
import Canvas from './Canvas';
import InitialOverlayDialog from './InitialOverlayDialog';

function App() {
    const hasHiddenInitialDialog = localStorage.getItem('hideInitialDialog') === 'true';

    return (
      <div className="App">
          {!hasHiddenInitialDialog && <InitialOverlayDialog />}
          <Canvas />
      </div>
  );
}

export default App;
