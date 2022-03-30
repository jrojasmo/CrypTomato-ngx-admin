import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ngx-descifrar-form',
  templateUrl: './descifrar-form.component.html',
  styleUrls: ['./descifrar-form.component.scss'],
})
export class DescifrarFormComponent {
  @Input() title = 'DescifrarFormComponent';
  @Input() textoClaro = '';
  @Input() tipoClave = 'numero';

  @Output() descifrarEvent = new EventEmitter<object>();
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
    textoCifrado: '',
    clave: [0, 0],
    claveString: ''
  }

  descifrar(textoCifrado, clave) {
    if (this.claveDoble) {
      this.descifrarEvent.emit({textoCifrado, clave});
    } else if (this.claveNumero) {
      this.descifrarEvent.emit({textoCifrado, clave: this.model.clave[0]});
    } else if (this.claveString) {
      this.descifrarEvent.emit({textoCifrado, clave: this.model.claveString});
    }
  }

  clearForm($event) {
    $event.preventDefault();
    this.model.textoCifrado = '';
    this.model.claveString = '';
    this.clearEvent.emit();
  }

}
