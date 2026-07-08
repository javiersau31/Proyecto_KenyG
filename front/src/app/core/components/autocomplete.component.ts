import { Component, Input, Output, EventEmitter, ContentChild, TemplateRef, ViewChild, HostListener } from '@angular/core';
import { CommonModule } from '@angular/common';
import { FormsModule } from '@angular/forms';




@Component({
  selector: 'app-autocomplete',
  standalone: true,
  imports: [CommonModule, FormsModule],
  templateUrl: './autocomplete.component.html'
})
export class AutocompleteComponent {

  @Input() items: any[] = [];
  @Input() labelKey: string = 'nombre';
  @Input() placeholder: string = 'Buscar...';
  @Input() disabled: boolean = false;
  @Input() value: any = null;

  @Output() cleared = new EventEmitter<void>();

  @Output() selected = new EventEmitter<any>();
  @ContentChild(TemplateRef) itemTemplate!: TemplateRef<any>;


  @ViewChild('defaultTemplate', { static: true })
    defaultTemplate!: TemplateRef<any>;
  @HostListener('document:click', ['$event'])
    onClickOutside(event: any) {
    if (!event.target.closest('.autocomplete-container')) {
        this.mostrar = false;
    }
    }

  termino = '';
  resultados: any[] = [];
  mostrar = false;

  onInput() {
      if (this.disabled) return;

      const texto = this.termino.toLowerCase();

      this.resultados = this.items.filter(item =>
        item[this.labelKey].toLowerCase().includes(texto)
      ).slice(0, 10);

      this.mostrar = true;
    }

  seleccionar(item: any) {
    this.termino = item[this.labelKey];
    this.mostrar = false;
    this.selected.emit(item);
  }

  cerrar() {
    setTimeout(() => this.mostrar = false, 200);
  }

  ngOnChanges() {
        if (this.value) {
        this.termino = this.value[this.labelKey] || '';
      }
        if (!this.termino) {
        this.resultados = this.items;
      }
    }
  reset() {
    this.termino = '';
    this.resultados = [];
    this.mostrar = false;
    }

}