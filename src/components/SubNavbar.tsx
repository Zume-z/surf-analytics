import { useRouter } from 'next/router'

interface subNavItem {
  label: string
  active: boolean
  router?: any
}

export default function SubNavbar({ items, className }: { items: subNavItem[]; className?: string }) {
  const router = useRouter()
  return (
    <div className={`items-center space-x-6 rounded border-b text-white  ${className}`}>
      {items.map((item: any, index: number) => (
        <button key={index} onClick={() => item.router && router.push(item.router)} className={`active:scale-[0.98] transition-200 ${item.active ? 'text-navy border-b border-navy py-2' : 'text-gray-500 hover-mod:hover:text-gray-700'}`}>
          {item.label}
        </button>
      ))}
    </div>
  )
}
