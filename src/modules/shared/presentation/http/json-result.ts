export type HttpErrorBody = {
  result: null;
  error: {
    statusCode: number;
    message: string;
    code?: string;
  };
};

export type HttpSuccessBody<T> = {
  result: T;
};

export function jsonResult<T>(data: T, init?: ResponseInit): Response {
  return Response.json({ result: data } satisfies HttpSuccessBody<T>, init);
}

export function jsonError(
  statusCode: number,
  message: string,
  code?: string,
): Response {
  return Response.json(
    {
      result: null,
      error: { statusCode, message, ...(code ? { code } : {}) },
    } satisfies HttpErrorBody,
    { status: statusCode },
  );
}
