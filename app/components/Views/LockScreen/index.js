/* eslint-disable import/no-commonjs */
import React, { useCallback } from 'react';
import { View, Text, StyleSheet, TouchableOpacity } from 'react-native';
import { connect } from 'react-redux';
import Routes from '../../../constants/navigation/Routes';
import NavigationService from '../../../core/NavigationService';

const styles = StyleSheet.create({
  root: {
    flex: 1,
    backgroundColor: '#FFFDF0',
    alignItems: 'center',
    justifyContent: 'center',
    paddingHorizontal: 24,
  },
  title: {
    fontSize: 28,
    fontWeight: '700',
    marginBottom: 8,
    color: '#000',
  },
  subtitle: {
    fontSize: 16,
    textAlign: 'center',
    color: '#666',
    marginBottom: 24,
  },
  button: {
    backgroundColor: '#5B7CFF',
    paddingHorizontal: 24,
    paddingVertical: 14,
    borderRadius: 28,
  },
  buttonText: {
    color: '#fff',
    fontWeight: '700',
    fontSize: 18,
  },
  footnote: {
    position: 'absolute',
    bottom: 24,
    fontSize: 12,
    color: '#888',
  },
});

const TAG = 'LOCK';

const LockScreen = (props) => {
  // prefer props.navigation if present; fallback to NavigationService
  const navigate = useCallback(
    (routeName, params) => {
      try {
        if (props?.navigation?.navigate) {
          props.navigation.navigate(routeName, params);
        } else if (NavigationService?.navigation?.navigate) {
          NavigationService.navigation.navigate(routeName, params);
        } else {
          console.log(TAG, 'navigate: navigation not available');
        }
      } catch (e) {
        console.log(TAG, 'navigate error', e?.message || e);
      }
    },
    [props?.navigation],
  );

  const onUsePassword = useCallback(() => {
    console.log(TAG, 'Use password tapped');
    // extremely defensive: do NOT call any possibly-undefined helpers here.
    // We just go straight to the password login route.
    // If your app uses a different route name, update it here.
    navigate(Routes.ONBOARDING.LOGIN, { locked: true });
  }, [navigate]);

  return (
    <View style={styles.root}>
      <Text style={styles.title}>Wallet Locked</Text>
      <Text style={styles.subtitle}>
        Password is required to unlock this wallet.
      </Text>

      <TouchableOpacity style={styles.button} onPress={onUsePassword}>
        <Text style={styles.buttonText}>Use password</Text>
      </TouchableOpacity>

      <Text style={styles.footnote}>
        Biometric/Passcode types depend on your device settings.
      </Text>
    </View>
  );
};

// Keep the connected wrapper to match the existing navigator structure.
// We don't rely on any state here, but connecting preserves the same component signature.
const mapStateToProps = () => ({});
export default connect(mapStateToProps)(LockScreen);
