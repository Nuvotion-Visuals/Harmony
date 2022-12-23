type SoundName = 'wake' | 'listen' | 'stop listen' | 'ask' | 'error' | 'send'

export const playSound = (name: SoundName) => {
  const audio = new Audio(`/assets/audio/ui/${name}.wav`)
  audio.play()
}