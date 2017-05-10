import { BBParseService, IParseConfig } from './bb-parse';
import { UrlService } from './url';

const config: IParseConfig = {
  text: null,
  removeMisalignedTags: false,
  addInLineBreaks: false,
  escapeHtml: false
};

const tests = [{
  input: '[activiteit]1234[/activiteit]',
  output: '<a href="https://csrdelft.nl/groepen/activiteiten/1234/">Activiteit 1234</a>'
}, {
  input: '[activiteit=1234]',
  output: '<a href="https://csrdelft.nl/groepen/activiteiten/1234/">Activiteit 1234</a>'
}, {
  input: '[activiteit=nope]',
  output: '<a></a>'
}, {
  input: '[bijbel]Job 3:1[/bijbel]',
  output: '<a href="https://www.debijbel.nl/bijbel/NBV/Job%203%3A1">Job 3:1</a>'
}, {
  input: '[citaat]lorem[/citaat]',
  output: 'Citaat:<br><blockquote>lorem</blockquote>'
}, {
  input: '[citaat=Naam]lorem[/citaat]',
  output: 'Citaat van Naam:<br><blockquote>lorem</blockquote>'
}, {
  input: '[document]1234[/document]',
  output: '<a href="https://csrdelft.nl/documenten/bekijken/1234/">Document 1234</a>'
}, {
  input: '[document=1234]',
  output: '<a href="https://csrdelft.nl/documenten/bekijken/1234/">Document 1234</a>'
}, {
  input: '[document=nope]',
  output: '<a></a>'
}, {
  input: '[foto]1234[/foto]',
  output: '<a></a>'
}, {
  input: '[foto]/a/b/c.jpg[/foto]',
  output: '<a href="https://csrdelft.nl/plaetjes/fotoalbum/a/b/c.jpg">\
<img width="150" height="150" src="https://csrdelft.nl/plaetjes/fotoalbum/a/b/_thumbs/c.jpg"></a>'
}, {
  input: '[img]https://csrdelft.nl/a.jpg[/img]',
  output: '<a href="https://csrdelft.nl/a.jpg">Foto</a>'
}, {
  input: '[ketzer]1234[/ketzer]',
  output: '<a href="https://csrdelft.nl/groepen/ketzers/1234/">Ketzer 1234</a>'
}, {
  input: '[ketzer=1234]',
  output: '<a href="https://csrdelft.nl/groepen/ketzers/1234/">Ketzer 1234</a>'
}, {
  input: '[ketzer=nope]',
  output: '<a></a>'
}, {
  input: '[lid=1113]',
  output: '<a href="#/leden/lid/1113">Lid 1113</a>'
}, {
  input: '[locatie]C.S.R. Delft[/locatie]',
  output: '<a href="https://maps.google.com?q=C.S.R.%20Delft">Locatie: C.S.R. Delft</a>'
}, {
  input: '[verklapper]hi[/verklapper]',
  output: '<a href="#/verklapper/" data-text="hi">Verklapper</a>'
}, {
  input: '[video]http://youtu.be/abcdefgh[/video]',
  output: '<a href="http://youtu.be/abcdefgh">Video</a>'
}, {
  input: '[youtube]abcdefgh[/youtube]',
  output: '<a href="http://youtu.be/abcdefgh">YouTube video</a>'
}];

class UrlServiceMock {
  open(url: string) {}
  getMapsUrl(query: string) {
    return 'https://maps.google.com?q=' + encodeURIComponent(query);
  }
}

describe('BBParseService', () => {
  let service: BBParseService;

  const urlMock = new UrlServiceMock() as UrlService;
  beforeEach(() => service = new BBParseService(urlMock));

  tests.forEach((test, index) => {
    it('should parse test #' + index, () => {
      config.text = test.input;
      const parsed = service.process(config);
      expect(parsed.error).toBe(false);
      expect(parsed.errorQueue.length).toBe(0);
      expect(parsed.html).toBe(test.output);
    });
  });

  it('should parse short closing tags', () => {
    config.text = '[img]https://csrdelft.nl/a.jpg[/]';
    const parsed = service.process(config);
    expect(parsed.error).toBe(false);
    expect(parsed.errorQueue.length).toBe(0);
    expect(parsed.html).toBe('<a href="https://csrdelft.nl/a.jpg">Foto</a>');
  });

});
