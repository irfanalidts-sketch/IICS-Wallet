//below code  is from \\wsl.localhost\Ubuntu-22.04\home\irfan\New folder\JustWallet\app\core\Engine\controllers\multichain-network-controller\multichain-network-controller-init.ts
import {
  MultichainNetworkController,
  MultichainNetworkControllerMessenger,
  MultichainNetworkControllerState,
} from '@metamask/multichain-network-controller';
import { ControllerInitFunction, ControllerInitRequest } from '../../types';
import { MultichainNetworkServiceInit } from './multichain-network-service-init';

/**
 * Initialize the MultichainNetworkController.
 *
 * @param request - The request object.
 * @returns The MultichainNetworkController.
 */
export const multichainNetworkControllerInit = ({
  controllerMessenger,
  persistedState,
}: ControllerInitRequest<MultichainNetworkControllerMessenger>): ReturnType<
  ControllerInitFunction<
    MultichainNetworkController,
    MultichainNetworkControllerMessenger
  >
> => {
  const networkService = MultichainNetworkServiceInit();
  const multichainNetworkControllerState =
    persistedState.MultichainNetworkController as MultichainNetworkControllerState;

  const controller = new MultichainNetworkController({
    messenger: controllerMessenger,
    state: multichainNetworkControllerState,
    networkService,
  });

  return { controller };
};
