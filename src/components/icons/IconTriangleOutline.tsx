export type TriangleProps = {
  className?: string
}

export default function TriangleOutline({ className }: TriangleProps) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 15 11">
      <path stroke="currentColor" d="M.968 9.95h13.064L7.5 1.55.968 9.95Z" />
    </svg>
  )
}
