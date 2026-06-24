import React from 'react';

export interface BadgeProps {
  children?: React.ReactNode;
  tone?: 'neutral' | 'brand' | 'accent' | 'positive' | 'caution' | 'negative';
  variant?: 'soft' | 'solid';
  style?: React.CSSProperties;
}

/** Étiquette compacte (info, comptage). Pour les statuts de leads, voir StatusBadge. */
export function Badge(props: BadgeProps): JSX.Element;
