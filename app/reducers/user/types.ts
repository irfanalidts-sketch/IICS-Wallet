//home/irfan/WalletOTP/app/reducers/user/types.ts
import { AppThemeKey } from '../../util/theme/models';

// Registration status for wallet user
export type RegistrationStatus =
  | 'UNREGISTERED'
  | 'REGISTERED_UNVERIFIED'
  | 'REGISTERED_VERIFIED';

/**
 * User state
 */
export interface UserState {
  loadingMsg: string;
  loadingSet: boolean;
  passwordSet: boolean;
  seedphraseBackedUp: boolean;
  backUpSeedphraseVisible: boolean;
  protectWalletModalVisible: boolean;
  gasEducationCarouselSeen: boolean;
  userLoggedIn: boolean;
  isAuthChecked: boolean;
  initialScreen: string;
  appTheme: AppThemeKey;
  ambiguousAddressEntries: Record<string, unknown>;
  appServicesReady: boolean;

  // Registration flow
  registrationStatus: RegistrationStatus;
}
