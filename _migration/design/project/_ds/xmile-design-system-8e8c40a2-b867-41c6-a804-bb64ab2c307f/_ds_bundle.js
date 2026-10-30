/* @ds-bundle: {"format":4,"namespace":"XmileDesignSystem_8e8c40","components":[{"name":"Badge","sourcePath":"components/core/Badge.jsx"},{"name":"Button","sourcePath":"components/core/Button.jsx"},{"name":"Icon","sourcePath":"components/core/Icon.jsx"},{"name":"IconButton","sourcePath":"components/core/IconButton.jsx"},{"name":"Pill","sourcePath":"components/core/Pill.jsx"},{"name":"Dialog","sourcePath":"components/feedback/Dialog.jsx"},{"name":"Toast","sourcePath":"components/feedback/Toast.jsx"},{"name":"Tooltip","sourcePath":"components/feedback/Tooltip.jsx"},{"name":"Checkbox","sourcePath":"components/forms/Checkbox.jsx"},{"name":"Input","sourcePath":"components/forms/Input.jsx"},{"name":"Select","sourcePath":"components/forms/Select.jsx"},{"name":"Switch","sourcePath":"components/forms/Switch.jsx"},{"name":"NavBar","sourcePath":"components/navigation/NavBar.jsx"},{"name":"Tabs","sourcePath":"components/navigation/Tabs.jsx"},{"name":"Card","sourcePath":"components/surfaces/Card.jsx"},{"name":"NotchCard","sourcePath":"components/surfaces/NotchCard.jsx"},{"name":"StatBlock","sourcePath":"components/surfaces/StatBlock.jsx"}],"sourceHashes":{"components/core/Badge.jsx":"73681d43ad40","components/core/Button.jsx":"598aa649fe8b","components/core/Icon.jsx":"fdc87d603420","components/core/IconButton.jsx":"80804f01d9dc","components/core/Pill.jsx":"f2c9cad2ff6f","components/feedback/Dialog.jsx":"08008548c503","components/feedback/Toast.jsx":"ad588b301260","components/feedback/Tooltip.jsx":"17a34dd528f8","components/forms/Checkbox.jsx":"4698e6967695","components/forms/Input.jsx":"d0a6578f72e1","components/forms/Select.jsx":"a937e4a2e847","components/forms/Switch.jsx":"1153575dbef6","components/navigation/NavBar.jsx":"6b6722dd2b8b","components/navigation/Tabs.jsx":"c5ee7101371d","components/surfaces/Card.jsx":"c0c744c42bae","components/surfaces/NotchCard.jsx":"cc73fe53243c","components/surfaces/StatBlock.jsx":"d19edc439065","ui_kits/website/EssaiDialog.jsx":"68798005fffa","ui_kits/website/HomeScreen.jsx":"8cd74764083b","ui_kits/website/PlanningScreen.jsx":"afe3fee78ba9","ui_kits/website/Shared.jsx":"65e0038c22b5","ui_kits/website/TarifsScreen.jsx":"4ebb39ecbc20"},"inlinedExternals":[],"unexposedExports":[]} */

