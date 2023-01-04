import { m as motion } from "framer-motion";
import styled from "styled-components";

type StyledTaskbarEntryProps = {
  $foreground: boolean;
  $progress?: number;
};

const StyledTaskbarEntry = styled(motion.li)<StyledTaskbarEntryProps>`
  display: flex;
  min-width: 0;
  overflow: hidden;
  place-content: center;
  position: relative;
  width: ${({ theme }) => theme.sizes.taskbar.entry.maxWidth};

  &::before {
    background-color: ${({ $foreground, $progress, theme }) =>
      $foreground
        ? $progress && $progress > 0 && $progress < 100
          ? 'var(--F_Surface_1)'
          : 'var(--F_Surface)'
        : ""};
    background-image: ${({ $progress, theme }) =>
      $progress && $progress > 0 && $progress < 100
        ? `linear-gradient(to right, ${theme.colors.progressBackground} 0% ${$progress}%, transparent ${$progress}% 100%)`
        : ""};
    border-bottom: ${({ $progress, theme }) => `
        ${theme.sizes.taskbar.entry.borderSize} solid ${
      $progress && $progress > 0 && $progress < 100
        ? theme.colors.progress
        : theme.colors.highlight
    }
      `};
    bottom: 0;
    content: "";
    height: ${({ $foreground }) => ($foreground ? "100%" : 0)};
    margin: ${({ $foreground }) => ($foreground ? "" : "0 4px")};
    position: absolute;
    transition-duration: 0.1s;
    transition-property: ${({ $foreground }) =>
      $foreground ? "all" : "width"};
    width: ${({ $foreground }) => ($foreground ? "100%" : `calc(100% - 8px)`)};
    z-index: -1;
  }

  &:hover {
    &::before {
      background-color: ${({ $foreground, $progress, theme }) =>
      $foreground
        ? 'var(--F_Surface_1)'
          : 'var(--F_Surface)'
      };
      height: 100%;
      margin: 0;
      width: 100%;
    }
  }

  &:active {
    &::before {
      background-color: ${({ $foreground, theme }) =>
        $foreground
          ? theme.colors.taskbar.activeForeground
          : theme.colors.taskbar.active};
    }
  }

  figure {
    align-items: center;
    display: flex;
    margin-bottom: ${({ theme }) => theme.sizes.taskbar.entry.borderSize};
    margin-left: .25rem;
    padding: .25rem;

    figcaption {
      color: ${({ theme }) => theme.colors.text};
      font-size: ${({ theme }) => theme.sizes.taskbar.entry.fontSize};
      margin: 0 .5rem;
      overflow-x: hidden;
      text-overflow: ellipsis;
      white-space: nowrap;
      line-height: 1em;
      padding-right: 1rem;
    }

    picture {
      height: ${({ theme }) => theme.sizes.taskbar.entry.iconSize};
      position: relative;
      top: 1px;
      width: ${({ theme }) => theme.sizes.taskbar.entry.iconSize};
    }
  }
`;

export default StyledTaskbarEntry;
