import { Component,Input } from '@angular/core';
import { DomSanitizer, SafeResourceUrl } from '@angular/platform-browser';

@Component({
  selector: 'app-doctorinfo',
  standalone: true,
  imports: [],
  templateUrl: './doctorinfo.component.html',
  styleUrl: './doctorinfo.component.css'
})
export class DoctorinfoComponent {
  @Input() doctor: any; 

  constructor(private sanitizer: DomSanitizer) { 
    
  }

  getSafeImageUrl(photo: string): SafeResourceUrl {
    return this.sanitizer.bypassSecurityTrustResourceUrl('data:image/jpeg;base64,' + photo);
  }
}