(() => {

const __ds_ns = (window.XmileDesignSystem_8e8c40 = window.XmileDesignSystem_8e8c40 || {});

const __ds_scope = {};

(__ds_ns.__errors = __ds_ns.__errors || []);

// components/core/Badge.jsx
try { (() => {
const T = {
  neutral: ['var(--xm-cream-200)', 'var(--text-strong)'],
  success: ['#DDF0E4', 'var(--xm-success)'],
  warning: ['#FBEFCF', '#9A6A05'],
  danger: ['#F8DCD7', 'var(--xm-danger)'],
  accent: ['var(--xm-orange-500)', 'var(--xm-chalk)'],
  dark: ['var(--xm-green-950)', 'var(--xm-chalk)']
};
function Badge({
  children,
  tone = 'neutral',
  dot
}) {
  const [bg, fg] = T[tone];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 6,
      padding: '3px 9px',
      borderRadius: 'var(--radius-xs)',
      background: bg,
      color: fg,
      font: '700 12px/1.2 var(--font-ui)',
      letterSpacing: '.05em',
      textTransform: 'uppercase'
    }
  }, dot && /*#__PURE__*/React.createElement("i", {
    style: {
      width: 6,
      height: 6,
      borderRadius: '50%',
      background: 'currentColor'
    }
  }), children);
}
Object.assign(__ds_scope, { Badge });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Badge.jsx", error: String((e && e.message) || e) }); }

// components/core/Icon.jsx
try { (() => {
function Icon({
  name,
  size = 18,
  color = 'currentColor',
  style
}) {
  const url = `https://unpkg.com/lucide-static@0.460.0/icons/${name}.svg`;
  return /*#__PURE__*/React.createElement("span", {
    "aria-hidden": "true",
    style: {
      display: 'inline-block',
      flex: 'none',
      width: size,
      height: size,
      background: color,
      WebkitMask: `url(${url}) center/contain no-repeat`,
      mask: `url(${url}) center/contain no-repeat`,
      ...style
    }
  });
}
Object.assign(__ds_scope, { Icon });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Icon.jsx", error: String((e && e.message) || e) }); }

// components/core/Button.jsx
try { (() => {
const SIZES = {
  sm: {
    h: 36,
    px: 16,
    fs: 14
  },
  md: {
    h: 46,
    px: 22,
    fs: 16
  },
  lg: {
    h: 56,
    px: 28,
    fs: 18
  }
};
const VARIANTS = {
  primary: {
    bg: 'var(--action-primary)',
    hover: 'var(--action-primary-hover)',
    fg: 'var(--text-on-accent)',
    bd: 'transparent'
  },
  dark: {
    bg: 'var(--action-dark)',
    hover: 'var(--action-dark-hover)',
    fg: 'var(--text-on-dark)',
    bd: 'transparent'
  },
  outline: {
    bg: 'transparent',
    hover: 'rgba(249,115,22,.08)',
    fg: 'inherit',
    bd: 'var(--xm-orange-500)'
  },
  ghost: {
    bg: 'transparent',
    hover: 'rgba(17,38,31,.06)',
    fg: 'inherit',
    bd: 'transparent'
  },
  light: {
    bg: 'var(--xm-chalk)',
    hover: 'var(--xm-cream-100)',
    fg: 'var(--text-strong)',
    bd: 'transparent'
  }
};
function Button({
  children,
  variant = 'primary',
  size = 'md',
  icon,
  iconRight,
  disabled,
  full,
  onClick,
  type = 'button',
  style
}) {
  const [h, setH] = React.useState(false);
  const [p, setP] = React.useState(false);
  const s = SIZES[size],
    v = VARIANTS[variant];
  return /*#__PURE__*/React.createElement("button", {
    type: type,
    disabled: disabled,
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => {
      setH(false);
      setP(false);
    },
    onMouseDown: () => setP(true),
    onMouseUp: () => setP(false),
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      gap: 10,
      height: s.h,
      padding: `0 ${s.px}px`,
      width: full ? '100%' : undefined,
      borderRadius: 'var(--radius-pill)',
      border: `1.5px solid ${v.bd}`,
      background: h && !disabled ? v.hover : v.bg,
      color: v.fg,
      font: `600 ${s.fs}px/1 var(--font-ui)`,
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .45 : 1,
      transform: p && !disabled ? 'scale(.97)' : 'none',
      transition: 'background var(--dur-fast), transform var(--dur-fast) var(--ease-out)',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: s.fs + 2
  }), children, iconRight && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: iconRight,
    size: s.fs + 2
  }));
}
Object.assign(__ds_scope, { Button });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Button.jsx", error: String((e && e.message) || e) }); }

// components/core/IconButton.jsx
try { (() => {
const V = {
  accent: ['var(--action-primary)', 'var(--xm-chalk)'],
  dark: ['var(--action-dark)', 'var(--xm-chalk)'],
  light: ['var(--xm-chalk)', 'var(--text-strong)'],
  outline: ['transparent', 'inherit']
};
function IconButton({
  icon,
  variant = 'accent',
  size = 44,
  label,
  onClick,
  disabled,
  style
}) {
  const [h, setH] = React.useState(false);
  const [bg, fg] = V[variant];
  return /*#__PURE__*/React.createElement("button", {
    "aria-label": label,
    title: label,
    onClick: onClick,
    disabled: disabled,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      width: size,
      height: size,
      borderRadius: '50%',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      flex: 'none',
      background: bg,
      color: fg,
      border: variant === 'outline' ? '1.5px solid currentColor' : 'none',
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .45 : 1,
      transform: h && !disabled ? 'rotate(-12deg) scale(1.05)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-snap)',
      ...style
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: Math.round(size * 0.42)
  }));
}
Object.assign(__ds_scope, { IconButton });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/IconButton.jsx", error: String((e && e.message) || e) }); }

// components/core/Pill.jsx
try { (() => {
function Pill({
  children,
  icon,
  tone = 'outline',
  style
}) {
  const t = {
    outline: {
      bg: 'transparent',
      bd: 'currentColor',
      fg: 'inherit'
    },
    light: {
      bg: 'var(--xm-chalk)',
      bd: 'transparent',
      fg: 'var(--text-strong)'
    },
    accent: {
      bg: 'var(--xm-orange-500)',
      bd: 'transparent',
      fg: 'var(--xm-chalk)'
    },
    tint: {
      bg: 'var(--xm-orange-100)',
      bd: 'transparent',
      fg: 'var(--xm-orange-700)'
    }
  }[tone];
  return /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 8,
      padding: '7px 14px',
      borderRadius: 'var(--radius-pill)',
      border: `1px solid ${t.bd}`,
      background: t.bg,
      color: t.fg,
      font: '600 13px/1 var(--font-ui)',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      whiteSpace: 'nowrap',
      ...style
    }
  }, icon && /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: icon,
    size: 14
  }), children);
}
Object.assign(__ds_scope, { Pill });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/core/Pill.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Dialog.jsx
try { (() => {
function Dialog({
  open,
  title,
  children,
  onClose,
  footer,
  width = 460
}) {
  if (!open) return null;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClose,
    style: {
      position: 'fixed',
      inset: 0,
      background: 'var(--overlay-scrim)',
      backdropFilter: 'blur(4px)',
      display: 'flex',
      alignItems: 'center',
      justifyContent: 'center',
      zIndex: 100,
      padding: 20
    }
  }, /*#__PURE__*/React.createElement("div", {
    onClick: e => e.stopPropagation(),
    role: "dialog",
    style: {
      width,
      maxWidth: '100%',
      background: 'var(--surface-card)',
      borderRadius: 'var(--radius-xl)',
      padding: 28,
      boxShadow: 'var(--shadow-lg)',
      display: 'flex',
      flexDirection: 'column',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'flex-start',
      gap: 16
    }
  }, /*#__PURE__*/React.createElement("h3", {
    style: {
      margin: 0,
      flex: 1,
      font: '400 34px/.95 var(--font-display)',
      textTransform: 'uppercase',
      color: 'var(--text-strong)'
    }
  }, title), onClose && /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "x",
    variant: "outline",
    size: 36,
    label: "Fermer",
    onClick: onClose,
    style: {
      color: 'var(--text-strong)'
    }
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '400 16px/1.55 var(--font-body)',
      color: 'var(--text-body)'
    }
  }, children), footer && /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 10,
      justifyContent: 'flex-end'
    }
  }, footer)));
}
Object.assign(__ds_scope, { Dialog });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Dialog.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Toast.jsx
try { (() => {
function Toast({
  children,
  tone = 'success',
  onClose
}) {
  const ic = {
    success: 'check',
    danger: 'alert-triangle',
    info: 'info'
  }[tone];
  const c = {
    success: 'var(--xm-success)',
    danger: 'var(--xm-danger)',
    info: 'var(--xm-orange-500)'
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    role: "status",
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 12,
      padding: '12px 16px 12px 12px',
      borderRadius: 'var(--radius-pill)',
      background: 'var(--surface-dark)',
      color: 'var(--text-on-dark)',
      boxShadow: 'var(--shadow-lg)',
      font: '500 15px var(--font-body)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      width: 28,
      height: 28,
      borderRadius: '50%',
      background: c,
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center'
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: ic,
    size: 16,
    color: "#fff"
  })), /*#__PURE__*/React.createElement("span", null, children), onClose && /*#__PURE__*/React.createElement("button", {
    onClick: onClose,
    "aria-label": "Fermer",
    style: {
      background: 'none',
      border: 'none',
      color: 'inherit',
      cursor: 'pointer',
      display: 'inline-flex',
      opacity: .7
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Icon, {
    name: "x",
    size: 16
  })));
}
Object.assign(__ds_scope, { Toast });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Toast.jsx", error: String((e && e.message) || e) }); }

// components/feedback/Tooltip.jsx
try { (() => {
function Tooltip({
  label,
  children
}) {
  const [o, setO] = React.useState(false);
  return /*#__PURE__*/React.createElement("span", {
    onMouseEnter: () => setO(true),
    onMouseLeave: () => setO(false),
    style: {
      position: 'relative',
      display: 'inline-flex'
    }
  }, children, o && /*#__PURE__*/React.createElement("span", {
    role: "tooltip",
    style: {
      position: 'absolute',
      bottom: 'calc(100% + 8px)',
      left: '50%',
      transform: 'translateX(-50%)',
      whiteSpace: 'nowrap',
      background: 'var(--surface-dark)',
      color: 'var(--text-on-dark)',
      padding: '6px 10px',
      borderRadius: 'var(--radius-xs)',
      font: '600 12px var(--font-ui)',
      letterSpacing: '.05em',
      textTransform: 'uppercase',
      zIndex: 10
    }
  }, label));
}
Object.assign(__ds_scope, { Tooltip });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/feedback/Tooltip.jsx", error: String((e && e.message) || e) }); }

// components/forms/Checkbox.jsx
try { (() => {
function Checkbox({
  label,
  checked,
  onChange,
  disabled
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1,
      font: '400 15px var(--font-body)',
      color: 'var(--text-strong)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      width: 22,
      height: 22,
      borderRadius: 6,
      flex: 'none',
      display: 'inline-flex',
      alignItems: 'center',
      justifyContent: 'center',
      background: checked ? 'var(--xm-orange-500)' : 'var(--surface-card)',
      border: `1.5px solid ${checked ? 'var(--xm-orange-500)' : 'var(--xm-sand-400)'}`,
      transition: 'background var(--dur-fast)'
    }
  }, checked && /*#__PURE__*/React.createElement("span", {
    style: {
      width: 6,
      height: 11,
      borderRight: '2.5px solid #fff',
      borderBottom: '2.5px solid #fff',
      transform: 'translateY(-1px) rotate(45deg)'
    }
  })), label);
}
Object.assign(__ds_scope, { Checkbox });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Checkbox.jsx", error: String((e && e.message) || e) }); }

// components/forms/Input.jsx
try { (() => {
function Input({
  label,
  placeholder,
  value,
  onChange,
  type = 'text',
  hint,
  error,
  dark,
  style
}) {
  const [f, setF] = React.useState(false);
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 13px var(--font-ui)',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: dark ? 'var(--text-on-dark)' : 'var(--text-strong)'
    }
  }, label), /*#__PURE__*/React.createElement("input", {
    type: type,
    placeholder: placeholder,
    value: value,
    onChange: e => onChange && onChange(e.target.value),
    onFocus: () => setF(true),
    onBlur: () => setF(false),
    style: {
      height: 48,
      padding: '0 16px',
      borderRadius: 'var(--radius-sm)',
      font: '400 16px var(--font-body)',
      outline: 'none',
      background: dark ? 'var(--surface-dark-raised)' : 'var(--surface-card)',
      color: dark ? 'var(--text-on-dark)' : 'var(--text-strong)',
      border: `1.5px solid ${error ? 'var(--xm-danger)' : f ? 'var(--xm-orange-500)' : dark ? 'var(--border-on-dark)' : 'var(--border-subtle)'}`,
      boxShadow: f ? 'var(--ring-focus)' : 'none',
      transition: 'border-color var(--dur-fast)'
    }
  }), (error || hint) && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 13px var(--font-body)',
      color: error ? 'var(--xm-danger)' : 'var(--text-muted)'
    }
  }, error || hint));
}
Object.assign(__ds_scope, { Input });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Input.jsx", error: String((e && e.message) || e) }); }

