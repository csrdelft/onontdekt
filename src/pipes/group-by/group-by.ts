import { Pipe, PipeTransform } from '@angular/core';

export interface Group {
  name: string;
  elements: any[];
}

export interface Grouped {
  [key: string]: Group;
}

@Pipe({
  name: 'csrGroupBy'
})
export class GroupByPipe implements PipeTransform {
  public transform(elements: any[], groupBy: (element: any) => string): Group[] {
    if (!elements) {
      return null;
    }

    const groups: Grouped = elements.reduce((groups: Grouped, element: any) => {
      const key = groupBy(element);
      if (!groups[key]) {
        groups[key] = {
          name: key,
          elements: []
        };
      }
      groups[key].elements.push(element);
      return groups;
    }, {});

    return Object.keys(groups).map(key => groups[key]);
  }
}
