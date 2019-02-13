const fs = require('fs')
const expect = require('chai').expect
var DB = require('../server/db.js')

describe('test db metafile manipulation', () => {

    let testRecord = "1549252849;happy;好像能成;不知道结果如何;天气不错"
    let testmetapath = './test/metadata'
    let testfiledir = './test/'
    let test_filename = '1549252849'
    let test_json = {a: 'abcdefg', b: 'ab"aefwdc"cde<a>fgh</a><p>grksselhrrgf</p>ijklmn'}
    let test_data = JSON.stringify(test_json)

    before((done) => {
        let p1 = new Promise((resolve, reject) => {
            fs.unlink(testmetapath, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
        let p2 = new Promise((resolve, reject) => {
            fs.unlink(testfiledir + test_filename, (err) => {
                if (err) {
                    reject(err)
                } else {
                    resolve()
                }
            })
        })
        Promise.all([p1, p2]).then(() => {
            done()
        }).catch((err) => {
            console.log(err)
            // done()
        })
    })

    let db = new DB(testmetapath, testfiledir)
    let old_record = ""
    
    it('db should write test entries successfully', (done) => {
        db.appendMetafile(testRecord, (err) => {
            if (err) console.log(err)
            expect(err).be.null
            done()
        })
    })

    it('db should read test entries successfully', (done) => {
        db.readMetafile((err, records) => {
            if (err) console.log(err)
            expect(err).be.null
            //console.log(records)
            expect(records[0]).contains(testRecord)
            old_record = records[0]
            done()
        })
    })

    it('db should update record successfully', (done) => {
        let old_position = parseInt(old_record.split(';')[0])
        db.updateMetafile(old_position, testRecord, (err) => {
            if (err) console.log(err)
            expect(err).be.null
            done()
        })
    })

    it('db should read updated test entries successfully', (done) => {
        db.readMetafile((err, records) => {
            let record = records[0]
            let start_position = parseInt(record.split(';'))[0]
            if (err) console.log(err)
            expect(err).be.null
            //console.log(records)
            expect(start_position).not.equal(0)
            expect(record).contains(testRecord)
            expect(records.length).equal(1)
            done()
        })
    })

    it('db should write tmp file successfully', (done) => {
        db.writeTempfile(test_filename, test_data, (err) => {
            if (err) console.log(err)
            expect(err).be.null
            fs.access(testfiledir + '.' + test_filename, fs.constants.F_OK, (a_err) => {
                if (a_err) console.log(a_err)
                expect(a_err).be.null
                done()
            })
        })
    })

    it('db should save file successfully', (done) => {
        db.saveFile(test_filename, (err) => {
            expect(err).be.null
            done()
        })
    })

    it('db should read file successfully', (done) => {
        db.readFile(testfiledir + test_filename, (err, data) => {
            if (err) console.log(err)
            expect(err).be.null
            let data_back = JSON.parse(data)
            expect(data_back.a).equal(test_json.a)
            done()
        })
    })

    it('db should finalize file successfully', (done) => {
        db.finalizeFile(test_filename, (err) => {
            if (err) console.log(err)
            expect(err).be.null
            fs.access('./.' + test_filename, fs.constants.F_OK, (a_err) => {
                expect(a_err).not.be.null
                done()
            })
        })
    })
})