// components/forms/Select.jsx
try { (() => {
function Select({
  label,
  options = [],
  value,
  onChange,
  style
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 6,
      ...style
    }
  }, label && /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 13px var(--font-ui)',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--text-strong)'
    }
  }, label), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'relative',
      display: 'block'
    }
  }, /*#__PURE__*/React.createElement("select", {
    value: value,
    onChange: e => onChange && onChange(e.target.value),
    style: {
      width: '100%',
      height: 48,
      padding: '0 40px 0 16px',
      appearance: 'none',
      borderRadius: 'var(--radius-sm)',
      border: '1.5px solid var(--border-subtle)',
      background: 'var(--surface-card)',
      font: '400 16px var(--font-body)',
      color: 'var(--text-strong)',
      cursor: 'pointer'
    }
  }, options.map(o => typeof o === 'string' ? /*#__PURE__*/React.createElement("option", {
    key: o
  }, o) : /*#__PURE__*/React.createElement("option", {
    key: o.value,
    value: o.value
  }, o.label))), /*#__PURE__*/React.createElement("span", {
    style: {
      position: 'absolute',
      right: 16,
      top: '50%',
      width: 8,
      height: 8,
      borderRight: '2px solid var(--xm-orange-500)',
      borderBottom: '2px solid var(--xm-orange-500)',
      transform: 'translateY(-70%) rotate(45deg)',
      pointerEvents: 'none'
    }
  })));
}
Object.assign(__ds_scope, { Select });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Select.jsx", error: String((e && e.message) || e) }); }

