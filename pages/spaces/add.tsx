import React from 'react'
import styled from 'styled-components'
import { AddSpace } from 'components/AddSpace'

interface Props {
  
}

const Add = ({ }: Props) => {
  return (<S.new>
    <AddSpace />
  </S.new>)
}

export default Add

const S = {
  new: styled.div`
    
  `
}