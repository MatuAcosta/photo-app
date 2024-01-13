import { CommonModule } from '@angular/common';
import {Component, OnDestroy, OnInit, inject,NgZone } from '@angular/core';
import { PictureService } from '../../services/picture.service';
import { Subject, Subscription,takeUntil } from 'rxjs';
import { UserService } from '../../services/user.service';
import { Router, RouterModule } from '@angular/router';
import Toastify from 'toastify-js';
import { USERNAME_REGEXP, colorsToastify } from '../../utils/constants';
import { TopicService } from '../../services/topic.service';
import { FormControl, FormsModule, ReactiveFormsModule, Validators } from '@angular/forms';

@Component({
  selector: 'app-upload',
  standalone: true,
  imports: [CommonModule, RouterModule, ReactiveFormsModule, FormsModule ],
  templateUrl: './upload.component.html',
  styleUrl: './upload.component.css'
})
export class UploadComponent implements OnInit, OnDestroy{

  private pictureService: PictureService = inject(PictureService);
  private userService: UserService = inject(UserService);
  private destroy$ = new Subject<void>();
  private router: Router = inject(Router);
  private ngZone: NgZone = inject(NgZone);
  public topicService:TopicService = inject(TopicService);
  public uploadSub: Subscription | undefined;
  public imageUploaded: File | undefined;
  public imageSrc: string | undefined;
  public progress: number = 0;
  public userDTO = this.userService.userDTO;
  public userName: FormControl | undefined;

  ngOnInit(): void {
    if(!this.userDTO){
      this.setFormUsername();
    }
    this.pictureService.uploadProgress$
    .pipe(takeUntil(this.destroy$))
    .subscribe(async (progress: number) => { 
      this.progress = progress;     
    });
    this.pictureService.urlPicture$
    .pipe(takeUntil(this.destroy$))
    .subscribe( async (url: string) => {
      if(url !== '' && this.progress === 100){
        let user = this.userDTO ? this.userDTO.username : this.userName?.value;
        await this.uploadImageToStore(url, String(user), '');
        this.navigate('home', 1000);
      }
    })


  }

  setFormUsername(){
    this.userName = new FormControl('', [Validators.required, Validators.pattern(USERNAME_REGEXP)]); 
  }

  async getUserByUsername(){
    try {
    let userRes = await this.userService.findUserByUserName(this.userName?.value);
    return userRes;
    } catch (error) {
      return error;
    }
  }

  async getPictureByUsername(){
    try {
    let userRes = await this.pictureService.findPictureByUsername(this.userName?.value);
    return userRes;
    } catch (error) {
      return error;
    }
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
    if(this.userName?.invalid) return this.toastify('Username is invalid', true);
    if(!this.userDTO){
      let userRes: any = await this.getUserByUsername();
      let pictureRes: any = await this.getPictureByUsername();
      if( userRes.error || pictureRes.error) return this.toastify(userRes.message, true);
      if( userRes.user || pictureRes.picture) return this.toastify('Username already used', true);
    }
    try {
      let user = this.userDTO ? this.userDTO.username : this.userName?.value;
      let path = `images/${user?.username}/${this.imageUploaded?.name}`;
      this.pictureService.uploadPictureToStorage(this.imageUploaded, path);
    } catch (error) {
      //console.log('ERRORRR',error);
      return this.toastify('Error uploading image', true)
    }
  }



  async uploadImageToStore(url: string, username: string , description:string){
    try {
      let picture = await this.pictureService.createPicture(url, username, description);
      //console.log('picture', picture);
      if(picture.error) throw new Error(picture.message);
      return this.toastify(picture.message)
    } catch (error) {
      //console.log('error uploadImageToStore', error);
      return this.toastify('Error uploading image', true)
    } 
  }

  
  removeImage(){
    this.imageUploaded = undefined;
    this.imageSrc = undefined;
  }
  
  onFileSelected(e: any){
    //console.log('e', e);
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

  toastify(text: string, error?: boolean){
    return Toastify({
      text,
      duration: 3000,
      close: true,
      gravity: "top", // `top` or `bottom`
      position: "center", // `left`, `center` or `right`
      stopOnFocus: true, // Prevents dismissing of toast on hover
      style: {
        background: error ? `linear-gradient(to right,${colorsToastify.error[0]},${colorsToastify.error[1]})` 
        : `linear-gradient(to right, ${colorsToastify.success[0]}, ${colorsToastify.success[1]})`
      },
      onClick: function(){} // Callback after click
    }).showToast();
  }


}
