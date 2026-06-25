import Image from "next/image";
import { LandingHeader } from "@/components/landing/LandingHeader";
import { LandingFooter } from "@/components/landing/LandingFooter";
import { HeroChat } from "@/components/landing/HeroChat";

export default function LandingPage() {
  return (
    <>
      <LandingHeader />

      {/* ── HERO ──────────────────────────────────────────────────────── */}
      <section
        id="hero-chat"
        style={{
          position: "relative",
          overflow: "hidden",
          minHeight: "100dvh",
          display: "flex",
          flexDirection: "column",
          justifyContent: "center",
          padding: "clamp(80px,11vh,120px) clamp(20px,5vw,56px) clamp(64px,8vw,96px)",
          background: "#060F14",
        }}
      >
        {/* Orbe lever de soleil — warm radial depuis le bas-centre, amber/dawn sur fond petrol-950 */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 0,
            background:
              "radial-gradient(120% 90% at 50% 110%, rgba(246,184,132,0.85) 0%, rgba(240,160,98,0.6) 20%, rgba(58,123,146,0.25) 52%, #0E2A38 72%, #060F14 100%)",
            pointerEvents: "none",
          }}
        />
        {/* Fade bas du hero vers l'image bus (petrol foncé pour raccord naturel) */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            bottom: 0,
            left: 0,
            right: 0,
            height: 120,
            zIndex: 1,
           
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 880,
            margin: "0 auto",
            display: "flex",
            flexDirection: "column",
            alignItems: "center",
            textAlign: "center",
          }}
        >
          {/* Eyebrow pill */}
          <div
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 10,
              padding: "7px 18px 7px 7px",
              borderRadius: 99,
              background: "rgba(255,255,255,0.07)",
              border: "1px solid rgba(195,219,227,0.18)",
              marginBottom: 28,
              backdropFilter: "blur(8px)",
              WebkitBackdropFilter: "blur(8px)",
            }}
          >
            {/* Flag EU dans un carré arrondi façon référence */}
            <span
              style={{
                width: 20,
                height: 20,
                borderRadius: 8,
                overflow: "hidden",
                display: "inline-flex",
                alignItems: "center",
                justifyContent: "center",
                flexShrink: 0,
                boxShadow: "0 1px 4px rgba(0,0,0,0.35)",
              }}
            >
              <Image
                src="/images/france.png"
                alt="Union Européenne"
                width={20}
                height={20}
                style={{
                  objectFit: "cover",
                  objectPosition: "center",
                  display: "block",
                  width: "100%",
                  height: "100%",
                }}
              />
            </span>
            <span
              style={{
                fontSize: 14,
                fontWeight: 500,
                letterSpacing: "-0.01em",
                color: "rgba(220,236,240,0.88)",
                fontFamily: "var(--font-sans)",
                lineHeight: 1,
              }}
            >
              Intermédiaire de transport depuis 2010
            </span>
          </div>

          {/* H1 */}
          <h1
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(38px,5.8vw,72px)",
              fontWeight: 400,
              lineHeight: 1.05,
              letterSpacing: "-0.025em",
              color: "#fff",
              margin: "0 0 20px",
            }}
          >
            Vous voyagez en groupe.
            <br />
            <em
              style={{
                color: "var(--dawn-400)",
                fontStyle: "italic",
                fontWeight: 300,
              }}
            >
              On s&apos;occupe de tout.
            </em>
          </h1>

          {/* Subtitle */}
          <p
            style={{
              fontFamily: "var(--font-sans)",
              fontSize: "clamp(16px,1.5vw,19px)",
              lineHeight: 1.65,
              color: "rgba(195,219,227,0.78)",
              maxWidth: 520,
              margin: "0 0 36px",
              fontWeight: 400,
            }}
          >
            Décrivez votre trajet en quelques mots. Devis accepté, partenaire mobilisé, prestation sécurisée le tout en quelques minutes.
          </p>

          {/* Chat widget */}
          <div style={{ width: "100%", maxWidth: 600 }}>
            <HeroChat />
          </div>

          {/* Reassurance strip */}
          <div
            style={{
              display: "flex",
              alignItems: "center",
              gap: 16,
              flexWrap: "wrap",
              justifyContent: "center",
              marginTop: 22,
              fontSize: 13,
              color: "rgba(169,194,203,0.65)",
              fontFamily: "var(--font-sans)",
              letterSpacing: "0.01em",
            }}
          >
            <span>Réponse en moins de 5 minutes</span>
            <span
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: "var(--horizon-500)",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span>Sans engagement</span>
            <span
              style={{
                width: 3,
                height: 3,
                borderRadius: "50%",
                background: "var(--horizon-500)",
                display: "inline-block",
                flexShrink: 0,
              }}
            />
            <span>Données sécurisées</span>
          </div>
        </div>
      </section>


      {/* ── COMMENT CA MARCHE ─────────────────────────────────────────── */}
      <section
        style={{
          background: "var(--surface-page)",
          padding: "clamp(64px,8vw,104px) clamp(20px,5vw,56px)",
        }}
      >
        <div style={{ maxWidth: 1160, margin: "0 auto" }}>
          {/* Header — split : titre gauche, image carte droite */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(32px,4vw,64px)",
              alignItems: "center",
              marginBottom: 52,
            }}
          >
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(28px,3.4vw,44px)",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "var(--text-strong)",
                  margin: "0 0 16px",
                }}
              >
                La complexité,{" "}
                <em style={{ fontStyle: "italic", color: "var(--horizon-600)", fontWeight: 300 }}>
                  absorbée en coulisses
                </em>
              </h2>
              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.65,
                  color: "var(--text-muted)",
                  margin: 0,
                  fontFamily: "var(--font-sans)",
                  maxWidth: "52ch",
                }}
              >
                Nous ne possédons pas de flotte. Notre valeur : transformer votre besoin en prestation fiable, en trois temps.
              </p>
            </div>

            {/* map_road image */}
            <div
              style={{
                position: "relative",
                borderRadius: 16,
                overflow: "hidden",
                aspectRatio: "4/3",
                boxShadow: "0 8px 32px rgba(14,42,56,0.12)",
              }}
            >
              <Image
                src="/images/map_road.png"
                alt="Carte routière de France avec boussole"
                fill
                sizes="(max-width: 768px) 100vw, 50vw"
                style={{ objectFit: "cover", objectPosition: "center" }}
              />
            </div>
          </div>

          {/* Steps — asymmetric grid */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 2,
            }}
          >
            {[
              {
                num: "01",
                title: "On qualifie",
                desc: "Vous décrivez votre besoin en langage naturel. Chaque détail est clarifié — trajet, dates, passagers, options — sans formulaire.",
                accent: "var(--horizon-600)",
                bg: "var(--surface-card)",
              },
              {
                num: "02",
                title: "On mobilise",
                desc: "On identifie le bon partenaire autocariste dans notre réseau, on vérifie sa disponibilité et on négocie les meilleures conditions.",
                accent: "var(--horizon-500)",
                bg: "var(--horizon-50)",
              },
              {
                num: "03",
                title: "On sécurise",
                desc: "On verrouille la prestation de bout en bout : conditions, logistique, imprévus. Vous n'avez plus qu'à monter à bord.",
                accent: "var(--dawn-600)",
                bg: "var(--surface-card)",
              },
            ].map((s, i) => (
              <div
                key={s.num}
                style={{
                  background: s.bg,
                  border: "1px solid var(--border-soft)",
                  borderRadius: i === 0 ? "16px 2px 2px 16px" : i === 2 ? "2px 16px 16px 2px" : 2,
                  padding: "32px 28px",
                  position: "relative",
                  overflow: "hidden",
                }}
              >
                <div
                  style={{
                    fontFamily: "var(--font-mono)",
                    fontSize: 11,
                    fontWeight: 700,
                    letterSpacing: "0.12em",
                    color: s.accent,
                    marginBottom: 16,
                    textTransform: "uppercase",
                  }}
                >
                  {s.num}
                </div>
                <div
                  style={{
                    width: 36,
                    height: 3,
                    background: s.accent,
                    borderRadius: 2,
                    marginBottom: 20,
                    opacity: 0.6,
                  }}
                />
                <h3
                  style={{
                    fontFamily: "var(--font-display)",
                    fontSize: 21,
                    fontWeight: 500,
                    color: "var(--text-strong)",
                    margin: "0 0 12px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {s.title}
                </h3>
                <p
                  style={{
                    fontSize: 15,
                    lineHeight: 1.65,
                    color: "var(--text-muted)",
                    margin: 0,
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {s.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── PREUVE / CONFIANCE ────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          color: "var(--text-on-dark)",
          padding: "clamp(64px,8vw,104px) clamp(20px,5vw,56px)",
        }}
      >
        {/* Background photo — group_premium */}
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image
            src="/images/group_premium.png"
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center 30%" }}
          />
        </div>
        {/* Overlay petrol — assure lisibilité */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background: "rgba(14,42,56,0.80)",
            pointerEvents: "none",
          }}
        />
        {/* Subtle grid lines */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 2,
            backgroundImage:
              "linear-gradient(rgba(195,219,227,0.04) 1px, transparent 1px), linear-gradient(90deg, rgba(195,219,227,0.04) 1px, transparent 1px)",
            backgroundSize: "64px 64px",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 3,
            maxWidth: 1160,
            margin: "0 auto",
          }}
        >
          {/* Split layout */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "1fr 1fr",
              gap: "clamp(40px,5vw,80px)",
              alignItems: "center",
              marginBottom: 60,
            }}
          >
            {/* Left — copy */}
            <div>
              <h2
                style={{
                  fontFamily: "var(--font-display)",
                  fontSize: "clamp(28px,3.4vw,44px)",
                  fontWeight: 400,
                  lineHeight: 1.1,
                  letterSpacing: "-0.02em",
                  color: "#fff",
                  margin: "0 0 18px",
                }}
              >
                La confiance tranquille d&apos;un groupe entre{" "}
                <em style={{ color: "var(--dawn-400)", fontWeight: 300, fontStyle: "italic" }}>
                  de bonnes mains
                </em>
              </h2>
              <p
                style={{
                  fontSize: 17,
                  lineHeight: 1.65,
                  color: "rgba(195,219,227,0.72)",
                  margin: 0,
                  fontFamily: "var(--font-sans)",
                  maxWidth: "48ch",
                }}
              >
                Notre métier n&apos;est pas de vendre un trajet. C&apos;est de comprendre un besoin, sécuriser une solution et coordonner des partenaires fiables.
              </p>
            </div>

            {/* Right — metrics */}
            <div
              style={{
                display: "flex",
                flexDirection: "column",
                gap: 0,
              }}
            >
              {[
                ["16 ans", "d'expertise en intermédiation transport"],
                ["Couverture", "nationale et internationale"],
                ["Réseau", "de partenaires autocaristes vérifiés"],
              ].map(([n, l], i, arr) => (
                <div
                  key={l}
                  style={{
                    display: "grid",
                    gridTemplateColumns: "120px 1fr",
                    alignItems: "center",
                    gap: 40,
                    padding: "20px 0",
                    borderBottom:
                      i < arr.length - 1
                        ? "1px solid rgba(195,219,227,0.12)"
                        : "none",
                  }}
                >
                  <span
                    style={{
                      fontFamily: "var(--font-display)",
                      fontSize: "clamp(22px,2.4vw,30px)",
                      fontWeight: 400,
                      color: "var(--dawn-400)",
                      letterSpacing: "-0.015em",
                      lineHeight: 1,
                    }}
                  >
                    {n}
                  </span>
                  <span
                    style={{
                      fontSize: 15,
                      lineHeight: 1.4,
                      color: "rgba(195,219,227,0.65)",
                      fontFamily: "var(--font-sans)",
                    }}
                  >
                    {l}
                  </span>
                </div>
              ))}
            </div>
          </div>

          {/* Value props */}
          <div
            style={{
              display: "grid",
              gridTemplateColumns: "repeat(3, 1fr)",
              gap: 16,
            }}
          >
            {[
              {
                title: "Conseil humain",
                desc: "Pour les cas complexes, un conseiller reprend la main avec tout le contexte.",
              },
              {
                title: "Réactivité",
                desc: "Le flux ne sature plus : chaque demande est traitée, aucune opportunité perdue.",
              },
              {
                title: "Transparence",
                desc: "Des règles de prix claires et auditables. Deux demandes identiques, le même devis.",
              },
            ].map((item) => (
              <div
                key={item.title}
                style={{
                  background: "rgba(255,255,255,0.04)",
                  border: "1px solid rgba(195,219,227,0.1)",
                  borderRadius: 14,
                  padding: "26px 24px",
                }}
              >
                <div
                  style={{
                    width: 28,
                    height: 2,
                    background: "var(--horizon-400)",
                    borderRadius: 1,
                    marginBottom: 18,
                    opacity: 0.7,
                  }}
                />
                <h3
                  style={{
                    fontFamily: "var(--font-sans)",
                    fontSize: 17,
                    fontWeight: 600,
                    color: "#fff",
                    margin: "0 0 9px",
                    letterSpacing: "-0.01em",
                  }}
                >
                  {item.title}
                </h3>
                <p
                  style={{
                    fontSize: 14.5,
                    lineHeight: 1.62,
                    color: "rgba(169,194,203,0.7)",
                    margin: 0,
                    fontFamily: "var(--font-sans)",
                  }}
                >
                  {item.desc}
                </p>
              </div>
            ))}
          </div>
        </div>
      </section>

      {/* ── CTA FINAL ─────────────────────────────────────────────────── */}
      <section
        style={{
          position: "relative",
          overflow: "hidden",
          padding: "clamp(64px,9vw,112px) clamp(20px,5vw,56px)",
        }}
      >
        {/* Background photo — road_light */}
        <div aria-hidden style={{ position: "absolute", inset: 0, zIndex: 0 }}>
          <Image
            src="/images/road_light.png"
            alt=""
            fill
            sizes="100vw"
            style={{ objectFit: "cover", objectPosition: "center" }}
          />
        </div>
        {/* Overlay dawn-300 — warm amber semi-transparent */}
        <div
          aria-hidden
          style={{
            position: "absolute",
            inset: 0,
            zIndex: 1,
            background: "rgba(246,184,132,0.75)",
            pointerEvents: "none",
          }}
        />

        <div
          style={{
            position: "relative",
            zIndex: 2,
            maxWidth: 680,
            margin: "0 auto",
            textAlign: "center",
          }}
        >
          <h2
            style={{
              fontFamily: "var(--font-display)",
              fontSize: "clamp(32px,4.2vw,56px)",
              fontWeight: 400,
              lineHeight: 1.06,
              letterSpacing: "-0.025em",
              color: "var(--petrol-950)",
              margin: "0 0 18px",
            }}
          >
            Prêt à confier votre trajet ?
          </h2>
          <p
            style={{
              fontSize: 18,
              lineHeight: 1.6,
              color: "var(--petrol-700)",
              margin: "0 0 32px",
              fontFamily: "var(--font-sans)",
              maxWidth: "44ch",
              marginLeft: "auto",
              marginRight: "auto",
            }}
          >
            Une conversation suffit. Devis clair, partenaire mobilisé, prestation sécurisée.
          </p>
          <a
            href="#hero-chat"
            style={{
              display: "inline-flex",
              alignItems: "center",
              gap: 8,
              padding: "14px 28px",
              borderRadius: 99,
              background: "var(--petrol-900)",
              color: "#fff",
              fontSize: 15.5,
              fontWeight: 600,
              textDecoration: "none",
              fontFamily: "var(--font-sans)",
              letterSpacing: "0.01em",
              boxShadow: "0 4px 16px rgba(10,32,41,0.2)",
            }}
          >
            Demander mon devis
          </a>
          <div
            style={{
              marginTop: 18,
              fontSize: 13,
              color: "rgba(20,56,69,0.55)",
              fontFamily: "var(--font-sans)",
            }}
          >
            Sans engagement · réponse sous 5 minutes
          </div>
        </div>
      </section>

      <LandingFooter />
    </>
  );
}
