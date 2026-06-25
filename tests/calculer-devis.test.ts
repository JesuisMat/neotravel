import { calculer_devis } from "@/lib/devis/calculer-devis";
import {
  determinerCoefficientCapacite,
  determinerSaison,
  determinerUrgence,
} from "@/lib/devis/regles";
import { MAX_PASSAGERS } from "@/lib/devis/matrices";

const NOW = new Date("2026-06-24T10:00:00Z");
const ISO = (s: string) => new Date(s);

describe("determinerUrgence", () => {
  it("retourne DD_PRIORITAIRE si < 48h", () => {
    expect(determinerUrgence(NOW, ISO("2026-06-25T10:00:00Z"))).toBe(
      "DD_PRIORITAIRE"
    );
  });
  it("retourne DD_URGENT entre 2 et 7 jours", () => {
    expect(determinerUrgence(NOW, ISO("2026-06-28T10:00:00Z"))).toBe(
      "DD_URGENT"
    );
  });
  it("retourne DD_NORMAL entre 7 jours et 3 mois", () => {
    expect(determinerUrgence(NOW, ISO("2026-07-24T10:00:00Z"))).toBe(
      "DD_NORMAL"
    );
  });
  it("retourne DD_3MOISETPLUS au-delà de 3 mois", () => {
    expect(determinerUrgence(NOW, ISO("2026-12-24T10:00:00Z"))).toBe(
      "DD_3MOISETPLUS"
    );
  });
  it("lève une erreur si date départ dans le passé", () => {
    expect(() => determinerUrgence(NOW, ISO("2026-06-20T10:00:00Z"))).toThrow();
  });
});

describe("determinerSaison", () => {
  it("détecte la saison très haute (juin)", () => {
    expect(determinerSaison(ISO("2026-06-15"))).toBe("tres_haute");
  });
  it("détecte la saison basse (novembre)", () => {
    expect(determinerSaison(ISO("2026-11-15"))).toBe("basse");
  });
  it("détecte la saison moyenne (décembre)", () => {
    expect(determinerSaison(ISO("2026-12-15"))).toBe("moyenne");
  });
  it("détecte la saison haute (avril)", () => {
    expect(determinerSaison(ISO("2026-04-15"))).toBe("haute");
  });
});

describe("determinerCoefficientCapacite", () => {
  it("≤ 19 → -5%", () => {
    expect(determinerCoefficientCapacite(15)).toBe(-0.05);
  });
  it("20-53 → 0%", () => {
    expect(determinerCoefficientCapacite(48)).toBe(0);
  });
  it("54-63 → +15%", () => {
    expect(determinerCoefficientCapacite(58)).toBe(0.15);
  });
  it("64-67 → +20%", () => {
    expect(determinerCoefficientCapacite(66)).toBe(0.2);
  });
  it("68-85 → +40%", () => {
    expect(determinerCoefficientCapacite(70)).toBe(0.4);
  });
  it("0 passager → erreur", () => {
    expect(() => determinerCoefficientCapacite(0)).toThrow();
  });
  it("> 85 → erreur HITL", () => {
    expect(() => determinerCoefficientCapacite(90)).toThrow(/HITL/);
  });
});

describe("calculer_devis — cas nominal", () => {
  const resultat = calculer_devis({
    nb_passagers: 48,
    date_depart: "2026-07-14",
    date_demande: "2026-06-24",
    distance_km: 580,
    type_vehicule: "autocar_53",
    options: ["guide", "peages"],
  });

  it("calcule un prix TTC positif et cohérent", () => {
    expect(resultat.prix_ttc).toBeGreaterThan(0);
    expect(resultat.prix_ttc).toBeGreaterThan(resultat.prix_ht);
  });

  it("applique la TVA à 10%", () => {
    expect(resultat.tva.montant).toBeCloseTo(resultat.prix_ht * 0.1, 1);
  });

  it("applique la marge commerciale 15%", () => {
    expect(resultat.marge.montant).toBeCloseTo(
      resultat.sous_total_ht * 0.15,
      1
    );
  });

  it("applique le coefficient de capacité 0% pour 48 pax", () => {
    const coefCap = resultat.coefficients.find((c) => c.type === "capacite");
    expect(coefCap?.valeur).toBe(0);
  });

  it("retourne la devise EUR", () => {
    expect(resultat.devise).toBe("EUR");
  });

  it("produit des lignes de calcul détaillées", () => {
    expect(resultat.lignes.length).toBeGreaterThanOrEqual(3);
    expect(
      resultat.lignes.some((l) => l.libelle.includes("km"))
    ).toBe(true);
  });
});

