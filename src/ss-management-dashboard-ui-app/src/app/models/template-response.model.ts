export class TemplateModel
{
    key: string;
    requiredProperties: TemplateProperty[];
}

export class TemplateProperty
{
    key: string;
    value: string;
    label: string;
}