export class TemplateModel
{
    key: string;
    requiredProperties: RequiredProperty[];
}

export class RequiredProperty
{
    key: string;
    value: string;
    label: string;
}