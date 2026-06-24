import React from 'react';

export interface AvatarProps {
  name?: string;
  src?: string | null;
  size?: number;
  tone?: 'brand' | 'accent' | 'petrol' | 'neutral';
  icon?: React.ReactNode;
  style?: React.CSSProperties;
}

/** Avatar rond — initiales sur dégradé doux, ou image. */
export function Avatar(props: AvatarProps): JSX.Element;
