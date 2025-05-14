import { Timestamp } from "firebase/firestore";

export function useFormatDate() {
  const formatDate = (date: string | Date | Timestamp | null) => {
    if (!date) return "Unknown";
    if (typeof date === "string") {
      const parsedDate = new Date(date);
      return isNaN(parsedDate.getTime())
        ? "Invalid Date"
        : parsedDate.toLocaleDateString("en-GB", {
            year: "numeric",
            month: "long",
            day: "numeric",
            hour: "2-digit",
            minute: "2-digit",
          });
    }
    if (date instanceof Date) {
      return date.toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    if (date && typeof (date as any).toDate === "function") {
      return (date as Timestamp).toDate().toLocaleDateString("en-GB", {
        year: "numeric",
        month: "long",
        day: "numeric",
        hour: "2-digit",
        minute: "2-digit",
      });
    }
    return "Unknown";
  };

  return { formatDate };
}
