const fs = require("fs")
//  var path = require("path")
const config = require('./config.js')
// [uint32 status][uint32 record length][uint32 void][uint32 void][uint32 start][binary data...]
const META_LENGTH = 20 // unit: bytes

export class DB {
    constructor() {
        this.metapath = config.metadir + config.metaname
    }

    //
    // metafile stores file name and tags of all individual files
    // @param callback(err, records: array) return valid records
    //
    readmetafile (callback) {
        let pathname = this.metapath
        let option = {encoding: 'binary', flag: 'r'}
        fs.readFile(pathname, option, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                let read_buf = Buffer.from(data)
                let len = read_buf.length
                let records = []
                let pointer = 0
                while (pointer < len) {
                    let status = read_buf.readUInt32LE(pointer)
                    let record_len = read_buf.readUInt32LE(pointer + 4)
                    if (status !== 0) {
                        // case when record is valid
                        // data pointer points to start position of data
                        let data_pointer = pointer + META_LENGTH
                        // a record includes its position and data
                        let record = read_buf.toString('utf-8', data_pointer - 4, record_len + 4)
                        records.push(record)
                    }
                    pointer = pointer + META_LENGTH + record_len
                }
                callback(null, records)
            }
        })
    }

    //
    // Append new record to metafile
    // @param record New record to be appended
    // @param callback(err) If there is err, return err. Otherwise, return null
    //
    appendmetafile (record, callback)  {
        let record_buf = Buffer.from(record)
        // obtain total file size
        fs.stat(this.metapath, (err, stats) => {
            let filesize = 0
            // if file does not exist, filesize remains 0
            // otherwise, assign to actual file size
            if (!err && stats) {
                filesize = stats.size
            }
            let meta_buf = Buffer.allocUnsafe(META_LENGTH)
            meta_buf.writeUInt32LE(1)
            meta_buf.writeUInt32LE(record_buf.length)
            meta_buf.writeUInt32LE(0)
            meta_buf.writeUInt32LE(0)
            meta_buf.writeUInt32LE(filesize)
            let totallen = meta_buf.length + record_buf.length
            let w_buf = Buffer.concat([meta_buf, record_buf], totallen)
            let pathname = this.pathname
            let option = {encoding: 'binary', flag: 'a'}
            fs.appendFile(pathname, w_buf, option, (err) => {
                if (err) {
                    callback(err)
                } else {
                    callback(null)
                }
            })
        })
    }

    //
    // Modify existing record in metafile. First append new record, then mark
    // old record as invalid.
    // @param old_position Position of old entry
    // @param entry New entry to be appended
    // @param callback(err) If there is err, return err. Otherwise, return null
    //
    updatemetafile (old_position, entry, callback) {
        appendFile(entry, (err) => {
            if (err) {
                callback(err)
            } else {
                let option = {encoding: 'binary', flags: 'r+', start: old_position}
                let buf = Buffer.allocUnsafe(4)
                buf.writeUInt32LE(0)
                let w_stream = fs.createWriteStream(this.metapath, option)
                w_stream.write(buf)
                w_stream.end()
                w_stream.on('finish', () => {
                    callback(null)
                })
                w_stream.on('error', (w_err) => {
                    callback(w_err)
                })
            }
        })
    }

    readfile (filename, callback) {

    }

    writefile (savename, callback) {

    }

    deletefile (filename, callback) {

    }

    searchbyword (word, callback) {

    }
}