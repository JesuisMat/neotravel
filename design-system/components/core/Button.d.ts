import React from 'react';

export interface ButtonProps {
  children?: React.ReactNode;
  /** primary = action principale ; accent = CTA chaleureux (dégradé d'aube) ; dark = sur fond clair premium */
  variant?: 'primary' | 'accent' | 'secondary' | 'ghost' | 'dark';
  size?: 'sm' | 'md' | 'lg';
  iconLeft?: React.ReactNode;
  iconRight?: React.ReactNode;
  fullWidth?: boolean;
  disabled?: boolean;
  type?: 'button' | 'submit' | 'reset';
  onClick?: (e: React.MouseEvent<HTMLButtonElement>) => void;
  style?: React.CSSProperties;
}

/**
 * Bouton NeoTravel — formes pilule, transition glissée, état pressé doux.
 * @startingPoint section="Composants" subtitle="Boutons : primaire, accent, secondaire, ghost" viewport="700x180"
 */
export function Button(props: ButtonProps): JSX.Element;
