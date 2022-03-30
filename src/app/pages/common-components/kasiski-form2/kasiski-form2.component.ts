import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ngx-kasiski-form2',
  templateUrl: './kasiski-form2.component.html',
  styleUrls: ['./kasiski-form2.component.scss'],
})
export class KasiskiForm2Component {
  @Input() title = 'KasiskiFormComponent';
  @Input() resultado = {indices: '', longitudClave: 0};

  @Output() kasiskiEvent = new EventEmitter<object>();
  @Output() clearEvent = new EventEmitter<void>();

  model = {
    textoCifrado: '',
    n_grama: ''
  }

  ngOnChanges(changes: SimpleChanges) {
    console.log(JSON.stringify(changes));
  }

  kasiski(textoCifrado, n_grama) {
    this.kasiskiEvent.emit({textoCifrado, n_grama});
  }

  clearForm($event) {
    $event.preventDefault();
    this.model.textoCifrado = '';
    this.model.n_grama = '';
    this.clearEvent.emit();
  }

}
