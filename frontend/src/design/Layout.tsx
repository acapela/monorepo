import { Logo } from "./Logo";

export const Sidebar: React.FC<{
  children?: React.ReactNode;
  action?: React.ReactNode;
}> = ({ children, action }) => {
  return (
    <div className="flex flex-col w-full md:w-80 flex-shrink-0 bg-gray-200 p-5">
      <span className="w-32 mb-8">
        <Logo />
      </span>
      {children}
      <span className="mt-auto">{action}</span>
    </div>
  );
};

export const SidebarLayout: React.FC<{
  children?: React.ReactNode;
  sidebar: {
    content?: React.ReactNode;
    action?: React.ReactNode;
  };
}> = ({ children, sidebar }) => {
  return (
    <div className="md:flex flex-col md:flex-row md:min-h-screen w-full">
      <Sidebar action={sidebar.action}>{sidebar.content}</Sidebar>
      <div className="p-8 w-full">{children}</div>
    </div>
  );
};
