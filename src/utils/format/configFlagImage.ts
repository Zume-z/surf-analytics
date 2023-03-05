export const configFlagImage = (flagImageLink: string, size: number) => {
  const y = size
  const x = size *1.5

  return flagImageLink.replace('x=60', `x=${x}`).replace('y=40', `y=${y}`)
}

// https://d3qf8nvav5av0u.cloudfront.net/image/b7368ede16a5208bc09caa54135cb94b.png?&x=60&y=40&cx=2&cy=12&cw=60&ch=40&icq=74&sig=943718b3fc3ac90f28322228abb8dfc3