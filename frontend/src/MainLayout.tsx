import { SidebarLayout } from "./design/Layout";
import { NavLink } from "./design/NavLink";
import { RoomCreationButton } from "./rooms/createRoom";

export const MainLayout: React.FC<{ children?: React.ReactNode }> = ({ children }) => {
  return (
    <SidebarLayout
      sidebar={{
        content: (
          <>
            <nav>
              <NavLink to="/home">Upcoming Acapelas</NavLink>
              <NavLink to="/active">Active Acapelas</NavLink>
              <NavLink to="/past">Past Acapelas</NavLink>
              <NavLink to="/settings">Settings</NavLink>
            </nav>
          </>
        ),
        action: <RoomCreationButton />,
      }}
    >
      {children}
    </SidebarLayout>
  );
};
