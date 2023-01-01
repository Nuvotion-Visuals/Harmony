import styled from "styled-components";

type StyledStartMenuBackgroundProps = {
  $height?: string;
};

const StyledStartMenuBackground = styled.span<StyledStartMenuBackgroundProps>`
  height: ${({ $height }) => $height};
  inset: 0;
  position: absolute;
  width: 100%;
  z-index: -1;
  background: var(--F_Background);
`;

export default StyledStartMenuBackground;
