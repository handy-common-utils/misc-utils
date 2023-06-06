/**
 * Some (not all) well known HTTP status codes
 */
export enum HttpStatusCode {
  /**
   * The request has succeeded. The meaning of a success varies depending on the HTTP method:
   * GET: The resource has been fetched and is transmitted in the message body.
   * HEAD: The entity headers are in the message body.
   * POST: The resource describing the result of the action is transmitted in the message body.
   * TRACE: The message body contains the request message as received by the server
   */
  OK200 = 200,
  /**
   * The request has succeeded and a new resource has been created as a result of it. This is typically the response sent after a PUT request.
   */
  CREATED201 = 201,
  /**
   * The request has been received but not yet acted upon. It is non-committal, meaning that there is no way in HTTP to later send an asynchronous response indicating the outcome of processing the request. It is intended for cases where another process or server handles the request, or for batch processing.
   */
  ACCEPTED202 = 202,
  /**
   * There is no content to send for this request, but the headers may be useful. The user-agent may update its cached headers for this resource with the new ones.
   */
  NO_CONTENT204 = 204,
  /**
   * This response code means that URI of requested resource has been changed. Probably, new URI would be given in the response.
   */
  MOVED_PERMANENTLY301 = 301,
  /**
   * This response code means that URI of requested resource has been changed temporarily. New changes in the URI might be made in the future. Therefore, this same URI should be used by the client in future requests.
   */
  MOVED_TEMPORARILY302 = 302,
  /**
   * Server sent this response to directing client to get requested resource to another URI with an GET request.
   */
  SEE_OTHER303 = 303,
  /**
   * Server sent this response to directing client to get requested resource to another URI with same method that used prior request. This has the same semantic than the 302 Found HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
   */
  TEMPORARY_REDIRECT307 = 307,
  /**
   * This means that the resource is now permanently located at another URI, specified by the Location: HTTP Response header. This has the same semantics as the 301 Moved Permanently HTTP response code, with the exception that the user agent must not change the HTTP method used: if a POST was used in the first request, a POST must be used in the second request.
   */
  PERMANENT_REDIRECT308 = 308,
  /**
   * This response means that server could not understand the request due to invalid syntax.
   */
  BAD_REQUEST400 = 400,
  /**
   * Although the HTTP standard specifies "unauthorized", semantically this response means "unauthenticated". That is, the client must authenticate itself to get the requested response.
   */
  UNAUTHORIZED401 = 401,
  /**
   * The client does not have access rights to the content, i.e. they are unauthorized, so server is rejecting to give proper response. Unlike 401, the client's identity is known to the server.
   */
  FORBIDDEN403 = 403,
  /**
   * The server can not find requested resource. In the browser, this means the URL is not recognized. In an API, this can also mean that the endpoint is valid but the resource itself does not exist. Servers may also send this response instead of 403 to hide the existence of a resource from an unauthorized client. This response code is probably the most famous one due to its frequent occurence on the web.
   */
  NOT_FOUND404 = 404,
  /**
   * The request method is known by the server but has been disabled and cannot be used. For example, an API may forbid DELETE-ing a resource. The two mandatory methods, GET and HEAD, must never be disabled and should not return this error code.
   */
  METHOD_NOT_ALLOWED405 = 405,
  /**
   * This response is sent on an idle connection by some servers, even without any previous request by the client. It means that the server would like to shut down this unused connection. This response is used much more since some browsers, like Chrome, Firefox 27+, or IE9, use HTTP pre-connection mechanisms to speed up surfing. Also note that some servers merely shut down the connection without sending this message.
   */
  REQUEST_TIMEOUT408 = 408,
  /**
   * This response is sent when a request conflicts with the current state of the server.
   */
  CONFLICT409 = 409,
  /**
   * The user has sent too many requests in a given amount of time ("rate limiting").
   */
  TOO_MANY_REQUESTS429 = 429,
  /**
   * The server encountered an unexpected condition that prevented it from fulfilling the request.
   */
  INTERNAL_SERVER_ERROR500 = 500,
  /**
   * The request method is not supported by the server and cannot be handled. The only methods that servers are required to support (and therefore that must not return this code) are GET and HEAD.
   */
  NOT_IMPLEMENTED501 = 501,
  /**
   * This error response means that the server, while working as a gateway to get a response needed to handle the request, got an invalid response.
   */
  BAD_GATEWAY502 = 502,
  /**
   * The server is not ready to handle the request. Common causes are a server that is down for maintenance or that is overloaded. Note that together with this response, a user-friendly page explaining the problem should be sent. This responses should be used for temporary conditions and the Retry-After: HTTP header should, if possible, contain the estimated time before the recovery of the service. The webmaster must also take care about the caching-related headers that are sent along with this response, as these temporary condition responses should usually not be cached.
   */
  SERVICE_UNAVAILABLE503 = 503,
  /**
   * This error response is given when the server is acting as a gateway and cannot get a response in time.
   */
  GATEWAY_TIMEOUT504 = 504,
}

/**
 * Some (not all) HTTP status messages matching their codes
 */
export const HttpStatusMessage = {
  [HttpStatusCode.OK200]: 'OK',
  [HttpStatusCode.CREATED201]: 'Created',
  [HttpStatusCode.ACCEPTED202]: 'Accepted',
  [HttpStatusCode.NO_CONTENT204]: 'No Content',
  [HttpStatusCode.MOVED_PERMANENTLY301]: 'Moved Permanently',
  [HttpStatusCode.MOVED_TEMPORARILY302]: 'Moved Temporarily',
  [HttpStatusCode.SEE_OTHER303]: 'See Other',
  [HttpStatusCode.TEMPORARY_REDIRECT307]: 'Temporary Redirect',
  [HttpStatusCode.PERMANENT_REDIRECT308]: 'Permanent Redirect',
  [HttpStatusCode.BAD_REQUEST400]: 'Bad Request',
  [HttpStatusCode.UNAUTHORIZED401]: 'Unauthorized',
  [HttpStatusCode.FORBIDDEN403]: 'Forbidden',
  [HttpStatusCode.NOT_FOUND404]: 'Not Found',
  [HttpStatusCode.METHOD_NOT_ALLOWED405]: 'Method Not Allowed',
  [HttpStatusCode.REQUEST_TIMEOUT408]: 'Request Timeout',
  [HttpStatusCode.CONFLICT409]: 'Conflict',
  [HttpStatusCode.TOO_MANY_REQUESTS429]: 'Too Many Requests',
  [HttpStatusCode.INTERNAL_SERVER_ERROR500]: 'Internal Server Error',
  [HttpStatusCode.NOT_IMPLEMENTED501]: 'Not Implemented',
  [HttpStatusCode.BAD_GATEWAY502]: 'Bad Gateway',
  [HttpStatusCode.SERVICE_UNAVAILABLE503]: 'Service Unavailable',
  [HttpStatusCode.GATEWAY_TIMEOUT504]: 'Gateway Timeout',
};
