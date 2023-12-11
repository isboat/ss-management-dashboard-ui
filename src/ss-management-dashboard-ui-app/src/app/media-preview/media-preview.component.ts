import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { MediaAssetModel } from 'app/models/media-asset-response.model';

@Component({
  selector: 'media-preview',
  templateUrl: './media-preview.component.html',
  styleUrls: ['./media-preview.component.css']
})
export class MediaPreviewComponent implements OnInit, OnDestroy {
  
  @Input() data: MediaAssetModel;

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  isVideoMedia(mediaType: number): boolean
  {
      return mediaType === 2; //1 for image, 2 for video
  }
}
