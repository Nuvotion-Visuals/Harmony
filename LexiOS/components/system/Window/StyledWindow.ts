import { m as motion } from "framer-motion";
import styled from "styled-components";

type StyledWindowProps = {
  $backgroundColor?: string;
  $isForeground: boolean;
  $isMaximized?: boolean
};

const StyledWindow = styled(motion.section)<StyledWindowProps>`
  background: var(--F_Background);
  outline: 1px solid var(--F_Surface);
  border-radius: ${props => props.$isMaximized ? '0' : '.5rem'};
  height: 100%;
  overflow: hidden;
  width: 100%;
  header + * {
    height: ${({ theme }) =>
      `calc(100% - ${theme.sizes.titleBar.height}px) !important`};
  }
`;

export default StyledWindow;
