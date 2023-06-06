import StyledSidebarButton from "components/system/StartMenu/Sidebar/StyledSidebarButton";
import { useRef } from "react";

type SidebarButton = {
  action?: () => void;
  active?: boolean;
  heading?: boolean;
  icon: JSX.Element;
  name: string;
  tooltip?: string;
};

export type SidebarButtons = SidebarButton[];

const SidebarButtonComponent: FC<SidebarButton> = ({
  action,
  active,
  heading,
  icon,
  name,
  tooltip,
}) => {
  const buttonRef = useRef<HTMLLIElement | null>(null);

  return (
    <StyledSidebarButton
      ref={buttonRef}
      $active={active}
      aria-label={name}
      onClick={action}
      title={tooltip}
    >
      <figure>
        {icon}
        <figcaption>{heading ? <strong>{name}</strong> : name}</figcaption>
      </figure>
    </StyledSidebarButton>
  );
};

export default SidebarButtonComponent;
