export default function CardCountryLoader({ width, height }: { width?: string; height?: string }) {
  return (
    <div className="flex items-center ">
      <div className="  flex-shrink-0">
        <div className={`pulse-loader  rounded-none ${width ? width : 'w-10'} ${height ? height : 'h-6'}`} />
      </div>
      <div className="ml-4 space-y-1">
        <div className="pulse-loader h-4 w-32" />
        <div className="pulse-loader h-4 w-32" />
      </div>
    </div>
  )
}
