import React from 'react';

export interface CardProps {
  children?: React.ReactNode;
  /** raised = blanc chaud + ombre ; glass = verre dépoli (sur dégradé) ; dark = petrol */
  variant?: 'raised' | 'flat' | 'sunken' | 'glass' | 'dark';
  padding?: 'none' | 'sm' | 'md' | 'lg';
  /** lève la carte au survol */
  interactive?: boolean;
  style?: React.CSSProperties;
}

/**
 * Carte NeoTravel — surface posée, coins généreux, ombre diffuse.
 */
export function Card(props: CardProps): JSX.Element;
