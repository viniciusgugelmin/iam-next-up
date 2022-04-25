export default function initMiddleware(middleware: any): any {
  return (req: any, res: any): void => {
    new Promise((resolve, reject) => {
      middleware(req, res, (result: any) => {
        if (result instanceof Error) {
          return reject(result);
        }
        return resolve(result);
      });
    });
  };
}
