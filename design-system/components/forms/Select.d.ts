import React from 'react';

export type SelectOption = string | { value: string; label: string };

export interface SelectProps {
  label?: string;
  hint?: string;
  error?: string;
  value?: string;
  defaultValue?: string;
  onChange?: (e: React.ChangeEvent<HTMLSelectElement>) => void;
  options?: SelectOption[];
  placeholder?: string;
  disabled?: boolean;
  id?: string;
  style?: React.CSSProperties;
}

/** Liste déroulante native stylée, même langage que Input. */
export function Select(props: SelectProps): JSX.Element;
