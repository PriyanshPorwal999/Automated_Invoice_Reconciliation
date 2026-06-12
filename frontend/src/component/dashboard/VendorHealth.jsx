export default function VendorHealth({ vendors }) {
  return (
    <div className="bg-slate-900 rounded-3xl p-6">
      <h2 className="text-white text-xl font-bold mb-5">
        Vendor Health
      </h2>

      {vendors.map((vendor) => (
        <div
          key={vendor.name}
          className="flex justify-between py-3 border-b border-slate-800"
        >
          <span className="text-slate-300">
            {vendor.name}
          </span>

          <span
            className={
              vendor.defects > 3
                ? "text-red-400"
                : vendor.defects > 0
                ? "text-yellow-400"
                : "text-green-400"
            }
          >
            {vendor.defects} defects
          </span>
        </div>
      ))}
    </div>
  );
}