import styled from "styled-components";

const StyledClock = styled.div`
  color: ${({ theme }) => theme.colors.text};
  display: flex;
  font-size: ${({ theme }) => theme.sizes.clock.fontSize};
  height: 100%;
  max-width: ${({ theme }) => `calc(${theme.sizes.clock.width} + 10px)}`};
  min-width: ${({ theme }) => theme.sizes.clock.width};
  place-content: center;
  place-items: center;

  &:hover {
    background-color: ${({ theme }) => theme.colors.taskbar.hover};
  }

  &:active {
    background-color: ${({ theme }) => theme.colors.taskbar.foreground};
  }
`;

export default StyledClock;

export const S_Container = styled.div`
    min-width: var(--F_Input_Width);
    margin-right: .5rem;

  button {
    box-shadow: none;
  }
`