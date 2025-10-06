// app/components/UI/ActionView/index.js

import React, { useCallback, useMemo, useRef, useState } from 'react';
import StyledButton from '../StyledButton';
import PropTypes from 'prop-types';
import {
  Keyboard,
  StyleSheet,
  View,
  ActivityIndicator,
  TouchableWithoutFeedback,
  TouchableOpacity,
  useColorScheme,
} from 'react-native';
import { baseStyles } from '../../../styles/common';
import { strings } from '../../../../locales/i18n';
import { KeyboardAwareScrollView } from 'react-native-keyboard-aware-scroll-view';
import { useTheme } from '../../../util/theme';

// MetaMask design-system icon
import Icon, {
  IconName,
  IconSize,
} from '../../../component-library/components/Icons/Icon';

export const ConfirmButtonState = {
  Error: 'error',
  Warning: 'warning',
  Normal: 'normal',
};

const getStyles = (colors) =>
  StyleSheet.create({
    root: {
      flex: 1,
    },
    actionContainer: {
      flex: 0,
      flexDirection: 'row',
      paddingVertical: 16,
      paddingHorizontal: 24,
    },
    button: {
      flex: 1,
    },
    cancel: {
      marginRight: 8,
    },
    confirm: {
      marginLeft: 8,
    },
    confirmButtonError: {
      backgroundColor: colors.error.default,
      borderColor: colors.error.default,
    },
    confirmButtonWarning: {
      backgroundColor: colors.warning.default,
      borderColor: colors.warning.default,
    },

    // Floating chevron FAB (dark puck; icon color is handled below)
    fab: {
      position: 'absolute',
      right: 16,
      bottom: 24,
      width: 44,
      height: 44,
      borderRadius: 22,
      alignItems: 'center',
      justifyContent: 'center',
      backgroundColor: 'rgba(0,0,0,0.8)',
      elevation: 6,
      shadowColor: '#000',
      shadowOpacity: 0.3,
      shadowRadius: 8,
      shadowOffset: { width: 0, height: 2 },
    },
  });

/**
 * Scrollable container with action buttons.
 * Adds a scroll-to-bottom FAB (chevron) that appears when content overflows.
 */
export default function ActionView({
  cancelTestID,
  confirmTestID,
  cancelText,
  children,
  confirmText,
  confirmButtonMode,
  onCancelPress,
  onConfirmPress,
  onTouchablePress,
  showCancelButton,
  showConfirmButton,
  confirmed,
  confirmDisabled,
  loading = false,
  keyboardShouldPersistTaps = 'never',
  style = undefined,
  confirmButtonState = ConfirmButtonState.Normal,
  scrollViewTestID,
  contentContainerStyle,
}) {
  const { colors } = useTheme();
  const appearance = useColorScheme(); // 'light' | 'dark' | null
  const isDark = appearance === 'dark';

  const styles = useMemo(() => getStyles(colors), [colors]);

  // Button labels
  confirmText = confirmText || strings('action_view.confirm');
  cancelText = cancelText || strings('action_view.cancel');

  // --- FAB visibility state ---
  const scrollRef = useRef(null);
  const [atBottom, setAtBottom] = useState(false);
  const [canScroll, setCanScroll] = useState(false);

  const handleScroll = useCallback((e) => {
    const { layoutMeasurement, contentOffset, contentSize } = e.nativeEvent;
    const paddingToBottom = 24;
    const isBottom =
      layoutMeasurement.height + contentOffset.y >=
      contentSize.height - paddingToBottom;
    setAtBottom(isBottom);
    setCanScroll(contentSize.height > layoutMeasurement.height + 1);
  }, []);

  const scrollToBottom = useCallback(() => {
    scrollRef.current?.scrollToEnd({ animated: true });
  }, []);

  // Choose icon color robustly:
  // 1) Prefer themed token if present
  // 2) Otherwise force white in dark / black in light (absolute fallback)
  const chevronColor =
    colors?.icon?.default ??
    (isDark ? '#FFFFFF' : '#111827');

  const showScrollFab = canScroll && !atBottom && !loading;

  return (
    <View style={styles.root}>
      <KeyboardAwareScrollView
        ref={scrollRef}
        style={[baseStyles.flexGrow, style]}
        resetScrollToCoords={{ x: 0, y: 0 }}
        keyboardShouldPersistTaps={keyboardShouldPersistTaps}
        testID={scrollViewTestID}
        contentContainerStyle={contentContainerStyle}
        onScroll={handleScroll}
        scrollEventThrottle={16}
      >
        <TouchableWithoutFeedback
          style={baseStyles.flexGrow}
          // eslint-disable-next-line react/jsx-no-bind
          onPress={() => {
            if (keyboardShouldPersistTaps === 'handled') {
              Keyboard.dismiss();
            }
            onTouchablePress && onTouchablePress();
          }}
        >
          {children}
        </TouchableWithoutFeedback>

        <View style={styles.actionContainer}>
          {showCancelButton && (
            <StyledButton
              testID={cancelTestID}
              type={confirmButtonMode === 'sign' ? 'signingCancel' : 'cancel'}
              onPress={onCancelPress}
              containerStyle={[styles.button, styles.cancel]}
              disabled={confirmed}
            >
              {cancelText}
            </StyledButton>
          )}
          {showConfirmButton && (
            <StyledButton
              testID={confirmTestID}
              type={confirmButtonMode}
              onPress={onConfirmPress}
              containerStyle={[
                styles.button,
                styles.confirm,
                confirmButtonState === ConfirmButtonState.Error
                  ? styles.confirmButtonError
                  : {},
                confirmButtonState === ConfirmButtonState.Warning
                  ? styles.confirmButtonWarning
                  : {},
              ]}
              disabled={confirmed || confirmDisabled || loading}
            >
              {confirmed || loading ? (
                <ActivityIndicator size="small" color={colors.primary.default} />
              ) : (
                confirmText
              )}
            </StyledButton>
          )}
        </View>
      </KeyboardAwareScrollView>

      {/* Scroll-to-bottom FAB */}
      {showScrollFab ? (
        <TouchableOpacity
          accessibilityRole="button"
          onPress={scrollToBottom}
          style={styles.fab}
          testID="actionview-scroll-fab"
        >
          <Icon
            name={IconName.ChevronDown}
            size={IconSize.Md}
            color={chevronColor}   // <- white in dark, black in light
          />
        </TouchableOpacity>
      ) : null}
    </View>
  );
}

ActionView.defaultProps = {
  cancelText: '',
  confirmButtonMode: 'normal',
  confirmText: '',
  confirmTestID: '',
  confirmed: false,
  cancelTestID: '',
  showCancelButton: true,
  showConfirmButton: true,
  contentContainerStyle: undefined,
};

ActionView.propTypes = {
  cancelTestID: PropTypes.string,
  confirmTestID: PropTypes.string,
  cancelText: PropTypes.string,
  children: PropTypes.node,
  confirmButtonMode: PropTypes.oneOf(['normal', 'confirm', 'sign']),
  confirmText: PropTypes.string,
  confirmed: PropTypes.bool,
  confirmDisabled: PropTypes.bool,
  onCancelPress: PropTypes.func,
  onConfirmPress: PropTypes.func,
  onTouchablePress: PropTypes.func,
  showCancelButton: PropTypes.bool,
  showConfirmButton: PropTypes.bool,
  loading: PropTypes.bool,
  keyboardShouldPersistTaps: PropTypes.string,
  style: PropTypes.object,
  confirmButtonState: PropTypes.string,
  scrollViewTestID: PropTypes.string,
  contentContainerStyle: PropTypes.object,
};
