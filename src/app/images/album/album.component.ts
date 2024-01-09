import { Component, EventEmitter, Input, Output, PLATFORM_ID, inject } from '@angular/core';
import {MatCardModule} from '@angular/material/card';
import {MatIconModule} from '@angular/material/icon';
import { platform } from 'os';

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
  @Input() likes: number = 0;
  @Input() createdAt: string | undefined;
  @Input() topic: string | undefined;
  private platformId: any = inject(PLATFORM_ID);

  public usernameLikes: string[] = 
  this.platformId === 'browser ' ? JSON.parse(localStorage.getItem('usernameLikes') || '[]') : null;
  
  @Output() likePicture: EventEmitter<any> = new EventEmitter<any>()

  


  like() {
    if(this.usernameLikes.find((username: string) => username === this.username)){ 
       this.likes -= 1;
       this.usernameLikes = this.usernameLikes.filter((username: string) => username !== this.username);
    } else {
      this.likes += 1;
      this.usernameLikes.push(this.username || '');
    }
    if(this.platformId === 'browser'){
      localStorage.setItem('usernameLikes', JSON.stringify(this.usernameLikes));
    }
    return this.likePhoto();
  }

  likePhoto(){
    this.likePicture.emit({
      username: this.username,
      likes: this.likes
    });
  }

}
