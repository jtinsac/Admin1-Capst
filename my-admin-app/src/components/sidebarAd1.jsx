import { Link, useLocation, useNavigate } from "react-router-dom";
import { Users, House, LogOut, Grid2x2 } from "lucide-react";
import { ref, update } from "firebase/database";
import { database } from "../firebase.config";
import "../components/sidebar1.css";
import Swal from 'sweetalert2'

function SidebarAd1() {
  const navigate = useNavigate();

  const handleLogout = async () => {
    // Confirm before logging out
    const confirmLogout = await Swal.fire({
      title: 'Confirm Logout',
      text: 'Are you sure you want to Log out?',
      icon: '',
      confirmButtonText: 'Yes',
      confirmButtonColor: '#1C2E8B',
      showCancelButton: true,
      customClass: {
        confirmButton: "confirm-button",
        cancelButton:"cancel-button",
      }
    })

   
    if (!confirmLogout.isConfirmed) return;

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
    navigate ('/')
  };

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

  return (
    <div className="sidebar-container">

      <div className="sidebar-wrapperAd1">
    
        <div className="sidebar-pages1">
        <div className="sidebar-logo">EasyQ's.</div>
        <div className="sidebar-logo2">E</div>
          <h3 className="sidebar-header1">MAIN MENU</h3>

          <CustomLink className="sidebar-link" href="/dashboard1">
            <House size={22} className="sidebar-icons" />
            <span className="sidebar-label">Dashboard</span>
          </CustomLink>

          <CustomLink className="sidebar-link" href="/users1">
            <Users size={22} className="sidebar-icons" />
            <span className="sidebar-label">Users</span>
            </CustomLink>
            <h4 className="sidebar-header2">FINANCE WINDOW</h4>

          <CustomLink className="sidebar-link" href="/winad1">
            <Grid2x2 size={22} className="sidebar-icons" />
            <span className="sidebar-label">Window 1</span>
          </CustomLink>
        </div>

        <div className="sidebar-pages2">
            <div className="ad1Logout-btn" href="/" onClick={handleLogout}>
              <LogOut size={22} className="sidebar-icons" flip="horizontal" />
              <span className="sidebar-label">Log out</span>
            </div>
         
        </div>

      </div>
    </div>
  );
}



export default SidebarAd1;