// components/forms/Switch.jsx
try { (() => {
function Switch({
  label,
  checked,
  onChange,
  disabled
}) {
  return /*#__PURE__*/React.createElement("label", {
    style: {
      display: 'inline-flex',
      alignItems: 'center',
      gap: 10,
      cursor: disabled ? 'not-allowed' : 'pointer',
      opacity: disabled ? .5 : 1,
      font: '400 15px var(--font-body)',
      color: 'var(--text-strong)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    role: "switch",
    "aria-checked": !!checked,
    onClick: () => !disabled && onChange && onChange(!checked),
    style: {
      width: 44,
      height: 26,
      borderRadius: 999,
      padding: 3,
      boxSizing: 'border-box',
      flex: 'none',
      background: checked ? 'var(--xm-orange-500)' : 'var(--xm-cream-200)',
      transition: 'background var(--dur-base)'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      display: 'block',
      width: 20,
      height: 20,
      borderRadius: '50%',
      background: '#fff',
      boxShadow: 'var(--shadow-sm)',
      transform: checked ? 'translateX(18px)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-snap)'
    }
  })), label);
}
Object.assign(__ds_scope, { Switch });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/forms/Switch.jsx", error: String((e && e.message) || e) }); }

// components/navigation/NavBar.jsx
try { (() => {
function NavBar({
  links = [],
  active,
  onNavigate,
  logoSrc,
  ctaLabel = 'Essai gratuit',
  onCta
}) {
  return /*#__PURE__*/React.createElement("nav", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 32,
      height: 'var(--nav-h)'
    }
  }, logoSrc ? /*#__PURE__*/React.createElement("img", {
    src: logoSrc,
    alt: "Xmile CrossFit",
    style: {
      height: 58,
      cursor: 'pointer'
    },
    onClick: () => onNavigate && onNavigate(links[0])
  }) : /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 32px var(--font-display)'
    }
  }, "XMILE"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 28,
      flex: 1
    }
  }, links.map(l => /*#__PURE__*/React.createElement("a", {
    key: l,
    onClick: () => onNavigate && onNavigate(l),
    style: {
      cursor: 'pointer',
      font: '600 15px var(--font-ui)',
      letterSpacing: '.05em',
      textTransform: 'uppercase',
      color: 'var(--text-strong)',
      textDecoration: 'none',
      paddingBottom: 4,
      borderBottom: `2px solid ${l === active ? 'var(--xm-orange-500)' : 'transparent'}`
    }
  }, l))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'center',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement(__ds_scope.Button, {
    variant: "outline",
    onClick: onCta,
    style: {
      color: 'var(--text-strong)'
    }
  }, ctaLabel), /*#__PURE__*/React.createElement(__ds_scope.IconButton, {
    icon: "arrow-up-right",
    label: ctaLabel,
    onClick: onCta
  })));
}
Object.assign(__ds_scope, { NavBar });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/NavBar.jsx", error: String((e && e.message) || e) }); }

