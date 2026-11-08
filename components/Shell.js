export default function Shell() {
  return (
    <>
      <header className="top">
        <div className="top-in">
          <button className="brand" type="button" data-go="start"><svg viewBox="0 0 26 16" aria-hidden="true"><path d="M1 8 C 5 -2, 8 -2, 13 8 S 21 18, 25 8" fill="none" stroke="currentColor" strokeWidth="2.2" strokeLinecap="round"/></svg>Schwingungen · 15</button>
          <span className="sp"></span>
          <span className="chip" id="topChip">Klausur in <b id="cdTop">–</b></span>
          <div className="bell" id="bellWrap" hidden>
            <button className="bell-btn" id="bellBtn" type="button" aria-haspopup="dialog" aria-expanded="false" aria-label="Benachrichtigungen"><svg viewBox="0 0 24 24" aria-hidden="true"><path d="M6 9a6 6 0 0 1 12 0c0 6.5 2.6 8.3 2.6 8.3H3.4S6 15.5 6 9"/><path d="M10.2 20.5a2 2 0 0 0 3.6 0"/></svg><span className="bdg" id="bellBadge" hidden>0</span></button>
            <div className="ncenter" id="ncenter" role="dialog" aria-label="Benachrichtigungen" aria-hidden="true">
              <div className="nc-h"><b>Benachrichtigungen</b><button className="nc-clear" id="ncClear" type="button">Alle löschen</button></div>
              <div className="nc-list" id="ncList"></div>
              <div className="nc-f" id="ncFoot"></div>
            </div>
          </div>
          <div className="acct">
            <button className="acct-btn" id="acctBtn" type="button" aria-haspopup="menu" aria-expanded="false"><span className="av" id="acctAv">?</span><span id="acctName">Wer bist du?</span><span className="sdot" id="acctDot"></span></button>
            <div className="acct-menu" id="acctMenu" role="menu" aria-hidden="true">
              <div className="acct-h">Wer lernt gerade?</div>
              <div id="acctList"></div>
              <p className="acct-s" id="acctSync">Gespeichert auf diesem Gerät.</p>
            </div>
          </div>
        </div>
      </header>
      <nav className="strip" id="strip" aria-label="Bereiche"></nav>

      <div className="picker" id="picker" hidden>
        <div className="picker-card" role="dialog" aria-modal="true" aria-labelledby="pickTitle" id="pickBody"></div>
      </div>
      <div className="toast" id="toast" role="status" aria-live="polite" hidden></div>
      <button className="ntoast" id="ntoast" type="button" hidden></button>
      <div className="shell">
        <aside className="rail" id="rail" aria-label="Navigation"></aside>
        <main id="main"></main>
      </div>

      <button className="fab" id="fab" type="button" aria-haspopup="dialog"><svg viewBox="0 0 26 16" aria-hidden="true"><path d="M1 8 C 5 -2, 8 -2, 13 8 S 21 18, 25 8" fill="none" strokeWidth="2.2" strokeLinecap="round"/></svg>Frag die KI</button>
      <button className="calc-fab" id="calcFab" type="button" aria-label="Taschenrechner öffnen" title="Taschenrechner"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="2.5" width="14" height="19" rx="3.2"/><path d="M8.5 7.2h7M8.6 11.6h.01M12 11.6h.01M15.4 11.6h.01M8.6 15h.01M12 15h.01M15.4 15h.01M8.6 18.4h.01M12 18.4h.01M15.4 18.4h.01"/></svg></button>
      <div className="calc" id="calcPanel" role="dialog" aria-label="Taschenrechner" aria-hidden="true">
        <header>
          <div className="seg" id="calcSeg" role="group" aria-label="Modus"><button type="button" data-mode="rechner">Rechner</button><button type="button" data-mode="formeln">Formeln</button></div>
          <button className="c-angle" id="cAngle" type="button" title="Winkelmodus umschalten (RAD/DEG)">RAD</button>
          <button className="hb" id="calcAiBtn" type="button" title="KI-Tutor daneben öffnen" aria-label="KI-Tutor"><svg viewBox="0 0 26 16" aria-hidden="true"><path d="M1 8 C 5 -2, 8 -2, 13 8 S 21 18, 25 8"/></svg></button>
          <button className="x" id="calcClose" type="button" aria-label="Schließen">×</button>
        </header>
        <div className="c-body" id="cRechner">
          <div className="c-hist" id="cHist"></div>
          <div className="c-disp"><input id="cIn" type="text" autoComplete="off" autoCapitalize="off" spellCheck={false} placeholder="0" aria-label="Rechnung" /><div className="c-prev" id="cPrev" aria-live="polite"></div></div>
          <div className="c-keys" id="cKeys"><button type="button" className="k k-fn" data-k="sin(">sin</button><button type="button" className="k k-fn" data-k="cos(">cos</button><button type="button" className="k k-fn" data-k="tan(">tan</button><button type="button" className="k k-fn" data-k="π">π</button><button type="button" className="k k-fn" data-k="e">e</button><button type="button" className="k k-fn" data-k="asin(">sin⁻¹</button><button type="button" className="k k-fn" data-k="acos(">cos⁻¹</button><button type="button" className="k k-fn" data-k="g">g</button><button type="button" className="k k-fn" data-k="ln(">ln</button><button type="button" className="k k-fn" data-k="log(">log</button><button type="button" className="k k-op" data-k="(">(</button><button type="button" className="k k-op" data-k=")">)</button><button type="button" className="k k-op" data-k="²">x²</button><button type="button" className="k k-op" data-k="^">xʸ</button><button type="button" className="k k-op" data-k="√(">√</button><button type="button" className="k k-num" data-k="7">7</button><button type="button" className="k k-num" data-k="8">8</button><button type="button" className="k k-num" data-k="9">9</button><button type="button" className="k k-op" data-k="÷">÷</button><button type="button" className="k k-op" data-k="del">⌫</button><button type="button" className="k k-num" data-k="4">4</button><button type="button" className="k k-num" data-k="5">5</button><button type="button" className="k k-num" data-k="6">6</button><button type="button" className="k k-op" data-k="×">×</button><button type="button" className="k k-clr" data-k="C">C</button><button type="button" className="k k-num" data-k="1">1</button><button type="button" className="k k-num" data-k="2">2</button><button type="button" className="k k-num" data-k="3">3</button><button type="button" className="k k-op" data-k="−">−</button><button type="button" className="k k-op" data-k="·10^(">·10ˣ</button><button type="button" className="k k-num" data-k="0">0</button><button type="button" className="k k-num" data-k=",">,</button><button type="button" className="k k-fn" data-k="Ans">Ans</button><button type="button" className="k k-op" data-k="+">+</button><button type="button" className="k k-eq" data-k="=">=</button></div>
        </div>
        <div className="c-body c-form" id="cFormeln" hidden>
          <select id="sSel" aria-label="Formel auswählen"></select>
          <div className="s-f" id="sF"></div>
          <p className="s-hint" id="sHint"></p>
          <div className="s-vars" id="sVars"></div>
          <div className="row"><button className="cta" id="sGo" type="button">Berechnen</button><button className="btn ghost" id="sReset" type="button">Leeren</button></div>
          <div className="s-out" id="sOut" hidden></div>
        </div>
      </div>
      <div className="drawer" id="drawer" role="dialog" aria-label="KI-Tutor" aria-hidden="true">
        <header>
          <h3>KI-Tutor<span className="ctx" id="aiCtx">Schwingungen · Kapitel 13</span></h3>
          <button className="hb" id="aiCalcBtn" type="button" title="Taschenrechner daneben öffnen" aria-label="Taschenrechner"><svg viewBox="0 0 24 24" aria-hidden="true"><rect x="5" y="2.5" width="14" height="19" rx="3.2"/><path d="M8.5 7.2h7M8.6 11.6h.01M12 11.6h.01M15.4 11.6h.01M8.6 15h.01M12 15h.01M15.4 15h.01M8.6 18.4h.01M12 18.4h.01M15.4 18.4h.01"/></svg></button>
          <button className="btn ghost" id="aiClear" type="button">Neu</button>
          <button className="x" id="aiClose" type="button" aria-label="Schließen">×</button>
        </header>
        <div className="msgs" id="msgs"></div>
        <form className="composer" id="composer">
          <textarea id="aiInput" rows={1} placeholder="Frag alles zu Schwingungen …"></textarea>
          <button className="cta" id="aiSend" type="submit">Senden</button>
        </form>
      </div>
    </>
  );
}
