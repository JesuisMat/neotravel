/**
 * Table de distances routières (km, aller simple) entre villes françaises courantes.
 * Source : estimations routières réelles (autoroute principale).
 * Utilisée par l'agent pour éviter d'halluciner les distances.
 *
 * Clé : "ville_a|ville_b" normalisée en minuscules sans accents.
 * La table est symétrique — lookup dans les deux sens.
 */

const TABLE: Record<string, number> = {
  // Bordeaux
  "bordeaux|toulouse": 250,
  "bordeaux|paris": 580,
  "bordeaux|lyon": 560,
  "bordeaux|marseille": 650,
  "bordeaux|nantes": 340,
  "bordeaux|biarritz": 190,
  "bordeaux|pau": 200,
  "bordeaux|la rochelle": 190,
  "bordeaux|perigueux": 130,
  "bordeaux|agen": 140,
  // Toulouse
  "toulouse|paris": 690,
  "toulouse|lyon": 540,
  "toulouse|marseille": 410,
  "toulouse|montpellier": 240,
  "toulouse|nantes": 590,
  "toulouse|nice": 560,
  "toulouse|perpignan": 210,
  "toulouse|pau": 200,
  "toulouse|carcassonne": 95,
  // Paris
  "paris|lyon": 470,
  "paris|marseille": 780,
  "paris|nice": 940,
  "paris|nantes": 390,
  "paris|strasbourg": 490,
  "paris|lille": 220,
  "paris|rennes": 350,
  "paris|montpellier": 750,
  "paris|clermont-ferrand": 420,
  "paris|dijon": 310,
  "paris|metz": 360,
  // Lyon
  "lyon|marseille": 320,
  "lyon|nice": 470,
  "lyon|montpellier": 300,
  "lyon|grenoble": 110,
  "lyon|strasbourg": 490,
  "lyon|clermont-ferrand": 170,
  "lyon|geneve": 150,
  // Marseille
  "marseille|nice": 200,
  "marseille|montpellier": 170,
  "marseille|toulon": 65,
  "marseille|avignon": 100,
  "marseille|aix-en-provence": 35,
  // Autres
  "lille|strasbourg": 530,
  "lille|rennes": 510,
  "nantes|rennes": 110,
  "nantes|bordeaux": 340,
  "nice|monaco": 20,
  "nice|cannes": 35,
};

function normaliser(ville: string): string {
  return ville
    .toLowerCase()
    .normalize("NFD")
    .replace(/[\u0300-\u036f]/g, "") // supprime les accents
    .trim();
}

function cle(a: string, b: string): string {
  const na = normaliser(a);
  const nb = normaliser(b);
  // Ordre alphabétique pour cohérence bidirectionnelle
  return [na, nb].sort().join("|");
}

/**
 * Retourne la distance en km entre deux villes si connue, sinon null.
 */
export function getDistanceVilles(
  origine: string,
  destination: string
): number | null {
  const k = cle(origine, destination);
  return TABLE[k] ?? null;
}

/**
 * Estime la distance en km à partir de la taille des villes.
 * Utilisé comme fallback quand la paire n'est pas dans la table.
 * L'agent doit signaler que c'est une estimation.
 */
export function estimerDistance(
  origine: string,
  destination: string
): { km: number; estime: boolean } {
  const connue = getDistanceVilles(origine, destination);
  if (connue !== null) return { km: connue, estime: false };
  // Fallback neutre : 200 km (valeur médiane pour un trajet France métro)
  return { km: 200, estime: true };
}
