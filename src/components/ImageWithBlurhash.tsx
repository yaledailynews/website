'use client'

import { ImgHTMLAttributes, PropsWithChildren } from 'react'
import { Blurhash } from 'react-blurhash'

import React, { useState, useEffect, useRef } from 'react'

export function ImageWithBlurhash({
  src,
  blurhash,
  w,
  h,
  alt,
  ...props
}: {
  src: string
  alt: string
  blurhash: string
  w: number
  h: number
} & Partial<ImgHTMLAttributes<HTMLImageElement>>) {
  const [isLoaded, setIsLoaded] = useState(false)
  const imageRef = useRef(null)

  useEffect(() => {
    const img = new Image()
    img.src = src
    img.onload = () => setIsLoaded(true)
  }, [src])

  const aspectRatio = w / h

  return (
    <div className="w-full max-w-full relative overflow-hidden bg-gray-200" style={{ aspectRatio }}>
      {!isLoaded && (
        <Blurhash
          hash={blurhash}
          width={w}
          height="100%"
          resolutionX={32}
          resolutionY={32}
          punch={1}
        />
      )}
      {/* eslint-disable-next-line @next/next/no-img-element */}
      <img
        ref={imageRef}
        src={src}
        alt={alt}
        width={w}
        height={h}
        className="w-full h-full"
        style={{
          opacity: isLoaded ? 1 : 0,
          transition: 'opacity 0.3s ease',
        }}
        onLoad={() => setIsLoaded(true)}
        {...props}
      />
    </div>
  )
}
