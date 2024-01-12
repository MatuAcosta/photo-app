import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { PictureDTO } from '../../models/types';


@Component({
  selector: 'album',
  standalone: true,
  imports: [MatCardModule, MatIconModule],
  templateUrl: './album.component.html',
  styleUrl: './album.component.css'
})
export class AlbumComponent {
  @Input() username: string | undefined;
  @Input() description: string | undefined;
  @Input() imageSrc: string | undefined;
  @Input() likes: string[] | undefined;
  @Input() createdAt: string | undefined;
  @Input() topic: string | undefined;
  @Output() showDetail: EventEmitter<PictureDTO> = new EventEmitter<PictureDTO>();
  constructor(){
  }
  @Output() likePicture: EventEmitter<any> = new EventEmitter<any>()
  
  show(){
    let picture: PictureDTO = {
      username: String(this.username),
      description: String(this.description),
      url: String(this.imageSrc),
      likes: this.likes ? this.likes : [],
      createdAt: String(this.createdAt),
      topic: String(this.topic)
    }
    this.showDetail.emit(picture);
  } 
  likePhoto(e: any){
    e.stopPropagation()
    this.likePicture.emit({
      username: this.username,
      likes: this.likes
    });
  }

}
