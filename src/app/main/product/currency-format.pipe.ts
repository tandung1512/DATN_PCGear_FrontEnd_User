import { Pipe, PipeTransform } from '@angular/core';

@Pipe({
  name: 'currencyFormat',
  standalone: true,  // Đảm bảo pipe là standalone
})
export class CurrencyFormatPipe implements PipeTransform {
  transform(value: number | string, currencySymbol: string = 'VNĐ'): string {
    if (value == null) return ''; // Nếu giá trị là null hoặc undefined, trả về chuỗi rỗng

    const numberValue = typeof value === 'string' ? parseFloat(value) : value;
    if (isNaN(numberValue)) return ''; // Nếu không phải số, trả về chuỗi rỗng

    return `${numberValue.toLocaleString()} ${currencySymbol}`;
  }
}
