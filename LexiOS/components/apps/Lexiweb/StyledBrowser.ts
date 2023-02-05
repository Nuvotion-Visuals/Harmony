import styled from "styled-components";

const StyledBrowser = styled.div`
  iframe {
    border: 0;
    height: calc(100% - 36px);
    width: 100%;
    border-top: 1px solid var(--F_Surface_0);

  }

  nav {
    background-color: var(--F_Background);
    display: flex;
    align-items: center;
    width: 100%;
    gap: .125rem;
    padding: 0 .25rem;

    button {
      border-radius: 50%;
      display: flex;
      height: 28px;
      place-content: center;
      place-items: center;
      transition: background 0.2s ease-in-out;
      width: 28px;
      box-shadow: none;

      &:hover {
        background-color: rgb(103, 103, 103);
      }

      &:active {
        background-color: rgb(110, 110, 110);
      }

      &:disabled {
        background-color: inherit;

      
      }
    }

   

    /* input {
      background-color: var(--F_Surface);
      border-radius: 18px;
      color: rgb(255, 255, 255);
      font-family: ${({ theme }) => theme.formats.systemFont};
      font-size: 13px;
      height: 28px;
      letter-spacing: 0.2px;
      line-height: 26px;
      margin: 0 6px;
      padding: 0 13px;
      width: 100%;

      &:focus {
        box-shadow: var(--F_Outline_Focus);
      }
    } */
  }
`;

export default StyledBrowser;
