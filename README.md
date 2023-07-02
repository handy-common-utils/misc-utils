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

```typescript
import { mask, maskAll, maskEmail, maskFullName, pathBasedReplacer } from '@handy-common-utils/misc-utils';

const masked = JSON.stringify(obj, pathBasedReplacer([
  [/.*\.x-api-key$/, maskAll],
  [/.*customer\.name$/, maskFullName],
  [/.*customer\..*[eE]mail$/, maskEmail],
  [/.*\.zip$/, (value: string) => value.slice(0, 3) + 'XX'],
  [/.*\.cc$/, () => undefined],
  [/.*\.ssn$/, mask],
]));
```

## Masking

In software development, it's often necessary to hide sensitive information
to protect user privacy or comply with regulations.
Masking is a common technique used to replace part of a sensitive value with a different,
non-sensitive value.
For example, you might mask credit card numbers, passwords, or email addresses. 

The `mask(input, keepLeft = 1, keepRight = 0, minLength = 3, maskLengthOrMaskString = null, maskPattern = '*')` function
can be used to mask the content of a string, replacing a part of the input string with a mask string.
It takes several optional parameters, including the number of characters to keep on the left and right sides of the string,
a minimum length for the input string to have unmask characters kept, and the mask pattern to use.
The `maskEmail(input)` and `maskFullName(input)` functions are specific variations of the mask function
that target email addresses and full names, respectively.
The `maskAll(input)` function masks all characters.

```typescript
expect(mask(undefined)).to.be.undefined;
expect(mask(null)).to.be.null;
expect(mask('')).to.equal('');

expect(mask('abcde')).to.equal('a****');
expect(mask('abc')).to.equal('a**');
expect(mask('ab')).to.equal('**');

expect(maskEmail('james.hu@address.com')).to.equal('j****.**@address.com');
expect(maskEmail('her@here.com')).to.equal('h**@here.com');
expect(maskEmail('me@here.com')).to.equal('**@here.com');
expect(maskEmail('my.new.email.address@example.com')).to.equal('**.n**.e****.a******@example.com');

expect(maskFullName('James Hu')).to.equal('J**** **');
expect(maskFullName('John Smith')).to.equal('J*** S****');
expect(maskFullName('Mike')).to.equal('M***');
expect(maskFullName('Mia')).to.equal('M**');
expect(maskFullName('Me')).to.equal('**');
expect(maskFullName('John von Neumann')).to.equal('J*** v** N******');
expect(maskFullName('Two  Spaces')).to.equal('T**  S*****');
expect(maskFullName('张三丰')).to.equal('张**');
expect(maskFullName('张三')).to.equal('**');
```

## Replacers for JSON.stringify(input, replacer, space)

The `pathAwareReplacer(replacer, options)` function allows you to build a replacer function that can be passed to `JSON.stringify(input, replacer, space)`.
Besides the key, value, and owning object, it also exposes more information to your callback function,
such like the full property path as both a dot (`.`) separated string and as an array, and an array of ancestor objects.
This can be useful when you need to replace specific values in an object, but you also want to know where those values were located in the object.

`pathBasedReplacer` is a function that takes an array of path-based masking rules and returns a function
that can be used as the second parameter in the `JSON.stringify` function.
This function allows you to mask sensitive information during `JSON.stringify` in a very flexible way.

Each element in the rules array contains two parts:
a regular expression that matches the full paths to the values you want to mask or replace,
and a masking or replacing function that takes the original value as input and returns the masked or replaced value.

For example, you could use `pathBasedReplacer` to replace all credit card numbers in an object with masked versions of the numbers:

```typescript
const maskCreditCard = (value: any) => "****-****-****-" + value.slice(-4);

const replacer = pathBasedReplacer([
  [/.*billing\.cc$/, maskCreditCard]
]);

const json = JSON.stringify({
  to: 'auditor@example.com',
  cc: 'auditing-trail@example.com',
  year: 2023,
  month: 2,
  orders: [
    {
      id: 123,
      billing: {
        address: '19 High Street',
        cc: '1234-5678-2222-3333',
      },
    },
    {
      id: 124,
      billing: {
        address: '88 Main Street',
        cc: '3435-8933-0009-2241',
      },
    },
  ],
}, replacer, 2);
```

## substituteAll

