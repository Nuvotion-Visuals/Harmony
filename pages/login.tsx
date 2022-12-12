// packages
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'

// components
import { TextInput, Button, Gap, Auth, StyleHTML } from '@avsync.live/formation'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

interface Values {
  sessionToken: string,
  clearanceToken: string
}

interface Props {

}

const Preview = ({  } : Props) => {
  const [disabled, setDisabled] = useState(false)

  const formik = useFormik({
    initialValues: {
      sessionToken: '',
      clearanceToken: ''
    },
    validationSchema: Yup.object().shape({
      sessionToken: Yup.string()
        .required('Required') ,
      clearanceToken: Yup.string()
        .required('Required')
    }),
    onSubmit: values => {
      submit(values)
    }
  })

  const submit = (values : Values) => {
    formik.setFieldTouched('sessionToken');
    formik.setFieldTouched('clearanceToken');
    setDisabled(true);
    (async () => {
      try {
        const loginRes = await axios({
          method: 'POST',
          url: `/auth/login`,
          data: {
            sessionToken: values.sessionToken,
            clearanceToken: values.clearanceToken,
            userAgent: window.navigator.userAgent
          }
        })
        const { status, msg } = loginRes.data

        if (status === 'success') {
          window.location.replace(`/`)
          return;
        }
        else {
          formik.setErrors({
            sessionToken: 'Verify your session token and try again',
            clearanceToken: 'Verify your clearance token and try again'
          })
        }
      }
      catch(e) {
        setDisabled(false)
      }
    })()
  }

  useEffect(() => {
    setDisabled(false)
  }, [formik.errors])

  return (<Auth title='Log in to Lexichat' logoSrc='/assets/lexi-favicon.svg'>
    <form 
      onSubmit={formik.handleSubmit}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          submit(formik.values)
        }
      }}
    >
      <StyleHTML>
          Lexi is an AI co-worker who can help with artistic and technical projects.

          <br />
          <br />
          <S.Help>

          <details>
            <summary>Where can I find the login information?</summary>
              <ol>
                <li>Go to <a href='https://chat.openai.com/chat' target='_blank'>https://chat.openai.com/chat</a> and log in or sign up</li>
                <li>Press F12 to open dev tools</li>
                <li>Go to Application &gt; Cookies</li>
                <li>Copy and paste the values for <i>__Secure-next-auth.session-token</i> and <i>cf_clearance</i></li>
              </ol>
          </details>

        </S.Help>
        </StyleHTML>
      <Gap gap={1}>
        
        <TextInput
          autoFocus={true}
          name='sessionToken'
          label='Session token'
          error={formik.touched.sessionToken && formik.errors.sessionToken ? formik.errors.sessionToken : ''}
          value={formik.values.sessionToken}
          iconPrefix='fal'
          onChangeEvent={e => formik.handleChange(e)}
        />
        <TextInput
          name='clearanceToken'
          label='Clearance token'
          error={formik.touched.clearanceToken && formik.errors.clearanceToken ? formik.errors.clearanceToken : ''}
          value={formik.values.clearanceToken}
          iconPrefix='fal'
          onChangeEvent={e => formik.handleChange(e)}
        />
        
        <Button
          text={'Login'}
          icon={'unlock'}
          expand={true}
          primary={true}
          disabled={disabled}
        />
      </Gap>
    </form>
  </Auth>)
}
export default Preview

const S = {
  Message: styled.p`
    font-size: var(--F_Font_Size);
    width: 100%;
  `,
  Help: styled.div`
  * {
    font-size: var(--F_Font_Size_Label);
    color: var(--F_Font_Color_Disabled);
  }
    
    width: 100%;
  `
}
