import type { FlattenSimpleInterpolation } from "styled-components";
import { css } from "styled-components";
import { DOWN, LEFT, RIGHT, UP } from "styles/ArrowIcons";

const ScrollBars = (
  size: number,
  verticalX?: number,
  verticalY?: number
): FlattenSimpleInterpolation => css`
  overflow: auto;
 
`;

export default ScrollBars;
