import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'csrStripBB'
})
export class StripBBPipe implements PipeTransform {
  transform(value: string, args: any[]): string {
    value = value.replace(/\[img\](.*)\[\/(img)?\]/g, '📷');
    value = value.replace(/\[foto\](.*)\[\/(foto)?\]/g, '📷');
    value = value.replace(/\[video\](.*)\[\/(video)?\]/g, '📹');
    return value.replace(/\[\/?[^\]]*\]/g, '');
  }
}
