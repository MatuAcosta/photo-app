import { Component, EventEmitter, Output, PLATFORM_ID, inject } from '@angular/core';

@Component({
  selector: 'app-instructions-modal',
  standalone: true,
  imports: [],
  templateUrl: './instructions-modal.component.html',
  styleUrl: './instructions-modal.component.css'
})
export class InstructionsModalComponent {

  @Output() closeModal: EventEmitter<any> = new EventEmitter<any>();
  close(): void {
    this.closeModal.emit();
  }

}