// components/navigation/Tabs.jsx
try { (() => {
function Tabs({
  items = [],
  value,
  onChange,
  dark
}) {
  return /*#__PURE__*/React.createElement("div", {
    role: "tablist",
    style: {
      display: 'inline-flex',
      gap: 4,
      padding: 4,
      borderRadius: 999,
      background: dark ? 'var(--surface-dark-raised)' : 'var(--xm-cream-100)'
    }
  }, items.map(it => {
    const v = typeof it === 'string' ? it : it.value,
      l = typeof it === 'string' ? it : it.label,
      on = v === value;
    return /*#__PURE__*/React.createElement("button", {
      key: v,
      role: "tab",
      "aria-selected": on,
      onClick: () => onChange && onChange(v),
      style: {
        height: 38,
        padding: '0 18px',
        border: 'none',
        borderRadius: 999,
        cursor: 'pointer',
        background: on ? 'var(--xm-orange-500)' : 'transparent',
        color: on ? '#fff' : dark ? 'var(--text-on-dark)' : 'var(--text-strong)',
        font: '600 14px var(--font-ui)',
        letterSpacing: '.06em',
        textTransform: 'uppercase',
        transition: 'background var(--dur-fast)'
      }
    }, l);
  }));
}
Object.assign(__ds_scope, { Tabs });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/navigation/Tabs.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/Card.jsx
try { (() => {
function Card({
  children,
  tone = 'light',
  padding = 24,
  style
}) {
  const t = {
    light: ['var(--surface-card)', 'var(--text-body)', '1px solid var(--border-subtle)'],
    dark: ['var(--surface-dark)', 'var(--text-on-dark)', 'none'],
    cream: ['var(--bg-alt)', 'var(--text-body)', 'none'],
    accent: ['var(--surface-accent)', 'var(--text-on-accent)', 'none']
  }[tone];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: t[0],
      color: t[1],
      border: t[2],
      borderRadius: 'var(--radius-lg)',
      padding,
      ...style
    }
  }, children);
}
Object.assign(__ds_scope, { Card });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/Card.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/NotchCard.jsx
try { (() => {
function NotchCard({
  children,
  bg = 'var(--xm-lime-300)',
  color = 'var(--text-strong)',
  height,
  tab = 0.46,
  onClick,
  style
}) {
  const [h, setH] = React.useState(false);
  const r = 22,
    tabH = 16;
  return /*#__PURE__*/React.createElement("div", {
    onClick: onClick,
    onMouseEnter: () => setH(true),
    onMouseLeave: () => setH(false),
    style: {
      position: 'relative',
      paddingTop: tabH,
      cursor: onClick ? 'pointer' : 'default',
      transform: h && onClick ? 'translateY(-4px)' : 'none',
      transition: 'transform var(--dur-base) var(--ease-out)',
      ...style
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: 0,
      right: 0,
      width: `${tab * 100}%`,
      height: tabH + r,
      background: bg,
      borderRadius: `${r}px ${r}px 0 0`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'absolute',
      top: tabH - 14,
      right: `calc(${tab * 100}% - 1px)`,
      width: 14,
      height: 14,
      background: `radial-gradient(circle at 0 0, transparent 13.5px, ${bg} 14px)`
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      position: 'relative',
      height,
      background: bg,
      color,
      borderRadius: `${r}px 0 ${r}px ${r}px`,
      padding: 22,
      boxSizing: 'border-box',
      overflow: 'hidden'
    }
  }, children));
}
Object.assign(__ds_scope, { NotchCard });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/NotchCard.jsx", error: String((e && e.message) || e) }); }

// components/surfaces/StatBlock.jsx
try { (() => {
function StatBlock({
  value,
  label,
  accent
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 4
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 56px/.9 var(--font-display)',
      color: accent ? 'var(--xm-orange-500)' : 'inherit'
    }
  }, value), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 13px/1.2 var(--font-ui)',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      opacity: .85
    }
  }, label));
}
Object.assign(__ds_scope, { StatBlock });
})(); } catch (e) { __ds_ns.__errors.push({ path: "components/surfaces/StatBlock.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/EssaiDialog.jsx
try { (() => {
function EssaiDialog({
  open,
  onClose,
  onDone
}) {
  const {
    Dialog,
    Input,
    Select,
    Checkbox,
    Button
  } = XM;
  const [ok, setOk] = React.useState(false);
  const [name, setName] = React.useState('');
  return /*#__PURE__*/React.createElement(Dialog, {
    open: open,
    onClose: onClose,
    title: "R\xE9serve ta s\xE9ance d'essai",
    width: 520,
    footer: /*#__PURE__*/React.createElement(React.Fragment, null, /*#__PURE__*/React.createElement(Button, {
      variant: "ghost",
      onClick: onClose
    }, "Annuler"), /*#__PURE__*/React.createElement(Button, {
      disabled: !ok || !name,
      iconRight: "arrow-up-right",
      onClick: () => {
        onDone('Séance d\'essai demandée — on te recontacte !');
        onClose();
      }
    }, "Envoyer"))
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 1fr',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Input, {
    label: "Pr\xE9nom",
    placeholder: "Alex",
    value: name,
    onChange: setName
  }), /*#__PURE__*/React.createElement(Input, {
    label: "E-mail",
    placeholder: "alex@mail.be"
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Programme",
    options: ['CrossFit', 'Hyrox', 'Haltérophilie']
  }), /*#__PURE__*/React.createElement(Select, {
    label: "Niveau",
    options: ['Débutant', 'Intermédiaire', 'Confirmé']
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      gridColumn: '1/-1'
    }
  }, /*#__PURE__*/React.createElement(Checkbox, {
    label: "J'accepte le r\xE8glement de la box",
    checked: ok,
    onChange: setOk
  }))));
}
window.EssaiDialog = EssaiDialog;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/EssaiDialog.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/HomeScreen.jsx
try { (() => {
function HomeScreen({
  go,
  book
}) {
  const {
    Button,
    IconButton,
    Pill,
    NotchCard,
    StatBlock,
    Icon
  } = XM;
  const progs = [['CrossFit', 'var(--xm-lime-300)', 'var(--text-strong)', 'WOD en groupe, tous niveaux'], ['Hyrox', 'var(--xm-orange-500)', '#fff', 'Course + 8 stations fonctionnelles'], ['Haltérophilie', 'var(--xm-blush-200)', 'var(--text-strong)', 'Arraché, épaulé-jeté, technique']];
  return /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement("section", {
    style: {
      background: 'var(--surface-dark)',
      color: 'var(--text-on-dark)',
      borderRadius: 'var(--radius-xl)',
      padding: '48px 48px 0',
      display: 'grid',
      gridTemplateColumns: '220px 1fr 1.2fr',
      gap: 32,
      minHeight: 500
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'space-around',
      borderRight: '1px solid var(--border-on-dark)',
      paddingRight: 24,
      paddingBottom: 48
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14,
      alignItems: 'flex-start'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "timer",
    size: 36,
    color: "var(--xm-orange-500)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 15px/1.3 var(--font-ui)',
      textTransform: 'uppercase',
      letterSpacing: '.04em'
    }
  }, "WOD de 6h \xE0 21h, 6 jours sur 7"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 6
    }
  }, /*#__PURE__*/React.createElement(IconButton, {
    icon: "chevron-left",
    size: 34,
    label: "Pr\xE9c."
  }), /*#__PURE__*/React.createElement(IconButton, {
    icon: "chevron-right",
    size: 34,
    label: "Suiv."
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 14
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "trophy",
    size: 36,
    color: "var(--xm-orange-500)"
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 15px/1.3 var(--font-ui)',
      textTransform: 'uppercase',
      letterSpacing: '.04em'
    }
  }, "Coachs certifi\xE9s CrossFit L2 & Hyrox"))), /*#__PURE__*/React.createElement(PhotoSlot, {
    label: "Photo athl\xE8te d\xE9tour\xE9e \u2014 \xE0 fournir",
    style: {
      borderRadius: 'var(--radius-lg) var(--radius-lg) 0 0'
    }
  }), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      justifyContent: 'center',
      gap: 20,
      paddingBottom: 48
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Pill, {
    icon: "dumbbell",
    style: {
      borderColor: 'var(--border-on-dark)'
    }
  }, "CrossFit \xB7 Hyrox \xB7 Halt\xE9ro")), /*#__PURE__*/React.createElement(H, {
    size: 104,
    color: "#fff"
  }, "Forge ton ", /*#__PURE__*/React.createElement("span", {
    style: {
      color: 'var(--xm-orange-500)'
    }
  }, "meilleur"), " toi"), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 24,
      borderTop: '1px solid var(--border-on-dark)',
      paddingTop: 20,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Button, {
    onClick: book,
    iconRight: "arrow-up-right"
  }, "S\xE9ance d'essai"), /*#__PURE__*/React.createElement("p", {
    style: {
      margin: 0,
      font: '500 14px/1.45 var(--font-ui)',
      textTransform: 'uppercase',
      letterSpacing: '.03em',
      color: 'var(--text-on-dark-muted)',
      borderLeft: '1px solid var(--border-on-dark)',
      paddingLeft: 20
    }
  }, "Du WOD matinal \xE0 la s\xE9ance d'halt\xE9ro du soir, on t'accompagne \xE0 chaque rep.")))), /*#__PURE__*/React.createElement("section", {
    style: {
      display: 'grid',
      gridTemplateColumns: '1fr 3fr',
      gap: 24,
      marginTop: 40,
      alignItems: 'end'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 20,
      paddingBottom: 12
    }
  }, /*#__PURE__*/React.createElement(H, {
    size: 40
  }, "Une box. Trois disciplines."), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement(StatBlock, {
    value: "500+",
    label: "Athl\xE8tes",
    accent: true
  }), /*#__PURE__*/React.createElement(StatBlock, {
    value: "6",
    label: "Coachs"
  })), /*#__PURE__*/React.createElement("a", {
    onClick: () => go('Planning'),
    style: {
      cursor: 'pointer',
      font: '600 14px var(--font-ui)',
      letterSpacing: '.06em',
      textTransform: 'uppercase',
      color: 'var(--text-strong)',
      borderBottom: '2px solid var(--text-strong)',
      alignSelf: 'flex-start',
      paddingBottom: 3,
      display: 'inline-flex',
      gap: 6,
      alignItems: 'center'
    }
  }, "Voir le planning ", /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-up-right",
    size: 16
  }))), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 18
    }
  }, progs.map(([n, bg, fg, d]) => /*#__PURE__*/React.createElement(NotchCard, {
    key: n,
    bg: bg,
    color: fg,
    height: 260,
    onClick: () => go('Planning')
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      height: '100%',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement(H, {
    size: 34,
    color: "inherit"
  }, n), /*#__PURE__*/React.createElement(Icon, {
    name: "arrow-up-right",
    size: 22
  })), /*#__PURE__*/React.createElement("div", {
    style: {
      font: '500 15px/1.4 var(--font-body)'
    }
  }, d)))))));
}
window.HomeScreen = HomeScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/HomeScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/PlanningScreen.jsx
try { (() => {
const SLOTS = [['06:30', 'CrossFit', 'Coach Sam', 4], ['07:30', 'Hyrox', 'Coach Léa', 1], ['12:15', 'CrossFit', 'Coach Tom', 8], ['17:30', 'Haltérophilie', 'Coach Nico', 0], ['18:30', 'CrossFit', 'Coach Sam', 3], ['19:30', 'Hyrox', 'Coach Léa', 6]];
function PlanningScreen({
  onBooked
}) {
  const {
    Tabs,
    Badge,
    Button,
    Card,
    Icon
  } = XM;
  const [day, setDay] = React.useState('Mer');
  const [booked, setBooked] = React.useState({});
  const [f, setF] = React.useState('Tous');
  const list = SLOTS.filter(s => f === 'Tous' || s[1] === f);
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between',
      alignItems: 'flex-end',
      gap: 20,
      flexWrap: 'wrap'
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Semaine 40"), /*#__PURE__*/React.createElement(H, {
    size: 72
  }, "Planning")), /*#__PURE__*/React.createElement(Tabs, {
    items: ['Tous', 'CrossFit', 'Hyrox', 'Haltérophilie'],
    value: f,
    onChange: setF
  })), /*#__PURE__*/React.createElement(Tabs, {
    items: ['Lun', 'Mar', 'Mer', 'Jeu', 'Ven', 'Sam'],
    value: day,
    onChange: setDay
  }), /*#__PURE__*/React.createElement(Card, {
    padding: 0
  }, list.map(([t, p, c, n], i) => {
    const k = day + t,
      b = booked[k],
      left = b ? n - 1 : n;
    return /*#__PURE__*/React.createElement("div", {
      key: k,
      style: {
        display: 'grid',
        gridTemplateColumns: '110px 1fr 160px 140px 160px',
        alignItems: 'center',
        gap: 16,
        padding: '18px 24px',
        borderTop: i ? '1px solid var(--border-subtle)' : 'none'
      }
    }, /*#__PURE__*/React.createElement("span", {
      style: {
        font: '400 34px/1 var(--font-display)',
        color: 'var(--text-strong)'
      }
    }, t), /*#__PURE__*/React.createElement("span", {
      style: {
        font: '600 18px var(--font-ui)',
        textTransform: 'uppercase',
        letterSpacing: '.04em',
        color: 'var(--text-strong)'
      }
    }, p), /*#__PURE__*/React.createElement("span", {
      style: {
        display: 'inline-flex',
        gap: 8,
        alignItems: 'center',
        color: 'var(--text-muted)'
      }
    }, /*#__PURE__*/React.createElement(Icon, {
      name: "user",
      size: 16
    }), c), /*#__PURE__*/React.createElement("span", null, n === 0 ? /*#__PURE__*/React.createElement(Badge, {
      tone: "danger"
    }, "Complet") : left <= 1 ? /*#__PURE__*/React.createElement(Badge, {
      tone: "warning",
      dot: true
    }, left, " place") : /*#__PURE__*/React.createElement(Badge, {
      tone: "success",
      dot: true
    }, left, " places")), b ? /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: "ghost",
      icon: "check",
      onClick: () => setBooked({
        ...booked,
        [k]: false
      })
    }, "Inscrit") : /*#__PURE__*/React.createElement(Button, {
      size: "sm",
      variant: n ? 'primary' : 'outline',
      disabled: !n,
      onClick: () => {
        setBooked({
          ...booked,
          [k]: true
        });
        onBooked(p + ' · ' + day + ' ' + t);
      }
    }, n ? 'Réserver' : "Liste d'attente"));
  })));
}
window.PlanningScreen = PlanningScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/PlanningScreen.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/Shared.jsx
try { (() => {
const XM = window.XmileDesignSystem_8e8c40;
function PhotoSlot({
  label,
  style
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      background: 'repeating-linear-gradient(135deg, rgba(255,255,255,.06) 0 10px, rgba(255,255,255,0) 10px 20px), var(--xm-green-800)',
      borderRadius: 'var(--radius-lg)',
      display: 'flex',
      alignItems: 'flex-end',
      padding: 14,
      color: 'var(--text-on-dark-muted)',
      font: '500 12px var(--font-body)',
      ...style
    }
  }, label);
}
function Eyebrow({
  children,
  color
}) {
  return /*#__PURE__*/React.createElement("div", {
    style: {
      font: '600 13px var(--font-ui)',
      letterSpacing: 'var(--ls-caps)',
      textTransform: 'uppercase',
      color: color || 'var(--text-accent)'
    }
  }, children);
}
function H({
  children,
  size = 64,
  color,
  style
}) {
  return /*#__PURE__*/React.createElement("h2", {
    style: {
      margin: 0,
      font: `400 ${size}px/.92 var(--font-display)`,
      textTransform: 'uppercase',
      color: color || 'var(--text-strong)',
      textWrap: 'balance',
      ...style
    }
  }, children);
}
function Footer({
  go
}) {
  const {
    Icon
  } = XM;
  return /*#__PURE__*/React.createElement("footer", {
    style: {
      background: 'var(--surface-dark)',
      color: 'var(--text-on-dark)',
      borderRadius: 'var(--radius-xl)',
      padding: '48px 40px',
      display: 'grid',
      gridTemplateColumns: '1.2fr 1fr 1fr 1fr',
      gap: 32,
      marginTop: 64
    }
  }, /*#__PURE__*/React.createElement("img", {
    src: "../../assets/logo-white.png",
    style: {
      width: 140
    }
  }), [['La box', ['Programmes', 'Planning', 'Tarifs']], ['Contact', ['hello@xmile.be', '+32 470 00 00 00', 'Bruxelles']], ['Horaires', ['Lun–Ven 6h–21h', 'Sam 8h–13h', 'Dim 9h–12h']]].map(([t, l]) => /*#__PURE__*/React.createElement("div", {
    key: t,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10
    }
  }, /*#__PURE__*/React.createElement(Eyebrow, {
    color: "var(--xm-orange-500)"
  }, t), l.map(x => /*#__PURE__*/React.createElement("a", {
    key: x,
    onClick: () => ['Programmes', 'Planning', 'Tarifs'].includes(x) && go(x),
    style: {
      color: 'var(--text-on-dark-muted)',
      cursor: 'pointer',
      font: '400 15px var(--font-body)'
    }
  }, x)))));
}
Object.assign(window, {
  XM,
  PhotoSlot,
  Eyebrow,
  H,
  Footer
});
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/Shared.jsx", error: String((e && e.message) || e) }); }

