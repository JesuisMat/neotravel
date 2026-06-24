import React from 'react';

export interface SuggestionChipProps {
  children?: React.ReactNode;
  onClick?: () => void;
  iconLeft?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Proposition cliquable sous le chat — survol chaud (aube). */
export function SuggestionChip(props: SuggestionChipProps): JSX.Element;
