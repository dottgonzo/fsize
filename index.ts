import * as Promise from "bluebird"

const getFolderSize = require("get-folder-size")
const diskfree = require('diskfree');

export interface ISizeInfo {
  available: number
  free: number
  total: number
  used: number
  locked: number
  size: number
  percentUsed: number
}

export function getSizeInfo(path: string): Promise<ISizeInfo> {

  return new Promise<ISizeInfo>((resolve, reject) => {

    getFolderSize(path, (err, size) => {
      if (err) return reject(err)

      diskfree.check(path, (error, info: ISizeInfo) => {
        if (error) {
          // You can see if its a known error 
          if (diskfree.isErrBadPath(err)) {
            reject(new Error('Path is Wrong'));
          } else if (diskfree.isErrDenied(error)) {
            reject(new Error('Permission Denied'))
          } else if (diskfree.isErrIO(error)) {
            reject(new Error('IO Error'))
          } else {
            reject(new Error('Unknown error: ' + error))
          }

        } else {
          info.size = size
          info.percentUsed = parseInt(((info.available * 100) / info.total).toFixed(1))
          resolve(info)
        }

      });



    })


  })

}