module.exports = function (DB, funcName, args) {
  let promise
  switch(funcName) {
    case 'readMetafile':
      promise = new Promise((resolve, reject) => {
        DB.readMetafile((err, records) => {
          if (err) {
            reject(err)
          } else {
            resolve(records)
          }
        })
      })
      break
    case 'appendMetafile':
      promise = new Promise((resolve, reject) => {
        DB.appendMetafile(args[0], (err) => {
          if (err) {
            reject(err)
          } else {
            resolve(err)
          }
        })
      })
      break
    case 'updateMetafile':
      promise = new Promise((resolve, reject) => {
        DB.updateMetafile(args[0], args[1], (err) => {
          if (err) {
            reject(err)
          } else {
            resolve(err)
          }
        })
      })
      break
    case 'readFile':
      promise = new Promise((resolve, reject) => {
        DB.readFile(args[0], (err, data) => {
          if (err) {
            reject(err)
          } else {
            resolve(data)
          }
        })
      })
      break
    case 'writeTempfile':
      promise = new Promise((resolve, reject) => {
        DB.writeTempfile(args[0], args[1], (err) => {
          if (err) {
            reject(err)
          } else {
            resolve(err)
          }
        })
      })
      break
    case 'saveFile':
      promise = new Promise((resolve, reject) => {
        DB.saveFile(args[0], (err) => {
          if (err) {
            reject(err)
          } else {
            resolve(err)
          }
        })
      })
      break
    case 'finalizeFile':
      promise = new Promise((resolve, reject) => {
        DB.finalizeFile(args[0], (err) => {
          if (err) {
            reject(err)
          } else {
            resolve(err)
          }
        })
      })
      break
    case 'deleteFileEntry':
      promise = new Promise((resolve, reject) => {
        DB.deleteFileEntry(args[0], (err) => {
          if (err) {
            reject(err)
          } else {
            resolve(err)
          }
        })
      })
      break
    case 'searchByWord':
      promise = new Promise((resolve, reject) => {
        
      })
      break
    default:
      promise = new Promise((resolve, reject) => {
        resolve("Function not supported.")
      })
      break
  }
  return promise
}