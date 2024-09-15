import { createCoreContext, translate } from '@intlify/core-base'
import { changeDeepCopy } from '@intlify/shared'
import { createCommonJS } from 'mlly'
import { dirname, resolve } from 'path'
import { createI18n } from 'vue-i18n'
import { displayMemoryUsage, readJson } from './utils.mjs'

const { require } = createCommonJS(import.meta.url)
const { Suite } = require('benchmark')

async function main() {
  const resources = await readJson(
    resolve(dirname('.'), './benchmark/complex-nested.json')
  )
  const resources2 = await readJson(
    resolve(dirname('.'), './benchmark/complex.json')
  )
  const len = Object.keys(resources).length
  changeDeepCopy(process.env.__LEGACY_DEEP_COPY__ === '1')
  console.log('deepcopy legacy mode', process.env.__LEGACY_DEEP_COPY__ === '1')

  console.log(`complex-nested pattern on ${len} resources (AOT):`)
  console.log()

  const ctx = createCoreContext({
    locale: 'en',
    modifiers: {
      caml: val => val
    },
    messages: {
      en: resources
    }
  })

  // const i18n = createI18n({
  //   legacy: false,
  //   locale: 'en',
  //   modifiers: {
  //     caml: val => val
  //   },
  //   messages: {
  //     en: resources
  //   }
  // })

  new Suite('complex pattern')
    .add('creation and merging', () => {
      const i18n = createI18n({
        legacy: false,
        locale: 'en',
        modifiers: {
          caml: val => val
        },
        messages: {
          en: resources2
        }
      })
      i18n.global.mergeLocaleMessage('en', resources)
      translate(ctx, 'keyn_887.nested_key_1.nested_key_0.nested_key_2')
    })
    // .add(`resolve time with core`, () => {
    //   translate(ctx, 'keyn_887.nested_key_1.nested_key_0.nested_key_2')
    // })
    // .add(`resolve time on composition`, () => {
    //   clearCompileCache()
    //   i18n.global.t('keyn_887.nested_key_1.nested_key_0.nested_key_2')
    // })
    // .add(`resolve time on composition with compile cache`, () => {
    //   i18n.global.t('keyn_887.nested_key_1.nested_key_0.nested_key_2')
    // })
    .on('error', event => {
      console.log(String(event.target))
    })
    .on('cycle', event => {
      console.log(String(event.target))
    })
    .run()

  displayMemoryUsage()
}

main().catch(err => {
  console.error(err)
  process.exit(1)
})
