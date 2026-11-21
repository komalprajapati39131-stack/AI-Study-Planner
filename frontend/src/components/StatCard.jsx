
function StatCard({ title, value, subtitle, icon: Icon }) {
  return (
    <div className="group bg-white p-6 rounded-2xl border border-slate-200
      shadow-sm hover:shadow-lg hover:-translate-y-1
      hover:border-indigo-200 transition-all duration-300">

      <div className="flex items-center justify-between">
        <p className="text-sm font-medium text-slate-500">
          {title}
        </p>

        <div className="p-3 bg-indigo-50 text-indigo-600 rounded-xl
          group-hover:bg-indigo-600 group-hover:text-white
          transition-all duration-300">
          <Icon size={22} strokeWidth={2} />
        </div>
      </div>

      <h3 className="text-3xl font-bold text-slate-800 mt-5 tracking-tight">
        {value}
      </h3>

      <p className="text-sm text-slate-500 mt-2">
        {subtitle}
      </p>

    </div>
  );
}

export default StatCard;