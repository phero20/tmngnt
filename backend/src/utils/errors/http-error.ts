import { ContentfulStatusCode } from 'hono/utils/http-status';

export class HttpError extends Error {
  status: ContentfulStatusCode;

  constructor(status: ContentfulStatusCode, message: string) {
    super(message);
    this.status = status;
    Object.setPrototypeOf(this, HttpError.prototype);
  }
}

export class BadRequestError extends HttpError {
  constructor(message: string = 'Bad Request') {
    super(400, message);
  }
}

export class UnauthorizedError extends HttpError {
  constructor(message: string = 'Unauthorized') {
    super(401, message);
  }
}

export class ForbiddenError extends HttpError {
  constructor(message: string = 'Forbidden') {
    super(403, message);
  }
}

export class NotFoundError extends HttpError {
  constructor(message: string = 'Not Found') {
    super(404, message);
  }
}

export class ConflictError extends HttpError {
  constructor(message: string = 'Conflict') {
    super(409, message);
  }
}

export class UnprocessableEntityError extends HttpError {
  constructor(message: string = 'Unprocessable Entity') {
    super(422, message);
  }
}

export class TooManyRequestsError extends HttpError {
  constructor(message: string = 'Too Many Requests') {
    super(429, message);
  }
}

export class InternalServerError extends HttpError {
  constructor(message: string = 'Internal Server Error') {
    super(500, message);
  }
}

export class ServiceUnavailableError extends HttpError {
  constructor(message: string = 'Service Unavailable') {
    super(503, message);
  }
}