The `substituteAll(input, searchPattern, substitute)` function allows you to perform substitutions on an input string
by matching a specified pattern and replacing the matches with substitution strings built by a function.
It provides flexibility in handling complex substitution scenarios through the `substitute` callback function.

### Example Usage Scenarios:

- __Templating__: Replace placeholder variables in a template string with dynamic values. For example, transforming the template "Hello, {name}! How are you, {name}? I am {me}." into "Hello, John! How are you, John? I am James." by substituting `{name}` with the value "John" and `{me}` with value "James".

```typescript
const input = 'Hello, {name}! How are you, {name}? I am {me}.';
const searchPattern = /{([^{}]+)}/g;
const dict: Record<string, string> = {
  name: 'John',
  me: 'James',
};
const substitute: Parameters<typeof substituteAll>[2] = (_match, result) => {
  const key = result[1];
  return dict[key] ?? `{NOT FOUND: ${key}}`;
};
const result = substituteAll(input, searchPattern, substitute);

```

- __Text Transformation__: Modify specific segments of a string based on predefined patterns. For instance, converting dates written in a non-standard format, such as "MM/DD/YY", to a standardized format, like "YYYY-MM-DD", using a suitable regular expression pattern and substitution logic.

```typescript
const input = 'Event date: 12/31/21';
const searchPattern = / ((\d{2})\/(\d{2})\/(\d{2}))/g;
const substitute = (_: string, result: any) => {
  const [match, date, month, day, year] = result;
  const formattedDate = `20${year}-${month}-${day}`;
  return match.replace(date, formattedDate);
};

const result = substituteAll(input, searchPattern, substitute);

```

# API

<!-- API start -->
<a name="readmemd"></a>

## @handy-common-utils/misc-utils

### Modules

