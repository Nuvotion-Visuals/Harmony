import { Button } from '@avsync.live/formation';
import React, { useState, useEffect } from 'react';
import { imageToPrompt } from '../../Lexi/System/Vision/imageToPrompt';

function ImageUploader() {


  return (
    <>
        <Button
            text='Click'
            onClick={() => {
                (async () => {
                   const res = await imageToPrompt('https://replicate.delivery/pbxt/f4nlztv3uz1iFC4AEf2wBYQGTezdVeysvtZUtwfsvZOJDN6AC/out-0.png')
                    console.log(res)
                })()
            }}
        />
    </>
  );
}

export default ImageUploader