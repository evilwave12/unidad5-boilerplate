import { useCallback, useEffect, useRef, useState } from 'react';

function extractPaginatedResult(result) {
  const items = Array.isArray(result)
    ? result
    : (result?.items ?? result?.data ?? []);
  const total =
    result?.total ??
    result?.totalCount ??
    result?.totalItems ??
    result?.totalRecords ??
    items.length;

  return { items, total };
}

function usePaginatedFetch(fetchFn, { pageSize = 10, initialPage = 1 } = {}) {
  const [data, setData] = useState([]);
  const [totalCount, setTotalCount] = useState(0);
  const [pageIndex, setPageIndex] = useState(initialPage);
  const [isLoading, setIsLoading] = useState(true);
  const [error, setError] = useState(null);

  const prevFetchFnRef = useRef(fetchFn);

  const executeFetch = useCallback(
    async (targetPage, isCancelled = () => false) => {
      try {
        setIsLoading(true);
        setError(null);
        const result = await fetchFn({ pageIndex: targetPage, pageSize });

        if (isCancelled()) return;

        const { items, total } = extractPaginatedResult(result);

        setData(items);
        setTotalCount(total);
      } catch (err) {
        if (isCancelled()) return;

        console.error('Error en carga paginada:', err);
        setError(err);
        setData([]);
        setTotalCount(0);
      } finally {
        if (!isCancelled()) {
          setIsLoading(false);
        }
      }
    },
    [fetchFn, pageSize]
  );

  useEffect(() => {
    if (prevFetchFnRef.current !== fetchFn) {
      prevFetchFnRef.current = fetchFn;

      if (pageIndex !== initialPage) {
        setPageIndex(initialPage);

        return;
      }
    }

    let cancelled = false;

    executeFetch(pageIndex, () => cancelled);

    return () => {
      cancelled = true;
    };
  }, [executeFetch, fetchFn, pageIndex, initialPage]);

  const refetch = useCallback(() => {
    return executeFetch(pageIndex);
  }, [executeFetch, pageIndex]);

  return {
    data,
    totalCount,
    pageIndex,
    pageSize,
    setPageIndex,
    isLoading,
    error,
    refetch,
  };
}

export default usePaginatedFetch;
