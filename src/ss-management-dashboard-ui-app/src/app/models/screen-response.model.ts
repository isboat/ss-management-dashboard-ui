import { TemplateProperty } from "./template-response.model";

export class ScreenModel
{
    id: string;
    tenantId: string;
    displayName: string;
    menuEntityId: string;
    mediaAssetEntityId: string;
    playlistId: string;
    externalMediaSource: string;
    textEditorData: string;
    layout: LayoutModel
}

export class LayoutModel
{
    id: string;
    templateKey: string;
    templateProperties: TemplateProperty[];
    subType: string;
}