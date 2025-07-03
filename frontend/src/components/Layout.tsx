import { Link, Outlet } from "react-router-dom";

export default function Layout() {
  return (
    <div className="min-h-screen bg-background">
      {/* <nav className="border-b">
        <div className="container mx-auto px-4 py-4">
          <div className="flex justify-between items-center">
            <Link to="/" className="text-2xl font-bold">
              Lessons Manager
            </Link>
          </div>
        </div>
      </nav> */}
      <main>
        <Outlet />
      </main>
    </div>
  );
}
