import { spawn } from 'child_process'

function run(pattner, mode) {
  return new Promise((resolve, reject) => {
    const child = spawn('node', [`./benchmark/${pattner}.mjs`], {
      stdio: 'inherit',
      env: {
        ...process.env,
        __LEGACY_DEEP_COPY__: String(mode)
      }
    })

    child.once('error', err => {
      reject(err)
    })

    child.once('exit', code => {
      if (code !== 0) {
        reject(new Error(`exit with code ${code}`))
      } else {
        resolve()
      }
    })
  })
}

;(async () => {
  try {
    for (const p of [
      // 'compile',
      // 'simple',
      // 'simple-jit',
      // 'simple-jit-aot',
      // 'complex',
      'complex-nested',
      'complex-nested-jit'
      // 'complex-jit',
      // 'complex-jit-aot'
    ]) {
      await run(p, 0)
      console.log()
      await run(p, 1)
      console.log()
    }
  } catch (e) {
    console.error(e)
  }
})()
