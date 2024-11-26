import ExpectedVsActualChart from "@/components/molecules/expectedVsActualChart";

export default function SalesDashboard() {
  return (
    <section className="sales-dashboard grid grid-cols-2 gap-4 place-items-center">
      <ExpectedVsActualChart expected={[{ name: "30", value: 3210 }, { name: "31", value: 2034 }]} actual={[3010, 3100]} options={{}} />
      <ExpectedVsActualChart expected={[{ name: "30", value: 3210 }, { name: "31", value: 2034 }]} actual={[3010, 3100]} options={{}} />
    </section>
  );
}
