import type { EquiSettingsExportPayload } from "@/data/settings/settings.types";

const EXPORT_FILE_NAME = "equi-settings.json";

export const exportSettingsToFile = (payload: EquiSettingsExportPayload): void => {
  const json = JSON.stringify(payload, null, 2);
  const blob = new Blob([json], { type: "application/json" });
  const url = URL.createObjectURL(blob);

  const anchor = document.createElement("a");
  anchor.href = url;
  anchor.download = EXPORT_FILE_NAME;
  anchor.style.display = "none";
  document.body.appendChild(anchor);
  anchor.click();
  document.body.removeChild(anchor);
  URL.revokeObjectURL(url);
};
