import { AssetModel } from "./asset-response.model";

export class PlaylistModel
{
    created: string;
    modifiedDate: string;
    id: string;
    tenantId: string;
    name: string;
    itemIdAndTypePairs: PlaylistItemIdTypePair[];
    itemDuration: any;

    editName: boolean
}

export class PlaylistItemIdTypePair
{
    id: string;
    itemType: number
}

export class DurationSpan 
{
    hours: string
    minutes: string
    seconds: string
}

export class PlaylistWithItemsModel extends PlaylistModel
{
    items: any[]
}