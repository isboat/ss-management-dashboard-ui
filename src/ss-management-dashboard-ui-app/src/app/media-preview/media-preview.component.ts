import { Component, OnDestroy, OnInit, Input } from '@angular/core';
import { AssetModel } from 'app/models/asset-response.model';

@Component({
  selector: 'media-preview',
  templateUrl: './media-preview.component.html',
  styleUrls: ['./media-preview.component.css']
})
export class MediaPreviewComponent implements OnInit, OnDestroy {
  
  @Input() data: AssetModel;
  @Input() assetUrl: string;
  @Input() assetType: number;
  @Input() previewWidth: string;

  mediaWidth: string = "200px";
  constructor() { }

  ngOnInit() {
    if(this.previewWidth) this.mediaWidth = this.previewWidth;
    if(this.assetUrl && this.assetType)
    {
      this.data = {
        id: null,
        assetUrl: this.assetUrl,
        tenantId: null,
        type: this.assetType,
        description: null,
        editName: null,
        name: null
      }
    }
  }

  ngOnDestroy() {
  }

  isVideoMedia(mediaType: number): boolean
  {
      return mediaType === 2; //1 for image, 2 for video
  }
}
