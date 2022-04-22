export const dispatchConfirmBox = ({
  title,
  message,
  onConfirm,
  onCancel,
}: {
  title: string;
  message: string;
  onConfirm: any;
  onCancel?: any;
}) => {
  const event = new CustomEvent("up-confirm-box", {
    detail: { title, message, onConfirm, onCancel },
  });

  window.dispatchEvent(event);
};
