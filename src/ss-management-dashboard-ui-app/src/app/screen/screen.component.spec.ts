import { of } from 'rxjs';

import { ScreenModel } from 'app/models/screen-response.model';
import { TemplateModel } from 'app/models/template-response.model';
import { ScreenDetailsComponent } from './screen.component';

describe('ScreenDetailsComponent signals', () => {
  const screen = {
    id: 'screen-1',
    layout: { id: 'layout-1', templateKey: 'Media', subType: '', templateProperties: [] }
  } as ScreenModel;
  const template = {
    key: 'Media',
    label: 'Media',
    requiredProperties: [{ key: 'backgroundOpacity', label: 'Opacity', value: '100' }],
    subTypes: []
  } as TemplateModel;

  function createComponent() {
    const auth = { adminUser: () => true };
    const dataService = {
      fetchTemplates: () => of([template]),
      updateScreen: () => of(undefined)
    };
    return new ScreenDetailsComponent(
      auth as any,
      {} as any,
      dataService as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any,
      {} as any
    );
  }

  it('applies the loaded template when screen data arrives first', () => {
    const component = createComponent();
    component.data.set(screen);

    component.fetchTemplates();

    expect(component.selectedTemplate()).toBe(template);
    expect(component.selectedTemplateHasMedia()).toBeTrue();
    expect(component.data()?.layout.templateProperties).toEqual(template.requiredProperties);
    expect(component.data()?.layout.templateProperties[0]).not.toBe(template.requiredProperties[0]);
  });
});
