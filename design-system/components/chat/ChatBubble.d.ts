import React from 'react';

export interface ChatBubbleProps {
  /** agent = IA NeoTravel (gauche) ; user = prospect (droite, dégradé d'aube) */
  from?: 'agent' | 'user';
  children?: React.ReactNode;
  /** surtitre au-dessus de la bulle */
  name?: string;
  /** affiche l'indicateur de saisie animé à la place du contenu */
  typing?: boolean;
  style?: React.CSSProperties;
}

/**
 * Bulle de conversation de la landing conversationnelle.
 * @startingPoint section="Chat" subtitle="Bulles agent / prospect + indicateur de saisie" viewport="700x220"
 */
export function ChatBubble(props: ChatBubbleProps): JSX.Element;
