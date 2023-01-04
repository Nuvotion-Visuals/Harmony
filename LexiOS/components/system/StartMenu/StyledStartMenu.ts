import StyledFileManager from "components/system/Files/Views/List/StyledFileManager";
import { m as motion } from "framer-motion";
import styled, { css } from "styled-components";
import ScrollBars from "styles/common/ScrollBars";
import { TASKBAR_HEIGHT, THIN_SCROLLBAR_WIDTH } from "utils/constants";

type StyledStartMenuProps = {
  $showScrolling: boolean;
};

const SCROLLBAR_PADDING_OFFSET = 3;
const HOVER_ADJUSTED_PADDING = THIN_SCROLLBAR_WIDTH - SCROLLBAR_PADDING_OFFSET;

const StyledStartMenu = styled(motion.nav)<StyledStartMenuProps>`
  border-radius: .5rem;
  bottom: ${TASKBAR_HEIGHT}px;
  contain: strict;
  display: flex;
  height: 100%;
  left: .5rem;
  margin-bottom: .5rem;
  max-height: ${({ theme }) => theme.sizes.startMenu.maxHeight}px;
  max-width: ${({ theme }) => theme.sizes.startMenu.size}px;
  position: absolute;
  width: 100%;
  z-index: 10000;
  border: 1px solid var(--F_Surface);

  @supports ((-webkit-backdrop-filter: none) or (backdrop-filter: none)) {
  }

  ${StyledFileManager} {
    ${ScrollBars(THIN_SCROLLBAR_WIDTH, -2, -1)};

    margin-top: 0;
    padding-left: ${({ theme }) => theme.sizes.startMenu.sideBar.width}px;
    scrollbar-width: none;

    ${StyledFileManager} {
      margin: 0;
      overflow: hidden;
      padding: 0;

      figure {
        picture {
          margin-left: 9px;
        }

        &:active {
          picture {
            margin-left: 13px;
          }
        }
      }
    }

    ::-webkit-scrollbar {
      width: 0;
    }

   

   
  }
`;

export default StyledStartMenu;
