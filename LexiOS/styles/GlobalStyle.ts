import { createGlobalStyle } from "styled-components";

const GlobalStyle = createGlobalStyle`
  *,
  *::before,
  *::after {
    border: 0;
    box-sizing: border-box;
    cursor: default;
    font-variant-numeric: tabular-nums;
    margin: 0;
    outline: 0;
    padding: 0;
    text-rendering: optimizeLegibility;
    -webkit-touch-callout: none;
    user-select: none;
  }

  body {
    font-family: ${({ theme }) => theme.formats.systemFont};
    height: 100%;
    overflow: hidden;
    text-size-adjust: none;
  }

  input::selection,
  textarea::selection {
    background-color: rgb(0, 120, 215);
    color: #fff;
  }

  input, textarea {
    cursor: text;
    user-select: text;
  }

  picture > img {
    display: block;
  }

  ol,
  ul {
    list-style: none;
  }

  :root {
    --F_Primary: #800080;
    --F_Primary_Hover: #990099;
    --F_Font_Color_Error: #d70a53;
    --F_Font_Family: 'Poppins';
    }

    @font-face {
    font-family: 'Poppins';
    src: url('/assets/fonts/Poppins.woff2') format('woff2');
    font-weight: normal;
    font-style: normal;
    }

    * {
    font-family: 'Poppins' !important;
    }
`;

export default GlobalStyle;
