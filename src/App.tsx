import React from 'react';
import { Canvas } from './components';
import { InitialOverlayDialog } from './components/Dialog/InitialOverlayDialog';
import { ThemeProvider } from 'styled-components';
import { theme } from './theme/theme';
import { MusicianProvider } from './context/MusicianContext';
import { GlobalStyles } from './styles/GlobalStyles';

const App: React.FC = () => {
  const hasHiddenInitialDialog = localStorage.getItem('hideInitialDialog') === 'true';

  return (
    <ThemeProvider theme={theme}>
      <GlobalStyles />
      <MusicianProvider>
        <div className="App">
          {!hasHiddenInitialDialog && <InitialOverlayDialog />}
          <Canvas />
        </div>
      </MusicianProvider>
    </ThemeProvider>
  );
};

export default App;
