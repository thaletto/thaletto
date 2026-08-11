import type { SVGProps } from 'react'

const Kotlin = (props: SVGProps<SVGSVGElement>) => (
  <svg {...props} viewBox="0 0 256 256" preserveAspectRatio="xMidYMid">
    <defs>
      <linearGradient x1="99.991%" y1="-.011%" x2=".01%" y2="100.01%" id="a">
        <stop stopColor="#E44857" offset=".344%" />
        <stop stopColor="#C711E1" offset="46.89%" />
        <stop stopColor="#7F52FF" offset="100%" />
      </linearGradient>
    </defs>
    <path fill="url(#a)" d="M256 256H0V0h256L128 127.949z" />
  </svg>
)

export { Kotlin }
