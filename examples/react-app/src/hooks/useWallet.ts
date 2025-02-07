import {
  useAccounts,
  useBalance,
  useConnectUI,
  useFuel,
  useWallet as useFuelWallet,
  useIsConnected,
} from '@fuels/react';
import { useEffect, useState } from 'react';

interface ICurrentConnector {
  logo: string;
  title: string;
}

const DEFAULT_CONNECTOR: ICurrentConnector = {
  logo: '',
  title: 'Wallet Demo',
};

export const useWallet = () => {
  const { fuel } = useFuel();
  const {
    connect,
    isConnecting,
    isLoading: isLoadingConnectors,
  } = useConnectUI();
  const { isConnected, refetch: refetchConnected } = useIsConnected();
  const {
    accounts,
    isLoading: isLoadingAccounts,
    isFetching: isFetchingAccounts,
  } = useAccounts();

  const address = accounts[0];
  const { wallet, refetch: refetchWallet } = useFuelWallet(address);

  const {
    balance,
    isLoading: isLoadingBalance,
    isFetching: isFetchingBalance,
  } = useBalance({ address });

  const [currentConnector, setCurrentConnector] =
    useState<ICurrentConnector>(DEFAULT_CONNECTOR);

  useEffect(() => {
    refetchConnected();
  }, [refetchConnected]);

  useEffect(() => {
    if (!isConnected) {
      setCurrentConnector(DEFAULT_CONNECTOR);
      return;
    }

    const currentConnector = fuel.currentConnector();

    const title = currentConnector?.name ?? DEFAULT_CONNECTOR.title;

    const logo =
      currentConnector && typeof currentConnector.metadata?.image === 'object'
        ? currentConnector.metadata.image.dark ?? ''
        : (currentConnector?.metadata?.image as string) ?? '';

    setCurrentConnector({ logo, title });
  }, [fuel.currentConnector, isConnected]);

  const isLoading = [isLoadingAccounts, isLoadingBalance].some(Boolean);

  const isFetching = [isFetchingAccounts, isFetchingBalance].some(Boolean);

  return {
    address,
    accounts,
    balance,
    currentConnector,
    isConnected,
    isConnecting,
    isLoading,
    isFetching,
    isLoadingConnectors,
    wallet,
    connect,
    refetchConnected,
    refetchWallet,
  };
};
