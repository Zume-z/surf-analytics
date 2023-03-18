import { useRouter } from 'next/router'
import { ButtonBack } from '../ButtonBack'
import { ChevronLeftIcon } from '@heroicons/react/outline'

export default function SubHeaderButtonBack({ label, routePath }: ButtonBack) {
  const router = useRouter()

  return (
    <div className={`absolute  left-0 items-center pl-1  text-white sm:block`}>
      <button onClick={() => routePath && router.replace(routePath)} className="transition-200 flex items-center justify-start  py-2 text-gray-500 active:scale-[0.98] hover-mod:hover:text-gray-700 ">
        <ChevronLeftIcon className="mr-1 h-4 w-4" />
        <div className="text-sm">{label}</div>
      </button>
    </div>
  )
}
