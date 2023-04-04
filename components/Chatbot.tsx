import styled from 'styled-components'

import React, { useState } from "react";
import { Box, Gap, TextInput } from '@avsync.live/formation';
import { scrollToElementById } from 'client-utils';

interface Message {
  message: string;
  response: string;
}

const Chatbot = (): JSX.Element => {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>("");
  const [response, setResponse] = useState<string>("");

 const send = () => {
  (async () => {
    const url = "/api/chatbot";
    const data = { message };
    try {
      const response = await fetch(url, {
        method: "POST",
        headers: {
          "Content-Type": "application/json",
        },
        body: JSON.stringify(data),
      });
      const jsonResponse = await response.json();
      const newMessage: Message = { message, response: jsonResponse.message };
      setConversation([...conversation, newMessage]);
      setResponse(jsonResponse.message);
      setMessage("");
      scrollToElementById('demo', {
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      })
    } catch (error) {
      console.error(error);
      
      setResponse("Sorry, there was an error processing your request.");
    }
  })()
 }

  return (
    <Box p={1} wrap>
      <h1>Chat</h1>
      <Gap gap={1}>
      {conversation.map((message: Message, index: number) => (
        <>
          <S.Container isUser>
            <S.Message isUser>{message.message}</S.Message>
          </S.Container>

          <S.Container>
            <S.Message>{message.response}</S.Message>
          </S.Container>
        </>
      ))}
      </Gap>

      <Box width='100%' pt={1}>
        <TextInput 
          placeholder={'Send message'}
          value={message}
          onChange={(value) =>
            setMessage(value)
          }
          autoFocus
          onEnter={send}
          buttons={[
            {
              icon: 'paper-plane',
              iconPrefix: 'fas',
              onClick: () => send(),
              minimal: true
            }
          ]}
        />
      </Box>
      <div id='demo' />
    </Box>
  );
};

export default Chatbot;

const S = {
  Message: styled.div<{
    isUser?: boolean
  }>`
    padding: 1rem;
    background: var(--F_Surface);
    background: ${props => props.isUser ? 'var(--F_Surface)' : 'var(--F_Emphasize)'};
    border-radius: 1rem;
    display: flex;
  `,
  Container: styled.div<{
    isUser?: boolean
  }>`
    width: 100%;
    display: flex;
    justify-content: ${props => props.isUser ? 'right' : 'left'};
    max-width: ${props => props.isUser ? '100%' : 'calc(100% - 2rem)'};

  `
}