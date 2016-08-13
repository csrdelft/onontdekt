describe('LustrumApp', () => {

  beforeEach(() => {
    browser.get('');
  });

  it('should have <nav>', () => {
    expect(element(by.css('ion-navbar')).isPresent()).toEqual(true);
  });
});
