
type Enumerate<Max extends number, IncrementalNumbers extends number[] = []> =
  IncrementalNumbers['length'] extends Max
    ? IncrementalNumbers[number]
    : Enumerate<Max, [...IncrementalNumbers, IncrementalNumbers['length']]>

export type IntRange<Min extends number, Max extends number> = Exclude<Enumerate<Max>, Enumerate<Min>> | Max
