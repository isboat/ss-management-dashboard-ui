import { of } from 'rxjs';

import { DeviceModel } from 'app/models/device-response.model';
import { ScreenModel } from 'app/models/screen-response.model';
import { ScreenListComponent } from './screen-list.component';

describe('ScreenListComponent signals', () => {
  const screen = { id: 'screen-1', displayName: 'Lobby' } as ScreenModel;
  const linkedDevice = { id: 'device-1', screenId: screen.id } as DeviceModel;

  function createComponent() {
    const deviceService = {
      fetchDevices: () => of([linkedDevice]),
      linkToDevice: jasmine.createSpy('linkToDevice')
    };
    const dataService = {
      fetchScreens: () => of([screen]),
      publishScreen: () => of(undefined),
      deleteScreen: () => of(undefined)
    };
    const authService = {
      isAdminUser: () => true,
      getAuthorizationToken: () => 'token',
      redirectToLogin: jasmine.createSpy('redirectToLogin')
    };
    const notification = { showSuccess: jasmine.createSpy('showSuccess') };

    return {
      component: new ScreenListComponent(
        authService as any,
        deviceService as any,
        dataService as any,
        authService as any,
        notification as any
      ),
      deviceService
    };
  }

  it('derives the publish device from the selected screen', () => {
    const { component } = createComponent();
    component.devices.set([linkedDevice]);
    component.onSelectScreen(screen);

    expect(component.deviceIdForPublish()).toBe(linkedDevice.id);

    component.onDeviceSelect({ target: { value: 'all' } });
    expect(component.deviceIdForPublish()).toBe('all');
  });

  it('updates list state after loading and deleting a screen', () => {
    const { component } = createComponent();

    component.fetchListData();
    expect(component.listData()).toEqual([screen]);

    component.deleteScreen(screen.id);
    expect(component.listData()).toEqual([]);
  });

  it('publishes using the computed device selection', () => {
    const { component, deviceService } = createComponent();
    component.devices.set([linkedDevice]);
    component.onSelectScreen(screen);

    component.publishScreen(screen.id);

    expect(deviceService.linkToDevice).toHaveBeenCalledWith(linkedDevice.id, screen.id, [linkedDevice]);
  });
});
