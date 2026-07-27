import { getPassThreshold } from "@/lib/settings";
import { updateSettings } from "./actions";

export default async function AdminSettingsPage() {
  const passThreshold = await getPassThreshold();

  return (
    <div className="p-margin-desktop flex flex-col gap-lg max-w-3xl mx-auto w-full">
      <div>
        <h1 className="font-headline-lg text-headline-lg text-primary font-bold">Settings</h1>
        <p className="text-body-md text-on-surface-variant">
          Platform-wide configuration. Changes apply immediately to every exam.
        </p>
      </div>

      <form action={updateSettings} className="bg-white rounded-xl border border-outline-variant/30 shadow-sm p-lg flex flex-col gap-md">
        <div>
          <label className="font-label-sm text-label-sm text-on-surface-variant uppercase block mb-1">
            Pass Threshold
          </label>
          <p className="font-body-sm text-body-sm text-on-surface-variant mb-2">
            The minimum score percentage a student needs to pass an exam and earn a certificate. Used across
            the dashboard, results pages, and certificate issuance.
          </p>
          <div className="flex items-center gap-sm">
            <input
              type="number"
              name="passThreshold"
              defaultValue={passThreshold}
              min={0}
              max={100}
              step={1}
              required
              className="w-32 px-3 py-2 rounded-lg border border-outline-variant/40 text-label-md"
            />
            <span className="font-label-md text-label-md text-on-surface-variant">%</span>
          </div>
        </div>

        <div className="pt-sm">
          <button
            type="submit"
            className="px-6 py-2.5 bg-primary text-on-primary rounded-lg font-label-md text-label-md font-bold hover:opacity-90 transition-all"
          >
            Save Settings
          </button>
        </div>
      </form>
    </div>
  );
}
