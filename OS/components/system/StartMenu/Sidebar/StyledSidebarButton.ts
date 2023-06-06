import StyledSidebar from "components/system/StartMenu/Sidebar/StyledSidebar";
import styled from "styled-components";

type StyledSidebarButtonProps = {
  $active?: boolean;
};

const StyledSidebarButton = styled.li<StyledSidebarButtonProps>`
  cursor: pointer;
  display: flex;
  height: ${({ theme }) => theme.sizes.startMenu.sideBar.height};
  place-content: center;
  place-items: center;
  width: ${({ theme }) => theme.sizes.startMenu.sideBar.width}px;
  cursor: pointer;

  * {
  cursor: pointer;

  }
  &::before {
    cursor: pointer;

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
    width: ${({ theme }) => theme.sizes.startMenu.sideBar.expandedWidth};
  }

  &:hover {
    background: var(--F_Surface_1);
  }

  &:active {
    background: var(--F_Surface_2);
  }
`;

export default StyledSidebarButton;
