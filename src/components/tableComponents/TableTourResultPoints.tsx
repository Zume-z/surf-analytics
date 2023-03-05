import { TourResult } from '@/utils/interfaces'

export default function TableTourResultPoints({ tourResult }: { tourResult: TourResult }) {
  return (
    <div className="table-item">
      {tourResult.tour.canceled && <div className="text-gray-500">-</div>}
      {!tourResult.tour.canceled && <div className="table-item">{tourResult.surferPoints.toLocaleString('en-US')}</div>}
    </div>
  )
}
