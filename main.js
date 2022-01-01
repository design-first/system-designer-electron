/*
 * System Designer
 *
 * https://designfirst.io/systemdesigner/
 *
 * Copyright 2022 Erwan Carriou
 *
 * Licensed under the Apache License, Version 2.0 (the "License");
 * you may not use this file except in compliance with the License.
 * You may obtain a copy of the License at
 *
 *    http://www.apache.org/licenses/LICENSE-2.0
 *
 * Unless required by applicable law or agreed to in writing, software
 * distributed under the License is distributed on an "AS IS" BASIS,
 * WITHOUT WARRANTIES OR CONDITIONS OF ANY KIND, either express or implied.
 * See the License for the specific language governing permissions and
 * limitations under the License.
 */

'use strict';

const electron = require('electron');
const app = electron.app;
const BrowserWindow = electron.BrowserWindow;
let mainWindow;

require('@electron/remote/main').initialize()

/**
 * @method nextWindow
 * @description focus on the next window
 */
function nextWindow() {
  const windows = BrowserWindow.getAllWindows();
  const focused = BrowserWindow.getFocusedWindow();
  let index = 0;
  let lastIndex = 0;
  let nextIndex = 0;

  if (focused) {
    index = windows.map(win => win.id).indexOf(focused.id);
    lastIndex = windows.length - 1;

    if (index + 1 > lastIndex) {
      nextIndex = 0;
    } else {
      nextIndex = index + 1;
    }

    windows[nextIndex].focus();
  }
}

/**
 * @method previousWindow
 * @description focus on the previous window
 */
function previousWindow() {
  const windows = BrowserWindow.getAllWindows();
  const focused = BrowserWindow.getFocusedWindow();
  let index = 0;
  let lastIndex = 0;
  let prevIndex = 0;

  if (focused) {
    index = windows.map(win => win.id).indexOf(focused.id);
    lastIndex = windows.length - 1;

    if (index === 0) {
      prevIndex = lastIndex;
    } else {
      prevIndex = index - 1;
    }

    windows[prevIndex].focus();
  }
}

/**
 * @method createWindow
 * @description create the main window
 */
function createWindow() {
  const Menu = electron.Menu;
  const template = [{
    label: 'Edit',
    submenu: [{
      label: 'Undo',
      accelerator: 'CmdOrCtrl+Z',
      role: 'undo'
    },
    {
      label: 'Redo',
      accelerator: 'Shift+CmdOrCtrl+Z',
      role: 'redo'
    },
    {
      type: 'separator'
    },
    {
      label: 'Cut',
      accelerator: 'CmdOrCtrl+X',
      role: 'cut'
    },
    {
      label: 'Copy',
      accelerator: 'CmdOrCtrl+C',
      role: 'copy'
    },
    {
      label: 'Paste',
      accelerator: 'CmdOrCtrl+V',
      role: 'paste'
    },
    {
      label: 'Select All',
      accelerator: 'CmdOrCtrl+A',
      role: 'selectall'
    }]
  },
  {
    label: 'View',
    submenu: [{
      label: 'Reload',
      accelerator: 'CmdOrCtrl+R',
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          focusedWindow.reload();
        }
      }
    },
    {
      label: 'Toggle Full Screen',
      accelerator: (() => {
        if (process.platform === 'darwin') {
          return 'Ctrl+Command+F';
        } else {
          return 'F11';
        }
      })(),
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          focusedWindow.setFullScreen(!focusedWindow.isFullScreen());
        }
      }
    },
    {
      label: 'Toggle Developer Tools',
      accelerator: (() => {
        if (process.platform === 'darwin') {
          return 'Alt+Command+I';
        } else {
          return 'Ctrl+Shift+I';
        }
      })(),
      click: (item, focusedWindow) => {
        if (focusedWindow) {
          focusedWindow.toggleDevTools();
        }
      }
    }
    ]
  },
  {
    label: 'Window',
    role: 'window',
    submenu: [{
      label: 'Minimize',
      accelerator: 'CmdOrCtrl+M',
      role: 'minimize'
    },
    {
      label: 'Close',
      accelerator: 'CmdOrCtrl+W',
      role: 'close'
    },
    {
      type: 'separator'
    },
    {
      label: 'Next Window',
      accelerator: 'Ctrl+Tab',
      click: (item, focusedWindow) => {
        nextWindow();
      }
    },
    {
      label: 'Previous Window',
      accelerator: 'Ctrl+Shift+Tab',
      click: (item, focusedWindow) => {
        previousWindow();
      }
    },
    {
      type: 'separator'
    }, {
      label: 'System Designer',
      click: (item, focusedWindow) => {
        if (!mainWindow) {
          createWindow();
        } else {
          mainWindow.focus();
        }
      }
    }]
  },
  {
    label: 'Help',
    role: 'help',
    submenu: [{
      label: 'Read the documentation',
      click: () => {
        let helpWindow = new BrowserWindow({
          webPreferences: {
            nodeIntegration: true,
            contextIsolation: false,
            enableRemoteModule: true
          },
          width: 1024,
          height: 768
        });
        helpWindow.loadURL('file://' + __dirname + '/documentation/docs/en/what-is-system-designer.html');

        helpWindow.on('closed', () => {
          helpWindow = null;
        });
      }
    },
    {
      label: 'Ask a question',
      click: () => {
        require('electron').shell.openExternal('https://github.com/design-first/system-designer/issues');
      }
    },
    {
      label: 'Report a bug',
      click: () => {
        require('electron').shell.openExternal('https://github.com/design-first/system-designer/issues');
      }
    },
    {
      label: 'Go to the website',
      click: () => {
        require('electron').shell.openExternal('https://designfirst.io/systemdesigner/');
      }
    }]
  }];

  // macOS menu
  if (process.platform === 'darwin') {
    const name = 'System Designer';
    template.unshift({
      label: name,
      submenu: [{
        label: 'About ' + name,
        role: 'about'
      },
      {
        type: 'separator'
      },
      {
        label: 'Services',
        role: 'services',
        submenu: []
      },
      {
        type: 'separator'
      },
      {
        label: 'Hide ' + name,
        accelerator: 'Command+H',
        role: 'hide'
      },
      {
        label: 'Hide Others',
        accelerator: 'Command+Alt+H',
        role: 'hideothers'
      },
      {
        label: 'Show All',
        role: 'unhide'
      },
      {
        type: 'separator'
      },
      {
        label: 'Quit',
        accelerator: 'Command+Q',
        click: () => {
          app.quit();
        }
      }]
    });
    template[3].submenu.push({
      type: 'separator'
    },
      {
        label: 'Bring All to Front',
        role: 'front'
      }
    );
  }

  const menu = Menu.buildFromTemplate(template);
  Menu.setApplicationMenu(menu);

  mainWindow = new BrowserWindow({
    webPreferences: {
      nodeIntegration: true,
      contextIsolation: false,
      enableRemoteModule: true
    },
    width: 1024,
    height: 768
  });

  // to enable exportation
  require('@electron/remote/main').enable(mainWindow.webContents);

  mainWindow.loadURL('file://' + __dirname + '/designer/index.html');

  mainWindow.on('closed', () => {
    mainWindow = null;
  });
}

app.on('ready', createWindow);

app.on('window-all-closed', () => {
  if (process.platform !== 'darwin') {
    app.quit();
  }
});

app.on('activate', () => {
  if (mainWindow === null) {
    createWindow();
  }
});