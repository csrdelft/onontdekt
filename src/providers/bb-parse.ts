/*
Copyright (C) 2011 Patrick Gillespie, http://patorjk.com/

Permission is hereby granted, free of charge, to any person obtaining a copy
of this software and associated documentation files (the "Software"), to deal
in the Software without restriction, including without limitation the rights
to use, copy, modify, merge, publish, distribute, sublicense, and/or sell
copies of the Software, and to permit persons to whom the Software is
furnished to do so, subject to the following conditions:

The above copyright notice and this permission notice shall be included in
all copies or substantial portions of the Software.

THE SOFTWARE IS PROVIDED "AS IS", WITHOUT WARRANTY OF ANY KIND, EXPRESS OR
IMPLIED, INCLUDING BUT NOT LIMITED TO THE WARRANTIES OF MERCHANTABILITY,
FITNESS FOR A PARTICULAR PURPOSE AND NONINFRINGEMENT. IN NO EVENT SHALL THE
AUTHORS OR COPYRIGHT HOLDERS BE LIABLE FOR ANY CLAIM, DAMAGES OR OTHER
LIABILITY, WHETHER IN AN ACTION OF CONTRACT, TORT OR OTHERWISE, ARISING FROM,
OUT OF OR IN CONNECTION WITH THE SOFTWARE OR THE USE OR OTHER DEALINGS IN
THE SOFTWARE.
*/

/*
  Extendible BBCode Parser v1.0.0
  https://github.com/patorjk/Extendible-BBCode-Parser

  Adjusted to function as an Angular 2 service.
  Several tags have been removed, changed, or added.
*/

import { Injectable } from '@angular/core';

