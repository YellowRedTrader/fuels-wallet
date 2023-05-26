import { cssObj } from '@fuel-ui/css';
import { Button } from '@fuel-ui/react';
import type { Network } from '@fuel-wallet/types';
import { forwardRef } from 'react';

import { NetworkStatus } from '../NetworkItem';

export type NetworkDropdownProps = {
  selected?: Network;
  isDisabled?: boolean;
  onPress?: (network: Network) => void;
};

export const NetworkDropdown = forwardRef<HTMLDivElement, NetworkDropdownProps>(
  ({ selected, isDisabled, onPress }, ref) => {
    return (
      <Button
        // eslint-disable-next-line @typescript-eslint/no-explicit-any
        ref={ref as any}
        size="xs"
        css={styles.trigger}
        onPress={() => onPress?.(selected!)}
        aria-label="Selected Network"
        isDisabled={isDisabled}
        rightIcon="ChevronDown"
      >
        {selected && <NetworkStatus network={selected} />}
        {selected?.name}
      </Button>
    );
  }
);

const styles = {
  trigger: cssObj({
    cursor: 'pointer',
    fontSize: '$sm',
    px: '$3',
    pr: '$2',
    border: '1px solid $border',
    color: '$intentsBase10',
    borderRadius: '$default',
    background: 'transparent',

    '&:not([aria-disabled="true"])': {
      '&:hover': {
        bg: '$inverseA3',
        boxShadow: 'none',
        border: '1px solid $border',
        color: '$intentsBase11',
      },

      '&:hover .fuel_Icon,& .fuel_Icon': {
        color: 'currentColor',
      },
    },

    '&:focus': {
      outlineColor: '$intentsBase2 !important',
    },

    '&[aria-disabled="true"]': {
      opacity: 1,
      cursor: 'default',
    },
  }),
};
