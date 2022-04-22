export const dispatchAlert = ({
  message,
  type,
  timeout,
}: {
  message: string;
  type?: string;
  timeout?: number;
}) => {
  const event = new CustomEvent("up-alert", {
    detail: { message, type, timeout },
  });
  window.dispatchEvent(event);
};
