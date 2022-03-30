import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ngx-cifrar-form',
  templateUrl: './cifrar-form.component.html',
  styleUrls: ['./cifrar-form.component.scss'],
})
export class CifrarFormComponent {
  @Input() title = 'CifrarFormComponent';
  @Input() textoCifrado = '';
  @Input() tipoClave = 'numero';

  @Output() cifrarEvent = new EventEmitter<object>();
  @Output() clearEvent = new EventEmitter<void>();

  claveNumero = true;
  claveDoble = false;
  claveString = false;

  ngOnChanges(changes: SimpleChanges) {
    if (changes['tipoClave']) {
      var tipoClave = changes['tipoClave'].currentValue;
      if (tipoClave == 'doble') {
        this.claveNumero = false;
        this.claveDoble = true;
        this.claveString = false;
      } else if (tipoClave == 'string') {
        this.claveNumero = false;
        this.claveDoble = false;
        this.claveString = true;
      }
    }
  }

  model = {
    textoClaro: '',
    clave: [0, 0],
    claveString: ''
  }

  cifrar(textoClaro) {
    if (this.claveDoble) {
      this.cifrarEvent.emit({textoClaro, clave: this.model.clave});
    } else if (this.claveNumero) {
      this.cifrarEvent.emit({textoClaro, clave: this.model.clave[0]});
    } else if (this.claveString) {
      this.cifrarEvent.emit({textoClaro, clave: this.model.claveString});
    }
  }

  clearForm($event) {
    $event.preventDefault();
    this.model.textoClaro = '';
    this.model.claveString = '';
    this.clearEvent.emit();
  }

}
