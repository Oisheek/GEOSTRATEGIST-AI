import AppLayout
from "../layouts/AppLayout";

export default function Dashboard() {

  return (
    <AppLayout>

      <div className="grid gap-6 md:grid-cols-4">

        <div className="border rounded-lg p-4">
          Active Conflicts
        </div>

        <div className="border rounded-lg p-4">
          Threat Index
        </div>

        <div className="border rounded-lg p-4">
          Alerts
        </div>

        <div className="border rounded-lg p-4">
          Forecasts
        </div>

      </div>

    </AppLayout>
  );
}