/* NeoTravel — helper d'icône basé sur Lucide (chargé en UMD).
   Iconographie de marque : Lucide, trait fin (1.75), coins doux —
   en cohérence avec la signalétique calme des espaces de transit. */
const { useEffect, useRef } = React;

function Icon({ name, size = 20, color, strokeWidth = 1.75, style = {} }) {
  const ref = useRef(null);
  useEffect(() => {
    const host = ref.current;
    if (!host || !window.lucide) return;
    host.innerHTML = '';
    const i = document.createElement('i');
    i.setAttribute('data-lucide', name);
    host.appendChild(i);
    try {
      window.lucide.createIcons({
        nameAttr: 'data-lucide',
        attrs: { 'stroke-width': strokeWidth },
      });
    } catch (e) { /* noop */ }
  }, [name, strokeWidth]);
  return (
    <span
      ref={ref}
      className="nt-ico"
      style={{ display: 'inline-flex', width: size, height: size, color: color || 'currentColor', flex: `0 0 ${size}px`, ...style }}
    />
  );
}

window.Icon = Icon;