describe("calculer_devis — urgence & saison", () => {
  it("applique DD_PRIORITAIRE (+10%) pour départ < 48h", () => {
    const r = calculer_devis({
      nb_passagers: 30,
      date_depart: "2026-06-25T18:00:00Z",
      date_demande: "2026-06-24T10:00:00Z",
      distance_km: 200,
      type_vehicule: "autocar_53",
    });
    expect(r.urgence_code).toBe("DD_PRIORITAIRE");
    expect(r.coefficients.find((c) => c.type === "urgence")?.valeur).toBe(0.1);
  });

  it("applique DD_3MOISETPLUS (-10%) pour départ très anticipé", () => {
    const r = calculer_devis({
      nb_passagers: 30,
      date_depart: "2026-12-24",
      date_demande: "2026-06-24",
      distance_km: 200,
      type_vehicule: "autocar_53",
    });
    expect(r.urgence_code).toBe("DD_3MOISETPLUS");
  });

  it("applique la saison très haute (+15%) pour un départ en juin", () => {
    const r = calculer_devis({
      nb_passagers: 30,
      date_depart: "2026-06-15",
      date_demande: "2026-06-01",
      distance_km: 200,
      type_vehicule: "autocar_53",
    });
    expect(r.saison_niveau).toBe("tres_haute");
  });
});

describe("calculer_devis — capacité & options", () => {
  it("applique -5% pour un petit groupe (≤ 19)", () => {
    const r = calculer_devis({
      nb_passagers: 12,
      date_depart: "2026-07-14",
      date_demande: "2026-06-24",
      distance_km: 200,
      type_vehicule: "minibus_19",
    });
    expect(r.coefficients.find((c) => c.type === "capacite")?.valeur).toBe(
      -0.05
    );
  });

  it("applique +40% pour 68-85 passagers", () => {
    const r = calculer_devis({
      nb_passagers: 75,
      date_depart: "2026-07-14",
      date_demande: "2026-06-24",
      distance_km: 200,
      type_vehicule: "autocar_85",
    });
    expect(r.coefficients.find((c) => c.type === "capacite")?.valeur).toBe(0.4);
  });

  it("ajoute les options demandées au devis", () => {
    const r = calculer_devis({
      nb_passagers: 48,
      date_depart: "2026-07-14",
      date_demande: "2026-06-24",
      distance_km: 580,
      type_vehicule: "autocar_53",
      options: ["guide", "nuit_chauffeur", "peages"],
    });
    const libelles = r.options.map((o) => o.libelle);
    expect(libelles.some((l) => l.includes("Guide"))).toBe(true);
    expect(libelles.some((l) => l.includes("Nuit chauffeur"))).toBe(true);
    expect(libelles.some((l) => l.includes("Péages"))).toBe(true);
  });

  it("facture le guide sur la durée de prestation (date_retour - date_depart)", () => {
    // Voyage du 14 au 16 juillet = 2 jours de prestation.
    // Sans date_retour : minimum 1 jour.
    const rAvecRetour = calculer_devis({
      nb_passagers: 48,
      date_depart: "2026-07-14",
      date_retour: "2026-07-16",
      date_demande: "2026-06-24",
      distance_km: 580,
      type_vehicule: "autocar_53",
      options: ["guide"],
    });
    const guide2j = rAvecRetour.options.find((o) =>
      o.libelle.includes("Guide")
    );
    expect(guide2j?.nb_unites).toBe(2);
    expect(guide2j?.montant).toBe(160); // 80 € × 2 jours

    const rSansRetour = calculer_devis({
      nb_passagers: 48,
      date_depart: "2026-07-14",
      date_demande: "2026-06-24",
      distance_km: 580,
      type_vehicule: "autocar_53",
      options: ["guide"],
    });
    const guide1j = rSansRetour.options.find((o) =>
      o.libelle.includes("Guide")
    );
    expect(guide1j?.nb_unites).toBe(1);
    expect(guide1j?.montant).toBe(80); // 80 € × 1 jour minimum
  });

  it("les péages restent un forfait quelle que soit la durée", () => {
    const r = calculer_devis({
      nb_passagers: 48,
      date_depart: "2026-07-14",
      date_retour: "2026-07-20",
      date_demande: "2026-06-24",
      distance_km: 580,
      type_vehicule: "autocar_53",
      options: ["peages"],
    });
    const peages = r.options.find((o) => o.libelle.includes("Péages"));
    expect(peages?.nb_unites).toBe(1);
    expect(peages?.montant).toBe(90); // forfait fixe
  });
});

