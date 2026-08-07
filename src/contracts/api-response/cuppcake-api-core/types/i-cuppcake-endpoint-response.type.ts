export interface ICuppcakeEndpointResponse {
  result: unknown;
  error?: {
    statusCode: number;
    message: string;
    code?: string;
    timestamp?: string;
    path?: string;
    method?: string;
  } | null;
}
