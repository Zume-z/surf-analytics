export const toString = (value?: string | number) => (value ? (typeof value === 'string' ? value : value.toString()) : undefined)
