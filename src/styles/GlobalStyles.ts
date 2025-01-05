import { createGlobalStyle } from 'styled-components';
import { Theme } from '../theme/theme';

export const GlobalStyles = createGlobalStyle<{ theme: Theme }>`
  * {
    box-sizing: border-box;
    margin: 0;
    padding: 0;
  }

  html, body {
    height: 100%;
    width: 100%;
    margin: 0;
    padding: 0;
  }

  body {
    font-family: system-ui, -apple-system, sans-serif;
    -webkit-font-smoothing: antialiased;
    -moz-osx-font-smoothing: grayscale;
    background: ${({ theme }) => theme.colors.background};
    color: ${({ theme }) => theme.colors.foreground};
  }

  #root {
    height: 100%;
    width: 100%;
  }

  .App {
    height: 100%;
    width: 100%;
    display: flex;
    flex-direction: column;
  }

  button {
    cursor: pointer;
    &:disabled {
      cursor: not-allowed;
      opacity: 0.6;
    }
  }

  /* Konva stage container styles */
  .konvajs-content {
    background: ${({ theme }) => theme.colors.background};
    width: 100% !important;
    height: 100% !important;
  }

  /* Dialog styles */
  .overlay {
    position: fixed;
    top: 0;
    left: 0;
    right: 0;
    bottom: 0;
    background-color: rgba(0, 0, 0, 0.5);
    display: flex;
    align-items: center;
    justify-content: center;
    z-index: 1000;
  }

  /* Selection styles */
  ::selection {
    background: ${({ theme }) => theme.colors.primary};
    color: white;
  }
`;
