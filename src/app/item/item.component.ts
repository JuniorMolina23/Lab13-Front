import { Component, OnInit } from '@angular/core';
import { ItemService } from '../item.service';
import { FormBuilder, FormGroup, Validators, AbstractControl, ValidationErrors } from '@angular/forms';

@Component({
  selector: 'app-item',
  templateUrl: './item.component.html',
  styleUrls: ['./item.component.css']
})
export class ItemComponent implements OnInit {
  items: any[] = [];
  currentItem: any = {};
  myForm: FormGroup;
  showModal: boolean = false;
  deleteItemId: string = '';

  constructor(
    public fb: FormBuilder,
    private itemService: ItemService
  ) {
    this.myForm = this.fb.group({
      name: ['', [Validators.required]],
      artist: ['', [Validators.required]],
      genero: ['', [Validators.required]],
      time: ['', [Validators.required, this.validateTime]],
    });
  }

  validateTime(control: AbstractControl): ValidationErrors | null {
    const enteredTime = control.value;
    const minTime = '01:00';

    if (enteredTime < minTime) {
      return { invalidTime: true };
    }

    return null;
  }

  ngOnInit(): void {
    this.getItems();
  }

  getItems(): void {
    this.itemService.getItems()
      .subscribe((items) => {
        this.items = items;
      });
  }

  getItemById(id: string): void {
    this.itemService.getItemById(id)
      .subscribe((item) => {
        this.currentItem = item;
      });
  }

  createItem(item: any): void {
    if (this.myForm.valid) {
      this.itemService.createItem(item)
        .subscribe(() => {
          this.getItems();
          this.currentItem = {};
          window.alert('La canción se creó correctamente.');
        });
    }
  }
  
  updateItem(id: string, item: any): void {
    if (this.myForm.valid) {
      this.itemService.updateItem(id, item)
        .subscribe(() => {
          this.getItems();
          this.currentItem = {};
          window.alert('El usuario se actualizó correctamente.');
        });
    }
  }
  
  deleteItem(id: string): void {
    if (confirm('¿Estás seguro de que quieres eliminar el usuario?')) {
      this.itemService.deleteItem(id)
        .subscribe(() => {
          this.getItems();
        });
    }
  }
  


  editItem(id: string): void {
    this.getItemById(id);
  }

  showDeleteModal(id: string): void {
    this.deleteItemId = id;
    this.showModal = true;
  }

  closeModal(): void {
    this.showModal = false;
    this.deleteItemId = '';
  }

}
