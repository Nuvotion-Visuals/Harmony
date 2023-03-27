import { Button, Modal, Page, TextInput, generateUUID, Gap, AspectRatio } from '@avsync.live/formation'
import { EditSpace } from 'components/EditSpace'
import { useRouter } from 'next/router'
import React, { useState } from 'react'
import styled from 'styled-components'

interface Props {
  
}

const Add = ({ }: Props) => {
  const router = useRouter()

  const [name, set_name] = useState('')
  const [description, set_description] = useState('')


  const [url, set_url] = useState('')

  return (<S.new>
    <EditSpace />
        
  </S.new>)
}

export default Add

const S = {
  new: styled.div`
    
  `
}