- [array](#modulesarraymd)
- [codec](#modulescodecmd)
- [http-status](#moduleshttp_statusmd)
- [index](#modulesindexmd)
- [line-logger](#modulesline_loggermd)
- [mask](#modulesmaskmd)
- [stringify-replacer](#modulesstringify_replacermd)
- [substitute](#modulessubstitutemd)

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

**`Example`**

```ts
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
| **debug**: `DEBUG_FUNC` |  |
| **error**: `ERROR_FUNC` |  |
| **info**: `INFO_FUNC` |  |
| **isDebug**: `boolean` = `false` | is debug output enabled or not, it could be overriden by isQuiet |
| **isQuiet**: `boolean` = `false` | is quiet mode enabled or not. When quiet mode is enabled, both debug and info output would be discarded. |
| **warn**: `WARN_FUNC` |  |
| `Static` `Protected` **NO\_OP\_FUNC**: () => `void` |  |


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

## Enums


<a name="enumshttp_statushttpstatuscodemd"></a>

### Enumeration: HttpStatusCode

[http-status](#moduleshttp_statusmd).HttpStatusCode

Some (not all) well known HTTP status codes

#### Enumeration Members

##### ACCEPTED202

• **ACCEPTED202** = ``202``

The request has been received but not yet acted upon. It is non-committal, meaning that there is no way in HTTP to later send an asynchronous response indicating the outcome of processing the request. It is intended for cases where another process or server handles the request, or for batch processing.

___

##### BAD\_GATEWAY502

• **BAD\_GATEWAY502** = ``502``

This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.

___

##### BAD\_REQUEST400

• **BAD\_REQUEST400** = ``400``

This response means that server could not understand the request due to invalid syntax.

___

##### CONFLICT409

• **CONFLICT409** = ``409``

This response is sent when a request conflicts with the current state of the server.

___

##### CREATED201

• **CREATED201** = ``201``

The request has succeeded and a new resource has been created as a result of it. This is typically the response sent after a PUT request.

___

##### FORBIDDEN403

• **FORBIDDEN403** = ``403``

The client does not have access rights to the content, i.e. they are unauthorized, so server is rejecting to give proper response. Unlike 401, the client's identity is known to the server.

___

##### GATEWAY\_TIMEOUT504

• **GATEWAY\_TIMEOUT504** = ``504``

This error response is given when the server is acting as a gateway and cannot get a response in time.

___

##### INTERNAL\_SERVER\_ERROR500

• **INTERNAL\_SERVER\_ERROR500** = ``500``

The server encountered an unexpected condition that prevented it from fulfilling the request.

___

##### METHOD\_NOT\_ALLOWED405

• **METHOD\_NOT\_ALLOWED405** = ``405``

The request method is known by the server but has been disabled and cannot be used. For example, an API may forbid DELETE-ing a resource. The two mandatory methods, GET and HEAD, must never be disabled and should not return this error code.

___

##### MOVED\_PERMANENTLY301

• **MOVED\_PERMANENTLY301** = ``301``

This response code means that URI of requested resource has been changed. Probably, new URI would be given in the response.

___

##### MOVED\_TEMPORARILY302

• **MOVED\_TEMPORARILY302** = ``302``

This response code means that URI of requested resource has been changed temporarily. New changes in the URI might be made in the future. Therefore, this same URI should be used by the client in future requests.

___

##### NOT\_FOUND404

• **NOT\_FOUND404** = ``404``

The server can not find requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client. This response code is probably the most famous one due to its frequent occurence on the web.

___

##### NOT\_IMPLEMENTED501

• **NOT\_IMPLEMENTED501** = ``501``

The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.

___

##### NO\_CONTENT204

• **NO\_CONTENT204** = ``204``

There is no content to send for this request, but the headers may be useful. The user-agent may update its cached headers for this resource with the new ones.

___

##### OK200

• **OK200** = ``200``

The request has succeeded. The meaning of a success varies depending on the HTTP method:
GET: The resource has been fetched and is transmitted in the message body.
HEAD: The entity headers are in the message body.
POST: The resource describing the result of the action is transmitted in the message body.
TRACE: The message body contains the request message as received by the server

___

##### PERMANENT\_REDIRECT308

• **PERMANENT\_REDIRECT308** = ``308``

This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header. This has the same semantics as the 301 Moved Permanently HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.

___

##### REQUEST\_TIMEOUT408

• **REQUEST\_TIMEOUT408** = ``408``

This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message.

___

##### SEE\_OTHER303

• **SEE\_OTHER303** = ``303``

Server sent this response to directing client to get requested resource to another URI with an GET request.

___

##### SERVICE\_UNAVAILABLE503

• **SERVICE\_UNAVAILABLE503** = ``503``

The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This responses should be used for temporary conditions and the Retry-After: HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.

___

##### TEMPORARY\_REDIRECT307

• **TEMPORARY\_REDIRECT307** = ``307``

Server sent this response to directing client to get requested resource to another URI with same method that used prior request. This has the same semantic than the 302 Found HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.

___

##### TOO\_MANY\_REQUESTS429

• **TOO\_MANY\_REQUESTS429** = ``429``

The user has sent too many requests in a given amount of time ("rate limiting").

___

##### UNAUTHORIZED401

• **UNAUTHORIZED401** = ``401``

Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.

## Modules


<a name="modulesarraymd"></a>

### Module: array

#### Functions

##### distributeRoundRobin

▸ **distributeRoundRobin**<`T`\>(`array`, `groups`): `T`[][]

Distributes an array into a number of groups in a round robin fashion.
This function has been tuned for performance.

###### Type parameters

| Name |
| :------ |
| `T` |

###### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `array` | `T`[] | The input array |
| `groups` | `number` | Number of groups the elements in the input array need to be distributed into. |

###### Returns

`T`[][]

The result as an array of arrays which each represents a group


<a name="modulescodecmd"></a>

### Module: codec

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


<a name="moduleshttp_statusmd"></a>

### Module: http-status

#### Enumerations

- [HttpStatusCode](#enumshttp_statushttpstatuscodemd)

#### Variables

##### HttpStatusMessage

• `Const` **HttpStatusMessage**: `Object`

Some (not all) HTTP status messages matching their codes

###### Type declaration

| Name | Type |
| :------ | :------ |
| `200` | `string` |
| `201` | `string` |
| `202` | `string` |
| `204` | `string` |
| `301` | `string` |
| `302` | `string` |
| `303` | `string` |
| `307` | `string` |
| `308` | `string` |
| `400` | `string` |
| `401` | `string` |
| `403` | `string` |
| `404` | `string` |
| `405` | `string` |
| `408` | `string` |
| `409` | `string` |
| `429` | `string` |
| `500` | `string` |
| `501` | `string` |
| `502` | `string` |
| `503` | `string` |
| `504` | `string` |


<a name="modulesindexmd"></a>

### Module: index

#### References

##### ConsoleLineLogger

Re-exports [ConsoleLineLogger](#consolelinelogger)

___

##### HttpStatusCode

Re-exports [HttpStatusCode](#enumshttp_statushttpstatuscodemd)

___

##### HttpStatusMessage

Re-exports [HttpStatusMessage](http_status.md#httpstatusmessage)

___

##### LineLogger

Re-exports [LineLogger](#classesline_loggerlineloggermd)

___

##### PathAwareReplacer

Re-exports [PathAwareReplacer](#pathawarereplacer)

___

##### base64FromUInt32

Re-exports [base64FromUInt32](#base64fromuint32)

___

##### base64UrlFromUInt32

Re-exports [base64UrlFromUInt32](#base64urlfromuint32)

___

##### consoleLike

Re-exports [consoleLike](#consolelike)

___

##### consoleWithColour

Re-exports [consoleWithColour](#consolewithcolour)

___

##### consoleWithoutColour

Re-exports [consoleWithoutColour](#consolewithoutcolour)

___

##### distributeRoundRobin

Re-exports [distributeRoundRobin](#distributeroundrobin)

___

##### mask

Re-exports [mask](#mask)

___

##### maskAll

Re-exports [maskAll](#maskall)

___

##### maskEmail

Re-exports [maskEmail](#maskemail)

___

##### maskFullName

Re-exports [maskFullName](#maskfullname)

___

##### pathAwareReplacer

Re-exports [pathAwareReplacer](#pathawarereplacer-1)

___

##### pathBasedReplacer

Re-exports [pathBasedReplacer](#pathbasedreplacer)

___

##### shortBase64FromUInt32

Re-exports [shortBase64FromUInt32](#shortbase64fromuint32)

___

##### shortBase64UrlFromUInt32

Re-exports [shortBase64UrlFromUInt32](#shortbase64urlfromuint32)

___

##### substituteAll

Re-exports [substituteAll](#substituteall)

___

##### urlSafe

Re-exports [urlSafe](#urlsafe)


<a name="modulesline_loggermd"></a>

### Module: line-logger

#### Classes

- [LineLogger](#classesline_loggerlineloggermd)

#### Type Aliases

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


<a name="modulesmaskmd"></a>

### Module: mask

#### Functions

##### mask

▸ **mask**<`T`\>(`input`, `keepLeft?`, `keepRight?`, `minLength?`, `maskLengthOrMaskString?`, `maskPattern?`): `T`

Mask the content of a string

###### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `undefined` \| ``null`` \| `string` |

###### Parameters

| Name | Type | Default value | Description |
| :------ | :------ | :------ | :------ |
| `input` | `T` | `undefined` | The input which could also be null or undefined |
| `keepLeft` | `number` | `1` | Number of characters on the left to be kept in the output without masking. Default value is 1. |
| `keepRight` | `number` | `0` | Number of characters on the right to be kept in the output without masking. Default value is 0. |
| `minLength` | `number` | `3` | Minimal length of the string for keepLeft and keepRight to be effective. If the input string is shorter than this length, the whole string would be masked. Default value is 3. |
| `maskLengthOrMaskString` | `undefined` \| ``null`` \| `string` \| `number` | `null` | The string to be used for replacing the part in the input that needs to be masked, or the length of the mask string if a fixed length is desired, or null/undefined if the mask string should have the same length as the part to be masked. Default value is null. |
| `maskPattern` | `string` | `'*'` | The pattern to be repeated as the mask. Default value is '*'. |

###### Returns

`T`

String with masked content

___

##### maskAll

▸ **maskAll**<`T`\>(`input`): `T`

Replace each character of the input with '*'

###### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `undefined` \| ``null`` \| `string` |

###### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `T` | a string or null or undefined |

###### Returns

`T`

masked string or null or undefined

___

##### maskEmail

▸ **maskEmail**<`T`\>(`email`): `T`

Mask sensitive information in an email address while keeping some information for troubleshooting

###### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `undefined` \| ``null`` \| `string` |

###### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `email` | `T` | the email address which could also be null or undefined |

###### Returns

`T`

masked email address

___

##### maskFullName

▸ **maskFullName**<`T`\>(`name`): `T`

Mask sensitive information in the full name while keeping useful information for troubleshooting

###### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `undefined` \| ``null`` \| `string` |

###### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `name` | `T` | the full name which could also be null or undefined |

###### Returns

`T`

masked full name


<a name="modulesstringify_replacermd"></a>

### Module: stringify-replacer

#### Type Aliases

##### PathAwareReplacer

Ƭ **PathAwareReplacer**: (`key`: `string`, `value`: `any`, `path`: `string`, `parent`: `Parent`, `pathArray`: `string`[], `ancestors`: `Parent`[]) => `any`

###### Type declaration

▸ (`key`, `value`, `path`, `parent`, `pathArray`, `ancestors`): `any`

The replacer that can potentially utilise the full path of the property in the object.

####### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `key` | `string` | Name of the property, or the index in the parent array. |
| `value` | `any` | Value of the property or the object in the parent array. |
| `path` | `string` | The full path of the property in the object, such like "access.visitor.location" or "request.x-forwarded-for.0". Please note that the special characters (including ".") in property names are not escaped, for example, "order.billing address.first line". |
| `parent` | `Parent` | The object that the property or the element belongs to. It could be `{ '': <the original object> }` when this replacer function is called the first time. |
| `pathArray` | `string`[] | The full path as an array. It is more useful than `path` in case special characters exist in property names. When this replacer function is called the first time, pathArray array would have a zero length. |
| `ancestors` | `Parent`[] | All the ancestor objects/arrays of the property. When this replacer function is called the first time, ancestors array would have a zero length. |

####### Returns

`any`

#### Functions

##### pathAwareReplacer

▸ **pathAwareReplacer**(`replacer`, `options?`): `JsonStringifyReplacer`

Build a replacer function that can be passed to JSON.stringify(...).

###### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `replacer` | [`PathAwareReplacer`](#pathawarereplacer) | The actual replacer function which could utilise additional information. |
| `options?` | `Object` | Options to control whether the pathArray and ancestors parameters would have values populated. By default all information available would be populated. There is no need to specify options unless you are extremely concerned about performance, for example if you need to frequently stringify 500MB objects. |
| `options.ancestors?` | `boolean` | - |
| `options.pathArray?` | `boolean` | - |

###### Returns

`JsonStringifyReplacer`

The replacer function that can be passed to JSON.stringify(...).

___

##### pathBasedReplacer

▸ **pathBasedReplacer**(`rules`): `JsonStringifyReplacer`

Create a replacer function for JSON.stringify(...) from an array of path based rules.
This function is useful for creating masking replacers which can apply masking based on the path of the property.

**`Example`**

```ts
import { mask, maskAll, maskEmail, maskFullName, pathBasedReplacer } from '@handy-common-utils/misc-utils';
console.log(JSON.stringify(obj, pathBasedReplacer([
 [/.*\.x-api-key$/, maskAll],
 [/.*customer\.name$/, maskFullName],
 [/.*customer\..*[eE]mail$/, maskEmail],
 [/.*\.zip$/, (value: string) => value.slice(0, 3) + 'XX'],
 [/.*\.cc$/, () => undefined],
 [/.*\.ssn$/, mask],
])));
```

###### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `rules` | [`RegExp`, (`input`: `any`) => `any`][] | Array of rules: if the regular expression tests true with the property path, the replacer function will be applied on the value |

###### Returns

`JsonStringifyReplacer`

the replacer function built from those path based rules


<a name="modulessubstitutemd"></a>

### Module: substitute

#### Functions

##### substituteAll

▸ **substituteAll**<`T`\>(`input`, `searchPattern`, `substitute`): `T`

Substitute all occurrences of a pattern in a string.

###### Type parameters

| Name | Type |
| :------ | :------ |
| `T` | extends `undefined` \| ``null`` \| `string` |

###### Parameters

| Name | Type | Description |
| :------ | :------ | :------ |
| `input` | `T` | The input string on which the substitutions will be performed. |
| `searchPattern` | `RegExp` | The regular expression pattern used to search for segments that should be substituted. It must have the `g` flag set. If the beginning part of the `input` should be skipped, set the `lastIndex` of the `searchPattern` before calling this function. After all the substitution are done, the `lastIndex` of the `searchPattern` will be reset to zero. See [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex) |
| `substitute` | (`match`: `string`, `matchResult`: `RegExpExecArray`) => ``null`` \| `string` | TThe function that builds the substitution string. It is called with the matched substring and the result of `RegExp.exec()`. See [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec#examples](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec#examples). The function can return null to indicate that no further substitution is desired. In such case, the `lastIndex` of the `searchPattern` will not be reset to zero. |

###### Returns

`T`

The resulting string after performing all substitutions.
<!-- API end -->
