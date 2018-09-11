import { Component } from '@angular/core';
import { ElectronService } from 'ngx-electron';

@Component({
  selector: 'app-root',
  templateUrl: './app.component.html',
  styleUrls: ['./app.component.css']
})
export class AppComponent {
  title = 'client-raccomandate-electron';

  constructor(private _electronService: ElectronService) {}   // DI

  launchWindow() {
    this._electronService.shell.openExternal('https://coursetro.com');
  }

  openDialog() {
    let dlgWindow = this._electronService.remote.dialog;
    dlgWindow.showOpenDialog({title: 'Select a folder', properties: ['openDirectory']}, (folderPath) => {
      if (folderPath === undefined){
          console.log('Nessuna selezione');
          return;
      }
      console.log('Selezione ', folderPath);
  });

  }


}
