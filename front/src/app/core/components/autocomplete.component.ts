import { Component, EventEmitter, Input, Output } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';

@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [
    CommonModule,
    FormsModule
  ],
  templateUrl: './autocomplete.component.html'
})
export class AutocompleteComponent {

  @Input() items: any[] = [];
  @Input() placeholder = 'Buscar...';

  @Output() seleccionado = new EventEmitter<any>();

  texto = '';
  mostrar = false;
  resultados: any[] = [];

  @Input() displayField = 'nombre';

  onInput(): void {

    const valor = this.texto.trim().toLowerCase();

    if (!valor) {
      this.resultados = [];
      this.mostrar = false;
      return;
    }

    this.resultados = this.items
      .filter(item => {
        const texto = item[this.displayField];

        return texto &&
          texto.toString().toLowerCase().includes(valor);
      })
      .slice(0, 8);

    this.mostrar = this.resultados.length > 0;
  }

  seleccionar(item: any): void {

    this.texto = item[this.displayField];

    this.mostrar = false;

    this.seleccionado.emit(item);
  }

  cerrar(): void {
    setTimeout(() => {
      this.mostrar = false;
    }, 150);
  }
}