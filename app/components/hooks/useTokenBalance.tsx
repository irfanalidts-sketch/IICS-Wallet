import { useState, useEffect, Dispatch, SetStateAction } from 'react';
import Engine from '../../core/Engine';
import { subscribeBalanceRefresh } from '../../core/BalanceRefresh';
import type BN4 from 'bnjs4';

const useTokenBalance = (
  requestedTokenAddress: string,
  userCurrentAddress: string,
): [BN4 | null, boolean, boolean] => {
  const [tokenBalance, setTokenBalance]: [
    BN4 | null,
    Dispatch<SetStateAction<BN4 | null>>,
  ] = useState<BN4 | null>(null);

  const [loading, setLoading] = useState<boolean>(true);
  const [error, setError] = useState<boolean>(false);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const { AssetsContractController }: any = Engine.context;

  const fetchBalance = async (
    tokenAddress: string,
    userAddress: string,
  ): Promise<void> => {
    try {
      setLoading(true);
      setError(false);

      const balance = await AssetsContractController.getERC20BalanceOf(
        tokenAddress,
        userAddress,
      );

      setTokenBalance(balance);
    } catch {
      setError(true);
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    let isMounted = true;

    const safeFetchBalance = async () => {
      if (!isMounted) return;
      await fetchBalance(requestedTokenAddress, userCurrentAddress);
    };

    // Initial fetch
    safeFetchBalance();

    // 🔔 Listen for refresh signal
    const unsubscribe = subscribeBalanceRefresh(() => {
      safeFetchBalance();

      // 🔁 delayed refetch to handle RPC lag
        setTimeout(() => {
          safeFetchBalance();
        }, 15_000); // 15 seconds
    });

    return () => {
      isMounted = false;
      unsubscribe();
    };
  }, [requestedTokenAddress, userCurrentAddress]);

  return [tokenBalance, loading, error];
};

export default useTokenBalance;
