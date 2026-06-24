import React from 'react';

export type LeadStatus =
  | 'nouveau' | 'incomplet' | 'qualifie' | 'devis_envoye'
  | 'relance_1' | 'relance_2' | 'accepte_prospect' | 'confirme'
  | 'refuse' | 'complexe' | 'cloture';

export interface StatusBadgeProps {
  /** Clé du statut commercial — fixe couleur + libellé automatiquement */
  status?: LeadStatus;
  /** Libellé libre (sinon dérivé de status) */
  label?: string;
  tone?: 'info' | 'brand' | 'accent' | 'positive' | 'caution' | 'negative' | 'neutral';
  dot?: boolean;
  style?: React.CSSProperties;
}

/**
 * Pilule de statut de lead, avec pastille colorée. Couvre toute
 * la machine d'état NeoTravel (nouveau → confirmé → clôturé).
 * @startingPoint section="Données" subtitle="Statuts commerciaux du pipeline lead" viewport="700x140"
 */
export function StatusBadge(props: StatusBadgeProps): JSX.Element;

export const LEAD_STATUSES: Record<LeadStatus, { label: string; tone: string }>;
