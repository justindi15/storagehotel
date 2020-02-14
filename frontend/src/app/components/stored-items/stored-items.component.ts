import { Component, OnInit, Input, Output, EventEmitter} from '@angular/core';
import { MatDialog } from '@angular/material';
import { RetrieveModalComponent } from '../retrieve-modal/retrieve-modal.component';

@Component({
  selector: 'app-stored-items',
  templateUrl: './stored-items.component.html',
  styleUrls: ['./stored-items.component.css']
})
export class StoredItemsComponent implements OnInit {

  @Output()
  bookingSuccessful: EventEmitter<boolean> = new EventEmitter<boolean>();

  @Input()
  items = []
  
  @Input()
  email = ""

  constructor(public dialog: MatDialog) { }

  ngOnInit() {
  }

  openDialog() {
    const dialogRef = this.dialog.open(RetrieveModalComponent, {
      data: {
        items: this.items,
        email: this.email,
      },
      width: '35%',
      panelClass: 'custom-dialog-container'
    })

    dialogRef.afterClosed().subscribe(res => {
      if(res){
        this.bookingSuccessful.emit(true);
      }
    }, err => {

    });
  }

}
