"use client";
import DashboardLayout from "@/components/ui/layout/layout";
import { WeeklyActivity } from "@/components/shared/dashboard/weeklyActivity";
import { FeaturedBusiness } from "@/components/shared/dashboard/featuredPharmacies";
import { GrowthHistory } from "@/components/shared/dashboard/growthHistory";
import { CategoryStats } from "@/components/shared/dashboard/statsCategory";
import { FeaturedAgents } from "@/components/shared/dashboard/featuredAgents";
import { UsersActivity } from "@/components/shared/dashboard/usersActivity";
import { FeaturedMedications } from "@/components/shared/dashboard/featuredMedications";
import { DeliveryReportCard } from "@/components/shared/dashboard/DeliveryReportCard";

export default function DashboardMedizin() {
  return (
    <DashboardLayout>
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-6 bg-[#F8FAFC] max-w-[1600px] mx-auto w-full">
        <WeeklyActivity />
        <FeaturedBusiness />
        <GrowthHistory />
        <CategoryStats />
        <FeaturedAgents />
        <UsersActivity />
        <FeaturedMedications />
        <DeliveryReportCard />
      </div>
    </DashboardLayout>
  );
}
