import { Component, OnDestroy, OnInit, Input, Output, EventEmitter } from '@angular/core';
import { AssetModel } from 'app/models/asset-response.model';

@Component({
  selector: 'media-dropdown',
  templateUrl: './media-dropdown.component.html',
  styleUrls: ['./media-dropdown.component.css']
})
export class MediaDropdownComponent implements OnInit, OnDestroy {
  
  @Input() mediaAssets: AssetModel[];
    
  @Output() clickEmitter = new EventEmitter();

  constructor() { }

  ngOnInit() {
  }

  ngOnDestroy() {
  }

  isVideoMedia(mediaType: number): boolean
  {
      return mediaType === 2; //1 for image, 2 for video
  }

  onMediaSelect(id: string)
  {
    this.clickEmitter.emit({ mediaId: id });
  }
}
