import {
  MdInventory2,
  MdLocalShipping,
  MdWarningAmber,
} from "react-icons/md";
import { Link } from "react-router-dom";
import StatCard from "../../components/cards/StatCard";
import SectionHeader from "../../components/common/SectionHeader";
import { useUser } from "../../contexts/user/UserContext";
import Activities from "../general/Activities";
import Deployments from "./Deployments";
import {
  formatCompactAmount,
  formatNumberWithCommas,
} from "../../utility/formatterUtilities";

const overviewStats = {
  totalMaterials: 12840,
  lowStockMaterials: 46,
  totalDeployments: 924,
};

const Overview = () => {
  const { user } = useUser();
  const firstName = user?.name?.split(" ")?.[0] ?? "Admin";

  return (
    <main className="flex flex-col gap-6">
      <section className="rounded-md border border-tableBorder bg-white p-5 shadow-sm shadow-primary/5">
        <div className="flex flex-col gap-4 lg:flex-row lg:items-center lg:justify-between">
          <div>
            <h1 className="mt-2 text-2xl font-extrabold text-tableHeading">
              Welcome back, {firstName}
            </h1>
            <p className="mt-2 max-w-2xl text-sm leading-6 text-tableData">
              Monitor material availability, deployment movement, and field
              activity from one operational command view.
            </p>
          </div>
        </div>
      </section>

      <section className="grid gap-4 sm:grid-cols-2 xl:grid-cols-3">
        <StatCard
          title="Total Materials"
          value={formatCompactAmount(overviewStats.totalMaterials)}
          icon={MdInventory2}
          subtitle="Across active inventory categories"
        />
        <StatCard
          title="Low Stock Materials"
          value={formatNumberWithCommas(overviewStats.lowStockMaterials)}
          icon={MdWarningAmber}
          subtitle="Items at or below reorder level"
        />
        <StatCard
          title="Total Deployments"
          value={formatCompactAmount(overviewStats.totalDeployments)}
          icon={MdLocalShipping}
          subtitle="All deployment records"
        />
      </section>

      <section className="grid gap-6 xl:grid-cols-[minmax(0,1.25fr)_minmax(360px,0.75fr)]">
        <section className="flex flex-col gap-4">
          <SectionHeader
            title="Recent Deployments"
            subtitle="Latest material dispatches and employee assignments."
            action={
              <Link
                to="/admin/deployments"
                className="text-xs font-bold text-primary transition hover:text-primary/80"
              >
                View All
              </Link>
            }
          />
          <Deployments isRecent />
        </section>

        <section className="flex flex-col gap-4">
          <SectionHeader
            title="Recent Activities"
            subtitle="Operational updates from users and inventory actions."
            action={
              <Link
                to="/general/activities"
                className="text-xs font-bold text-primary transition hover:text-primary/80"
              >
                View All
              </Link>
            }
          />
          <Activities isRecent />
        </section>
      </section>
    </main>
  );
};

export default Overview;
