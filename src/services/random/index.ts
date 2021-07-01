// ? Event random distribution as Math.random can't be 1.
export const random = (min: number, max: number) => Math.floor(Math.random() * max + min + 1)
export const randomPick = <T>(array: T[]): T => array[random(0, array.length - 1)]