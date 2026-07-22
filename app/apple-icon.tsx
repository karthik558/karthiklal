import { ImageResponse } from 'next/og'

export const runtime = 'edge'

export const size = {
  width: 180,
  height: 180,
}
export const contentType = 'image/png'

export default function Icon() {
  return new ImageResponse(
    (
      <div
        style={{
          background: '#09090b',
          width: '100%',
          height: '100%',
          display: 'flex',
          alignItems: 'center',
          justifyContent: 'center',
        }}
      >
        <svg
          width="160"
          height="160"
          viewBox="0 0 100 100"
          fill="none"
          xmlns="http://www.w3.org/2000/svg"
        >
          {/* Cursive K Calligraphic Logo Mark */}
          <path
            d="M30,16 C34,10 42,12 36,26 C30,44 24,64 22,82 C21,87 25,87 30,84 C36,78 40,70 43,62 C48,46 58,26 76,18 C82,15 82,24 70,36 C58,48 48,56 43,62 C50,66 64,76 80,78 C86,79 82,85 74,85 C60,84 48,74 40,64 C35,74 29,81 22,82 C18,83 16,78 18,68 C22,48 26,28 30,16 Z"
            fill="#FFFFFF"
          />
        </svg>
      </div>
    ),
    {
      ...size,
    }
  )
}
