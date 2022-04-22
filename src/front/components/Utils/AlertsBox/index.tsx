import { useEffect, useState } from "react";

export const AlertsBox = () => {
  const [alerts, setAlerts] = useState<any[]>([]);

  useEffect(() => {
    window.addEventListener("up-alert", (e: any) => {
      addAlert(e.detail);
    });
  }, []);

  const addAlert = ({
    message,
    type = "common",
    timeout = 5000,
  }: {
    message: string;
    type: string;
    timeout: number;
  }) => {
    if (!["success", "error", "common"].includes(type)) {
      type = "common";
    }

    const newAlert = {
      id: Date.now(),
      type,
      message,
    };

    setAlerts((a) => [newAlert, ...a]);

    setTimeout(() => {
      removeAlert(newAlert.id);
    }, timeout);
  };

  const removeAlert = (id: number) => {
    setAlerts((a) => a.filter((a) => a.id !== id));
  };

  return (
    <section className="up-alerts-box">
      {alerts.map((alert: any) => (
        <div
          key={alert.id}
          className={`up-alerts-box__alert up-alerts-box__alert--${alert.type}`}
        >
          <span className="up-alerts-box__alert-text">{alert.message}</span>
          <span
            className="up-alerts-box__alert-close"
            onClick={() => removeAlert(alert.id)}
          >
            x
          </span>
        </div>
      ))}
    </section>
  );
};
