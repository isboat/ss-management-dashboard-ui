import { AssetModel } from "./asset-response.model";

export class PlaylistModel
{
    created: string;
    modifiedDate: string;
    id: string;
    tenantId: string;
    name: string;
    assetIds: string[];
    itemDuration: any;

    editName: boolean
}

export class DurationSpan 
{
    hours: string
    minutes: string
    seconds: string
}

export class PlaylistWithItemsModel extends PlaylistModel
{
    assetItems: AssetModel[]
}