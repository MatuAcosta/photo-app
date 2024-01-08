import { CommonModule } from '@angular/common';
import {Component, OnDestroy, OnInit, inject,NgZone } from '@angular/core';
import { PictureService } from '../../services/picture.service';
import { Subject, Subscription, firstValueFrom, takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, RouterModule ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent implements OnInit, OnDestroy{

  private pictureService: PictureService = inject(PictureService);
  private userService: UserService = inject(UserService);
  private destroy$ = new Subject<void>();
  private router: Router = inject(Router);
  private ngZone: NgZone = inject(NgZone);
  public uploadSub: Subscription | undefined;
  public imageUploaded: File | undefined;
  public imageSrc: string | undefined;
  public progress: number = 0;

  ngOnInit(): void {
    this.pictureService.uploadProgress$
    .pipe(takeUntil(this.destroy$))
    .subscribe(async (progress: number) => { 
      this.progress = progress;     
    });
    this.pictureService.urlPicture$
    .pipe(takeUntil(this.destroy$))
    .subscribe( async (url: string) => {
      if(url !== '' && this.progress === 100){
        let user = await firstValueFrom(this.userService.userDTO$);
        await this.uploadImageToStore(url, String(user?.username), '');
        this.navigate('home', 1000);
      }
    })
  }

  onDrop(event: any){
    event.preventDefault();
    if(event.dataTransfer.files.length > 1) return alert('Solo puedes subir una imagen');
    if(!this.verifyFile(event.dataTransfer.files[0])) return alert('Solo puedes subir imagenes');
    this.imageUploaded = event.dataTransfer.files[0];
    this.setSrcImage();
  }

  setSrcImage(){
    if(!this.imageUploaded) return alert('No has seleccionado ninguna imagen');
    this.imageSrc = URL.createObjectURL(this.imageUploaded);
  }

  verifyFile(file: File){
    return file.type.startsWith('image/');
  }

  onDragOver(event: any){
    event.preventDefault();
  }
  
  async uploadImageToStorage(){
    if(!this.imageUploaded) return;
    try {
      let user = await firstValueFrom(this.userService.userDTO$);
      let path = `images/${user?.username}/${this.imageUploaded?.name}`;
      this.pictureService.uploadPictureToStorage(this.imageUploaded, path);
    } catch (error) {
      console.log('error uploadImageToStorage', error);
    }
  }



  async uploadImageToStore(url: string, username: string , description:string){
    try {
      let picture = await this.pictureService.createPicture(url, username, description);
      console.log('picture', picture);
      if(picture.error) throw new Error(picture.message);
      alert(picture.message);
    } catch (error) {
      console.log('error uploadImageToStore', error);
    } 
  }

  
  removeImage(){
    this.imageUploaded = undefined;
    this.imageSrc = undefined;
  }
  
  onFileSelected(e: any){
    console.log('e', e);
    if(e.target.files.length > 1) return alert('Solo puedes subir una imagen');
    if(!this.verifyFile(e.target.files[0])) return alert('Solo puedes subir imagenes');
    this.imageUploaded = e.target.files[0];
    this.setSrcImage();
  }
  ngOnDestroy() {
    this.destroy$.next();
    this.destroy$.complete();
  }

  navigate(path:string, time:number){
    this.ngZone.run(() => setTimeout(() => {this.router.navigate([`/${path}`])},time));
      
  }

}
