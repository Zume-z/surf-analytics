import { RouterType } from '@/utils/interfaces'
import { useRouter } from 'next/router'

interface subHeaderSurferProps {
  label?: string
  value: any
  subvalue?: string
  active?: boolean
  routePath?: RouterType
  loading?: boolean
  className?: string
  noBorder?: boolean
}

export default function SubHeaderItem({ label, value, subvalue, active, routePath, loading, className, noBorder }: subHeaderSurferProps) {
  const router = useRouter()
  if (!label || !value || loading)
    return (
      <div className="px-2 sm:space-y-1 py-2 sm:px-4">
        <div className="pulse-loader hidden h-4 w-24 sm:block"></div>
        <div className="pulse-loader h-5 w-16 sm:h-4 sm:w-24"></div>
      </div>
    )
  return (
    <div className={`flex ${className}`}>
      <div>
        {/* Desktop */}
        <div onClick={() => routePath && router.replace(routePath)} className="group hidden px-4 sm:block active:scale-[0.99]">
          <div className={`transition-200 text-xs ${active ? 'font-semibold text-blue-base' : 'text-gray-500 hover-mod:group-hover:font-semibold hover-mod:group-hover:text-blue-base'}`}>{label.toUpperCase()}</div>
          <div className="text-base  ">{value}</div>
        </div>
        {/* Mobile */}
        <div onClick={() => routePath && router.replace(routePath)} className="group block px-2 sm:hidden ">
          <div className="flex items-center text-sm  ">
            <div className={`${active ? `${!noBorder && 'border-b border-black'} text-navy` : 'text-gray-dark'} py-2`}>{subvalue ? subvalue : value}</div>
          </div>
        </div>
      </div>
    </div>
  )
}
