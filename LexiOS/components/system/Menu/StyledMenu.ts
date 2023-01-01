import { m as motion } from "framer-motion";
import styled from "styled-components";

type StyledMenuProps = {
  $isSubMenu: boolean;
  $x: number;
  $y: number;
};

const StyledMenu = styled(motion.nav).attrs<StyledMenuProps>(({ $x, $y }) => ({
  style: {
    transform: `translate(${$x}px, ${$y}px)`,
  },
}))<StyledMenuProps>`
  background: var(--F_Surface_0);
  color: rgb(255, 255, 255);
  border-radius: .5rem;
  contain: layout;
  font-size: 13px;
  max-height: fit-content;
  max-width: fit-content;
  position: absolute;
  width: max-content;
  z-index: ${({ $isSubMenu }) => $isSubMenu && 1};
  padding: .5rem 0;
  box-shadow: var(--F_Outline);
  ol {
    li.disabled {
      color: rgb(110, 110, 110);
      pointer-events: none;
    }

    hr {
      background-color: var(--F_Surface);
      height: 1px;
      margin: 3px 8px;
    }

    figure {
      display: flex;
      align-items: center;
      padding: .5rem 0;
      &:hover,
      &.active {
        background: var(--F_Surface);
      }

      figcaption {
        display: flex;
        height: 16px;
        line-height: 16px;
        margin-left: 2rem;
        margin-right: 64px;
        place-items: center;
        position: relative;
        top: 1px;
        white-space: nowrap;
        width: max-content;
        line-height: 1em;

        &.primary {
          font-weight: 700;
        }
      }

      picture {
        margin: 0 -24px 0 8px;
      }

      svg {
        fill: #fff;
        height: 13px;
        margin-top: 1px;
        position: absolute;
        width: 13px;

        &.left {
          left: 8px;
        }

        &.right {
          right: 8px;
        }
      }
    }
  }
`;

export default StyledMenu;
