/**
 * @packageDocumentation
 * @module utils
 */

import { Pipe, PipeTransform } from '@angular/core';


@Pipe({
  name: 'pure',
})
export class PurePipe implements PipeTransform {
  /**
   * ! Notice: function overload is not supported for `mapper`,
   * you may have to use `$any` to workaround in template.
   */
  transform<T extends (...args: any) => any>(
    value: Parameters<T>[0],
    mapper: T,
    ...args: any
  ) {
    return mapper(value, ...args) as ReturnType<T>;
  }
}
