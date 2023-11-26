export class TemplateModel
{
    key: string;
    label: string;
    requiredProperties: TemplateProperty[];
    subTypes: SubtypeTemplate[];
}

export class TemplateProperty
{
    key: string;
    value: string;
    label: string;
}
export class SubtypeTemplate
{
    key: string;
    label: string;
}