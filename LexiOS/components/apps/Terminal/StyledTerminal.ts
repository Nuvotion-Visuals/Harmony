import styled from "styled-components";
import ScrollBars from "styles/common/ScrollBars";
import { DEFAULT_SCROLLBAR_WIDTH } from "utils/constants";

const StyledTerminal = styled.div`
  height: 100%;
  width: 100%;
  font-family: monospace !important;
* {
  font-family: monospace !important;
}
  .terminal {
    height: 100% !important;
    background: var(--F_Background);
    padding: 0 .5rem;
  }

  .xterm-viewport {
    ${ScrollBars(DEFAULT_SCROLLBAR_WIDTH)};

    width: 100% !important;
  }
`;

export default StyledTerminal;
