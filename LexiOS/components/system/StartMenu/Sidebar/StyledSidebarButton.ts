import StyledSidebar from "components/system/StartMenu/Sidebar/StyledSidebar";
import styled from "styled-components";

type StyledSidebarButtonProps = {
  $active?: boolean;
};

const StyledSidebarButton = styled.li<StyledSidebarButtonProps>`
 
  display: flex;
  height: ${({ theme }) => theme.sizes.startMenu.sideBar.height};
  place-content: center;
  place-items: center;
  transition-duration: 150ms;
  width: ${({ theme }) => theme.sizes.startMenu.sideBar.width}px;

  &::before {

    content: "";
    height: ${({ theme }) => theme.sizes.startMenu.sideBar.height};
    left: 0;
    position: absolute;
    width: ${({ theme }) => theme.sizes.startMenu.sideBar.width}px;
  }

  figure {
    color: ${({ $active, theme }) =>
      $active ? theme.colors.highlight : theme.colors.text};
    display: flex;
    place-items: center;

    svg {
      fill: ${({ $active, theme }) =>
        $active ? theme.colors.highlight : theme.colors.text};
      height: ${({ theme }) => theme.sizes.startMenu.sideBar.iconSize};
      left: ${({ theme }) => theme.sizes.startMenu.sideBar.iconSize};
      margin-left: 1px;
      position: absolute;
      width: ${({ theme }) => theme.sizes.startMenu.sideBar.iconSize};
    }

    figcaption {
    
      left: ${({ theme }) => theme.sizes.startMenu.sideBar.width}px;
      position: absolute;
      white-space: nowrap;

      strong {
        font-weight: 600;
      }
    }
  }

  ${StyledSidebar}:hover:not(${StyledSidebar}.collapsed) & {
    transition: width 300ms;
    transition-timing-function: cubic-bezier(0.15, 1, 0.5, 1);
    width: ${({ theme }) => theme.sizes.startMenu.sideBar.expandedWidth};
  }

  &:hover {
    background: var(--F_Surface_0);
  }

  &:active {
    background: var(--F_Surface_1);
  }
`;

export default StyledSidebarButton;
