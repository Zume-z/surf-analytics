import { EventResult } from '@/utils/interfaces'
import { ordinalSuffix } from '@/utils/format/ordinalSuffix'

export default function TableLink({ className, label, canceled }: { className?: string, label: string; canceled?: boolean }) {
  return (
    <div className={className}>
      {canceled && <div className="text-gray-500">Canceled</div>}
      {!canceled && <div className="text-blue-base">{label}</div>}
    </div>
  )
}