const URL_PATTERN = /^(?:https?|file|c):(?:\/{1,3}|\\{1})[-a-zA-Z0-9:;,@#%&()~_?\+=\/\\\.]*$/;
const EMAIL_PATTERN = /[^\s@]+@[^\s@]+\.[^\s@]+/;

export interface IParseConfig {
  text: string;
  removeMisalignedTags: boolean;
  addInLineBreaks: boolean;
  escapeHtml: boolean;
}

export interface IParseResult {
  html: string;
  error: boolean;
  errorQueue: string[];
}

export interface ITag {
  openTag: (params: string, content: string) => string;
  closeTag: (params: string, content: string) => string;
  noParse?: boolean;
  displayContent?: boolean;
  restrictChildrenTo?: string[];
  restrictParentsTo?: string[];
  validChildLookup?: { [tag: string]: boolean };
  validParentLookup?: { [tag: string]: boolean };
}

@Injectable()
export class BBParseService {

  private tags: { [tag: string]: ITag };
  private tagList: string[];
  private tagsNoParseList: string[] = [];
  private bbRegExp: RegExp;
  private pbbRegExp: RegExp;
  private pbbRegExp2: RegExp;
  private openTags: RegExp;
  private closeTags: RegExp;

  /* -----------------------------------------------------------------------------
   * tags
   * This object contains a list of tags that your code will be able to understand.
   * Each tag object has the following properties:
   *
   *   openTag - A function that takes in the tag's parameters (if any) and its
   *             contents, and returns what its HTML open tag should be.
   *             Example: [color=red]test[/color] would take in "=red" as a
   *             parameter input, and "test" as a content input.
   *             It should be noted that any BBCode inside of "content" will have
   *             been processed by the time it enter the openTag function.
   *
   *   closeTag - A function that takes in the tag's parameters (if any) and its
   *              contents, and returns what its HTML close tag should be.
   *
   *   displayContent - Defaults to true. If false, the content for the tag will
   *                    not be displayed. This is useful for tags like IMG where
   *                    its contents are actually a parameter input.
   *
   *   restrictChildrenTo - A list of BBCode tags which are allowed to be nested
   *                        within this BBCode tag. If this property is omitted,
   *                        any BBCode tag may be nested within the tag.
   *
   *   restrictParentsTo - A list of BBCode tags which are allowed to be parents of
   *                       this BBCode tag. If this property is omitted, any BBCode
   *                       tag may be a parent of the tag.
   *
   *   noParse - true or false. If true, none of the content WITHIN this tag will be
   *             parsed by the XBBCode parser.
   *
   *
   *
   * LIMITIONS on adding NEW TAGS:
   *  - Tag names should be alphanumeric (including underscores) and all tags should have an opening tag
   *    and a closing tag.
   *    The [*] tag is an exception because it was already a standard
   *    bbcode tag. Technecially tags don't *have* to be alphanumeric, but since
   *    regular expressions are used to parse the text, if you use a non-alphanumeric
   *    tag names, just make sure the tag name gets escaped properly (if needed).
   * --------------------------------------------------------------------------- */

  constructor() {
    this.tags = {
      'activiteit': { // TODO
        openTag: (params, content) => '<strong>Activiteit ' + (params ? params.substr(1) : content),
        closeTag: (params, content) => '</strong>'
      },
      'b': {
        openTag: (params, content) => {
          return '<strong>';
        },
        closeTag: (params, content) => {
          return '</strong>';
        }
      },
      /*
        This tag does nothing and is here mostly to be used as a classification for
        the bbcode input when evaluating parent-child tag relationships
      */
      'bbcode': {
        openTag: (params, content) => '',
        closeTag: (params, content) => ''
      },
      'bijbel': {
        openTag: (params, content) => {
          return '[bijbel]';
        },
        closeTag: (params, content) => {
          return '[/bijbel]';
        }
      },
      'citaat': {
        openTag: (params, content) => {
          // Todo: add author
          return '<blockquote>';
        },
        closeTag: (params, content) => '</blockquote>'
      },
      'code': {
        openTag: (params, content) => '<pre>',
        closeTag: (params, content) => '</pre>',
        noParse: true
      },
      'document': { // TODO
        openTag: (params, content) => '<strong>Document: ' + content,
        closeTag: (params, content) => '</strong>'
      },
      'email': {
        openTag: (params, content) => {
          let myEmail: string;

          if (!params) {
            myEmail = content.replace(/<.*?>/g, '');
          } else {
            myEmail = params.substr(1);
          }

          EMAIL_PATTERN.lastIndex = 0;
          if (!EMAIL_PATTERN.test(myEmail)) {
            return '<a>';
          }

          return '<a href="mailto:' + myEmail + '">';
        },
        closeTag: (params, content) => '</a>'
      },
      'foto': { // TODO
        openTag: (params, content) => {
          const url = params ? params.substr(1) : content;
          return '<strong>Foto ' + url;
        },
        closeTag: (params, content) => '</strong>'
      },
      'h': {
        openTag: (params, content) => {
          let size = params.length === 2 ? params.substr(1) : '2';
          if (size !== '1' && size !== '2' && size !== '3' && size !== '4' && size !== '5' && size !== '6') {
            size = '2';
          }
          return `<h${size}>`;
        },
        closeTag: (params, content) => {
          let size = params.length === 2 ? params.substr(1) : '2';
          if (size !== '1' && size !== '2' && size !== '3' && size !== '4' && size !== '5' && size !== '6') {
            size = '2';
          }
          return `</h${size}>`;
        }
      },
      'i': {
        openTag: (params, content) => '<em>',
        closeTag: (params, content) => '</em>'
      },
      'img': {
        openTag: (params, content) => {
          var myUrl = content;

          URL_PATTERN.lastIndex = 0;
          if (!URL_PATTERN.test(myUrl)) {
            myUrl = '';
          }

          return `<img src="${myUrl}" />`;
        },
        closeTag: (params, content) => '',
        displayContent: false
      },
      'ketzer': { // TODO
        openTag: (params, content) => '<strong>Ketzer ' + params.substr(1),
        closeTag: (params, content) => '</strong>'
      },
      'li': {
        openTag: (params, content) => '<li>',
        closeTag: (params, content) => '</li>',
        restrictParentsTo: ['list', 'ul', 'ol']
      },
      'lid': { // TODO
        openTag: (params, content) => '<strong>Lid ' + params.substr(1),
        closeTag: (params, content) => '</strong>'
      },
      'list': {
        openTag: (params, content) => '<ul>',
        closeTag: (params, content) => '</ul>',
        restrictChildrenTo: ['*', 'li']
      },
      'locatie': { // TODO
        openTag: (params, content) => '<strong>Locatie: ' + content,
        closeTag: (params, content) => '</strong>'
      },
      'offtopic': {
        openTag: (params, content) => '<small>',
        closeTag: (params, content) => '</small>'
      },
      'ol': {
        openTag: (params, content) => '<ol>',
        closeTag: (params, content) => '</ol>',
        restrictChildrenTo: ['*', 'li']
      },
      's': {
        openTag: (params, content) => '<del>',
        closeTag: (params, content) => '</del>'
      },
      'sub': {
        openTag: (params, content) => '<sub>',
        closeTag: (params, content) => '</sub>'
      },
      'sup': {
        openTag: (params, content) => '<sup>',
        closeTag: (params, content) => '</sup>'
      },
      'table': {
        openTag: (params, content) => '<table>',
        closeTag: (params, content) => '</table>',
        restrictChildrenTo: ['tr']
      },
      'td': {
        openTag: (params, content) => '<td>',
        closeTag: (params, content) => '</td>',
        restrictParentsTo: ['tr']
      },
      'th': {
        openTag: (params, content) => '<th>',
        closeTag: (params, content) => '</th>',
        restrictParentsTo: ['tr']
      },
      'tr': {
        openTag: (params, content) => '<tr>',
        closeTag: (params, content) => '</tr>',
        restrictChildrenTo: ['td', 'th'],
        restrictParentsTo: ['table']
      },
      'u': {
        openTag: (params, content) => '<u>',
        closeTag: (params, content) => '</u>'
      },
      'ubboff': {
        openTag: (params, content) => '',
        closeTag: (params, content) => '',
        noParse: true
      },
      'ul': {
        openTag: (params, content) => '<ul>',
        closeTag: (params, content) => '</ul>',
        restrictChildrenTo: ['*', 'li']
      },
      'url': {
        openTag: (params, content) => {
          let myUrl = params ? params.substr(1) : content.replace(/<.*?>/g, '');
          URL_PATTERN.lastIndex = 0;
          if (!URL_PATTERN.test(myUrl)) {
            myUrl = '#';
          }
          return `<a href="${myUrl}">`;
        },
        closeTag: (params, content) => '</a>'
      },
      'verklapper': { // TODO
        openTag: (params, content) => '<strong>Verklapper</strong>' + content,
        closeTag: (params, content) => '<strong>Einde verklapper</strong>'
      },
      'video': { // TODO
        openTag: (params, content) => {
          let myUrl = content.replace(/<.*?>/g, '');
          URL_PATTERN.lastIndex = 0;
          if (!URL_PATTERN.test(myUrl)) {
            myUrl = '#';
          }
          return `<a href="${myUrl}">`;
        },
        closeTag: (params, content) => '</a>'
      },
      'youtube': { // TODO
        openTag: (params, content) => {
          const url = 'http://youtu.be/' + content;
          return `<a href="${url}">`;
        },
        closeTag: (params, content) => '</a>'
      },
      /*
        The [*] tag is special since the user does not define a closing [/*] tag when writing their bbcode.
        Instead this module parses the code and adds the closing [/*] tag in for them. None of the tags you
        add will act like this and this tag is an exception to the others.
      */
      '*': {
        openTag: (params, content) => '<li>',
        closeTag: (params, content) => '</li>',
        restrictParentsTo: ['list', 'ul', 'ol']
      }
    };
    this.initTags();
  }

  public process(config: IParseConfig): IParseResult {
    var ret: IParseResult = {
      html: '',
      error: false,
      errorQueue: null
    };
    let errQueue: string[] = [];

    // Add ending tag for singulars
    config.text = config.text.replace(/\[(lid|ketzer|activiteit|document)=(.*)\]/gi, (match, value) => {
      return match + '[/' + value + ']';
    });

    for (let i = 0; i < 3; i++) {
      if (config.text.indexOf('[/]') > -1) {
        console.log('BEFORE', config.text);
        // Modify generic closing tags to be specific
        config.text = config.text.replace(/\[([^\/][^\[]*)\](((?!\[\/\]).)*)\[\/\]/gi, (match, value, value2) => {
          if (value.indexOf('=') > -1) {
            value = value.substring(0, value.indexOf('='));
          } else if (value.indexOf(' ') > -1) {
            value = value.substring(0, value.indexOf(' '));
          }
          console.log(match, value, value2, match.replace(new RegExp('\[\/\]$'), `[/${value}]`));

          return match.replace(new RegExp('\[\/\]$'), `[/${value}]`);
        });
        console.log('AFTER', config.text);
      }
    }

    config.text = config.text.replace(/</g, '&lt;'); // escape HTML tag brackets
    config.text = config.text.replace(/>/g, '&gt;'); // escape HTML tag brackets

    config.text = config.text.replace(this.openTags, (matchStr, openB, contents, closeB) => {
      return '<' + contents + '>';
    });
    config.text = config.text.replace(this.closeTags, (matchStr, openB, contents, closeB) => {
      return '<' + contents + '>';
    });

    config.text = config.text.replace(/\[/g, '&#91;'); // escape ['s that aren't apart of tags
    config.text = config.text.replace(/\]/g, '&#93;'); // escape ['s that aren't apart of tags
    config.text = config.text.replace(/</g, '['); // escape ['s that aren't apart of tags
    config.text = config.text.replace(/>/g, ']'); // escape ['s that aren't apart of tags

    // process tags that don't have their content parsed
    while (config.text !== (config.text = config.text.replace(this.pbbRegExp2, (matchStr, tagName, tagParams, tagContents) => {
      tagContents = tagContents.replace(/\[/g, '&#91;');
      tagContents = tagContents.replace(/\]/g, '&#93;');
      tagParams = tagParams || '';
      tagContents = tagContents || '';
      return '[' + tagName + tagParams + ']' + tagContents + '[/' + tagName + ']';
    })));

    config.text = this.fixStarTag(config.text); // add in closing tags for the [*] tag

    config.text = this.addBbcodeLevels(config.text); // add in level metadata

    errQueue = this.checkParentChildRestrictions('bbcode', config.text, -1, '', '', config.text, null);

    ret.html = this.parse(config);

    if (ret.html.indexOf('[') !== -1 || ret.html.indexOf(']') !== -1) {
      errQueue.push('Some tags appear to be misaligned.');
    }

    if (config.removeMisalignedTags) {
      ret.html = ret.html.replace(/\[.*?\]/g, '');
    }
    if (config.addInLineBreaks) {
      ret.html = '<div style="white-space:pre-wrap;">' + ret.html + '</div>';
    }
    if (!config.escapeHtml) {
      ret.html = ret.html.replace('&#91;', '['); // put ['s back in
      ret.html = ret.html.replace('&#93;', ']'); // put ['s back in
    }

    ret.error = errQueue.length !== 0;
    ret.errorQueue = errQueue;

    return ret;
  };

  // create tag list and lookup fields
  private initTags() {
    this.tagList = [];

    for (let prop in this.tags) {
      if (this.tags.hasOwnProperty(prop)) {
        if (prop === '*') {
          this.tagList.push('\\' + prop);
        } else {
          this.tagList.push(prop);
          if (this.tags[prop].noParse) {
            this.tagsNoParseList.push(prop);
          }
        }

        this.tags[prop].validChildLookup = {};
        this.tags[prop].validParentLookup = {};
        this.tags[prop].restrictParentsTo = this.tags[prop].restrictParentsTo || [];
        this.tags[prop].restrictChildrenTo = this.tags[prop].restrictChildrenTo || [];

        const len = this.tags[prop].restrictChildrenTo.length;
        for (let ii = 0; ii < len; ii++) {
          this.tags[prop].validChildLookup[this.tags[prop].restrictChildrenTo[ii]] = true;
        }
        const len2 = this.tags[prop].restrictParentsTo.length;
        for (let ii = 0; ii < len2; ii++) {
          this.tags[prop].validParentLookup[this.tags[prop].restrictParentsTo[ii]] = true;
        }
      }
    }

    const tagsOr = this.tagList.join('|');

    this.bbRegExp = new RegExp('<bbcl=([0-9]+) (' + tagsOr + ')([ =][^>]*?)?>((?:.|[\\r\\n])*?)<bbcl=\\1 /\\2>', 'gi');
    this.pbbRegExp = new RegExp('\\[(' + tagsOr + ')([ =][^\\]]*?)?\\]([^\\[]*?)\\[/\\1\\]', 'gi');
    this.pbbRegExp2 = new RegExp('\\[(' + this.tagsNoParseList.join('|') + ')([ =][^\\]]*?)?\\]([\\s\\S]*?)\\[/\\1\\]', 'gi');

    // create the regex for escaping ['s that aren't apart of tags
    var closeTagList: string[] = [];
    for (var j = 0; j < this.tagList.length; j++) {
      if (this.tagList[j] !== '\\*') { // the * tag doesn't have an offical closing tag
        closeTagList.push('/' + this.tagList[j]);
      }
    }

    this.openTags = new RegExp('(\\[)((?:' + tagsOr + ')(?:[ =][^\\]]*?)?)(\\])', 'gi');
    this.closeTags = new RegExp('(\\[)(' + closeTagList.join('|') + ')(\\])', 'gi');
  }

  private checkParentChildRestrictions(parentTag: string, bbcode: string, bbcodeLevel: number, tagName: string, tagParams: string, tagContents: string, errQueue: string[]): string[] {
    errQueue = errQueue || [];
    bbcodeLevel++;

    // get a list of all of the child tags to this tag
    var reTagNames = new RegExp('(<bbcl=' + bbcodeLevel + ' )(' + this.tagList.join('|') + ')([ =>])', 'gi'),
      reTagNamesParts = new RegExp('(<bbcl=' + bbcodeLevel + ' )(' + this.tagList.join('|') + ')([ =>])', 'i'),
      matchingTags = tagContents.match(reTagNames) || [],
      errStr: string,
      pInfo = this.tags[parentTag];

    reTagNames.lastIndex = 0;

    if (!matchingTags) {
      tagContents = '';
    }

    for (let ii = 0; ii < matchingTags.length; ii++) {
      reTagNamesParts.lastIndex = 0;
      let childTag = (matchingTags[ii].match(reTagNamesParts))[2].toLowerCase();

      if (pInfo && pInfo.restrictChildrenTo && pInfo.restrictChildrenTo.length > 0) {
        if (!pInfo.validChildLookup[childTag]) {
          errStr = 'The tag "' + childTag + '" is not allowed as a child of the tag "' + parentTag + '"';
          errQueue.push(errStr);
        }
      }
      let cInfo = this.tags[childTag];
      if (cInfo.restrictParentsTo.length > 0) {
        if (!cInfo.validParentLookup[parentTag]) {
          errStr = 'The tag "' + parentTag + '" is not allowed as a parent of the tag "' + childTag + '"';
          errQueue.push(errStr);
        }
      }

    }

    tagContents = tagContents.replace(this.bbRegExp, (matchStr, bbcodeLevel, tagName, tagParams, tagContents) => {
      errQueue = this.checkParentChildRestrictions(tagName.toLowerCase(), matchStr, bbcodeLevel, tagName, tagParams, tagContents, errQueue);
      return matchStr;
    });
    return errQueue;
  }

  /*
    This function updates or adds a piece of metadata to each tag called "bbcl" which
    indicates how deeply nested a particular tag was in the bbcode. This property is removed
    from the HTML code tags at the end of the processing.
  */
  private updateTagDepths(tagContents: string): string {
    tagContents = tagContents.replace(/\<([^\>][^\>]*?)\>/gi, (matchStr, subMatchStr) => {
      var bbCodeLevel = subMatchStr.match(/^bbcl=([0-9]+) /);
      if (bbCodeLevel === null) {
        return '<bbcl=0 ' + subMatchStr + '>';
      } else {
        return '<' + subMatchStr.replace(/^(bbcl=)([0-9]+)/, (matchStr: string, m1: string, m2: string) => {
          return m1 + (parseInt(m2, 10) + 1);
        }) + '>';
      }
    });
    return tagContents;
  }

  /*
    This function removes the metadata added by the updateTagDepths function
  */
  private unprocess(tagContent: string): string {
    return tagContent.replace(/<bbcl=[0-9]+ \/\*>/gi, '').replace(/<bbcl=[0-9]+ /gi, '&#91;').replace(/>/gi, '&#93;');
  }

  private parse(config: IParseConfig): string {
    const replaceFunct = (matchStr: string, bbcodeLevel: string, tagName: string, tagParams: string, tagContents: string) => {
      tagName = tagName.toLowerCase();

      var processedContent: string = this.tags[tagName].noParse ? this.unprocess(tagContents) : tagContents.replace(this.bbRegExp, replaceFunct),
        openTag = this.tags[tagName].openTag(tagParams, processedContent),
        closeTag = this.tags[tagName].closeTag(tagParams, processedContent);

      if (this.tags[tagName].displayContent === false) {
        processedContent = '';
      }

      return openTag + processedContent + closeTag;
    };

    var output = config.text;
    output = output.replace(this.bbRegExp, replaceFunct);
    return output;
  }

  /*
    The star tag [*] is special in that it does not use a closing tag. Since this parser requires that tags to have a closing
    tag, we must pre-process the input and add in closing tags [/*] for the star tag.
    We have a little levaridge in that we know the text we're processing wont contain the <> characters (they have been
    changed into their HTML entity form to prevent XSS and code injection), so we can use those characters as markers to
    help us define boundaries and figure out where to place the [/*] tags.
  */
  private fixStarTag(text: string): string {
    text = text.replace(/\[(?!\*[ =\]]|list([ =][^\]]*)?\]|\/list[\]])/ig, '<');
    text = text.replace(/\[(?=list([ =][^\]]*)?\]|\/list[\]])/ig, '>');

    while (text !== (text = text.replace(/>list([ =][^\]]*)?\]([^>]*?)(>\/list])/gi, (matchStr, contents, endTag) => {

      var innerListTxt = matchStr;
      while (innerListTxt !== (innerListTxt = innerListTxt.replace(/\[\*\]([^\[]*?)(\[\*\]|>\/list])/i, (matchStr, contents, endTag) => {
        if (endTag.toLowerCase() === '>/list]') {
          endTag = '</*]</list]';
        } else {
          endTag = '</*][*]';
        }
        return '<*]' + contents + endTag;
      })));

      innerListTxt = innerListTxt.replace(/>/g, '<');
      return innerListTxt;
    })));

    // add ['s for our tags back in
    text = text.replace(/</g, '[');
    return text;
  }

  private addBbcodeLevels(text: string): string {
    while (text !== (text = text.replace(this.pbbRegExp, (matchStr, tagName, tagParams, tagContents) => {
      matchStr = matchStr.replace(/\[/g, '<');
      matchStr = matchStr.replace(/\]/g, '>');
      return this.updateTagDepths(matchStr);
    })));
    return text;
  }

}
