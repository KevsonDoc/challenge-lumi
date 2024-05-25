export class HttpExeption extends Error {
  constructor(
    public readonly messages: string[] = [],
    public readonly httpStatusCode: number,
  ) {
    super(messages[0]);
  }
}
