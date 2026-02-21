import { SettingsPanels } from "@/components/settings/settings-panels";

export default function SettingsPage() {
  return (
    <div className="section-gap">
      <h1 className="text-page text-primary">Platform Settings</h1>
      <SettingsPanels />
    </div>
  );
}