describe("calculer_devis — cas limites (erreurs)", () => {
  it("rejette 0 passager", () => {
    expect(() =>
      calculer_devis({
        nb_passagers: 0,
        date_depart: "2026-07-14",
        date_demande: "2026-06-24",
        distance_km: 200,
        type_vehicule: "autocar_53",
      })
    ).toThrow();
  });

  it(`rejette > ${MAX_PASSAGERS} passagers (HITL)`, () => {
    expect(() =>
      calculer_devis({
        nb_passagers: 90,
        date_depart: "2026-07-14",
        date_demande: "2026-06-24",
        distance_km: 200,
        type_vehicule: "autocar_85",
      })
    ).toThrow(/HITL/);
  });

  it("rejette une distance négative", () => {
    expect(() =>
      calculer_devis({
        nb_passagers: 48,
        date_depart: "2026-07-14",
        date_demande: "2026-06-24",
        distance_km: -100,
        type_vehicule: "autocar_53",
      })
    ).toThrow();
  });

  it("rejette une date de départ dans le passé", () => {
    expect(() =>
      calculer_devis({
        nb_passagers: 48,
        date_depart: "2026-06-20",
        date_demande: "2026-06-24",
        distance_km: 200,
        type_vehicule: "autocar_53",
      })
    ).toThrow(/antérieure/);
  });

  it("applique le prix minimum sur un court trajet", () => {
    const r = calculer_devis({
      nb_passagers: 48,
      date_depart: "2026-07-14",
      date_demande: "2026-06-24",
      distance_km: 5,
      type_vehicule: "autocar_53",
    });
    // 5 km × 2.5 = 12.5 < prix minimum 250 → base = 250
    expect(r.base_km.montant).toBeGreaterThanOrEqual(250);
  });

  it("rejette un type de véhicule inconnu", () => {
    expect(() =>
      calculer_devis({
        nb_passagers: 48,
        date_depart: "2026-07-14",
        date_demande: "2026-06-24",
        distance_km: 200,
        type_vehicule: "velo" as never,
      })
    ).toThrow();
  });
});

describe("calculer_devis — déterminisme", () => {
  const params = {
    nb_passagers: 48,
    date_depart: "2026-07-14",
    date_demande: "2026-06-24",
    distance_km: 580,
    type_vehicule: "autocar_53" as const,
    options: ["guide", "peages"] as const,
  };

  it("deux appels identiques produisent un prix TTC identique", () => {
    const a = calculer_devis(params);
    const b = calculer_devis(params);
    expect(a.prix_ttc).toBe(b.prix_ttc);
    expect(a.lignes).toEqual(b.lignes);
  });
});
