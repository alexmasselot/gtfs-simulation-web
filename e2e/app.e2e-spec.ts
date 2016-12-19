import { GtfsSimulationWebPage } from './app.po';

describe('gtfs-simulation-web App', function() {
  let page: GtfsSimulationWebPage;

  beforeEach(() => {
    page = new GtfsSimulationWebPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
