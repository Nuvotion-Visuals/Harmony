import styled from "styled-components";
import Button from "styles/common/Button";

type StyledStartButtonProps = {
  $active: boolean;
};

const StyledStartButton = styled(Button)<StyledStartButtonProps>`
  background-color: ${({ $active, theme }) =>
    $active && 'var(--F_Surface_0)'};
  display: flex;
  fill: ${({ theme }) => theme.colors.startButton};
  height: 100%;
  left: 0;
  place-content: center;
  place-items: center;
  position: absolute;
  cursor: pointer;
  * {
    cursor: pointer;
  }
  && {
    width: ${({ theme }) => theme.sizes.startButton.width};
  }

  svg {
  cursor: pointer;

    height: ${({ theme }) => theme.sizes.startButton.iconSize};
  }

  &:hover {
    background-color: ${({ $active, theme }) =>
      !$active && 'var(--F_Surface_0)'};

    svg {
      fill: ${({ theme }) => theme.colors.highlight};
    }
  }

  &:active {
    background-color: hsla(0, 0%, 20%, 70%);

    svg {
      fill: hsla(207, 100%, 60%, 80%);
    }
  }
`;

export default StyledStartButton;
