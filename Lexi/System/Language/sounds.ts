type SoundName = 'wake' | 'listen' | 'stop-listening' | 'ask' | 'error' | 'send'

/**
 * Plays an audio file with the specified name from the `/assets/audio/ui` directory.
 *
 * @remarks
 * This method is part of the UI subsystem.
 *
 * @param {SoundName} name - The name of the audio file to play. Must be one of `'wake'`, `'listen'`, `'stop listen'`, `'ask'`, `'error'`, or `'send'`.
 * @returns void
 */
export const playSound = (name: SoundName) => {
  const audio = new Audio(`/assets/audio/ui/${name}.wav`)
  audio.play()
}