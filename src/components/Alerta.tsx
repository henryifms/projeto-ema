type AlertProps = {
  message: string;
  type?: "success" | "error";
};

const Alert = ({ message, type = "success" }: AlertProps) => {
  const base = "p-3 rounded-lg text-sm font-medium border";

  const styles =
    type === "success"
      ? "bg-green-100 text-green-700 border-green-200"
      : "bg-red-100 text-red-700 border-red-200";

  return <div className={`${base} ${styles}`}>{message}</div>;
};

export default Alert;
