export default function CardSurferLoader() {
  return (
    <div>
      <div className="flex items-center whitespace-nowrap text-sm">
        <div className=" h-12 w-12 flex-shrink-0">
          <div className="transition-200 pulse-loader h-12 w-12 rounded-full border border-gray-200 bg-gray-100 hover-mod:group-hover:bg-white" />
        </div>
        <div className="ml-2 space-y-1">
          <div className="pulse-loader h-4 w-24"></div>
          <div className="pulse-loader h-4 w-24"></div>
        </div>
      </div>
    </div>
  )
}
