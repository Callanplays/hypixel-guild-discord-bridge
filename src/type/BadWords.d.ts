export default class BadWords {
  constructor(options?: BadWordsOptions)

  clean: (text: string) => string
  removeWords: (...args: string[]) => void
}

export interface BadWordsOptions {
  emptyList?: boolean
  list?: string[]
  placeHolder?: string
  regex?: string
  replaceRegex?: string
}
