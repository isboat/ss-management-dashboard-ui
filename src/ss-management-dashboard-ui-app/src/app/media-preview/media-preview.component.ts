import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { MediaAssetModel } from 'app/models/media-asset-response.model';

@Component({
  selector: 'media-preview',
  templateUrl: './media-preview.component.html',
  styleUrls: ['./media-preview.component.css']
})
export class MediaPreviewComponent implements OnInit, OnDestroy {
  
  @Input() data: MediaAssetModel;
  @Input() previewWidth: string;

  mediaWidth: string = "200px";
  constructor() { }

  ngOnInit() {
    if(this.previewWidth) this.mediaWidth = this.previewWidth;
  }

  ngOnDestroy() {
  }

  isVideoMedia(mediaType: number): boolean
  {
      return mediaType === 2; //1 for image, 2 for video
  }
}
