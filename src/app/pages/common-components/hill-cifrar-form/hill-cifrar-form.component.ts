import { Component, EventEmitter, Input, Output, SimpleChanges } from '@angular/core';

@Component({
  selector: 'ngx-hill-cifrar-form',
  templateUrl: './hill-cifrar-form.component.html',
  styleUrls: ['./hill-cifrar-form.component.scss'],
})
export class HillCifrarFormComponent {
  @Input() title = 'HillCifrarFormComponent';
  @Input() imagenCifrada = [];

  @Output() cifrarEvent = new EventEmitter<object>();
  @Output() clearEvent = new EventEmitter<void>();

  ngOnChanges(changes: SimpleChanges) {
    
  }

  model = {
    linkImagenClara: '',
    clave: [0, 0, 0, 0]
  }

  cifrar() {
    this.cifrarEvent.emit({linkImagenClara: this.model.linkImagenClara, clave: this.model.clave});
  }

  clearForm($event) {
    $event.preventDefault();
    this.model.clave = [];
    this.clearEvent.emit();
  }

}
