import { useRouter } from 'next/router'

interface subNavItem {
  label: string
  active: boolean
  router?: any
}

export default function SubNavbar({ items, className }: { items: subNavItem[]; className?: string }) {
  const router = useRouter()
  return (
    <div className={`items-center space-x-6 border-b   ${className}`}>
      {items.map((item: any, index: number) => (
        <button key={index} onClick={() => item.router && router.push(item.router)} className={`transition-200 active:scale-[0.98] ${item.active ? 'border-b border-navy py-2 text-navy' : 'text-gray-500 hover-mod:hover:text-gray-700'}`}>
          {item.label}
        </button>
      ))}
    </div>
  )
}
