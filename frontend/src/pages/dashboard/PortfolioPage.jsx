import React, { useState } from "react";
import ProductJourneySection from "../../components/dashboard/ProductJourneySection";
import RecentPortfoliosSection from "../../components/dashboard/RecentPortfoliosSection";
import CreatePortfolioModal from "../../components/dashboard/CreatePortfolioModal";
import ErrorState from "../../components/common/ErrorState";
import Skeleton from "../../components/common/Skeleton";
import { useSummary } from "../../hooks/useSummary";
import "./PortfolioPage.css";

export const PortfolioPage = () => {
  const { summary, loading, error, refetch } = useSummary();
  const [isCreateModalOpen, setIsCreateModalOpen] = useState(false);

  return (
    <div className="portfolio-page-container">
      {/* Loading Skeleton */}
      {loading && !summary && (
        <div className="portfolio-page-loading" aria-label="Loading portfolio journey...">
          <Skeleton height="180px" borderRadius="16px" />
          <Skeleton height="260px" borderRadius="16px" />
        </div>
      )}

      {/* Error State Card with Try Again */}
      {error && !loading && (
        <ErrorState
          title="Unable to load portfolio journey"
          message={error}
          onRetry={() => refetch()}
          retryText="Try again"
        />
      )}

      {/* Content when Summary Data is Available */}
      {summary && (
        <>
          {/* Top: Product Journey Stepper */}
          <ProductJourneySection
            journey={summary.journey}
            onCreatePortfolio={() => setIsCreateModalOpen(true)}
          />

          {/* User's Portfolios Section (Cards + Create Button + Empty State) */}
          <RecentPortfoliosSection
            portfolios={summary.recentPortfolios}
            onCreateClick={() => setIsCreateModalOpen(true)}
          />
        </>
      )}

      {/* Create Portfolio Modal */}
      <CreatePortfolioModal
        isOpen={isCreateModalOpen}
        onClose={() => setIsCreateModalOpen(false)}
      />
    </div>
  );
};

export default PortfolioPage;

