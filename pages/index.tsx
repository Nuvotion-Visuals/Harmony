import { AspectRatio, Box, Button, Gap } from "@avsync.live/formation"

const Home = () => {
  return (
    <Box wrap={true}>
      {/* <AspectRatio
        ratio={21/9}
        backgroundSrc='/assets/lexi-banner-2.gif'
        coverBackground={true}
      /> */}
      <Box py={.75} width='100%' wrap={true}>
        <Gap>
          <Button
            text='How are AGI systems superior to AI chatbots?'
            hero={true}
            expand={true}
            secondary={true}
          />
          <Button
            text='What can you help me with?'
            hero={true}
            expand={true}
            secondary={true}
          />
          <Button
            text='Hi, Lexi'
            hero={true}
            secondary={true}
            expand={true}
          />
        </Gap>
        
      </Box>
    </Box>
  )
}

export default Home