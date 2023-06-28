import { TemplateProperty } from "./template-response.model";

export class ScreenModel
{
    id: string;
    tenantId: string;
    displayName: string;
    menuEntityId: string;
    mediaAssetEntityId: string;
    templateKey: string;
    templateProperties: TemplateProperty[];
}