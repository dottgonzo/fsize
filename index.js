"use strict";
Object.defineProperty(exports, "__esModule", { value: true });
const Promise = require("bluebird");
const getFolderSize = require("get-folder-size");
const diskfree = require('diskfree');
function getSizeInfo(path) {
    return new Promise((resolve, reject) => {
        getFolderSize(path, (err, size) => {
            if (err)
                return reject(err);
            diskfree.check(path, (error, info) => {
                if (error) {
                    if (diskfree.isErrBadPath(err)) {
                        reject(new Error('Path is Wrong'));
                    }
                    else if (diskfree.isErrDenied(error)) {
                        reject(new Error('Permission Denied'));
                    }
                    else if (diskfree.isErrIO(error)) {
                        reject(new Error('IO Error'));
                    }
                    else {
                        reject(new Error('Unknown error: ' + error));
                    }
                }
                else {
                    info.size = size;
                    info.percentUsed = 100 - parseInt(((info.available * 100) / info.total).toFixed(1));
                    resolve(info);
                }
            });
        });
    });
}
exports.getSizeInfo = getSizeInfo;
