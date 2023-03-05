import { TourResult } from '@/utils/interfaces'
import { ordinalSuffix } from '@/utils/format/ordinalSuffix'

export default function TableTourResultRank({ tourResult }: { tourResult: TourResult }) {
  return (
    <div className="table-item">
      {tourResult.tour.canceled && <div className="text-gray-500">-</div>}
      {!tourResult.tour.canceled && <div className="table-item">{ordinalSuffix(tourResult.surferRank)}</div>}
    </div>
  )
}


