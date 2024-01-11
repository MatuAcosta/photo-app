import { Component, EventEmitter, Input, Output } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';


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
  constructor(){
  }
  @Output() likePicture: EventEmitter<any> = new EventEmitter<any>()


  likePhoto(){
    this.likePicture.emit({
      username: this.username,
      likes: this.likes
    });
  }

}
