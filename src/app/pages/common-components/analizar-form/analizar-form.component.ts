import { Component, EventEmitter, Input, Output } from '@angular/core';

@Component({
  selector: 'ngx-analizar-form',
  templateUrl: './analizar-form.component.html',
  styleUrls: ['./analizar-form.component.scss'],
})
export class AnalizarFormComponent {
  @Input() title = 'AnalizarFormComponent';
  @Input() analisis = [];

  @Output() analizarEvent = new EventEmitter<string>();
  @Output() clearEvent = new EventEmitter<void>();

  model = {
    textoCifrado: '',
  }

  analizar(textoCifrado) {
    this.analizarEvent.emit(textoCifrado);
  }

  clearForm($event) {
    $event.preventDefault();
    this.model.textoCifrado = '';
    this.clearEvent.emit();
  }

}
