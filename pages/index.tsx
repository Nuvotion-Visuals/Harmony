import { AspectRatio, Box, Button, Gap } from "@avsync.live/formation"
import { useRouter } from "next/router"
import { useEffect } from "react"
import { useSpaces_spaceGuids } from "redux-tk/spaces/hook"

const Home = () => {
  const spaceGuids = useSpaces_spaceGuids()
  const router = useRouter()
  useEffect(() => {
    if (spaceGuids.length) {
      router.push(`/spaces/${spaceGuids[0]}`)
    }
  }, [spaceGuids])

  return (
    <Box wrap={true}>
     
    </Box>
  )
}

export default Home