/**
 * Original Utilities
 * written by kazuya kawaguchi
 */
/* eslint-disable vue/prefer-import-from-vue */
export * from '@vue/shared'
export { extend as assign } from '@vue/shared'
import { isObject, isPlainObject, hasOwn as vueHasOwn } from '@vue/shared'
export const inBrowser: boolean = typeof window !== 'undefined'

// wrap utility to prevent narrowing key to never
export const hasOwn = (val: object, key: string | symbol): boolean => vueHasOwn(val, key)

export let mark: (tag: string) => void | undefined
export let measure: (name: string, startTag: string, endTag: string) => void | undefined

if (__DEV__) {
  const perf = inBrowser && window.performance

  if (
    perf &&
    perf.mark &&
    perf.measure &&
    perf.clearMarks &&
    // @ts-ignore browser compat
    perf.clearMeasures
  ) {
    mark = (tag: string): void => {
      perf.mark(tag)
    }
    measure = (name: string, startTag: string, endTag: string): void => {
      perf.measure(name, startTag, endTag)
      perf.clearMarks(startTag)
      perf.clearMarks(endTag)
    }
  }
}

const RE_ARGS = /\{([0-9a-zA-Z]+)\}/g

// eslint-disable-next-line @typescript-eslint/no-explicit-any
export function format(message: string, ...args: any): string {
  if (args.length === 1 && isObject(args[0])) {
    args = args[0]
  }
  if (!args || !args.hasOwnProperty) {
    args = {}
  }
  return message.replace(RE_ARGS, (match: string, identifier: string): string => {
    return hasOwn(args, identifier) ? args[identifier] : ''
  })
}

export const makeSymbol = (name: string, shareable = false): symbol =>
  !shareable ? Symbol(name) : Symbol.for(name)

export const generateFormatCacheKey = (locale: string, key: string, source: string): string =>
  friendlyJSONstringify({ l: locale, k: key, s: source })

export const friendlyJSONstringify = (json: unknown): string =>
  JSON.stringify(json)
    .replace(/\u2028/g, '\\u2028')
    .replace(/\u2029/g, '\\u2029')
    .replace(/\u0027/g, '\\u0027')

export const isNumber = (val: unknown): val is number => typeof val === 'number' && isFinite(val)

export const isEmptyObject = (val: unknown): val is boolean =>
  isPlainObject(val) && Object.keys(val).length === 0

const _create = Object.create
export const create = (obj: object | null = null): object => _create(obj)

export const isBoolean = (val: unknown): val is boolean => typeof val === 'boolean'

export function join(items: string[], separator = ''): string {
  return items.reduce((str, item, index) => (index === 0 ? str + item : str + separator + item), '')
}
