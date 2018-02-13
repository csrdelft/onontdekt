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
  transform(
    elements: any[],
    groupBy: (element: any) => string
  ): Group[] | null {
    if (!elements) {
      return null;
    }

    const grouped: Grouped = elements.reduce(
      (groups: Grouped, element: any) => {
        const key = groupBy(element);
        if (!groups[key]) {
          groups[key] = {
            name: key,
            elements: []
          };
        }
        groups[key].elements.push(element);
        return groups;
      },
      {}
    );

    return Object.keys(grouped).map(key => grouped[key]);
  }
}
