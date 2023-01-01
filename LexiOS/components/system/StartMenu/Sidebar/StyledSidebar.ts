import styled from "styled-components";

const StyledSidebar = styled.nav`
  display: flex;
  flex-direction: column;
  height: 100%;
  justify-content: space-between;
  overflow: hidden;
  position: absolute;
  top: 0;
  width: ${({ theme }) => theme.sizes.startMenu.sideBar.width}px;
  z-index: 1;

  
`;

export default StyledSidebar;
