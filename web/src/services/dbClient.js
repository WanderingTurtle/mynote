import Vue from 'vue'
import { EventBus } from './eventBus.js'
const { ipcRenderer } = window.require('electron')
const TESTINGWEB = false

export const DBClient = new Vue({
  data: function(){
    return {
      metafile: null
    }
  },
  created: function() {
    ipcRenderer.on('DB-reply', (event, funcName, event_id, data) => {
      if (funcName === 'readMetafile') {
        this.metafile = data
        console.log(this.metafile)
      }
      // Might be better to use timestamp as event id
      // Can use file name as event id as well
      // Use $once to monitor events to save memory usage? (potentially?)
      if (event_id) {
        if (funcName === 'Error') {
          EventBus.$emit(event_id, {Error: true, data: data})
        } else {
          EventBus.$emit(event_id, {Error: false, data: data})
        }
      }
      if (funcName === 'Error') {
        // TODO show error message somewhere
        console.log(data)
      } 
    })
    send('readMetafile')
    // This is working
    // 
    // ipcRenderer.send('test-main', 'hello event_id', {asd:'asd'})
    // ipcRenderer.on('test-main', (event, event_id, arg) => {
    //   console.log(event_id)
    //   console.log(arg)
    //   setTimeout(() => {
    //     ipcRenderer.send('test-main', 'hello event_id')
    //   }, 5000)
    // })
  },
  methods: {
    reloadMetafile: function(event_id) {
      send('readMetafile', event_id)
    },
    appendMetafile: function(event_id, record) {
      send('appendMetafile', event_id, [record])
    },
    updateMetafile(event_id, old_position, entry) {
      send('updateMetafile', event_id, [old_position, entry])
    },
    readFile: function(event_id, filepath) {
      send('readFile', event_id, [filepath])
    },
    writeTempfile: function(event_id, filename, data) {
      send('writeTempfile', event_id, [filename, data])
    },
    saveFile: function(event_id, filename) {
      send('saveFile', event_id, [filename])
    },
    finalizeFile: function(event_id, filename) {
      send('finalizeFile', event_id, [filename])
    },
    deleteFileEntry: function(event_id, position) {
      send('deleteFileEntry', event_id, [position])
    },
    searchByWord: function(event_id, word) {
      // TODO
      console.log('not supported')
    }
  }
})

function send(funcName, event_id, args) {
  if (TESTINGWEB) return
  if (!args) args = []
  ipcRenderer.send('DB', funcName, event_id, args)
}
