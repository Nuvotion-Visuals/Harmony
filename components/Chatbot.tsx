import styled from 'styled-components'

import React, { useState } from 'react';
import { scrollToElementById, Box, Button, Gap, TextInput } from '@avsync.live/formation';

interface Message {
  message: string;
  response?: string;
}

const Chatbot = (): JSX.Element => {
  const [conversation, setConversation] = useState<Message[]>([]);
  const [message, setMessage] = useState<string>('');
  const [response, setResponse] = useState<string>('');

  const send = async (message: string) => {
    const url = '/api/chatbot';
    const data = { message };
  
    const newMessage: Message = { message, response: '...' };
    setConversation(prevConversation => {
      // Update the response value of the final index in the conversation
      const updatedConversation = [...prevConversation];
      if (updatedConversation.length > 0) {
        const lastIndex = updatedConversation.length - 1;
        updatedConversation[lastIndex].response = updatedConversation[lastIndex].response;
      }
  
      return [...updatedConversation, newMessage];
    });
  
    try {
      const response = await fetch(url, {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(data),
      });
      const jsonResponse = await response.json();
  
      setConversation(prevConversation => {
        // Update the response value of the final index in the conversation
        const updatedConversation = [...prevConversation];
        if (updatedConversation.length > 0) {
          const lastIndex = updatedConversation.length - 1;
          updatedConversation[lastIndex].response = jsonResponse.message;
        }
  
        return [...updatedConversation];
      });
  
      setResponse(jsonResponse.message);
      setMessage('');
      scrollToElementById('demo', {
        behavior: 'smooth',
        block: 'start',
        inline: 'nearest'
      });
    } catch (error) {
      console.error(error);
      
      setResponse('Sorry, there was an error processing your request.');
    }
  };
  

  return (
    <Box p={1} wrap>
      <h1>Chat</h1>
      <Gap gap={1}>
      {conversation.map((message: Message, index: number) => (
        <>
          <S.Container isUser>
            <S.Message isUser>{message.message}</S.Message>
          </S.Container>
          {
            message?.response &&
              <S.Container>
                <S.Message>{message?.response}</S.Message>
              </S.Container>
          }
        </>
      ))}
      </Gap>

      <Box pt={1} width='100%'>
        <Gap>
          <Button
            circle
            onClick={() => send('Nevermind')}
            icon='sync'
            iconPrefix='fas'
            secondary
          />
          <Button
            circle
            onClick={() => {
              setConversation([])
            }}
            icon='times'
            iconPrefix='fas'
            secondary
          />
          <Button
            text='What time is it?'
            secondary
            onClick={() => send('What time is it')}
          />
          <Button
            text='What is the weather?'
            secondary
            onClick={() => send('What is the weather in Chicago?')}
          />
          <Button
            text='Create a space'
            secondary
            onClick={() => send('Create a space')}
          />
        </Gap>
      </Box>

      <Box width='100%' pt={1}>
        <TextInput 
          placeholder={'Send message'}
          value={message}
          onChange={(value) =>
            setMessage(value)
          }
          onEnter={() => send(message)}
          buttons={[
            {
              icon: 'paper-plane',
              iconPrefix: 'fas',
              onClick: () => send(message),
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
    line-height: 1.33;
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