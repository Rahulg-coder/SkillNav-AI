function Navbar() {
  return (
    <header className="h-16 border-b border-slate-200 bg-white flex items-center justify-between px-6">
      <div>
        <h2 className="text-lg font-semibold text-slate-800">
          Personalized Learning
        </h2>
        <p className="text-sm text-slate-500">
          Your AI-powered learning companion
        </p>
      </div>

      <div className="flex items-center gap-3">
        <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
          S
        </div>

        <div>
          <p className="text-sm font-medium text-slate-800">Learner</p>
          <p className="text-xs text-slate-500">Student</p>
        </div>
      </div>
    </header>
  );
}

export default Navbar;