import { HolidayGamePage } from './app.po';

describe('holiday-game App', () => {
  let page: HolidayGamePage;

  beforeEach(() => {
    page = new HolidayGamePage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
