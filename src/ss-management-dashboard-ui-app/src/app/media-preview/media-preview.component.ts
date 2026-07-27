import { Component, computed, input } from '@angular/core';
import { AssetModel } from 'app/models/asset-response.model';

@Component({
  standalone: false,
  selector: 'media-preview',
  templateUrl: './media-preview.component.html',
  styleUrls: ['./media-preview.component.css']
})
export class MediaPreviewComponent {
  readonly data = input<AssetModel>();
  readonly assetUrl = input<string>();
  readonly assetType = input<number>();
  readonly previewWidth = input('200px');
  readonly dataAlt = input('');
  readonly media = computed(() => {
    if(this.assetUrl() && this.assetType()) {
      return {
        id: null,
        assetUrl: this.assetUrl(),
        tenantId: null,
        type: this.assetType(),
        description: null,
        editName: null,
        name: null
      } as AssetModel;
    }
    return this.data();
  });

  isVideoMedia(mediaType: number): boolean
  {
      return mediaType === 2; //1 for image, 2 for video
  }
}
