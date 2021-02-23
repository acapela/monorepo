import { useRouter } from "next/router";
import classNames from "classnames";
import Link from "next/link";

export const NavLink: React.FC<{
  to?: string;
  children?: React.ReactNode;
}> = ({ to, children }) => {
  const router = useRouter();
  const isActive = router.asPath === to;
  const className = classNames(
    "block p-4 rounded-lg font-semibold transition duration-150 ease-in-out transform-gpu hover:-translate-y-0.5 mb-1 active:translate-y-0",
    {
      "bg-white shadow-lg hover:shadow-xl": isActive,
      "hover:bg-white hover:bg-opacity-50 hover:shadow-sm": !isActive,
    }
  );
  return (
    <Link href={to}>
      <a className={className}>{children}</a>
    </Link>
  );
};
