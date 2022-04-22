import { useEffect, useState } from "react";
import { Button } from "../../Base/Button";

export const COnfirmBox = () => {
  const [show, setShow] = useState(false);
  const [title, setTitle] = useState("");
  const [message, setMessage] = useState("");
  const [onConfirm, setOnConfirm] = useState(null);
  const [onCancel, setOnCancel] = useState(null);
  const [loading, setLoading] = useState(false);

  useEffect(() => {
    window.addEventListener("up-confirm-box", (e: any) => {
      setTitle(e.detail.title);
      setMessage(e.detail.message);
      setOnConfirm(() => e.detail.onConfirm);
      setOnCancel(() => e.detail.onCancel);
      setShow(true);
    });
  }, []);

  const handleConfirm = async () => {
    setLoading(true);

    if (typeof onConfirm === "function") {
      // @ts-ignore
      await onConfirm(true);
    }

    setShow(false);
    setLoading(false);
  };

  const handleCancel = async () => {
    setLoading(true);

    if (typeof onCancel === "function") {
      // @ts-ignore
      await onCancel(true);
    }

    setShow(false);
    setLoading(false);
  };

  if (!show) {
    return <></>;
  }

  return (
    <>
      <div className="up-modal">
        <h1>{title}</h1>
        <p>{message}</p>
        <div className="up-modal__buttons">
          <Button
            className="up-modal__button"
            onClick={handleConfirm}
            disabled={loading}
          >
            {loading ? "Loading..." : "Confirm"}
          </Button>
          <Button
            className="up-modal__button"
            onClick={handleCancel}
            disabled={loading}
          >
            {loading ? "Loading..." : "Cancel"}
          </Button>
        </div>
      </div>
      <div className="up-modal__overlay" onClick={() => setShow(false)} />
    </>
  );
};
