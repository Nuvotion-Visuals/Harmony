import { TextInput } from "@avsync.live/formation";
import { IconName, IconPrefix } from "@fortawesome/fontawesome-svg-core";
import { useMemo } from "react";

interface AddChannelInputProps {
    newChannelName: string;
    setNewChannelName: (value: string) => void;
    onAddChannel: (i: number) => void;
    index: number;
  }
  
  export const AddChannelInput: React.FC<AddChannelInputProps> = ({
    newChannelName,
    setNewChannelName,
    onAddChannel,
    index,
  }) => {
    const addChannelButtons = useMemo(
      () => [
        {
          icon: 'plus' as IconName,
          iconPrefix: 'fas' as IconPrefix,
          minimal: true,
          onClick: () => onAddChannel(index),
          disabled: !newChannelName,
        },
      ],
      [onAddChannel, newChannelName]
    );
  
    return (
      <TextInput
        value={newChannelName}
        onChange={(newValue) => setNewChannelName(newValue)}
        iconPrefix="fas"
        compact
        hideOutline
        placeholder="Add channel"
        onEnter={() => onAddChannel(index)}
        buttons={addChannelButtons}
      />
    );
  };