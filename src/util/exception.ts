export class ApiExceptionResponse {
  timestamp: Date = new Date();
  status: string = "505";
  error: string = "Internal server error";
  message: string = "";
  fieldErrors: FieldErrors = {};
  objectErrors: string[] = [];
}

export interface FieldErrors {
  [key: string]: string;
}
