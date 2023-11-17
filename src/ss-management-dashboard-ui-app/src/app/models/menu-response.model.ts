export class MenuModel
{
    id: string;
    tenantId: string;
    name: string;
    description: string;
    title: string;
    currency: string;
    iconUrl: string;
    menuItems: MenuItemModel[]
}

export class MenuItemModel
{
    id: string;
    name: string;
    description: string;
    title: string;
    price: string;
    iconUrl: string;
}