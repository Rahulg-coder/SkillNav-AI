import { LogOut } from "lucide-react";
import { useNavigate } from "react-router-dom";

function Navbar() {
  const navigate = useNavigate();

  const handleLogout = () => {
    localStorage.removeItem("skillpath_logged_in");
    navigate("/login");
  };

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

      <div className="flex items-center gap-4">

        <div className="flex items-center gap-3">

          <div className="w-9 h-9 rounded-full bg-blue-100 flex items-center justify-center text-blue-600 font-semibold">
            S
          </div>

          <div className="hidden sm:block">
            <p className="text-sm font-medium text-slate-800">
              Learner
            </p>

            <p className="text-xs text-slate-500">
              Student
            </p>
          </div>

        </div>

        <button
          onClick={handleLogout}
          className="flex items-center gap-2 px-3 py-2 rounded-lg text-sm text-slate-500 hover:bg-slate-100 hover:text-red-600 transition"
        >
          <LogOut size={17} />
          <span className="hidden sm:block">
            Logout
          </span>
        </button>

      </div>

    </header>
  );
}

export default Navbar;