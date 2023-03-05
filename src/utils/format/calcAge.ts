const arrayMove = (arr: any, old_index: number, new_index: number) => {
  if (new_index >= arr.length) {
    var k = new_index - arr.length + 1
    while (k--) {
      arr.push(undefined)
    }
  }
  arr.splice(new_index, 0, arr.splice(old_index, 1)[0])
  return arr
}

export const calcAge = (dob: any) => {
  const dobDate = new Date(dob)
  const diff_ms = Date.now() - dobDate.getTime()
  const age_dt = new Date(diff_ms)
  return Math.abs(age_dt.getUTCFullYear() - 1970)
}

export const dobFormat = (dob: string) => {
  return dob.split('-').reverse().join('-')
}


export const getAgeDob = (dob: string) => {
  const newDob = dobFormat(dob)
  const dobDate = new Date(newDob).toLocaleDateString('en-us', { year: 'numeric', month: 'short', day: 'numeric' })
  const age = calcAge(newDob)
  return { age: age, dob: dobDate }
}
