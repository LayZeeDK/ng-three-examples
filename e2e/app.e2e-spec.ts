import { NgThreeExamplesPage } from './app.po';

describe('ng-three-examples App', function() {
  let page: NgThreeExamplesPage;

  beforeEach(() => {
    page = new NgThreeExamplesPage();
  });

  it('should display message saying app works', () => {
    page.navigateTo();
    expect(page.getParagraphText()).toEqual('app works!');
  });
});
