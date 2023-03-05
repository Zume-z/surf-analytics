export default function FilterBar({ children, className }: { children: React.ReactNode; className?: string }) {
  return (
    <div className={`flex items-center ${className}`}>
      {/* py-2 */}
      <div className="flex items-center justify-center divide-x divide-gray-300 border   rounded-md bg-gray-50 text-small shadow sm:text-base">{children}</div>
    </div>
  )
}
