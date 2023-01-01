import styled from "styled-components";

const StyledBrowser = styled.div`
  iframe {
    border: 0;
    height: calc(100% - 36px - 33px);
    width: 100%;
  }

  nav {
    background-color: var(--F_Background);
    display: flex;
    padding-bottom: calc(.5rem - 2px);
    padding-top: 2px;
    place-content: center;
    place-items: center;

    div {
      display: flex;
      justify-content: space-around;
      min-width: 102px;
      padding-left: 6px;
      width: 102px;
    }

    button {
      border-radius: 50%;
      display: flex;
      height: 28px;
      place-content: center;
      place-items: center;
      transition: background 0.2s ease-in-out;
      width: 28px;

      svg {
        fill: rgb(240, 240, 240);
        height: 22px;
        width: 22px;
      }

      &:hover {
        background-color: rgb(103, 103, 103);
      }

      &:active {
        background-color: rgb(110, 110, 110);
      }

      &:disabled {
        background-color: inherit;

        svg {
          fill: rgb(152, 152, 152);
        }
      }
    }

    &:not(:first-child) {
      height: 33px;
      justify-content: left;
      padding: 0 8px;
      border-bottom: 1px solid var(--F_Surface);

      button {
        margin-bottom: 4px;
        margin-right: 4px;
      }
    }

    input {
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
    }
  }
`;

export default StyledBrowser;
