import React from 'react';

export interface InputProps {
  label?: string;
  hint?: string;
  error?: string;
  iconLeft?: React.ReactNode;
  type?: string;
  value?: string;
  defaultValue?: string;
  placeholder?: string;
  disabled?: boolean;
  onChange?: (e: React.ChangeEvent<HTMLInputElement>) => void;
  id?: string;
  style?: React.CSSProperties;
}

/** Champ de saisie limpide, focus anneau horizon. */
export function Input(props: InputProps): JSX.Element;
