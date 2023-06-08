// packages
import { useFormik } from 'formik'
import * as Yup from 'yup'
import axios from 'axios'

// components
import { TextInput, Button, Gap, Auth, StyleHTML, Box } from '@avsync.live/formation'
import { useEffect, useState } from 'react'
import styled from 'styled-components'

interface Values {
  email: string,
  password: string
}

interface Props {

}

const Preview = ({  } : Props) => {
  const [disabled, setDisabled] = useState(false)

  const formik = useFormik({
    initialValues: {
      email: '',
      password: ''
    },
    validationSchema: Yup.object().shape({
      email: Yup.string()
        .required('Required') ,
      password: Yup.string()
        .required('Required')
    }),
    onSubmit: values => {
      submit(values)
    }
  })

  const submit = (values : Values) => {
    formik.setFieldTouched('email');
    formik.setFieldTouched('password');
    setDisabled(true);
    (async () => {
      try {
        const loginRes = await axios({
          method: 'POST',
          url: `/auth/login`,
          data: {
            email: values.email,
            password: values.password,
            userAgent: window.navigator.userAgent
          }
        })
        const { status, message } = loginRes.data

        if (status === 200) {
          window.location.replace(`/`)
          return;
        }
        else {
          console.log(status, message)
          formik.setErrors({
            email: 'Your login failed, check your credentials.',
            password: 'Alternatively, there may be an error trying to connect to the OpenAI API.'
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

  return (<Auth title='Welcome to Harmony' logoSrc='/harmony-circle.svg'>
    <form 
      onSubmit={formik.handleSubmit}
      onKeyDown={e => {
        if (e.key === 'Enter') {
          submit(formik.values)
        }
      }}
      style={{textAlign: 'center'}}
    >
      <StyleHTML>
        
        <S.Help>Hi, I'm Harmony, a creative AGI ready to help you with any artistic or technical project.</S.Help>
        </StyleHTML>
      <Gap gap={1}>
        
        <TextInput
          autoFocus={true}
          name='email'
          type='email'
          label='Email'
          error={formik.touched.email && formik.errors.email ? formik.errors.email : ''}
          value={formik.values.email}
          iconPrefix='fal'
          onChangeEvent={e => formik.handleChange(e)}
        />
        <TextInput
          name='password'
          type='password'
          label='Password'
          error={formik.touched.password && formik.errors.password ? formik.errors.password : ''}
          value={formik.values.password}
          iconPrefix='fal'
          onChangeEvent={e => formik.handleChange(e)}
        />
        
        <Button
          text={disabled ? 'Logging in...' : 'Login'}
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
    font-size: var(--F_Font_Size_Label);
    font-family: Poppins;
    width: 100%;
  `
}
