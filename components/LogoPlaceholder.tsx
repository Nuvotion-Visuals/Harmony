import styled from 'styled-components'

const Placeholders = () => {
  return (
    <S.Placeholders>
      <S.Gradient />
      <S.Logo src='/assets/lexi-circle.png' />
    </S.Placeholders>
  )
}

export default Placeholders

const S = {
  Placeholders: styled.div`
    display: flex;
    flex-wrap: wrap;
    position: relative;
    justify-content: center;
    width: calc(100% - 4rem);
    padding: 2rem;
    gap: 1rem;
    overflow: hidden;
  `,
  Gradient: styled.div`
    position: absolute;
    width: 100%;
    top: 0;
    left: 1px;
    height: 100%;
    width: 100%;
    background: var(--F_Gradient_To_Background);
    z-index: 1;
  `,
  Logo: styled.img`
    width: 160px;
    height: auto;
  `
}
