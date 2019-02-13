const { app, BrowserWindow } = require('electron')
const { ipcMain } = require('electron')
const DB = require('./server/db.js')
const dbMappings = require('./server/dbMappings.js')
const dbLog = require('./server/logger.js').getLogger('DB log')

// 保持对window对象的全局引用，如果不这么做的话，当JavaScript对象被
// 垃圾回收的时候，window对象将会自动的关闭
let win
let db

function createWindow () {
  // 创建浏览器窗口。
  db = new DB(false, false)
  win = new BrowserWindow({ width: 800, height: 600 })
  
  // 然后加载应用的 index.html。
  win.loadFile('./www/index.html')

  // 打开开发者工具
  win.webContents.openDevTools()

  // 当 window 被关闭，这个事件会被触发。
  win.on('closed', () => {
    // 取消引用 window 对象，如果你的应用支持多窗口的话，
    // 通常会把多个 window 对象存放在一个数组里面，
    // 与此同时，你应该删除相应的元素。
    win = null
    db = null
  })
}

// Electron 会在初始化后并准备
// 创建浏览器窗口时，调用这个函数。
// 部分 API 在 ready 事件触发后才能使用。
app.on('ready', createWindow)

// 当全部窗口关闭时退出。
app.on('window-all-closed', () => {
  // 在 macOS 上，除非用户用 Cmd + Q 确定地退出，
  // 否则绝大部分应用及其菜单栏会保持激活。
  if (process.platform !== 'darwin') {
    app.quit()
  }
})

app.on('activate', () => {
  // 在macOS上，当单击dock图标并且没有其他窗口打开时，
  // 通常在应用程序中重新创建一个窗口。
  if (win === null) {
    createWindow()
  }
})

// 在这个文件中，你可以续写应用剩下主进程代码。
// 也可以拆分成几个文件，然后用 require 导入。

ipcMain.on('DB', (event, funcName, event_id, args) => {
  dbLog.info('Calling function: ', funcName)
  console.log('index.js calling function: ', funcName) // prints "ping"
  let promise = dbMappings(db, funcName, args)
  promise.then(data => {
    event.sender.send('DB-reply', funcName, event_id, data)
  }).catch(err => {
    // TODO log err somewhere
    // console.log(err)
    dbLog.error(err)
    event.sender.send("DB-reply", event_id, 'Error', err.message)
  })
})

ipcMain.on('test-main', (event, event_id, arg) => {
  console.log('ipcMain received: ', event_id)
  event.sender.send('test-main', event_id, 'hello world!')
})