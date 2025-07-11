import type {
  Address,
  GapDetectionResult,
  Job,
} from "@/types/driverApplicationForm";
import dayjs from "dayjs";
import { useCallback } from "react";

export const useGapDetection = () => {
  const checkResidencyRequirements = useCallback(
    (currentAddressFromMonth: number, currentAddressFromYear: number) => {
      const currentAddressFrom = dayjs(
        `${currentAddressFromYear}-${currentAddressFromMonth}-01`
      );
      const threeYearsAgo = dayjs().subtract(3, "year");

      return currentAddressFrom.isAfter(threeYearsAgo);
    },
    []
  );

  const checkForResidencyGaps = useCallback(
    (
      addresses: Address[],
      currentAddressFromMonth: number,
      currentAddressFromYear: number
    ): GapDetectionResult => {
      const currentAddressFrom = dayjs(
        `${currentAddressFromYear}-${currentAddressFromMonth}-01`
      );
      const threeYearsAgo = dayjs().subtract(3, "year");

      // If current address covers 3+ years, no gaps
      if (currentAddressFrom.isBefore(threeYearsAgo)) {
        return {
          gapDetected: false,
          periods: [],
        };
      }

      // Sort addresses by end date (most recent first)
      const sortedAddresses = addresses
        .filter((addr) => addr.address && addr.city && addr.state && addr.zip) // Only include complete addresses
        .sort((a, b) => {
          const aDate = dayjs(`${a.toYear}-${a.toMonth}-01`).endOf("month");
          const bDate = dayjs(`${b.toYear}-${b.toMonth}-01`).endOf("month");
          return bDate.diff(aDate);
        });

      let gaps: Array<{ from: dayjs.Dayjs; to: dayjs.Dayjs }> = [];
      let lastToDate = currentAddressFrom;

      // Check for gaps between current address and previous addresses
      sortedAddresses.forEach((address) => {
        const addressTo = dayjs(
          `${address.toYear}-${address.toMonth}-01`
        ).endOf("month");
        const addressFrom = dayjs(
          `${address.fromYear}-${address.fromMonth}-01`
        ).startOf("month");

        // Check if there's a gap between current address and this address
        if (lastToDate.diff(addressTo, "month") > 1) {
          gaps.push({
            from: addressTo.add(1, "month"),
            to: lastToDate.subtract(1, "month"),
          });
        }
        lastToDate = addressFrom;
      });

      // Check if we have covered the full 3 years
      if (lastToDate.isAfter(threeYearsAgo)) {
        gaps.push({
          from: threeYearsAgo,
          to: lastToDate.subtract(1, "month"),
        });
      }

      // Also check for overlaps in addresses
      const overlaps: Array<{ from: dayjs.Dayjs; to: dayjs.Dayjs }> = [];
      for (let i = 0; i < sortedAddresses.length - 1; i++) {
        const current = sortedAddresses[i];
        const next = sortedAddresses[i + 1];

        const currentFrom = dayjs(
          `${current.fromYear}-${current.fromMonth}-01`
        ).startOf("month");
        const currentTo = dayjs(
          `${current.toYear}-${current.toMonth}-01`
        ).endOf("month");
        const nextFrom = dayjs(`${next.fromYear}-${next.fromMonth}-01`).startOf(
          "month"
        );
        const nextTo = dayjs(`${next.toYear}-${next.toMonth}-01`).endOf(
          "month"
        );

        // Check if there's an overlap
        if (currentFrom.isBefore(nextTo) && currentTo.isAfter(nextFrom)) {
          overlaps.push({
            from: currentFrom.isAfter(nextFrom) ? currentFrom : nextFrom,
            to: currentTo.isBefore(nextTo) ? currentTo : nextTo,
          });
        }
      }

      return {
        gapDetected: gaps.length > 0 || overlaps.length > 0,
        periods: [
          ...gaps.map((gap) => ({
            from: gap.from.format("MM/YYYY"),
            to: gap.to.format("MM/YYYY"),
            type: "gap" as const,
          })),
          ...overlaps.map((overlap) => ({
            from: overlap.from.format("MM/YYYY"),
            to: overlap.to.format("MM/YYYY"),
            type: "overlap" as const,
          })),
        ],
      };
    },
    []
  );

  const checkForEmploymentGaps = useCallback(
    (jobs: Job[]): GapDetectionResult => {
      // Filter out incomplete jobs
      const validJobs = jobs.filter(
        (job) =>
          job.employerName &&
          job.positionHeld &&
          job.fromMonth &&
          job.fromYear &&
          job.toMonth &&
          job.toYear
      );

      if (validJobs.length === 0) {
        return {
          gapDetected: true,
          periods: [],
          totalMonths: 0,
        };
      }

      // Sort jobs by end date (most recent first)
      const sortedJobs = validJobs.sort((a, b) => {
        const aDate = dayjs(`${a.toYear}-${a.toMonth}-01`).endOf("month");
        const bDate = dayjs(`${b.toYear}-${b.toMonth}-01`).endOf("month");
        return bDate.diff(aDate);
      });

      let gaps: Array<{ from: dayjs.Dayjs; to: dayjs.Dayjs }> = [];
      const today = dayjs();
      let lastToDate = today;

      // Check for gaps between jobs
      sortedJobs.forEach((job) => {
        const jobTo = dayjs(`${job.toYear}-${job.toMonth}-01`).endOf("month");
        const jobFrom = dayjs(`${job.fromYear}-${job.fromMonth}-01`).startOf(
          "month"
        );

        // Check if there's a gap between current job and previous job
        if (lastToDate.diff(jobTo, "month") > 1) {
          gaps.push({
            from: jobTo.add(1, "month"),
            to: lastToDate.subtract(1, "month"),
          });
        }
        lastToDate = jobFrom;
      });

      // Check for overlaps in jobs
      const overlaps: Array<{ from: dayjs.Dayjs; to: dayjs.Dayjs }> = [];
      for (let i = 0; i < sortedJobs.length - 1; i++) {
        const current = sortedJobs[i];
        const next = sortedJobs[i + 1];

        const currentFrom = dayjs(
          `${current.fromYear}-${current.fromMonth}-01`
        ).startOf("month");
        const currentTo = dayjs(
          `${current.toYear}-${current.toMonth}-01`
        ).endOf("month");
        const nextFrom = dayjs(`${next.fromYear}-${next.fromMonth}-01`).startOf(
          "month"
        );
        const nextTo = dayjs(`${next.toYear}-${next.toMonth}-01`).endOf(
          "month"
        );

        // Check if there's an overlap
        if (currentFrom.isBefore(nextTo) && currentTo.isAfter(nextFrom)) {
          overlaps.push({
            from: currentFrom.isAfter(nextFrom) ? currentFrom : nextFrom,
            to: currentTo.isBefore(nextTo) ? currentTo : nextTo,
          });
        }
      }

      const totalMonths = calculateJobDuration(validJobs);

      return {
        gapDetected: gaps.length > 0 || overlaps.length > 0 || totalMonths < 36,
        periods: [
          ...gaps.map((gap) => ({
            from: gap.from.format("MM/YYYY"),
            to: gap.to.format("MM/YYYY"),
            type: "gap" as const,
          })),
          ...overlaps.map((overlap) => ({
            from: overlap.from.format("MM/YYYY"),
            to: overlap.to.format("MM/YYYY"),
            type: "overlap" as const,
          })),
        ],
        totalMonths,
      };
    },
    []
  );

  const calculateJobDuration = useCallback((jobs: Job[]): number => {
    let totalMonths = 0;
    jobs.forEach((job) => {
      const from = dayjs(`${job.fromYear}-${job.fromMonth}-01`);
      const to = dayjs(`${job.toYear}-${job.toMonth}-01`).endOf("month");
      totalMonths += to.diff(from, "month") + 1;
    });
    return totalMonths;
  }, []);

  return {
    checkResidencyRequirements,
    checkForResidencyGaps,
    checkForEmploymentGaps,
    calculateJobDuration,
  };
};
