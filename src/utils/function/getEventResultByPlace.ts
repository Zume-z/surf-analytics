import { EventResult } from "../interfaces"

export const filterERByPlace = (eventResults: EventResult[], place: number) => {
  return eventResults.filter((eventResult: any) => eventResult.place == place)
}
export const findERByPlace = (eventResults: EventResult[], place: number) => {
  return eventResults.find((eventResult: any) => eventResult.place == place)
}