const electron = require('electron');
const url = require('url');
const path = require('path');

const {app, BrowserWindow, Menu, ipcMain} = electron;

let mainWindow;
let addWindow;

//Listen for app to be ready

app.on('ready', () => {
    //create new window
    mainWindow = new BrowserWindow({});
    //Load html into window 
    mainWindow.loadURL(url.format({
        pathname: path.join(__dirname, 'mainWindow.html'),
        protocol: 'file:',
        slashes: true
    }))
    //Quit app when closed 
    mainWindow.on('closed', () => {
    app.quit();
    })

    //Main menu from template
        const mainMenu = Menu.buildFromTemplate(mainMenuTemplate);
    //Insert menu
    Menu.setApplicationMenu(mainMenu);
})

//Handle create add window
function createAddWindow() {
        addWindow = new BrowserWindow({
            width: 300,
            height: 200,
            title: 'Agregar Material para comprar'
        });
        
        webPreferences: {
            nodeIntegration: true;
        }

        addWindow.loadURL(url.format({
            pathname: path.join(__dirname, 'addWindow.html'),
            protocol: 'file:',
            slashes: true
        }));
        //Garbage Collector
        addWindow.on('closes', () => {
             addWindow = null;
        })
};

//Catch item:add
ipcMain.on('item:add', (e, item) => {
    console.log(item)
    mainWindow.webContents.send('item::add', item);
    addWindow.close();
})


//create menu template
const mainMenuTemplate = [
    { 
        label: 'File', 
        submenu: [
            {
                label: 'Agregar Materiales',
                click(){
                    createAddWindow();
                }

            },
            {
                label: 'Quitar Materiales',
                
            },
            {
                label: 'Salir de aplicacion',
                accelerator: process.platform == 'darwin' ? 'Command+Q' :
                'Ctrl+Q',
                click() {
                   app.quit(); 
                }
            }
        ]
    }
]

//If mac add empty object to menu
if (process.platform == 'darwin') {
    mainMenuTemplate.unshift({})
}

//Add developer tools if not in production
if(process.env.NODE_ENV !== 'production') {
    mainMenuTemplate.push({
        label:'Developer Tools',
    submenu:[
        {
            label: 'Toggle DevTools',
            accelerator: process.platform == 'darwin' ? 'Command+I' :
                'Ctrl+I',
            click(item,focusedWindow) {
                focusedWindow.toggleDevTools();
            }
        }, {
            role: 'reload'
        }
    ]
    })
}