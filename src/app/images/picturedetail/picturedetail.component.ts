import { Component, EventEmitter, Input, Output } from '@angular/core';
import { PictureDTO } from '../../models/types';
import { MatIconModule } from '@angular/material/icon';

@Component({
  selector: 'picture-detail',
  standalone: true,
  imports: [MatIconModule],
  templateUrl: './picturedetail.component.html',
  styleUrl: './picturedetail.component.css'
})
export class PicturedetailComponent {
  @Input() picture: PictureDTO | undefined;
  @Output() closeDetail: EventEmitter<void> = new EventEmitter<void>();
  @Output() likePicture: EventEmitter<any> = new EventEmitter<any>()


  close(){
    this.closeDetail.emit();
  }

  likePhoto(){
    //console.log(this.picture?.username);
    this.likePicture.emit({
      username: this.picture?.username,
      likes: this.picture?.likes
    });
  }

}
