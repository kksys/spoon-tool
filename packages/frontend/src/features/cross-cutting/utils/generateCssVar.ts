export function generateCssVar(): string {
  const alphabet = 'abcdefghijklmnopqrstuvwxyzABCDEFGHIJKLMNOPQRSTUVWXYZ'
  const number = '0123456789'

  const id = Array.from(new Array(10))
    .map((_, index) => {
      const array = index === 0
        ? alphabet
        : (Math.random() * 10) > 4
          ? number
          : alphabet

      return array.charAt(Math.floor(Math.random() * array.length))
    })
    .join('')

  return `--${id}`
}
