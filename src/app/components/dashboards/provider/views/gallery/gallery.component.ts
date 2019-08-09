import { ActivatedRoute } from '@angular/router';
import { Component, OnInit, Output, EventEmitter, Input, ViewChild, ElementRef } from '@angular/core';
import { Observable } from 'rxjs';
import { FileInfo } from './../../../../../models';
import { FileService } from '../../../../../services';
import { NotificationService } from '../../../../../services';

@Component({
  selector: 'app-gallery',
  templateUrl: './gallery.component.html',
  styleUrls: ['./gallery.component.scss']
})
export class GalleryComponent implements OnInit {
  @Output() files = new EventEmitter<FileInfo []>();
  @Input() model: any;
  @Input() serverFiles$: Observable<any>;
  @Input() progress$: Observable<number>;
  @Input() uploading: Boolean;
  @Input() mode: string;
  @ViewChild('alert', {static: true}) alert: ElementRef;

  selectedFiles: FileInfo [] = [];
  providerId: string;
  showError = false;
  fileName = '';
  errorMsg = '';
  extensionError = false;
  sizeError = false;
  clicked = false;

  constructor(
    private route: ActivatedRoute,
    private readonly fileService: FileService,
    private readonly notification: NotificationService
  ) {}

  ngOnInit() {
    this.providerId = this.route.snapshot.params['providerId'];
    if (this.mode === 'edit') {
      this.serverFiles$.subscribe(files => {
        this.selectedFiles = files;
      });
    }
  }

  // local files
  onSelectFile(event) {
    // multiple files
    for (const file of event.target.files) {
      const reader = new FileReader();

      // validate image extension
      if (!this.isValidExtension(file.type)) {
        this.showError = true;
        this.extensionError = true;
        this.fileName = file.name;

        return;
      }

      // // validate image size
      if (!this.isValidImageSize(file.size)) {
        this.showError = true;
        this.sizeError = true;
        this.fileName = file.name;

        return;
      }

      reader.addEventListener('load', (eventProgress: any) => {
        const index = this.selectedFiles.findIndex(f => f.name === file.name);
        if (index === -1) {
          const fileInfo: FileInfo = {
            file: file,
            name: file.name,
            size: file.size,
            type: file.type,
            src: eventProgress.target.result,
            createdAt: new Date(),
            markAsPrincipal: false
          };

          this.selectedFiles.push(fileInfo);
        }

        // event send fileInfo data
        this.files.emit(this.selectedFiles);
      });

      reader.readAsDataURL(file);
    }
  }

  markAsPrincipal(image: FileInfo) {
    this.selectedFiles = this.selectedFiles.map(file => {
      file.markAsPrincipal = false;

      return file;
    });

    // event send fileInfo data
    if (image.file) {
      // mark as principal new image
      const newIndex = this.selectedFiles.findIndex(f => f.name === image.name);
      this.selectedFiles[newIndex].markAsPrincipal = true;

      this.files.emit(this.selectedFiles);
    } else {
      this.clicked = true;
      this.fileService.updateFileInfo(image, this.model).then(() => {
        this.clicked = false;
        this.files.emit(this.selectedFiles);
      })
      .catch(error => {
        this.clicked = false;
        this.notification.ErrorMessage(error.message, '', 2500);
      });
    }
  }

  removeImage(image: FileInfo) {
    if (image.markAsPrincipal) {
      this.notification.WarningMessage(
        'Can not delete the main image', '', 2500);

      return;
    }

    // event send fileInfo data
    if (image.file) {
      const index = this.selectedFiles.findIndex(f => f.name === image.name);
      this.selectedFiles.splice(index, 1);

      this.files.emit(this.selectedFiles);
    } else {
      this.clicked = true;
      this.fileService.removeFileInfo(image).then(() => {
        this.clicked = false;
        this.files.emit(this.selectedFiles);
      })
      .catch(error => {
        this.clicked = false;
        this.notification.ErrorMessage(error.message, '', 2500);
      });
    }
  }

  // valid image extension "jpg", "jpeg", "gif", "png"
  isValidExtension(type: string) {
    return type.split('/')[0] === 'image';
  }

  // file size > 2048 kb
  isValidImageSize(size: number) {
    return (size / 1024) <= 2048;
  }

  closeAlert() {
    this.alert.nativeElement.classList.remove('show');
    this.showError = false;
    this.extensionError = false;
    this.sizeError = false;
    this.fileName = '';
  }
}
