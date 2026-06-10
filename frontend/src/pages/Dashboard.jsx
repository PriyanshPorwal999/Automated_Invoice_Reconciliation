import PageWrapper from "../component/layout/PageWrapper.jsx";
import StatsCard from "../component/dashboard/statsCard.jsx";

export default function Dashboard() {
  return (
    <PageWrapper>
      <h1 className="text-4xl font-bold text-white">
        Financial Audit Dashboard
      </h1>

      <div className="grid grid-cols-4 gap-6 mt-8">
        <StatsCard
          title="Documents"
          value="124"
        />

        <StatsCard
          title="Clean"
          value="101"
        />

        <StatsCard
          title="Defects"
          value="18"
        />

        <StatsCard
          title="Critical"
          value="5"
        />
      </div>
    </PageWrapper>
  );
}