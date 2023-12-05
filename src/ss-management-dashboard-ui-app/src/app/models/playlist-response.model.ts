import { MediaAssetModel } from "./media-asset-response.model";

export class PlaylistModel
{
    created: string;
    modifiedDate: string;
    id: string;
    tenantId: string;
    name: string;
}

export class PlaylistWithItemsModel
{
    created: string;
    modifiedDate: string;
    id: string;
    tenantId: string;
    name: string;
    assetItems: MediaAssetModel[]
}