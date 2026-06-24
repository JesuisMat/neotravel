import React from 'react';

export interface StatCardProps {
  label: string;
  value: string | number;
  unit?: string;
  /** ex. "12 %" ; affiché avec une flèche */
  delta?: string;
  deltaDir?: 'up' | 'down';
  caption?: string;
  /** met la tuile en avant avec le dégradé d'aube */
  accent?: boolean;
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Tuile KPI du dashboard direction — chiffre tabulaire en sérif. */
export function StatCard(props: StatCardProps): JSX.Element;
