import { Box, copyToClipboard, Dropdown, Gap, Spacer, TextInput } from "@avsync.live/formation";
import { bookmarks, config, HOME_PAGE } from "components/apps/Lexiweb/config";
import StyledBrowser from "components/apps/Lexiweb/StyledBrowser";
import type { ComponentProcessProps } from "components/system/Apps/RenderComponent";
import useTitle from "components/system/Window/useTitle";
import { useFileSystem } from "contexts/fileSystem";
import { useProcesses } from "contexts/process";
import processDirectory from "contexts/process/directory";
import useHistory from "hooks/useHistory";
import { extname } from "path";
import { useCallback, useEffect, useMemo, useRef, useState } from "react";
import Button from "styles/common/Button";
import Icon from "styles/common/Icon";
import { FAVICON_BASE_PATH, ONE_TIME_PASSIVE_EVENT } from "utils/constants";
import { getUrlOrSearch, SEARCH_QUERY, label } from "utils/functions";
import { Button as F_Button } from '@avsync.live/formation'

const Browser: FC<ComponentProcessProps> = ({ id }) => {
  const {
    icon: setIcon,
    linkElement,
    url: changeUrl,
    processes: { [id]: process },
  } = useProcesses();
  const { prependFileToTitle } = useTitle(id);
  const { url = "" } = process || {};
  const initialUrl = url || HOME_PAGE;
  const { canGoBack, canGoForward, history, moveHistory, position } =
    useHistory(initialUrl, id);
  const { exists, readFile } = useFileSystem();
  const inputRef = useRef<HTMLInputElement | null>(null);
  const iframeRef = useRef<HTMLIFrameElement | null>(null);
  const [loading, setLoading] = useState(false);
  const [srcDoc, setSrcDoc] = useState("");
  const changeHistory = (step: number): void => {
    moveHistory(step);

    if (inputRef.current) inputRef.current.value = history[position + step];
  };
  const currentUrl = useRef("");
  const setUrl = useCallback(
    async (addressInput: string): Promise<void> => {
      const { contentWindow } = iframeRef.current || {};

      if (contentWindow?.location) {
        const isHtml =
          [".htm", ".html"].includes(extname(addressInput).toLowerCase()) &&
          (await exists(addressInput));

        setLoading(true);
        setSrcDoc("");
        if (isHtml) setSrcDoc((await readFile(addressInput)).toString());
        // setIcon(id, processDirectory.Browser.icon);

        if (!isHtml) {
          const addressUrl = await getUrlOrSearch(addressInput);

          contentWindow.location.replace(addressUrl);

          if (addressUrl.startsWith(SEARCH_QUERY)) {
            prependFileToTitle(`${addressInput} - Google Search`);
          } else {
            const { name = "" } =
              bookmarks?.find(
                ({ url: bookmarkUrl }) => bookmarkUrl === addressInput
              ) || {};

            prependFileToTitle(name);
          }

          // if (addressInput.startsWith("ipfs://")) {
          //   setIcon(id, "/System/Icons/Favicons/ipfs.webp");
          // } else {
          //   const favicon = new Image();
          //   const faviconUrl = `${
          //     new URL(addressUrl).origin
          //   }${FAVICON_BASE_PATH}`;

          //   favicon.addEventListener(
          //     "error",
          //     () => {
          //       const { icon } =
          //         bookmarks?.find(
          //           ({ url: bookmarkUrl }) => bookmarkUrl === addressUrl
          //         ) || {};

          //       if (icon) setIcon(id, icon);
          //     },
          //     ONE_TIME_PASSIVE_EVENT
          //   );
          //   favicon.addEventListener(
          //     "load",
          //     () => setIcon(id, faviconUrl),
          //     ONE_TIME_PASSIVE_EVENT
          //   );
          //   favicon.src = faviconUrl;
          // }
        }
      }
    },
    [exists, id, prependFileToTitle, readFile, setIcon]
  );
  const style = useMemo<React.CSSProperties>(
    () => ({ backgroundColor: srcDoc ? "#fff" : "initial" }),
    [srcDoc]
  );

  useEffect(() => {
    if (process && history[position] !== currentUrl.current) {
      currentUrl.current = history[position];
      setUrl(history[position]);
    }
  }, [history, position, process, setUrl]);

  useEffect(() => {
    if (iframeRef?.current) {
      linkElement(id, "peekElement", iframeRef.current);
    }
  }, [id, linkElement]);

  const [browswerUrl, set_browserUrl] = useState(initialUrl)
  useEffect(() => {
    currentUrl.current = history[position];
    set_browserUrl(history[position]);
  }, [history])


  useEffect(() => {
    const iframe = iframeRef.current;
    const originalSrc = iframe?.src;

    function handleLoad() {
      // Compare the iframe's current src to the original src
      // If they are different, it means the src attribute has changed
      if (iframe?.src !== originalSrc) {
        alert(iframe?.src)
      }
    }

    // Add an event listener to the iframe element to detect when the src attribute changes
    iframe?.addEventListener('load', handleLoad);

    // Return a cleanup function to remove the event listener when the component unmounts
    return () => {
      iframe?.removeEventListener('load', handleLoad);
    };
  }, [iframeRef?.current]);

  return (
    <StyledBrowser>
      <Box px={.5}>
       <Gap disableWrap gap={.25}>
        <F_Button
          icon='arrow-left'
          iconPrefix='fas'
          disabled={!canGoBack}
          onClick={() => changeHistory(-1)}
          secondary
          circle
        />
        <F_Button
          icon='arrow-right'
          iconPrefix='fas'
          disabled={!canGoForward}
          onClick={() => changeHistory(+1)}
          secondary
          circle
        />
        
        <F_Button
          icon='refresh'
          iconPrefix='fas'
          disabled={loading}
          onClick={() => setUrl(history[position])}
          circle
          secondary
        />
        <F_Button
          icon='home'
          iconPrefix='fas'
          onClick={() => {
            setUrl('https://dash.lexi.studio')
            set_browserUrl('https://dash.lexi.studio')
          }}
          circle
          secondary
        />
        <TextInput
          value={browswerUrl}
          onChange={value => set_browserUrl(value)}
          compact={true}
          onEnter={() => {
            changeUrl(id, browswerUrl);
            window.getSelection()?.removeAllRanges();
            inputRef.current?.blur();
          }}
          ref={inputRef}
        />
        <F_Button
          icon='copy'
          iconPrefix='far'
          disabled={loading}
          onClick={() => copyToClipboard(browswerUrl)}
          circle
          secondary
        />
      
        <Dropdown
          options={[
            {
              "icon": "ellipsis-vertical",
              "iconPrefix": "fas",
              "dropDownOptions": [
                {
                  "icon": "heart",
                  "text": "Save"
                },
                {
                  "icon": "paper-plane",
                  "text": "Send"
                },
                {
                  "icon": "plus",
                  "iconPrefix": "fas",
                  "text": "Add"
                }
              ]
            }
          ]}
       />
      </Gap>
      </Box>
      {/* <Box py={.25}>
        <nav>
          {bookmarks.map(({ name, icon, url: bookmarkUrl }) => (
            <Button
              key={name}
              onClick={() => {
                if (inputRef.current) {
                  inputRef.current.value = bookmarkUrl;
                }

                changeUrl(id, bookmarkUrl);
              }}
              {...label(`${name}\n${bookmarkUrl}`)}
            >
              <Icon alt={name} imgSize={16} src={icon} />
            </Button>
          ))}
        </nav>
      </Box> */}

      <Box width='100%' py={.25}></Box>
      <iframe
        ref={iframeRef}
        onLoad={() => setLoading(false)}
        srcDoc={srcDoc || undefined}
        style={style}
        title={id}
        {...config}
        allow="microphone; camera; fullscreen; autoplay; encrypted-media"
      />
    </StyledBrowser>
  );
};

export default Browser;
