interface SpinnerProps {
  className?: string
  height?: string
  width?: string
}

import React from 'react'
import * as Progress from '@radix-ui/react-progress'

export default function ProgressBar() {
  const [progress, setProgress] = React.useState(13)

  React.useEffect(() => {
    const timer = setTimeout(() => setProgress(66), 500)
    setTimeout(() => setProgress(77), 1000)
    setTimeout(() => setProgress(90), 2000)
    setTimeout(() => setProgress(95), 4000)
    return () => clearTimeout(timer)
  }, [])

  return (
    <Progress.Root className="relative h-[10px] w-[300px] overflow-hidden rounded-full border  bg-white" style={{ transform: 'translateZ(0)' }} value={progress}>
      <Progress.Indicator className="ease-[cubic-bezier(0.65, 0, 0.35, 1)] h-full w-full   bg-gray-300 transition-transform duration-[660ms]" style={{ transform: `translateX(-${100 - progress}%)` }} />
    </Progress.Root>
  )
}
