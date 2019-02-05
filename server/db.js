const fs = require("fs")
//  var path = require("path")
const config = require('./config.js').config
// [uint32 status][uint32 record length][uint32 void][uint32 void][uint32 start][binary data...]
const META_LENGTH = 20 // unit: bytes

class DB {
    constructor(metapath, filedir) {
        this.metapath = config.metadir + config.metaname
        if (metapath) {
            this.metapath = metapath
        }
        // console.log(this.metapath) 
        this.encoding = config.encoding
        this.filedir = config.filedir
        if (filedir) {
            this.filedir = filedir
        }
    }

    //
    // metafile stores file name and tags of all individual files
    // @param callback(err, records: array) return valid records
    //
    readMetafile (callback) {
        let pathname = this.metapath
        let option = {encoding: this.encoding, flag: 'r'}
        fs.readFile(pathname, option, (err, data) => {
            if (err) {
                callback(err, null)
            } else {
                let read_buf = Buffer.from(data, this.encoding)
                let bound = read_buf.length - 1
                let records = []
                let pointer = 0
                while (pointer < bound) {
                    let status = read_buf.readUInt32LE(pointer)
                    let record_len = read_buf.readUInt32LE(pointer + 4)
                    if (status !== 0) {
                        // case when record is valid
                        // data pointer points to start position of data
                        let data_pointer = pointer + META_LENGTH
                        let end = data_pointer + record_len
                        // a record includes its position and data
                        let start_position = read_buf.readUInt32LE(data_pointer - 4)
                        let record = read_buf.toString(this.encoding, data_pointer, end)
                        records.push(start_position + ';' + record)
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
    appendMetafile (record, callback)  {
        let record_buf = Buffer.from(record, this.encoding)
        // obtain total file size
        fs.stat(this.metapath, (err, stats) => {
            let filesize = 0
            // if file does not exist, filesize remains 0
            // otherwise, assign to actual file size
            if (!err && stats) {
                filesize = stats.size
            }
            let meta_buf = Buffer.allocUnsafe(META_LENGTH)
            meta_buf.writeUInt32LE(1, 0)
            meta_buf.writeUInt32LE(record_buf.length, 4)
            meta_buf.writeUInt32LE(0, 8)
            meta_buf.writeUInt32LE(0, 12)
            meta_buf.writeUInt32LE(filesize, 16)
            // console.log('meta buffer: ', meta_buf)
            let totallen = meta_buf.length + record_buf.length
            let w_buf = Buffer.concat([meta_buf, record_buf], totallen)
            let option = {encoding: this.encoding, flag: 'a'}
            fs.appendFile(this.metapath, w_buf, option, (err) => {
                callback(err)
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
    updateMetafile (old_position, entry, callback) {
        this.appendMetafile(entry, (err) => {
            if (err) {
                callback(err)
            } else {
                this.deleteFileEntry(old_position, (err) => {
                    callback(err)
                })
            }
        })
    }

    //
    // read a normal file
    // @filename The name of target file
    // @param callback(err) If there is err, return err. Otherwise, return null
    //
    readFile (filepath, callback) {
        let option = {encoding: this.encoding, flag: 'r'}
        fs.readFile(filepath, option, (err, data) => {
            callback(err, data)
        })
    }

    // 
    // save data as temporary file
    // @param filepath The destination of final version
    // @param data The data to be written to temporary file
    // @param callback(err) If there is err, return err. Otherwise, return null
    //
    writeTempfile (filename, data, callback) {
        let option = {encoding: this.encoding, flag: 'w'}
        let tmp_filepath = this.filedir + '.' + filename
        fs.writeFile(tmp_filepath, data, option, (err) => {
            callback(err)
        })
    }

    //
    // copy tempfile and overwrite as final version
    // @param filename The file name of final version
    // @param callback(err) If there is err, return err. Otherwise, return null
    //
    saveFile (filename, callback) {
        let tmp_filepath = this.filedir + '.' + filename
        let filepath = this.filedir + filename
        fs.copyFile(tmp_filepath, filepath, fs.constants.COPYFILE_FICLONE, (err) => {
            callback(err)
        })
    }

    //
    // copy temporary file to final version, then delete temporary file
    // @param filename The file name of final version
    // @param callback(err) If there is err, return err. Otherwise, return null
    //
    finalizeFile (filename, callback) {
        this.saveFile(filename, (err) => {
            if (err) {
                callback(err)
            } else {
                let tmp_filepath = this.filedir + '.' + filename
                fs.unlink(tmp_filepath, (err) => {
                    callback(err)
                })
            }
        })
    }

    //
    // Delete a normal file. Only deletes the entry in metadata file.
    // @param filepath The path of to be deleted file
    // @param callback(err) If there is err, return err. Otherwise, return null
    //
    deleteFileEntry (position, callback) {
        let option = {encoding: this.encoding, flags: 'r+', start: position}
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

    searchbyword (word, callback) {

    }
}

module.exports.DB = DB