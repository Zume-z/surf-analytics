export type TriangleProps = {
  className?: string
}

export default function TriangleFill({ className }: TriangleProps) {
  return (
    <svg className={className} xmlns="http://www.w3.org/2000/svg" fill="none" viewBox="0 0 15 11">
      <path fill="currentColor" d="M0 10.572h15L7.5.929 0 10.572Z" />
    </svg>
  )
}
