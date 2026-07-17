import { TemplateProperty } from "./template-response.model";

export class ScreenModel
{
    id: string;
    tenantId: string;
    displayName: string;
    menuEntityId: string;
    mediaAssetEntityId: string;
    textAssetEntityId: string;
    playlistId: string;
    externalMediaSource: string;
    textEditorData: string;
    layout: LayoutModel

    editName: boolean; // ui property
}

export class LayoutModel
{
    id: string;
    templateKey: string;
    templateProperties: TemplateProperty[];
    subType: string;
}