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

```javascript
 // use chalk (chalk is not a dependency of this package, you need to add chalk as a dependency separately)
 import chalk from 'chalk';
 import { LineLogger } from '@handy-common-utils/misc-utils';

 // this.flags is an object with properties "debug" and "quiet"
 this.output = LineLogger.consoleWithColour(this.flags, chalk);
 this.output.warn('Configuration file not found, default configuration would be used.');  // it would be printed out in yellow
```

# API

<!-- API start -->
<a name="readmemd"></a>

## @handy-common-utils/misc-utils

### Modules

- [index](#modulesindexmd)
- [line-logger](#modulesline_loggermd)

## Classes


<a name="classesline_loggerlineloggermd"></a>

### Class: LineLogger<DEBUG_FUNC, INFO_FUNC, WARN_FUNC, ERROR_FUNC\>

[line-logger](#modulesline_loggermd).LineLogger

A LineLogger logs/prints one entire line of text before advancing to another line.
This class is useful for encapsulating console.log/info/warn/error functions.
By having an abstraction layer, your code can switching to a different output with nearly no change.

Please note that although the name contains "Logger", this class is not intended to be used as a generic logger.
It is intended for "logging for humans to read" scenario.

`LineLogger.console()` and `LineLogger.consoleWithColour()` are ready to use convenient functions.
Or you can use the constructor to build your own wrappers.

**`example`**
```javascript


// Just a wrapper of console.log/info/warn/error
const consoleLogger = LineLogger.console();

// Wrapper of console.log/info/warn/error but it mutes console.log
const lessVerboseConsoleLogger = LineLogger.console({debug: false});

// Wrapper of console.log/info/warn/error but it mutes console.log and console.info
const lessVerboseConsoleLogger = LineLogger.console({quiet: true});

// use chalk (chalk is not a dependency of this package, you need to add chalk as a dependency separately)
import chalk from 'chalk';
// this.flags is an object with properties "debug" and "quiet"
this.output = LineLogger.consoleWithColour(this.flags, chalk);
this.output.warn('Configuration file not found, default configuration would be used.');  // it would be printed out in yellow

```
#### Type parameters

| Name | Type |
| :------ | :------ |
| `DEBUG_FUNC` | extends `Function` |
| `INFO_FUNC` | extends `Function` |
| `WARN_FUNC` | extends `Function` |
| `ERROR_FUNC` | extends `Function` |

#### Constructors

##### constructor

• **new LineLogger**<`DEBUG_FUNC`, `INFO_FUNC`, `WARN_FUNC`, `ERROR_FUNC`\>(`debugFunction`, `infoFunction`, `warnFunction`, `errorFunction`, `isDebug?`, `isQuiet?`)

Constructor

###### Type parameters

| Name | Type |
| :------ | :------ |
| `DEBUG_FUNC` | extends `Function` |
| `INFO_FUNC` | extends `Function` |
| `WARN_FUNC` | extends `Function` |
| `ERROR_FUNC` | extends `Function` |

###### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `debugFunction` | `DEBUG_FUNC` | `undefined` | function for outputting debug information |
| `infoFunction` | `INFO_FUNC` | `undefined` | function for outputting info information |
| `warnFunction` | `WARN_FUNC` | `undefined` | function for outputting warn information |
| `errorFunction` | `ERROR_FUNC` | `undefined` | function for outputting error information |
| `isDebug` | `boolean` | `false` | is debug output enabled or not, it could be overriden by isQuiet |
| `isQuiet` | `boolean` | `false` | is quiet mode enabled or not. When quiet mode is enabled, both debug and info output would be discarded. |

#### Properties

| Property | Description |
| --- | --- |
| • **debug**: `DEBUG_FUNC` |  |
| • **error**: `ERROR_FUNC` |  |
| • **info**: `INFO_FUNC` |  |
| • **isDebug**: `boolean` = `false` |  |
| • **isQuiet**: `boolean` = `false` |  |
| • **warn**: `WARN_FUNC` |  |
| ▪ `Static` `Protected` **NO\_OP\_FUNC**: () => `void` | **Type declaration:**<br>▸ (): `void`<br><br>**Returns:**<br>`void` |


#### Methods

##### console

▸ `Static` **console**<`FLAGS`\>(`flags?`, `debugFlagName?`, `quietFlagName?`): [`LineLogger`](#classesline_loggerlineloggermd)<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\>

Build an instance with console.log/info/warn/error.

###### Type parameters

| Name | Type |
| :------ | :------ |
| `FLAGS` | extends `Record`<`string`, `any`\> |

###### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `flags` | `FLAGS` | `undefined` | The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled. Values of those fields are evaluated only once within this function. They are not evaluated when debug/info/warn/error functions are called. |
| `debugFlagName` | keyof `FLAGS` | `'debug'` | Name of the debug field in the flags object |
| `quietFlagName` | keyof `FLAGS` | `'quiet'` | Name of the quiet field in the flags object |

###### Returns

[`LineLogger`](#classesline_loggerlineloggermd)<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\>

An instance that uses console.log/info/warn/error.

___

##### consoleLike

▸ `Static` **consoleLike**(`log`): [`LineLogger`](#classesline_loggerlineloggermd)<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\>

Build an instance from 'log' (https://github.com/medikoo/log).
`info` of the LineLogger is mapped to `notice` of the medikoo log.

###### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `log` | `MedikooLogger` | instance of the logger |

###### Returns

[`LineLogger`](#classesline_loggerlineloggermd)<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\>

instance of LineLogger that is actually ConsoleLineLogger type

___

##### consoleWithColour

▸ `Static` **consoleWithColour**<`FLAGS`, `COLOURER`\>(`flags`, `colourer`, `debugColourFuncName?`, `infoColourFuncName?`, `warnColourFuncName?`, `errorColourFuncName?`, `debugFlagName?`, `quietFlagName?`): [`LineLogger`](#classesline_loggerlineloggermd)<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\>

Build an instance with console.log/info/warn/error and chalk/colors/cli-color.
This package does not depend on chalk or colors or cli-color,
you need to add them as dependencies separately.

###### Type parameters

| Name | Type |
| :------ | :------ |
| `FLAGS` | extends `Record`<`string`, `any`\> |
| `COLOURER` | extends `Record`<`string`, `any`\> |

###### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `flags` | `FLAGS` | `undefined` | The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled. Values of those fields are evaluated only once within this function. They are not evaluated when debug/info/warn/error functions are called. |
| `colourer` | `COLOURER` | `undefined` | Supplier of the colouring function, such as chalk or colors or cli-color |
| `debugColourFuncName` | keyof `COLOURER` | `'grey'` | Name of the function within colourer that will be used to add colour to debug messages, or null if colouring is not desired. |
| `infoColourFuncName?` | keyof `COLOURER` | `undefined` | Name of the function within colourer that will be used to add colour to info messages, or null if colouring is not desired. |
| `warnColourFuncName` | keyof `COLOURER` | `'yellow'` | Name of the function within colourer that will be used to add colour to warn messages, or null if colouring is not desired. |
| `errorColourFuncName` | keyof `COLOURER` | `'red'` | Name of the function within colourer that will be used to add colour to error messages, or null if colouring is not desired. |
| `debugFlagName` | keyof `FLAGS` | `'debug'` | Name of the debug field in the flags object |
| `quietFlagName` | keyof `FLAGS` | `'quiet'` | Name of the quiet field in the flags object |

###### Returns

[`LineLogger`](#classesline_loggerlineloggermd)<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\>

An instance that uses console.log/info/warn/error and also adds colour to the messages using chalk/colors/cli-color.

## Modules


<a name="modulesindexmd"></a>

### Module: index

#### References

##### ConsoleLineLogger

Re-exports [ConsoleLineLogger](#consolelinelogger)

___

##### LineLogger

Re-exports [LineLogger](#classesline_loggerlineloggermd)

___

##### consoleLike

Re-exports [consoleLike](#consolelike)

___

##### consoleWithColour

Re-exports [consoleWithColour](#consolewithcolour)

___

##### consoleWithoutColour

Re-exports [consoleWithoutColour](#consolewithoutcolour)

#### Functions

##### base64FromUInt32

▸ **base64FromUInt32**<`T`\>(`ui32`): `Exclude`<`T`, `number`\> \| `string`

Encode an unsigned 32-bit integer into BASE64 string.

###### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `undefined` \| ``null`` \| `number` |

###### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ui32` | `T` | A 32-bit integer number which could also be null or undefined. It must be a valid unsigned 32-bit integer. Behavior is undefined when valueis anything other than an unsigned 32-bit integer. If you don't care about loosing precision, you can convert a number by doing `n >>> 0` (See https://stackoverflow.com/questions/22335853/hack-to-convert-javascript-number-to-uint32) |

###### Returns

`Exclude`<`T`, `number`\> \| `string`

BASE64 string representing the integer input, or the original input if it is null or undefined.

___

##### base64UrlFromUInt32

▸ **base64UrlFromUInt32**<`T`\>(`ui32`, `replacements?`): `Exclude`<`T`, `number`\> \| `string`

Encode an unsigned 32-bit integer into URL/path safe BASE64 string.

###### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `undefined` \| ``null`` \| `number` |

###### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `ui32` | `T` | `undefined` | A 32-bit integer number which could also be null or undefined. It must be a valid unsigned 32-bit integer. Behavior is undefined when valueis anything other than an unsigned 32-bit integer. If you don't care about loosing precision, you can convert a number by doing `n >>> 0` (See https://stackoverflow.com/questions/22335853/hack-to-convert-javascript-number-to-uint32) |
| `replacements` | `string` | `'_-='` | A string containing replacement characters for "/", "+", and "=". If omitted, default value of '_-=' would be used. |

###### Returns

`Exclude`<`T`, `number`\> \| `string`

URL/path safe BASE64 string representing the integer input, or the original input if it is null or undefined.

___

##### shortBase64FromUInt32

▸ **shortBase64FromUInt32**<`T`\>(`ui32`): `Exclude`<`T`, `number`\> \| `string`

Encode an unsigned 32-bit integer into BASE64 string without trailing '='.

###### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `undefined` \| ``null`` \| `number` |

###### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `ui32` | `T` | A 32-bit integer number which could also be null or undefined. It must be a valid unsigned 32-bit integer. Behavior is undefined when valueis anything other than an unsigned 32-bit integer. If you don't care about loosing precision, you can convert a number by doing `n >>> 0` (See https://stackoverflow.com/questions/22335853/hack-to-convert-javascript-number-to-uint32) |

###### Returns

`Exclude`<`T`, `number`\> \| `string`

BASE64 string without trailing '=' representing the integer input, or the original input if it is null or undefined.

___

##### shortBase64UrlFromUInt32

▸ **shortBase64UrlFromUInt32**<`T`\>(`ui32`, `replacements?`): `Exclude`<`T`, `number`\> \| `string`

Encode an unsigned 32-bit integer into URL/path safe BASE64 string without trailling '='.

###### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `undefined` \| ``null`` \| `number` |

###### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `ui32` | `T` | `undefined` | A 32-bit integer number which could also be null or undefined. It must be a valid unsigned 32-bit integer. Behavior is undefined when valueis anything other than an unsigned 32-bit integer. If you don't care about loosing precision, you can convert a number by doing `n >>> 0` (See https://stackoverflow.com/questions/22335853/hack-to-convert-javascript-number-to-uint32) |
| `replacements` | `string` | `'_-'` | A string containing replacement characters for "/" and "+". If omitted, default value of '_-' would be used. |

###### Returns

`Exclude`<`T`, `number`\> \| `string`

URL/path safe BASE64 string without trailing '=' representing the integer input, or the original input if it is null or undefined.

___

##### urlSafe

▸ **urlSafe**<`T`\>(`base64Input`, `replacements?`): `T`

Make a "normal" (BASE64) string URL/path safe.

###### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `undefined` \| ``null`` \| `string` |

###### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `base64Input` | `T` | `undefined` | A (BASE64) string which could be null or undefined. |
| `replacements` | `string` | `'_-='` | A string containing replacement characters for "/", "+", and "=". If omitted, default value of '_-=' would be used. |

###### Returns

`T`

URL/path safe version of the (BASE64) input string, or the original input if it is null or undefined.


<a name="modulesline_loggermd"></a>

### Module: line-logger

#### Classes

- [LineLogger](#classesline_loggerlineloggermd)

#### Type aliases

##### ConsoleLineLogger

Ƭ **ConsoleLineLogger**: `ReturnType`<typeof [`console`](#console)\>

Type of the object returned by `LineLogger.console()` or `LineLogger.consoleWithColour()`.
It has the same function signatures as console.log/info/warn/error.

#### Functions

##### consoleLike

▸ **consoleLike**(`log`): [`LineLogger`](#classesline_loggerlineloggermd)<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\>

Build an instance from 'log' (https://github.com/medikoo/log).
`info` of the LineLogger is mapped to `notice` of the medikoo log.

###### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `log` | `MedikooLogger` | instance of the logger |

###### Returns

[`LineLogger`](#classesline_loggerlineloggermd)<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\>

instance of LineLogger that is actually ConsoleLineLogger type

___

##### consoleWithColour

▸ **consoleWithColour**<`FLAGS`, `COLOURER`\>(`flags`, `colourer`, `debugColourFuncName?`, `infoColourFuncName?`, `warnColourFuncName?`, `errorColourFuncName?`, `debugFlagName?`, `quietFlagName?`): [`LineLogger`](#classesline_loggerlineloggermd)<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\>

Build an encapsulation of console output functions with console.log/info/warn/error and chalk/colors/cli-color.

###### Type parameters

| Name | Type |
| :------ | :------ |
| `FLAGS` | extends `Record`<`string`, `any`\> |
| `COLOURER` | extends `Record`<`string`, `any`\> |

###### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `flags` | `FLAGS` | `undefined` | The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled. Values of those fields are evaluated only once within this function. They are not evaluated when debug/info/warn/error functions are called. |
| `colourer` | `COLOURER` | `undefined` | Supplier of the colouring function, such as chalk or colors or cli-color |
| `debugColourFuncName` | keyof `COLOURER` | `'grey'` | Name of the function within colourer that will be used to add colour to debug messages, or null if colouring is not desired. |
| `infoColourFuncName?` | keyof `COLOURER` | `undefined` | Name of the function within colourer that will be used to add colour to info messages, or null if colouring is not desired. |
| `warnColourFuncName` | keyof `COLOURER` | `'yellow'` | Name of the function within colourer that will be used to add colour to warn messages, or null if colouring is not desired. |
| `errorColourFuncName` | keyof `COLOURER` | `'red'` | Name of the function within colourer that will be used to add colour to error messages, or null if colouring is not desired. |
| `debugFlagName` | keyof `FLAGS` | `'debug'` | Name of the debug field in the flags object |
| `quietFlagName` | keyof `FLAGS` | `'quiet'` | Name of the quiet field in the flags object. Quiet flag can override debug flag. |

###### Returns

[`LineLogger`](#classesline_loggerlineloggermd)<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\>

An LineLogger instance that uses console.log/info/warn/error and also adds colour to the messages using chalk/colors/cli-color.

___

##### consoleWithoutColour

▸ **consoleWithoutColour**<`FLAGS`\>(`flags?`, `debugFlagName?`, `quietFlagName?`): [`LineLogger`](#classesline_loggerlineloggermd)<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\>

Build an encapsulation of console output functions with console.log/info/warn/error.

###### Type parameters

| Name | Type |
| :------ | :------ |
| `FLAGS` | extends `Record`<`string`, `any`\> |

###### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `flags` | `FLAGS` | `undefined` | The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled. Values of those fields are evaluated only once within this function. They are not evaluated when debug/info/warn/error functions are called. |
| `debugFlagName` | keyof `FLAGS` | `'debug'` | Name of the debug field in the flags object |
| `quietFlagName` | keyof `FLAGS` | `'quiet'` | Name of the quiet field in the flags object. Quiet flag can override debug flag. |

###### Returns

[`LineLogger`](#classesline_loggerlineloggermd)<(`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`, (`message?`: `any`, ...`optionalParams`: `any`[]) => `void`\>

An LineLogger instance that uses console.log/info/warn/error.
<!-- API end -->
