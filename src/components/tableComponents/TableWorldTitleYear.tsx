import { TourWorldTitle } from "@/utils/interfaces";

export default function TableWorldTitleYear({ item }: { item: TourWorldTitle }) {
  return (
    <div>
          <div className="lg:text-base">{item.year}</div>
          {item.year >= 2015 && (
            <div>
              <div className="hidden text-xs text-gray-500 sm:block">WSL CHAMPIONSHIP TOUR</div>
              <div className="block text-xs text-gray-500 sm:hidden">WSL</div>
            </div>
          )}
          {item.year <= 2014 && item.year >= 1983 && (
            <div>
              <div className="hidden text-xs text-gray-500 sm:block">ASP WORLD TOUR</div>
              <div className="block text-xs text-gray-500 sm:hidden">ASP</div>
            </div>
          )}
          {item.year <= 1982 && (
            <div>
              <div className="hidden text-xs text-gray-500 sm:block">IPS WOLRD CIRCUIT</div>
              <div className="block text-xs text-gray-500 sm:hidden">IPS</div>
            </div>
          )}
        </div>
  )
}
