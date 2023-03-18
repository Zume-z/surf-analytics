import { useRouter } from 'next/router'
import { RouterType } from '@/utils/interfaces'
import { ChevronLeftIcon } from '@heroicons/react/outline'

export interface ButtonBack {
  label?: string
  routePath?: RouterType
  className?: string
}

export default function ButtonBack({ label, routePath, className }: ButtonBack) {
  const router = useRouter()
  return (
    <div className={`${className} border-b `}>
      <button onClick={() => routePath && router.replace(routePath)} className="transition-200 flex items-center justify-start  py-2 text-gray-500 active:scale-[0.98] hover-mod:hover:text-gray-700 ">
        <ChevronLeftIcon className="mr-1 h-5 w-5" />
        <div>{label}</div>
      </button>
    </div>
  )
}
