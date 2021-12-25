# @handy-common-utils/misc-utils

Miscellaneous utilities

[![Version](https://img.shields.io/npm/v/@handy-common-utils/misc-utils.svg)](https://npmjs.org/package/@handy-common-utils/misc-utils)
[![Downloads/week](https://img.shields.io/npm/dw/@handy-common-utils/misc-utils.svg)](https://npmjs.org/package/@handy-common-utils/misc-utils)
[![CI](https://github.com/handy-common-utils/misc-utils/actions/workflows/ci.yml/badge.svg)](https://github.com/handy-common-utils/misc-utils/actions/workflows/ci.yml)
[![codecov](https://codecov.io/gh/handy-common-utils/misc-utils/branch/master/graph/badge.svg?token=awSIttXQ6L)](https://codecov.io/gh/handy-common-utils/misc-utils)

## How to use

First add it as a dependency:

```sh
npm install @handy-common-utils/misc-utils
```

Then you can use it in the code:

```javascript
import { shortBase64UrlFromUInt32 } from '@handy-common-utils/misc-utils';

const urlSafeBase64 = shortBase64UrlFromUInt32(12345);
```

# API

<!-- API start -->
<a name="readmemd"></a>

@handy-common-utils/misc-utils

## @handy-common-utils/misc-utils

### Table of contents

#### Functions

- [base64FromUInt32](#base64fromuint32)
- [base64UrlFromUInt32](#base64urlfromuint32)
- [shortBase64FromUInt32](#shortbase64fromuint32)
- [shortBase64UrlFromUInt32](#shortbase64urlfromuint32)
- [urlSafe](#urlsafe)

### Functions

#### base64FromUInt32

▸ **base64FromUInt32**<`T`\>(`ui32`): `Exclude`<`T`, `number`\> \| `string`

Encode an unsigned 32-bit integer into BASE64 string.

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `undefined` \| ``null`` \| `number` |

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ui32` | `T` | A number which could also be null or undefined. It must be a valid unsigned 32-bit integer. Behavior is undefined when valueis anything other than an unsigned 32-bit integer. |

##### Returns

`Exclude`<`T`, `number`\> \| `string`

BASE64 string representing the integer input, or the original input if it is null or undefined.

___

#### base64UrlFromUInt32

▸ **base64UrlFromUInt32**<`T`\>(`ui32`, `replacements?`): `Exclude`<`T`, `number`\> \| `string`

Encode an unsigned 32-bit integer into URL/path safe BASE64 string.

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `undefined` \| ``null`` \| `number` |

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `ui32` | `T` | `undefined` | A number which could also be null or undefined. It must be a valid unsigned 32-bit integer. Behavior is undefined when valueis anything other than an unsigned 32-bit integer. |
| `replacements` | `string` | `'_-='` | A string containing replacement characters for "/", "+", and "=". If omitted, default value of '_-=' would be used. |

##### Returns

`Exclude`<`T`, `number`\> \| `string`

URL/path safe BASE64 string representing the integer input, or the original input if it is null or undefined.

___

#### shortBase64FromUInt32

▸ **shortBase64FromUInt32**<`T`\>(`ui32`): `Exclude`<`T`, `number`\> \| `string`

Encode an unsigned 32-bit integer into BASE64 string without trailing '='.

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `undefined` \| ``null`` \| `number` |

##### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ui32` | `T` | A number which could also be null or undefined. It must be a valid unsigned 32-bit integer. Behavior is undefined when valueis anything other than an unsigned 32-bit integer. |

##### Returns

`Exclude`<`T`, `number`\> \| `string`

BASE64 string without trailing '=' representing the integer input, or the original input if it is null or undefined.

___

#### shortBase64UrlFromUInt32

▸ **shortBase64UrlFromUInt32**<`T`\>(`ui32`, `replacements?`): `Exclude`<`T`, `number`\> \| `string`

Encode an unsigned 32-bit integer into URL/path safe BASE64 string without trailling '='.

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `undefined` \| ``null`` \| `number` |

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `ui32` | `T` | `undefined` | A number which could also be null or undefined. It must be a valid unsigned 32-bit integer. Behavior is undefined when valueis anything other than an unsigned 32-bit integer. |
| `replacements` | `string` | `'_-'` | A string containing replacement characters for "/" and "+". If omitted, default value of '_-' would be used. |

##### Returns

`Exclude`<`T`, `number`\> \| `string`

URL/path safe BASE64 string without trailing '=' representing the integer input, or the original input if it is null or undefined.

___

#### urlSafe

▸ **urlSafe**<`T`\>(`base64Input`, `replacements?`): `T`

Make a "normal" (BASE64) string URL/path safe.

##### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `undefined` \| ``null`` \| `string` |

##### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `base64Input` | `T` | `undefined` | A (BASE64) string which could be null or undefined. |
| `replacements` | `string` | `'_-='` | A string containing replacement characters for "/", "+", and "=". If omitted, default value of '_-=' would be used. |

##### Returns

`T`

URL/path safe version of the (BASE64) input string, or the original input if it is null or undefined.
<!-- API end -->