// ui_kits/website/TarifsScreen.jsx
try { (() => {
function TarifsScreen({
  book
}) {
  const {
    Card,
    Button,
    Badge,
    Icon
  } = XM;
  const plans = [['Découverte', '25', '1 séance', ['Cours au choix', 'Briefing coach'], 'light'], ['Illimité', '129', '/ mois', ['Tous les cours', 'Open gym', 'Suivi des PR'], 'dark'], ['10 séances', '180', 'carte', ['Valable 4 mois', 'Tous les cours'], 'cream']];
  return /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 28
    }
  }, /*#__PURE__*/React.createElement("div", null, /*#__PURE__*/React.createElement(Eyebrow, null, "Sans engagement"), /*#__PURE__*/React.createElement(H, {
    size: 72
  }, "Tarifs")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'grid',
      gridTemplateColumns: 'repeat(3,1fr)',
      gap: 18
    }
  }, plans.map(([n, p, u, f, tone]) => /*#__PURE__*/React.createElement(Card, {
    key: n,
    tone: tone,
    padding: 28,
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 18
    }
  }, /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      justifyContent: 'space-between'
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '600 16px var(--font-ui)',
      textTransform: 'uppercase',
      letterSpacing: '.06em'
    }
  }, n), tone === 'dark' && /*#__PURE__*/React.createElement(Badge, {
    tone: "accent"
  }, "Populaire")), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      alignItems: 'baseline',
      gap: 8
    }
  }, /*#__PURE__*/React.createElement("span", {
    style: {
      font: '400 80px/.9 var(--font-display)',
      color: tone === 'dark' ? 'var(--xm-orange-500)' : 'var(--text-strong)'
    }
  }, p, "\u20AC"), /*#__PURE__*/React.createElement("span", {
    style: {
      font: '500 14px var(--font-ui)',
      textTransform: 'uppercase',
      opacity: .8
    }
  }, u)), /*#__PURE__*/React.createElement("div", {
    style: {
      display: 'flex',
      flexDirection: 'column',
      gap: 10,
      flex: 1
    }
  }, f.map(x => /*#__PURE__*/React.createElement("span", {
    key: x,
    style: {
      display: 'flex',
      gap: 10,
      alignItems: 'center'
    }
  }, /*#__PURE__*/React.createElement(Icon, {
    name: "check",
    size: 16,
    color: "var(--xm-orange-500)"
  }), x))), /*#__PURE__*/React.createElement(Button, {
    full: true,
    variant: tone === 'dark' ? 'primary' : 'dark',
    onClick: book
  }, "Choisir")))));
}
window.TarifsScreen = TarifsScreen;
})(); } catch (e) { __ds_ns.__errors.push({ path: "ui_kits/website/TarifsScreen.jsx", error: String((e && e.message) || e) }); }

__ds_ns.Badge = __ds_scope.Badge;

__ds_ns.Button = __ds_scope.Button;

__ds_ns.Icon = __ds_scope.Icon;

__ds_ns.IconButton = __ds_scope.IconButton;

__ds_ns.Pill = __ds_scope.Pill;

__ds_ns.Dialog = __ds_scope.Dialog;

__ds_ns.Toast = __ds_scope.Toast;

__ds_ns.Tooltip = __ds_scope.Tooltip;

__ds_ns.Checkbox = __ds_scope.Checkbox;

__ds_ns.Input = __ds_scope.Input;

__ds_ns.Select = __ds_scope.Select;

__ds_ns.Switch = __ds_scope.Switch;

__ds_ns.NavBar = __ds_scope.NavBar;

__ds_ns.Tabs = __ds_scope.Tabs;

__ds_ns.Card = __ds_scope.Card;

__ds_ns.NotchCard = __ds_scope.NotchCard;

__ds_ns.StatBlock = __ds_scope.StatBlock;

})();
