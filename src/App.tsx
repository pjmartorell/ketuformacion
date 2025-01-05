import React from 'react';
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';
import { Canvas } from './components';
import { InitialOverlayDialog } from './components/Dialog/InitialOverlayDialog';
import { theme } from './theme/theme';
import { MusicianProvider } from './context/MusicianContext';
import { GlobalStyles } from './styles/GlobalStyles';

const App: React.FC = () => {
  const hasHiddenInitialDialog = localStorage.getItem('hideInitialDialog') === 'true';

  return (
    <StyleSheetManager shouldForwardProp={isPropValid}>
      <ThemeProvider theme={theme}>
        <GlobalStyles theme={theme} />
        <MusicianProvider>
          <div className="App">
            {!hasHiddenInitialDialog && <InitialOverlayDialog />}
            <Canvas />
          </div>
        </MusicianProvider>
      </ThemeProvider>
    </StyleSheetManager>
  );
};

export default App;
