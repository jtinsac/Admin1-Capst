import { Link, useLocation, useNavigate } from "react-router-dom";
import { Users, House, LogOut, Grid2x2 } from "lucide-react";
import { ref, update } from "firebase/database";
import { database } from "../firebase.config";
import "../components/sidebar1.css";

function SidebarAd1() {
  const navigate = useNavigate();

  function CustomLink({ href, children, className = "", onClick, ...props }) {
    const location = useLocation(); // Get current path
    const path = location.pathname.replace(/\/$/, ""); // Normalize path
    const linkHref = href.replace(/\/$/, ""); // Normalize href

    // Dynamically add "active" class
    const isActive = path === linkHref;
    const activeClass = isActive ? "active" : "";

    const handleClick = async (e) => {
      if (onClick) {
        e.preventDefault(); // Prevent default navigation if `onClick` is provided
        await onClick();
      }
      navigate(href); // Navigate after handling logic
    };

    return (
      <Link
        to={href}
        className={`${className} ${activeClass}`}
        onClick={handleClick}
        {...props}
      >
        {children}
      </Link>
    );
  }

  const handleLogout = async () => {
    // Confirm before logging out
    const confirmLogout = window.confirm("Are you sure you want to log out?");
    if (!confirmLogout) return;

    try {
      // Update the LoginStatus of Window1 to "Inactive"
      const windowRef = ref(database, "QueueSystemStatus/Window1");
      await update(windowRef, { LoginStatus: "Inactive" });

      // Clear logged-in user data from localStorage
      localStorage.removeItem("loggedInUsername");

      console.log("User logged out successfully");
    } catch (error) {
      console.error("Error logging out:", error);
      alert("An error occurred while logging out. Please try again.");
      return;
    }

    // Redirect to login page after successful logout
    navigate("/");
  };

  return (
    <div className="sidebar-container">
      <div className="sidebar-pagesAd1">
        <div className="sidebar-logo">EasyQ's.</div>
        <div className="sidebar-logo2">E</div>

        <div className="sidebar-pages1">
          <h3 className="sidebar-header1">MAIN MENU</h3>

          <CustomLink className="sidebar-link" href="/dashboard1">
            <House size={22} className="sidebar-icons" />
            <span className="sidebar-label">Dashboard</span>
          </CustomLink>

          <CustomLink className="sidebar-link" href="/users1">
            <Users size={22} className="sidebar-icons" />
            <span className="sidebar-label">Users</span>
          </CustomLink>
        </div>

        <div className="sidebar-pages2">
          <h4 className="sidebar-header2">FINANCE WINDOW</h4>

          <CustomLink className="sidebar-link" href="/winad1">
            <Grid2x2 size={22} className="sidebar-icons" />
            <span className="sidebar-label">Window 1</span>
          </CustomLink>

          <div className="conz">
            <CustomLink
              className="sidebar-link"
              href="/"
              onClick={handleLogout}
            >
              <LogOut size={22} className="sidebar-icons" flip="horizontal" />
              <span className="sidebar-label">Log out</span>
            </CustomLink>
          </div>
        </div>
      </div>
    </div>
  );
}

export default SidebarAd1;
