export default class SanitizeEveryWordService {
  public execute(element: any): any {
    if (
      typeof element === "number" ||
      typeof element === "boolean" ||
      element === null ||
      element === undefined
    ) {
      return element;
    }

    if (typeof element === "string") {
      return element.trim();
    }

    if (Array.isArray(element)) {
      return element.map((item) => this.execute(item));
    }

    if (typeof element === "object") {
      const newObject = {};
      Object.keys(element).forEach((key: string) => {
        // @ts-ignore
        newObject[key] = this.execute(element[key]);
      });
      return newObject;
    }

    return element;
  }
}
