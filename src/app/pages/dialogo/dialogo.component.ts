import { Component, Input } from '@angular/core';
import { NbDialogRef } from '@nebular/theme';

@Component({
  selector: 'ngx-dialogo',
  templateUrl: 'dialogo.component.html',
  styleUrls: ['dialogo.component.scss'],
})
export class DialogoComponent {

  @Input() title: string;
  @Input() content: string;

  constructor(protected ref: NbDialogRef<DialogoComponent>) {}

  dismiss() {
    this.ref.close();
  }
}
