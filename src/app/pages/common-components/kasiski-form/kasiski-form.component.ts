import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ngx-kasiski-form',
  templateUrl: './kasiski-form.component.html',
  styleUrls: ['./kasiski-form.component.scss'],
})
export class KasiskiFormComponent {
  @Input() title = 'KasiskiFormComponent';
  @Input() kasiskiFrecuencies = [];

  @Output() kasiskiEvent = new EventEmitter<object>();
  @Output() clearEvent = new EventEmitter<void>();

  model = {
    textoCifrado: '',
    tamanio: 1
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(JSON.stringify(changes));
    
  }

  kasiski(textoCifrado, tamanio) {
    this.kasiskiEvent.emit({textoCifrado, tamanio});
  }

  clearForm($event) {
    $event.preventDefault();
    this.model.textoCifrado = '';
    this.clearEvent.emit();
  }

}
