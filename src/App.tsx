import React from 'react';
import { StyleSheetManager, ThemeProvider } from 'styled-components';
import isPropValid from '@emotion/is-prop-valid';
import { Canvas } from './components';
import { InitialOverlayDialog } from './components/Dialog/InitialOverlayDialog';
import { theme } from './theme/theme';
import { GlobalStyles } from './styles/GlobalStyles';

const App: React.FC = () => {
  const hasHiddenInitialDialog = localStorage.getItem('hideInitialDialog') === 'true';

  return (
    <StyleSheetManager shouldForwardProp={isPropValid}>
      <ThemeProvider theme={theme}>
        <GlobalStyles theme={theme} />
        <div className="App">
          {!hasHiddenInitialDialog && <InitialOverlayDialog />}
          <Canvas />
        </div>
      </ThemeProvider>
    </StyleSheetManager>
  );
};

export default App;
