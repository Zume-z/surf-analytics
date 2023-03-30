export default function FilterBar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center ${className ? className : ''}`}>
      <div className="relative">
        <div className="text-small flex items-center justify-center divide-gray-300   rounded-md  border bg-gray-50 shadow  sm:text-base">{children}</div>
      </div>
    </div>
  )
}

