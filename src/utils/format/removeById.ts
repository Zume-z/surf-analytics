export function removeById(arr: any[], id: any) {
  const objWithIdIndex = arr.findIndex((obj: { id: any }) => obj.id === id)

  if (objWithIdIndex > -1) {
    arr.splice(objWithIdIndex, 1)
  }

  return arr
}

