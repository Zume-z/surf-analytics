export default function ButtonSelectLoader({ text }: { text: string }) {
  return (
    <div className='px-2 sm:px-4'>
      <div className="flex animate-pulse items-center rounded border border-gray-200 bg-gray-md py-0.5 px-2 text-white ">
        <div>{text}</div>
      </div>
    </div>
  )
}
