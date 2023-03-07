export default function TableLink({ className, label, canceled, nolinkParam }: { className?: string; label: string; canceled?: boolean; nolinkParam?: boolean }) {
  return (
    <div className={className}>
      {canceled && <div className="text-gray-500">Canceled</div>}
      {!canceled && <div className={`${nolinkParam ? 'text-gray-300' : 'text-blue-base'}`}>{label}</div>}
    </div>
  )
}
