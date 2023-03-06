import type { Heat } from '@/utils/interfaces'

export default function CardHeat({ heat, className }: { heat: Heat; className?: string }) {
  return (
    <div className={className}>
      <div className="text-gray-900">{heat.heatRound}</div>
      <div className="text-gray-500">Heat {heat.heatNumber}</div>
    </div>
  )
}
