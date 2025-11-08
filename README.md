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
  [/(^|\.)x-api-key$/i, maskAll],
  [/(^|\.)customer\.name$/i, maskFullName],
  [/(^|\.)customer\..*[eE]mail$/i, maskEmail],
  [/(^|\.)zip$/i, (value: string) => value.slice(0, 3) + 'XX'],
  [/(^|\.)cc$/i, () => undefined],
  [/(^|\.)ssn$/i, mask],
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
  [/(^|\.)billing\.cc$/i, maskCreditCard]
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

// Combining multiple path based replaces
const replacer2 = pathBasedReplacer([
  ...
]);
const combinedReplacer = pathBasedReplacer([...replacer.rules, ...replacer2.rules]);
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

| Module | Description |
| ------ | ------ |
| [array](#arrayreadmemd) | - |
| [codec](#codecreadmemd) | - |
| [errors](#errorsreadmemd) | - |
| [http-status](http-status/README.md) | - |
| [index](#indexreadmemd) | - |
| [line-logger](#line-loggerreadmemd) | - |
| [mask](#maskreadmemd) | - |
| [stringify-replacer](#stringify-replacerreadmemd) | - |
| [substitute](#substitutereadmemd) | - |

## Array


<a id="arrayreadmemd"></a>

### array

#### Functions

| Function | Description |
| ------ | ------ |
| [distributeRoundRobin](#arrayfunctionsdistributeroundrobinmd) | Distributes an array into a number of groups in a round robin fashion. This function has been tuned for performance. |
| [downSampleRandomly](#arrayfunctionsdownsamplerandomlymd) | Down samples the input array randomly. |

### Functions


<a id="arrayfunctionsdistributeroundrobinmd"></a>

#### Function: distributeRoundRobin()

> **distributeRoundRobin**\<`T`\>(`array`, `groups`): `T`[][]

Distributes an array into a number of groups in a round robin fashion.
This function has been tuned for performance.

##### Type Parameters

| Type Parameter |
| ------ |
| `T` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `array` | `T`[] | The input array |
| `groups` | `number` | Number of groups the elements in the input array need to be distributed into. |

##### Returns

`T`[][]

The result as an array of arrays which each represents a group


<a id="arrayfunctionsdownsamplerandomlymd"></a>

#### Function: downSampleRandomly()

> **downSampleRandomly**\<`T`\>(`array`, `numSamples`, `probabilityTransformerFunction`): `T`[]

Down samples the input array randomly.

##### Type Parameters

| Type Parameter |
| ------ |
| `T` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `array` | `T`[] | The input array |
| `numSamples` | `number` | Number of samples to be taken from the input array. If the number of samples is greater than or equal to the length of the input array, the output array will contain all the elements in the input array. |
| `probabilityTransformerFunction` | (`x`) => `number` | A function that turns a random number within [0, 1) to another number within [0, 1). If not provided, the identity function F(x) = x will be used. The probability of an element being selected from the input array is determined by this function. |

##### Returns

`T`[]

A new array with the down sampled elements from the input array.
         The order of the elements in the output array is the same as the input array.

## Codec


<a id="codecreadmemd"></a>

### codec

#### Functions

| Function | Description |
| ------ | ------ |
| [base64FromUInt32](#codecfunctionsbase64fromuint32md) | Encode an unsigned 32-bit integer into BASE64 string. |
| [base64UrlFromUInt32](#codecfunctionsbase64urlfromuint32md) | Encode an unsigned 32-bit integer into URL/path safe BASE64 string. |
| [escapeForRegExp](#codecfunctionsescapeforregexpmd) | Escape a string literal for using it inside of RegExp. (From: https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex) |
| [escapeForRegExpReplacement](#codecfunctionsescapeforregexpreplacementmd) | Escape replacement string for using it inside of RegExp replacement parameter. (From: https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex) |
| [generateRandomString](#codecfunctionsgeneraterandomstringmd) | Generate a strong (using crypto.randomFillSync(...)) random string that is URL/path safe. In the generated string, approximately every 6 characters represent randomly generated 32 bits. For example, if you need 128 bits of randomness, you just need to generate a string containing 24 characters. |
| [generateRandomStringQuickly](#codecfunctionsgeneraterandomstringquicklymd) | Generate a weak (using Math.random()) random string that is URL/path safe. In the generated string, approximately every 6 characters represent randomly generated 32 bits. For example, if you need 128 bits of randomness, you just need to generate a string containing 24 characters. |
| [shortBase64FromUInt32](#codecfunctionsshortbase64fromuint32md) | Encode an unsigned 32-bit integer into BASE64 string without trailing '='. |
| [shortBase64UrlFromUInt32](#codecfunctionsshortbase64urlfromuint32md) | Encode an unsigned 32-bit integer into URL/path safe BASE64 string without trailing '='. |
| [urlSafe](#codecfunctionsurlsafemd) | Make a "normal" (BASE64) string URL/path safe. |

### Functions


<a id="codecfunctionsbase64fromuint32md"></a>

#### Function: base64FromUInt32()

> **base64FromUInt32**\<`T`\>(`ui32`): `string` \| `Exclude`\<`T`, `number`\>

Encode an unsigned 32-bit integer into BASE64 string.

##### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `undefined` \| `null` \| `number` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ui32` | `T` | A 32-bit integer number which could also be null or undefined. It must be a valid unsigned 32-bit integer. Behavior is undefined when the value is anything other than an unsigned 32-bit integer. If you don't care about loosing precision, you can convert a number by doing `n >>> 0` (See https://stackoverflow.com/questions/22335853/hack-to-convert-javascript-number-to-uint32) |

##### Returns

`string` \| `Exclude`\<`T`, `number`\>

BASE64 string representing the integer input, or the original input if it is null or undefined.


<a id="codecfunctionsbase64urlfromuint32md"></a>

#### Function: base64UrlFromUInt32()

> **base64UrlFromUInt32**\<`T`\>(`ui32`, `replacements`): `string` \| `Exclude`\<`T`, `number`\>

Encode an unsigned 32-bit integer into URL/path safe BASE64 string.

##### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `undefined` \| `null` \| `number` |

##### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `ui32` | `T` | `undefined` | A 32-bit integer number which could also be null or undefined. It must be a valid unsigned 32-bit integer. Behavior is undefined when the value is anything other than an unsigned 32-bit integer. If you don't care about loosing precision, you can convert a number by doing `n >>> 0` (See https://stackoverflow.com/questions/22335853/hack-to-convert-javascript-number-to-uint32) |
| `replacements` | `string` | `'_-='` | A string containing replacement characters for "/", "+", and "=". If omitted, default value of '_-=' would be used. |

##### Returns

`string` \| `Exclude`\<`T`, `number`\>

URL/path safe BASE64 string representing the integer input, or the original input if it is null or undefined.


<a id="codecfunctionsescapeforregexpmd"></a>

#### Function: escapeForRegExp()

> **escapeForRegExp**(`text`): `string`

Escape a string literal for using it inside of RegExp.
(From: https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `text` | `undefined` \| `null` \| `string` | the string literal to be escaped |

##### Returns

`string`

escaped string that can be used inside of RegExp, or an empty string if the input is null or undefined


<a id="codecfunctionsescapeforregexpreplacementmd"></a>

#### Function: escapeForRegExpReplacement()

> **escapeForRegExpReplacement**(`text`): `string`

Escape replacement string for using it inside of RegExp replacement parameter.
(From: https://stackoverflow.com/questions/3446170/escape-string-for-use-in-javascript-regex)

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `text` | `undefined` \| `null` \| `string` | the replacement string to be escaped, or an empty string if the input is null or undefined |

##### Returns

`string`

escaped replacement string that can be used inside of RegExp replacement parameter


<a id="codecfunctionsgeneraterandomstringmd"></a>

#### Function: generateRandomString()

> **generateRandomString**(`len`): `string`

Generate a strong (using crypto.randomFillSync(...)) random string that is URL/path safe.
In the generated string, approximately every 6 characters represent randomly generated 32 bits.
For example, if you need 128 bits of randomness, you just need to generate a string containing 24 characters.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `len` | `number` | length of the string to be generated |

##### Returns

`string`

the random string


<a id="codecfunctionsgeneraterandomstringquicklymd"></a>

#### Function: generateRandomStringQuickly()

> **generateRandomStringQuickly**(`len`): `string`

Generate a weak (using Math.random()) random string that is URL/path safe.
In the generated string, approximately every 6 characters represent randomly generated 32 bits.
For example, if you need 128 bits of randomness, you just need to generate a string containing 24 characters.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `len` | `number` | length of the string to be generated |

##### Returns

`string`

the random string


<a id="codecfunctionsshortbase64fromuint32md"></a>

#### Function: shortBase64FromUInt32()

> **shortBase64FromUInt32**\<`T`\>(`ui32`): `string` \| `Exclude`\<`T`, `number`\>

Encode an unsigned 32-bit integer into BASE64 string without trailing '='.

##### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `undefined` \| `null` \| `number` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `ui32` | `T` | A 32-bit integer number which could also be null or undefined. It must be a valid unsigned 32-bit integer. Behavior is undefined when the value is anything other than an unsigned 32-bit integer. If you don't care about loosing precision, you can convert a number by doing `n >>> 0` (See https://stackoverflow.com/questions/22335853/hack-to-convert-javascript-number-to-uint32) |

##### Returns

`string` \| `Exclude`\<`T`, `number`\>

BASE64 string without trailing '=' representing the integer input, or the original input if it is null or undefined.


<a id="codecfunctionsshortbase64urlfromuint32md"></a>

#### Function: shortBase64UrlFromUInt32()

> **shortBase64UrlFromUInt32**\<`T`\>(`ui32`, `replacements`): `string` \| `Exclude`\<`T`, `number`\>

Encode an unsigned 32-bit integer into URL/path safe BASE64 string without trailing '='.

##### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `undefined` \| `null` \| `number` |

##### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `ui32` | `T` | `undefined` | A 32-bit integer number which could also be null or undefined. It must be a valid unsigned 32-bit integer. Behavior is undefined when the value is anything other than an unsigned 32-bit integer. If you don't care about loosing precision, you can convert a number by doing `n >>> 0` (See https://stackoverflow.com/questions/22335853/hack-to-convert-javascript-number-to-uint32) |
| `replacements` | `string` | `'_-'` | A string containing replacement characters for "/" and "+". If omitted, default value of '_-' would be used. |

##### Returns

`string` \| `Exclude`\<`T`, `number`\>

URL/path safe BASE64 string without trailing '=' representing the integer input, or the original input if it is null or undefined.


<a id="codecfunctionsurlsafemd"></a>

#### Function: urlSafe()

> **urlSafe**\<`T`\>(`base64Input`, `replacements`): `T`

Make a "normal" (BASE64) string URL/path safe.

##### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `undefined` \| `null` \| `string` |

##### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `base64Input` | `T` | `undefined` | A (BASE64) string which could be null or undefined. |
| `replacements` | `string` | `'_-='` | A string containing replacement characters for "/", "+", and "=". If omitted, default value of '_-=' would be used. |

##### Returns

`T`

URL/path safe version of the (BASE64) input string, or the original input if it is null or undefined.

## Errors


<a id="errorsreadmemd"></a>

### errors

#### Functions

| Function | Description |
| ------ | ------ |
| [couldBeNetworkingTimeoutError](#errorsfunctionscouldbenetworkingtimeouterrormd) | Checks if the error could be a networking timeout error. |
| [couldBeServerError](#errorsfunctionscouldbeservererrormd) | Checks if the error could be a server error. |
| [couldBeTemporaryNetworkingError](#errorsfunctionscouldbetemporarynetworkingerrormd) | Checks if the error could be a temporary networking error. |

### Functions


<a id="errorsfunctionscouldbenetworkingtimeouterrormd"></a>

#### Function: couldBeNetworkingTimeoutError()

> **couldBeNetworkingTimeoutError**(`err`): `boolean`

Checks if the error could be a networking timeout error.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `err` | `unknown` | The error to check. |

##### Returns

`boolean`

True if the error is a networking timeout error, false otherwise.


<a id="errorsfunctionscouldbeservererrormd"></a>

#### Function: couldBeServerError()

> **couldBeServerError**(`err`): `boolean`

Checks if the error could be a server error.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `err` | `unknown` | The error to check. |

##### Returns

`boolean`

True if the error is a server error, false otherwise.


<a id="errorsfunctionscouldbetemporarynetworkingerrormd"></a>

#### Function: couldBeTemporaryNetworkingError()

> **couldBeTemporaryNetworkingError**(`err`): `boolean`

Checks if the error could be a temporary networking error.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `err` | `unknown` | The error to check. |

##### Returns

`boolean`

True if the error is a temporary networking error, false otherwise.

## Http Status


<a id="http-statusreadmemd"></a>

### http-status

#### Enumerations

| Enumeration | Description |
| ------ | ------ |
| [HttpStatusCode](#http-statusenumerationshttpstatuscodemd) | Some (not all) well known HTTP status codes |

#### Variables

| Variable | Description |
| ------ | ------ |
| [HttpStatusMessage](#http-statusvariableshttpstatusmessagemd) | Some (not all) HTTP status messages matching their codes |

### Enumerations


<a id="http-statusenumerationshttpstatuscodemd"></a>

#### Enumeration: HttpStatusCode

Some (not all) well known HTTP status codes

##### Enumeration Members

| Enumeration Member | Value | Description |
| ------ | ------ | ------ |
| <a id="api-accepted202"></a> `ACCEPTED202` | `202` | The request has been received but not yet acted upon. It is non-committal, meaning that there is no way in HTTP to later send an asynchronous response indicating the outcome of processing the request. It is intended for cases where another process or server handles the request, or for batch processing. |
| <a id="api-bad_gateway502"></a> `BAD_GATEWAY502` | `502` | This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response. |
| <a id="api-bad_request400"></a> `BAD_REQUEST400` | `400` | This response means that server could not understand the request due to invalid syntax. |
| <a id="api-conflict409"></a> `CONFLICT409` | `409` | This response is sent when a request conflicts with the current state of the server. |
| <a id="api-created201"></a> `CREATED201` | `201` | The request has succeeded and a new resource has been created as a result of it. This is typically the response sent after a PUT request. |
| <a id="api-forbidden403"></a> `FORBIDDEN403` | `403` | The client does not have access rights to the content, i.e. they are unauthorized, so server is rejecting to give proper response. Unlike 401, the client's identity is known to the server. |
| <a id="api-gateway_timeout504"></a> `GATEWAY_TIMEOUT504` | `504` | This error response is given when the server is acting as a gateway and cannot get a response in time. |
| <a id="api-internal_server_error500"></a> `INTERNAL_SERVER_ERROR500` | `500` | The server encountered an unexpected condition that prevented it from fulfilling the request. |
| <a id="api-method_not_allowed405"></a> `METHOD_NOT_ALLOWED405` | `405` | The request method is known by the server but has been disabled and cannot be used. For example, an API may forbid DELETE-ing a resource. The two mandatory methods, GET and HEAD, must never be disabled and should not return this error code. |
| <a id="api-moved_permanently301"></a> `MOVED_PERMANENTLY301` | `301` | This response code means that URI of requested resource has been changed. Probably, new URI would be given in the response. |
| <a id="api-moved_temporarily302"></a> `MOVED_TEMPORARILY302` | `302` | This response code means that URI of requested resource has been changed temporarily. New changes in the URI might be made in the future. Therefore, this same URI should be used by the client in future requests. |
| <a id="api-no_content204"></a> `NO_CONTENT204` | `204` | There is no content to send for this request, but the headers may be useful. The user-agent may update its cached headers for this resource with the new ones. |
| <a id="api-not_found404"></a> `NOT_FOUND404` | `404` | The server can not find requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client. This response code is probably the most famous one due to its frequent occurence on the web. |
| <a id="api-not_implemented501"></a> `NOT_IMPLEMENTED501` | `501` | The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD. |
| <a id="api-ok200"></a> `OK200` | `200` | The request has succeeded. The meaning of a success varies depending on the HTTP method: GET: The resource has been fetched and is transmitted in the message body. HEAD: The entity headers are in the message body. POST: The resource describing the result of the action is transmitted in the message body. TRACE: The message body contains the request message as received by the server |
| <a id="api-permanent_redirect308"></a> `PERMANENT_REDIRECT308` | `308` | This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header. This has the same semantics as the 301 Moved Permanently HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request. |
| <a id="api-request_timeout408"></a> `REQUEST_TIMEOUT408` | `408` | This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message. |
| <a id="api-see_other303"></a> `SEE_OTHER303` | `303` | Server sent this response to directing client to get requested resource to another URI with an GET request. |
| <a id="api-service_unavailable503"></a> `SERVICE_UNAVAILABLE503` | `503` | The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This responses should be used for temporary conditions and the Retry-After: HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached. |
| <a id="api-temporary_redirect307"></a> `TEMPORARY_REDIRECT307` | `307` | Server sent this response to directing client to get requested resource to another URI with same method that used prior request. This has the same semantic than the 302 Found HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request. |
| <a id="api-too_many_requests429"></a> `TOO_MANY_REQUESTS429` | `429` | The user has sent too many requests in a given amount of time ("rate limiting"). |
| <a id="api-unauthorized401"></a> `UNAUTHORIZED401` | `401` | Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response. |

### Variables


<a id="http-statusvariableshttpstatusmessagemd"></a>

#### Variable: HttpStatusMessage

> `const` **HttpStatusMessage**: `object`

Some (not all) HTTP status messages matching their codes

##### Type declaration

| Name | Type | Default value |
| ------ | ------ | ------ |
| <a id="api-200"></a> `200` | `string` | `'OK'` |
| <a id="api-201"></a> `201` | `string` | `'Created'` |
| <a id="api-202"></a> `202` | `string` | `'Accepted'` |
| <a id="api-204"></a> `204` | `string` | `'No Content'` |
| <a id="api-301"></a> `301` | `string` | `'Moved Permanently'` |
| <a id="api-302"></a> `302` | `string` | `'Moved Temporarily'` |
| <a id="api-303"></a> `303` | `string` | `'See Other'` |
| <a id="api-307"></a> `307` | `string` | `'Temporary Redirect'` |
| <a id="api-308"></a> `308` | `string` | `'Permanent Redirect'` |
| <a id="api-400"></a> `400` | `string` | `'Bad Request'` |
| <a id="api-401"></a> `401` | `string` | `'Unauthorized'` |
| <a id="api-403"></a> `403` | `string` | `'Forbidden'` |
| <a id="api-404"></a> `404` | `string` | `'Not Found'` |
| <a id="api-405"></a> `405` | `string` | `'Method Not Allowed'` |
| <a id="api-408"></a> `408` | `string` | `'Request Timeout'` |
| <a id="api-409"></a> `409` | `string` | `'Conflict'` |
| <a id="api-429"></a> `429` | `string` | `'Too Many Requests'` |
| <a id="api-500"></a> `500` | `string` | `'Internal Server Error'` |
| <a id="api-501"></a> `501` | `string` | `'Not Implemented'` |
| <a id="api-502"></a> `502` | `string` | `'Bad Gateway'` |
| <a id="api-503"></a> `503` | `string` | `'Service Unavailable'` |
| <a id="api-504"></a> `504` | `string` | `'Gateway Timeout'` |

## Index


<a id="indexreadmemd"></a>

### index

#### References

<a id="api-base64fromuint32"></a>

##### base64FromUInt32

Re-exports [base64FromUInt32](#codecfunctionsbase64fromuint32md)

***

<a id="api-base64urlfromuint32"></a>

##### base64UrlFromUInt32

Re-exports [base64UrlFromUInt32](#codecfunctionsbase64urlfromuint32md)

***

<a id="api-consolelike"></a>

##### consoleLike

Re-exports [consoleLike](#line-loggervariablesconsolelikemd)

***

<a id="api-consolelinelogger"></a>

##### ConsoleLineLogger

Re-exports [ConsoleLineLogger](#line-loggertype-aliasesconsolelineloggermd)

***

<a id="api-consolewithcolour"></a>

##### consoleWithColour

Re-exports [consoleWithColour](#line-loggervariablesconsolewithcolourmd)

***

<a id="api-consolewithoutcolour"></a>

##### consoleWithoutColour

Re-exports [consoleWithoutColour](#line-loggervariablesconsolewithoutcolourmd)

***

<a id="api-couldbenetworkingtimeouterror"></a>

##### couldBeNetworkingTimeoutError

Re-exports [couldBeNetworkingTimeoutError](#errorsfunctionscouldbenetworkingtimeouterrormd)

***

<a id="api-couldbeservererror"></a>

##### couldBeServerError

Re-exports [couldBeServerError](#errorsfunctionscouldbeservererrormd)

***

<a id="api-couldbetemporarynetworkingerror"></a>

##### couldBeTemporaryNetworkingError

Re-exports [couldBeTemporaryNetworkingError](#errorsfunctionscouldbetemporarynetworkingerrormd)

***

<a id="api-distributeroundrobin"></a>

##### distributeRoundRobin

Re-exports [distributeRoundRobin](#arrayfunctionsdistributeroundrobinmd)

***

<a id="api-downsamplerandomly"></a>

##### downSampleRandomly

Re-exports [downSampleRandomly](#arrayfunctionsdownsamplerandomlymd)

***

<a id="api-escapeforregexp"></a>

##### escapeForRegExp

Re-exports [escapeForRegExp](#codecfunctionsescapeforregexpmd)

***

<a id="api-escapeforregexpreplacement"></a>

##### escapeForRegExpReplacement

Re-exports [escapeForRegExpReplacement](#codecfunctionsescapeforregexpreplacementmd)

***

<a id="api-generaterandomstring"></a>

##### generateRandomString

Re-exports [generateRandomString](#codecfunctionsgeneraterandomstringmd)

***

<a id="api-generaterandomstringquickly"></a>

##### generateRandomStringQuickly

Re-exports [generateRandomStringQuickly](#codecfunctionsgeneraterandomstringquicklymd)

***

<a id="api-httpstatuscode"></a>

##### HttpStatusCode

Re-exports [HttpStatusCode](#http-statusenumerationshttpstatuscodemd)

***

<a id="api-httpstatusmessage"></a>

##### HttpStatusMessage

Re-exports [HttpStatusMessage](#http-statusvariableshttpstatusmessagemd)

***

<a id="api-jsonstringifyreplacer"></a>

##### JsonStringifyReplacer

Re-exports [JsonStringifyReplacer](#stringify-replacertype-aliasesjsonstringifyreplacermd)

***

<a id="api-jsonstringifyreplacerfrompathbasedrules"></a>

##### JsonStringifyReplacerFromPathBasedRules

Re-exports [JsonStringifyReplacerFromPathBasedRules](#stringify-replacertype-aliasesjsonstringifyreplacerfrompathbasedrulesmd)

***

<a id="api-linelogger"></a>

##### LineLogger

Re-exports [LineLogger](#line-loggerclasseslineloggermd)

***

<a id="api-mask"></a>

##### mask

Re-exports [mask](#maskfunctionsmaskmd)

***

<a id="api-maskall"></a>

##### maskAll

Re-exports [maskAll](#maskfunctionsmaskallmd)

***

<a id="api-maskcreditcard"></a>

##### maskCreditCard

Re-exports [maskCreditCard](#maskfunctionsmaskcreditcardmd)

***

<a id="api-maskemail"></a>

##### maskEmail

Re-exports [maskEmail](#maskfunctionsmaskemailmd)

***

<a id="api-masker"></a>

##### masker

Re-exports [masker](#maskfunctionsmaskermd)

***

<a id="api-maskfullname"></a>

##### maskFullName

Re-exports [maskFullName](#maskfunctionsmaskfullnamemd)

***

<a id="api-pathawarereplacer"></a>

##### pathAwareReplacer

Re-exports [pathAwareReplacer](#stringify-replacerfunctionspathawarereplacermd)

***

<a id="api-pathawarereplacer-1"></a>

##### PathAwareReplacer

Re-exports [PathAwareReplacer](#stringify-replacertype-aliasespathawarereplacermd)

***

<a id="api-pathbasedreplacer"></a>

##### pathBasedReplacer

Re-exports [pathBasedReplacer](#stringify-replacerfunctionspathbasedreplacermd)

***

<a id="api-shortbase64fromuint32"></a>

##### shortBase64FromUInt32

Re-exports [shortBase64FromUInt32](#codecfunctionsshortbase64fromuint32md)

***

<a id="api-shortbase64urlfromuint32"></a>

##### shortBase64UrlFromUInt32

Re-exports [shortBase64UrlFromUInt32](#codecfunctionsshortbase64urlfromuint32md)

***

<a id="api-substituteall"></a>

##### substituteAll

Re-exports [substituteAll](#substitutefunctionssubstituteallmd)

***

<a id="api-urlsafe"></a>

##### urlSafe

Re-exports [urlSafe](#codecfunctionsurlsafemd)

## Line Logger


<a id="line-loggerreadmemd"></a>

### line-logger

#### Classes

| Class | Description |
| ------ | ------ |
| [LineLogger](#line-loggerclasseslineloggermd) | A LineLogger logs/prints one entire line of text before advancing to another line. This class is useful for encapsulating console.log/info/warn/error functions. By having an abstraction layer, your code can switching to a different output with nearly no change. |

#### Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [ConsoleLineLogger](#line-loggertype-aliasesconsolelineloggermd) | Type of the object returned by `LineLogger.console()` or `LineLogger.consoleWithColour()`. It has the same function signatures as console.log/info/warn/error. |

#### Variables

| Variable | Description |
| ------ | ------ |
| [consoleLike](#line-loggervariablesconsolelikemd) | Build an instance from 'log' (https://github.com/medikoo/log). `info` of the LineLogger is mapped to `notice` of the medikoo log. |
| [consoleWithColour](#line-loggervariablesconsolewithcolourmd) | Build an encapsulation of console output functions with console.log/info/warn/error and chalk/colors/cli-color. |
| [consoleWithoutColour](#line-loggervariablesconsolewithoutcolourmd) | Build an encapsulation of console output functions with console.log/info/warn/error. |

### Classes


<a id="line-loggerclasseslineloggermd"></a>

#### Class: LineLogger\<DEBUG_FUNC, INFO_FUNC, WARN_FUNC, ERROR_FUNC\>

A LineLogger logs/prints one entire line of text before advancing to another line.
This class is useful for encapsulating console.log/info/warn/error functions.
By having an abstraction layer, your code can switching to a different output with nearly no change.

Please note that although the name contains "Logger", this class is not intended to be used as a generic logger.
It is intended for "logging for humans to read" scenario.

`LineLogger.console()` and `LineLogger.consoleWithColour()` are ready to use convenient functions.
Or you can use the constructor to build your own wrappers.

##### Example

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

##### Type Parameters

| Type Parameter |
| ------ |
| `DEBUG_FUNC` *extends* `Function` |
| `INFO_FUNC` *extends* `Function` |
| `WARN_FUNC` *extends* `Function` |
| `ERROR_FUNC` *extends* `Function` |

##### Constructors

<a id="api-constructor"></a>

###### Constructor

> **new LineLogger**\<`DEBUG_FUNC`, `INFO_FUNC`, `WARN_FUNC`, `ERROR_FUNC`\>(`debugFunction`, `infoFunction`, `warnFunction`, `errorFunction`, `isDebug`, `isQuiet`): `LineLogger`\<`DEBUG_FUNC`, `INFO_FUNC`, `WARN_FUNC`, `ERROR_FUNC`\>

Constructor

####### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `debugFunction` | `DEBUG_FUNC` | `undefined` | function for outputting debug information |
| `infoFunction` | `INFO_FUNC` | `undefined` | function for outputting info information |
| `warnFunction` | `WARN_FUNC` | `undefined` | function for outputting warn information |
| `errorFunction` | `ERROR_FUNC` | `undefined` | function for outputting error information |
| `isDebug` | `boolean` | `false` | is debug output enabled or not, it could be overriden by isQuiet |
| `isQuiet` | `boolean` | `false` | is quiet mode enabled or not. When quiet mode is enabled, both debug and info output would be discarded. |

####### Returns

`LineLogger`\<`DEBUG_FUNC`, `INFO_FUNC`, `WARN_FUNC`, `ERROR_FUNC`\>

##### Properties

| Property | Modifier | Type | Default value | Description |
| ------ | ------ | ------ | ------ | ------ |
| <a id="api-debug"></a> `debug` | `public` | `DEBUG_FUNC` | `undefined` | - |
| <a id="api-error"></a> `error` | `public` | `ERROR_FUNC` | `undefined` | - |
| <a id="api-info"></a> `info` | `public` | `INFO_FUNC` | `undefined` | - |
| <a id="api-isdebug"></a> `isDebug` | `public` | `boolean` | `false` | is debug output enabled or not, it could be overriden by isQuiet |
| <a id="api-isquiet"></a> `isQuiet` | `public` | `boolean` | `false` | is quiet mode enabled or not. When quiet mode is enabled, both debug and info output would be discarded. |
| <a id="api-warn"></a> `warn` | `public` | `WARN_FUNC` | `undefined` | - |
| <a id="api-no_op_func"></a> `NO_OP_FUNC` | `static` | () => `void` | `undefined` | - |

##### Methods

<a id="api-console"></a>

###### console()

> `static` **console**\<`FLAGS`\>(`flags`, `debugFlagName`, `quietFlagName`): `LineLogger`\<(`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`\>

Build an instance with console.log/info/warn/error.

####### Type Parameters

| Type Parameter |
| ------ |
| `FLAGS` *extends* `Record`\<`string`, `any`\> |

####### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `flags` | `FLAGS` | `...` | The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled. Values of those fields are evaluated only once within this function. They are not evaluated when debug/info/warn/error functions are called. |
| `debugFlagName` | keyof `FLAGS` | `'debug'` | Name of the debug field in the flags object |
| `quietFlagName` | keyof `FLAGS` | `'quiet'` | Name of the quiet field in the flags object |

####### Returns

`LineLogger`\<(`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`\>

An instance that uses console.log/info/warn/error.

***

<a id="api-consolelike"></a>

###### consoleLike()

> `static` **consoleLike**(`log`): `LineLogger`\<(`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`\>

Build an instance from 'log' (https://github.com/medikoo/log).
`info` of the LineLogger is mapped to `notice` of the medikoo log.

####### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `log` | `MedikooLogger` | instance of the logger |

####### Returns

`LineLogger`\<(`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`\>

instance of LineLogger that is actually ConsoleLineLogger type

***

<a id="api-consolewithcolour"></a>

###### consoleWithColour()

> `static` **consoleWithColour**\<`FLAGS`, `COLOURER`\>(`flags`, `colourer`, `debugColourFuncName`, `infoColourFuncName?`, `warnColourFuncName?`, `errorColourFuncName?`, `debugFlagName?`, `quietFlagName?`): `LineLogger`\<(`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`\>

Build an instance with console.log/info/warn/error and chalk/colors/cli-color.
This package does not depend on chalk or colors or cli-color,
you need to add them as dependencies separately.

####### Type Parameters

| Type Parameter |
| ------ |
| `FLAGS` *extends* `Record`\<`string`, `any`\> |
| `COLOURER` *extends* `Record`\<`string`, `any`\> |

####### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `flags` | `FLAGS` | `undefined` | The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled. Values of those fields are evaluated only once within this function. They are not evaluated when debug/info/warn/error functions are called. |
| `colourer` | `COLOURER` | `undefined` | Supplier of the colouring function, such as chalk or colors or cli-color |
| `debugColourFuncName` | keyof `COLOURER` | `'grey'` | Name of the function within colourer that will be used to add colour to debug messages, or null if colouring is not desired. |
| `infoColourFuncName?` | keyof `COLOURER` | `undefined` | Name of the function within colourer that will be used to add colour to info messages, or null if colouring is not desired. |
| `warnColourFuncName?` | keyof `COLOURER` | `'yellow'` | Name of the function within colourer that will be used to add colour to warn messages, or null if colouring is not desired. |
| `errorColourFuncName?` | keyof `COLOURER` | `'red'` | Name of the function within colourer that will be used to add colour to error messages, or null if colouring is not desired. |
| `debugFlagName?` | keyof `FLAGS` | `'debug'` | Name of the debug field in the flags object |
| `quietFlagName?` | keyof `FLAGS` | `'quiet'` | Name of the quiet field in the flags object |

####### Returns

`LineLogger`\<(`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`\>

An instance that uses console.log/info/warn/error and also adds colour to the messages using chalk/colors/cli-color.

### Type Aliases


<a id="line-loggertype-aliasesconsolelineloggermd"></a>

#### Type Alias: ConsoleLineLogger

> **ConsoleLineLogger** = `ReturnType`\<*typeof* [`console`](#console)\>

Type of the object returned by `LineLogger.console()` or `LineLogger.consoleWithColour()`.
It has the same function signatures as console.log/info/warn/error.

### Variables


<a id="line-loggervariablesconsolelikemd"></a>

#### Variable: consoleLike()

> `const` **consoleLike**: (`log`) => [`LineLogger`](#line-loggerclasseslineloggermd)\<(`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`\> = `LineLogger.consoleLike`

Build an instance from 'log' (https://github.com/medikoo/log).
`info` of the LineLogger is mapped to `notice` of the medikoo log.

Build an instance from 'log' (https://github.com/medikoo/log).
`info` of the LineLogger is mapped to `notice` of the medikoo log.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `log` | `MedikooLogger` | instance of the logger |

##### Returns

[`LineLogger`](#line-loggerclasseslineloggermd)\<(`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`\>

instance of LineLogger that is actually ConsoleLineLogger type

##### Param

instance of the logger

##### Returns

instance of LineLogger that is actually ConsoleLineLogger type


<a id="line-loggervariablesconsolewithcolourmd"></a>

#### Variable: consoleWithColour()

> `const` **consoleWithColour**: \<`FLAGS`, `COLOURER`\>(`flags`, `colourer`, `debugColourFuncName`, `infoColourFuncName?`, `warnColourFuncName`, `errorColourFuncName`, `debugFlagName`, `quietFlagName`) => [`LineLogger`](#line-loggerclasseslineloggermd)\<(`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`\> = `LineLogger.consoleWithColour`

Build an encapsulation of console output functions with console.log/info/warn/error and chalk/colors/cli-color.

Build an instance with console.log/info/warn/error and chalk/colors/cli-color.
This package does not depend on chalk or colors or cli-color,
you need to add them as dependencies separately.

##### Type Parameters

| Type Parameter |
| ------ |
| `FLAGS` *extends* `Record`\<`string`, `any`\> |
| `COLOURER` *extends* `Record`\<`string`, `any`\> |

##### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `flags` | `FLAGS` | `undefined` | The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled. Values of those fields are evaluated only once within this function. They are not evaluated when debug/info/warn/error functions are called. |
| `colourer` | `COLOURER` | `undefined` | Supplier of the colouring function, such as chalk or colors or cli-color |
| `debugColourFuncName` | keyof `COLOURER` | `'grey'` | Name of the function within colourer that will be used to add colour to debug messages, or null if colouring is not desired. |
| `infoColourFuncName?` | keyof `COLOURER` | `undefined` | Name of the function within colourer that will be used to add colour to info messages, or null if colouring is not desired. |
| `warnColourFuncName?` | keyof `COLOURER` | `'yellow'` | Name of the function within colourer that will be used to add colour to warn messages, or null if colouring is not desired. |
| `errorColourFuncName?` | keyof `COLOURER` | `'red'` | Name of the function within colourer that will be used to add colour to error messages, or null if colouring is not desired. |
| `debugFlagName?` | keyof `FLAGS` | `'debug'` | Name of the debug field in the flags object |
| `quietFlagName?` | keyof `FLAGS` | `'quiet'` | Name of the quiet field in the flags object |

##### Returns

[`LineLogger`](#line-loggerclasseslineloggermd)\<(`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`\>

An instance that uses console.log/info/warn/error and also adds colour to the messages using chalk/colors/cli-color.

##### Param

The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled.
Values of those fields are evaluated only once within this function.
They are not evaluated when debug/info/warn/error functions are called.

##### Param

Supplier of the colouring function, such as chalk or colors or cli-color

##### Param

Name of the function within colourer that will be used to add colour to debug messages, or null if colouring is not desired.

##### Param

Name of the function within colourer that will be used to add colour to info messages, or null if colouring is not desired.

##### Param

Name of the function within colourer that will be used to add colour to warn messages, or null if colouring is not desired.

##### Param

Name of the function within colourer that will be used to add colour to error messages, or null if colouring is not desired.

##### Param

Name of the debug field in the flags object

##### Param

Name of the quiet field in the flags object. Quiet flag can override debug flag.

##### Returns

An LineLogger instance that uses console.log/info/warn/error and also adds colour to the messages using chalk/colors/cli-color.


<a id="line-loggervariablesconsolewithoutcolourmd"></a>

#### Variable: consoleWithoutColour()

> `const` **consoleWithoutColour**: \<`FLAGS`\>(`flags`, `debugFlagName`, `quietFlagName`) => [`LineLogger`](#line-loggerclasseslineloggermd)\<(`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`\> = `LineLogger.console`

Build an encapsulation of console output functions with console.log/info/warn/error.

Build an instance with console.log/info/warn/error.

##### Type Parameters

| Type Parameter |
| ------ |
| `FLAGS` *extends* `Record`\<`string`, `any`\> |

##### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `flags` | `FLAGS` | `...` | The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled. Values of those fields are evaluated only once within this function. They are not evaluated when debug/info/warn/error functions are called. |
| `debugFlagName` | keyof `FLAGS` | `'debug'` | Name of the debug field in the flags object |
| `quietFlagName` | keyof `FLAGS` | `'quiet'` | Name of the quiet field in the flags object |

##### Returns

[`LineLogger`](#line-loggerclasseslineloggermd)\<(`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`, (`message?`, ...`optionalParams`) => `void`\>

An instance that uses console.log/info/warn/error.

##### Param

The flag object that contains fields for knowning whether debug is enabled and whether quiet mode is enabled.
Values of those fields are evaluated only once within this function.
They are not evaluated when debug/info/warn/error functions are called.

##### Param

Name of the debug field in the flags object

##### Param

Name of the quiet field in the flags object. Quiet flag can override debug flag.

##### Returns

An LineLogger instance that uses console.log/info/warn/error.

## Mask


<a id="maskreadmemd"></a>

### mask

#### Functions

| Function | Description |
| ------ | ------ |
| [mask](#maskfunctionsmaskmd) | Mask the content of a string |
| [maskAll](#maskfunctionsmaskallmd) | Replace each character of the input with '*' |
| [maskCreditCard](#maskfunctionsmaskcreditcardmd) | Mask credit card number string |
| [maskEmail](#maskfunctionsmaskemailmd) | Mask sensitive information in an email address while keeping some information for troubleshooting |
| [masker](#maskfunctionsmaskermd) | Create a mask function with pre-set parameters. |
| [maskFullName](#maskfunctionsmaskfullnamemd) | Mask sensitive information in the full name while keeping useful information for troubleshooting |

### Functions


<a id="maskfunctionsmaskmd"></a>

#### Function: mask()

> **mask**\<`T`\>(`input`, `keepLeft`, `keepRight`, `minLength`, `maskLengthOrMaskString`, `maskPattern`): `T`

Mask the content of a string

##### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `undefined` \| `null` \| `string` |

##### Parameters

| Parameter | Type | Default value | Description |
| ------ | ------ | ------ | ------ |
| `input` | `T` | `undefined` | The input which could also be null or undefined |
| `keepLeft` | `number` | `1` | Number of characters on the left to be kept in the output without masking. Default value is 1. |
| `keepRight` | `number` | `0` | Number of characters on the right to be kept in the output without masking. Default value is 0. |
| `minLength` | `number` | `3` | Minimal length of the string for keepLeft and keepRight to be effective. If the input string is shorter than this length, the whole string would be masked. Default value is 3. |
| `maskLengthOrMaskString` | `undefined` \| `null` \| `string` \| `number` | `null` | The string to be used for replacing the part in the input that needs to be masked, or the length of the mask string if a fixed length is desired, or null/undefined if the mask string should have the same length as the part to be masked. Default value is null. |
| `maskPattern` | `string` | `'*'` | The pattern to be repeated as the mask. Default value is '*'. |

##### Returns

`T`

String with masked content


<a id="maskfunctionsmaskallmd"></a>

#### Function: maskAll()

> **maskAll**\<`T`\>(`input`): `T`

Replace each character of the input with '*'

##### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `undefined` \| `null` \| `string` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `T` | a string or null or undefined |

##### Returns

`T`

masked string or null or undefined


<a id="maskfunctionsmaskcreditcardmd"></a>

#### Function: maskCreditCard()

> **maskCreditCard**\<`T`\>(`input`): `T`

Mask credit card number string

##### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `undefined` \| `null` \| `string` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `T` | credit card number string which could also be null or undefined |

##### Returns

`T`

Something like ****-****-****-1234, or null/undefined if the input is null/undefined


<a id="maskfunctionsmaskemailmd"></a>

#### Function: maskEmail()

> **maskEmail**\<`T`\>(`email`): `T`

Mask sensitive information in an email address while keeping some information for troubleshooting

##### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `undefined` \| `null` \| `string` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `email` | `T` | the email address which could also be null or undefined |

##### Returns

`T`

masked email address


<a id="maskfunctionsmaskfullnamemd"></a>

#### Function: maskFullName()

> **maskFullName**\<`T`\>(`name`): `T`

Mask sensitive information in the full name while keeping useful information for troubleshooting

##### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `undefined` \| `null` \| `string` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `name` | `T` | the full name which could also be null or undefined |

##### Returns

`T`

masked full name


<a id="maskfunctionsmaskermd"></a>

#### Function: masker()

> **masker**\<`T`\>(`keepLeft?`, `keepRight?`, `minLength?`, `maskLengthOrMaskString?`, `maskPattern?`): (`input`) => `T`

Create a mask function with pre-set parameters.

##### Type Parameters

| Type Parameter | Default type |
| ------ | ------ |
| `T` *extends* `undefined` \| `null` \| `string` | `string` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `keepLeft?` | `number` | Number of characters on the left to be kept in the output without masking. Default value is 1. |
| `keepRight?` | `number` | Number of characters on the right to be kept in the output without masking. Default value is 0. |
| `minLength?` | `number` | Minimal length of the string for keepLeft and keepRight to be effective. If the input string is shorter than this length, the whole string would be masked. Default value is 3. |
| `maskLengthOrMaskString?` | `null` \| `string` \| `number` | The string to be used for replacing the part in the input that needs to be masked, or the length of the mask string if a fixed length is desired, or null/undefined if the mask string should have the same length as the part to be masked. Default value is null. |
| `maskPattern?` | `string` | The pattern to be repeated as the mask. Default value is '*'. |

##### Returns

A mask function that has specified parameters as pre-set

> (`input`): `T`

###### Parameters

| Parameter | Type |
| ------ | ------ |
| `input` | `T` |

###### Returns

`T`

##### Example

```ts
const maskApiKey = masker(2, 2, 10);
  const maskedString = maskApiKey(myApiKey);
```

## Stringify Replacer


<a id="stringify-replacerreadmemd"></a>

### stringify-replacer

#### Type Aliases

| Type Alias | Description |
| ------ | ------ |
| [JsonStringifyReplacer](#stringify-replacertype-aliasesjsonstringifyreplacermd) | The original replacer expected by JSON.stringify(...) |
| [JsonStringifyReplacerFromPathBasedRules](#stringify-replacertype-aliasesjsonstringifyreplacerfrompathbasedrulesmd) | A JsonStringifyReplacer that was created from path based rules. Those rules are stored in the `rules` property in case of need. |
| [PathAwareReplacer](#stringify-replacertype-aliasespathawarereplacermd) | The replacer that can potentially utilise the full path of the property in the object. |

#### Functions

| Function | Description |
| ------ | ------ |
| [pathAwareReplacer](#stringify-replacerfunctionspathawarereplacermd) | Build a replacer function that can be passed to JSON.stringify(...). |
| [pathBasedReplacer](#stringify-replacerfunctionspathbasedreplacermd) | Create a replacer function for JSON.stringify(...) from an array of path based rules. This function is useful for creating masking replacers which can apply masking based on the path of the property. |

### Functions


<a id="stringify-replacerfunctionspathawarereplacermd"></a>

#### Function: pathAwareReplacer()

> **pathAwareReplacer**(`replacer`, `options?`): [`JsonStringifyReplacer`](#stringify-replacertype-aliasesjsonstringifyreplacermd)

Build a replacer function that can be passed to JSON.stringify(...).

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `replacer` | [`PathAwareReplacer`](#stringify-replacertype-aliasespathawarereplacermd) | The actual replacer function which could utilise additional information. |
| `options?` | \{ `ancestors?`: `boolean`; `pathArray?`: `boolean`; \} | Options to control whether the pathArray and ancestors parameters would have values populated. By default all information available would be populated. There is no need to specify options unless you are extremely concerned about performance, for example if you need to frequently stringify 500MB objects. |
| `options.ancestors?` | `boolean` | - |
| `options.pathArray?` | `boolean` | - |

##### Returns

[`JsonStringifyReplacer`](#stringify-replacertype-aliasesjsonstringifyreplacermd)

The replacer function that can be passed to JSON.stringify(...).


<a id="stringify-replacerfunctionspathbasedreplacermd"></a>

#### Function: pathBasedReplacer()

> **pathBasedReplacer**(`rules`): [`JsonStringifyReplacerFromPathBasedRules`](#stringify-replacertype-aliasesjsonstringifyreplacerfrompathbasedrulesmd)

Create a replacer function for JSON.stringify(...) from an array of path based rules.
This function is useful for creating masking replacers which can apply masking based on the path of the property.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `rules` | \[`RegExp`, (`input`) => `any`\][] | Array of rules: if the regular expression tests true with the property path, the replacer function will be applied on the value |

##### Returns

[`JsonStringifyReplacerFromPathBasedRules`](#stringify-replacertype-aliasesjsonstringifyreplacerfrompathbasedrulesmd)

the replacer function built from those path based rules

##### Example

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

### Type Aliases


<a id="stringify-replacertype-aliasesjsonstringifyreplacermd"></a>

#### Type Alias: JsonStringifyReplacer()

> **JsonStringifyReplacer** = (`this`, `key`, `value`) => `any`

The original replacer expected by JSON.stringify(...)

##### Parameters

| Parameter | Type |
| ------ | ------ |
| `this` | `any` |
| `key` | `string` |
| `value` | `any` |

##### Returns

`any`


<a id="stringify-replacertype-aliasesjsonstringifyreplacerfrompathbasedrulesmd"></a>

#### Type Alias: JsonStringifyReplacerFromPathBasedRules

> **JsonStringifyReplacerFromPathBasedRules** = `object` & [`JsonStringifyReplacer`](#stringify-replacertype-aliasesjsonstringifyreplacermd)

A JsonStringifyReplacer that was created from path based rules.
Those rules are stored in the `rules` property in case of need.

##### Type declaration

| Name | Type |
| ------ | ------ |
| `rules` | \[`RegExp`, (`input`) => `any`\][] |


<a id="stringify-replacertype-aliasespathawarereplacermd"></a>

#### Type Alias: PathAwareReplacer()

> **PathAwareReplacer** = (`key`, `value`, `path`, `parent`, `pathArray`, `ancestors`) => `any`

The replacer that can potentially utilise the full path of the property in the object.

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `key` | `string` | Name of the property, or the index in the parent array. |
| `value` | `any` | Value of the property or the object in the parent array. |
| `path` | `string` | The full path of the property in the object, such like "access.visitor.location" or "request.x-forwarded-for.0". Please note that the special characters (including ".") in property names are not escaped, for example, "order.billing address.first line". |
| `parent` | `Parent` | The object that the property or the element belongs to. It could be `{ '': <the original object> }` when this replacer function is called the first time. |
| `pathArray` | `string`[] | The full path as an array. It is more useful than `path` in case special characters exist in property names. When this replacer function is called the first time, pathArray array would have a zero length. |
| `ancestors` | `Parent`[] | All the ancestor objects/arrays of the property. When this replacer function is called the first time, ancestors array would have a zero length. |

##### Returns

`any`

## Substitute


<a id="substitutereadmemd"></a>

### substitute

#### Functions

| Function | Description |
| ------ | ------ |
| [substituteAll](#substitutefunctionssubstituteallmd) | Substitute all occurrences of a pattern in a string. |

### Functions


<a id="substitutefunctionssubstituteallmd"></a>

#### Function: substituteAll()

> **substituteAll**\<`T`\>(`input`, `searchPattern`, `substitute`): `T`

Substitute all occurrences of a pattern in a string.

##### Type Parameters

| Type Parameter |
| ------ |
| `T` *extends* `undefined` \| `null` \| `string` |

##### Parameters

| Parameter | Type | Description |
| ------ | ------ | ------ |
| `input` | `T` | The input string on which the substitutions will be performed. |
| `searchPattern` | `RegExp` | The regular expression pattern used to search for segments that should be substituted. It must have the `g` flag set. If the beginning part of the `input` should be skipped, set the `lastIndex` of the `searchPattern` before calling this function. After all the substitution are done, the `lastIndex` of the `searchPattern` will be reset to zero. See [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/RegExp/lastIndex](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/lastIndex) |
| `substitute` | (`match`, `matchResult`) => `null` \| `string` | TThe function that builds the substitution string. It is called with the matched substring and the result of `RegExp.exec()`. See [https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global\_Objects/RegExp/exec#examples](https://developer.mozilla.org/en-US/docs/Web/JavaScript/Reference/Global_Objects/RegExp/exec#examples). The function can return null to indicate that no further substitution is desired. In such case, the `lastIndex` of the `searchPattern` will not be reset to zero. |

##### Returns

`T`

The resulting string after performing all substitutions.
<!-- API end -->
