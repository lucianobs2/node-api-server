import { ArgumentMetadata, ParseEnumPipe } from '@nestjs/common';

export class OptionalParseENUMPipe<T = any> extends ParseEnumPipe<T> {
  override async transform(value: T, metadata: ArgumentMetadata) {
    if (typeof value === 'undefined') {
      return undefined;
    }

    return super.transform(value, metadata);
  }
}
