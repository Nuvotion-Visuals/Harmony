import { TextInput, Box, Button, Gap } from "@avsync.live/formation";
import FileManager from "components/system/Files/FileManager";
import Sidebar from "components/system/StartMenu/Sidebar";
import StyledStartMenu from "components/system/StartMenu/StyledStartMenu";
import useStartMenuTransition from "components/system/StartMenu/useStartMenuTransition";
import type { Variant } from "framer-motion";
import { useLayoutEffect, useRef, useState } from "react";
import styled from "styled-components";
import {
  DEFAULT_SCROLLBAR_WIDTH,
  FOCUSABLE_ELEMENT,
  HOME,
  PREVENT_SCROLL,
} from "utils/constants";

type StartMenuProps = {
  toggleStartMenu: (showMenu?: boolean) => void;
};

type StyleVariant = Variant & {
  height?: string;
};

const StartMenu: FC<StartMenuProps> = ({ toggleStartMenu }) => {
  const menuRef = useRef<HTMLElement | null>(null);
  const [showScrolling, setShowScrolling] = useState(false);
  const revealScrolling: React.MouseEventHandler = ({ clientX = 0 }) => {
    const { width = 0 } = menuRef.current?.getBoundingClientRect() || {};

    setShowScrolling(clientX > width - DEFAULT_SCROLLBAR_WIDTH);
  };
  const maybeCloseMenu: React.FocusEventHandler<HTMLElement> = ({
    relatedTarget,
  }) => {
    const focusedElement = relatedTarget as HTMLElement | null;
    const focusedInsideMenu =
      focusedElement && menuRef.current?.contains(focusedElement);

    if (!focusedInsideMenu) {
      const focusedTaskbar = focusedElement === menuRef.current?.nextSibling;
      const focusedStartButton =
        focusedElement?.parentElement === menuRef.current?.nextSibling;

      if (!focusedTaskbar && !focusedStartButton) {
        toggleStartMenu(false);
      } else {
        menuRef.current?.focus(PREVENT_SCROLL);
      }
    }
  };
  const startMenuTransition = useStartMenuTransition();
  const { height } =
    (startMenuTransition.variants?.active as StyleVariant) ?? {};

  useLayoutEffect(() => menuRef.current?.focus(PREVENT_SCROLL), []);

  return (
    <StyledStartMenu
      ref={menuRef}
      $showScrolling={showScrolling}
      onBlurCapture={maybeCloseMenu}
      onMouseMove={revealScrolling}
      {...startMenuTransition}
      {...FOCUSABLE_ELEMENT}
    >
      
      <S.Inner>
        <Box width={'100%'} p={.5}>
        <Gap disableWrap>

        <Button
          icon='microphone'
          iconPrefix='fas'
          circle
          secondary
          onClick={() => {alert('test')}}
        />
        <TextInput
          icon='search'
          iconPrefix="fas"
          value=''
          onChange={() => {}}
          compact
        />

        </Gap>

      </Box>
      
      <Sidebar height={height} />
      <FileManager
        url={`${HOME}/Start Menu`}
        view="list"
        hideLoading
        hideShortcutIcons
        loadIconsImmediately
        preloadShortcuts
        readOnly
        hideFolders
        skipFsWatcher
        skipSorting
        useNewFolderIcon
      />
      </S.Inner>

    </StyledStartMenu>
  );
};

export default StartMenu;

const S = {
  Inner: styled.div`
    position: absolute;
    width: 100%;
    z-index: 100;

  `
}