export type AvatarCharacter = "boy" | "girl" | "neutral";
export type AvatarSkin = "porcelain" | "honey" | "almond" | "umber";
export type AvatarHair = "short" | "long" | "curly" | "waves" | "traditional";
export type AvatarExpression = "smile" | "calm" | "joyful";
export type AvatarOutfit = "kurta" | "sherwani" | "saree" | "lehenga";
export type AvatarAccessory =
  | "none"
  | "glasses"
  | "bindi"
  | "earrings"
  | "necklace"
  | "turban"
  | "bangles"
  | "tilak";
export type AvatarScene = "courtyard" | "palace" | "fireworks" | "rangoli" | "gold";

export type AvatarConfig = {
  character: AvatarCharacter;
  skin: AvatarSkin;
  hair: AvatarHair;
  hairColor: string;
  expression: AvatarExpression;
  outfit: AvatarOutfit;
  outfitColor: string;
  accessories: AvatarAccessory[];
  scene: AvatarScene;
};

const skinColors: Record<AvatarSkin, { base: string; light: string; shade: string }> = {
  porcelain: { base: "#f2c9a9", light: "#ffddc3", shade: "#c78c70" },
  honey: { base: "#dca273", light: "#efbd8d", shade: "#a66b4b" },
  almond: { base: "#b87950", light: "#d39468", shade: "#80503b" },
  umber: { base: "#754632", light: "#986147", shade: "#4e3028" },
};

function FaceShape({ character }: { character: AvatarCharacter }) {
  if (character === "boy") {
    return <path d="M124 147Q124 82 210 78Q296 82 296 147L287 208Q279 252 245 269Q227 280 210 281Q193 280 175 269Q141 252 133 208Z" />;
  }
  if (character === "girl") {
    return <path d="M124 149Q124 78 210 76Q296 78 296 149L287 218Q278 267 210 279Q142 267 133 218Z" />;
  }
  return <path d="M120 151Q120 78 210 78Q300 78 300 151L288 211Q280 262 210 281Q140 262 132 211Z" />;
}

function HairBack({ hair, color }: { hair: AvatarHair; color: string }) {
  if (hair === "long" || hair === "waves") {
    return (
      <path
        d={hair === "long"
          ? "M119 150Q112 75 210 63Q309 73 301 154L307 253Q297 287 276 278L278 193L143 193L143 278Q119 289 111 255Z"
          : "M118 151Q112 72 210 64Q310 73 302 157L309 240Q292 267 276 250Q286 219 268 194L145 194Q134 219 144 251Q124 269 109 242Z"}
        fill={color}
        stroke="#573832"
        strokeWidth="5"
        strokeLinejoin="round"
      />
    );
  }
  if (hair === "traditional") {
    return (
      <>
        <path d="M123 150Q117 74 210 63Q304 73 298 151L286 215L270 174L147 174L136 215Z" fill={color} stroke="#573832" strokeWidth="5" strokeLinejoin="round" />
        <circle cx="210" cy="73" r="32" fill={color} stroke="#573832" strokeWidth="5" />
      </>
    );
  }
  return null;
}

function HairFront({ hair, color }: { hair: AvatarHair; color: string }) {
  if (hair === "long") {
    return (
      <path
        d="M120 151Q115 78 210 64Q305 75 300 153L286 171Q279 145 258 127Q235 143 207 137Q169 128 140 157L133 177Z"
        fill={color}
        stroke="#573832"
        strokeWidth="5"
        strokeLinejoin="round"
      />
    );
  }
  if (hair === "short") {
    return (
      <path
        d="M120 151Q115 79 210 64Q304 75 300 153L285 168Q278 138 258 123Q226 145 179 133Q152 129 135 151L132 169Z"
        fill={color}
        stroke="#573832"
        strokeWidth="5"
        strokeLinejoin="round"
      />
    );
  }
  if (hair === "curly") {
    return (
      <path
        d="M119 157Q106 136 120 114Q112 91 135 78Q143 55 171 67Q188 46 209 65Q232 48 249 68Q279 57 285 83Q312 94 297 122Q306 140 298 160L284 173Q276 142 259 126Q231 144 194 135Q159 127 136 157L132 175Z"
        fill={color}
        stroke="#573832"
        strokeWidth="5"
        strokeLinejoin="round"
      />
    );
  }
  if (hair === "waves") {
    return (
      <path
        d="M120 153Q113 78 210 64Q307 74 300 157L285 166Q275 140 257 126Q232 145 205 136Q170 126 145 154L137 178L128 204L116 192Z"
        fill={color}
        stroke="#573832"
        strokeWidth="5"
        strokeLinejoin="round"
      />
    );
  }
  if (hair === "traditional") {
    return (
      <path
        d="M122 152Q115 79 210 64Q304 74 298 153L284 170Q278 140 254 122Q232 139 209 137Q175 137 142 161L133 177Z"
        fill={color}
        stroke="#573832"
        strokeWidth="5"
        strokeLinejoin="round"
      />
    );
  }
  return null;
}

function Clothing({
  outfit,
  color,
  skin,
  accessory,
}: {
  outfit: AvatarOutfit;
  color: string;
  skin: string;
  accessory: AvatarAccessory[];
}) {
  const isSkirt = outfit === "saree" || outfit === "lehenga";
  return (
    <g stroke="#56323b" strokeWidth="5" strokeLinejoin="round" strokeLinecap="round">
      <path d="M175 239L175 280Q210 304 245 280L245 239Z" fill={skin} />
      {isSkirt ? (
        <path d="M153 286Q168 270 183 275L210 294L237 275Q252 270 267 286L312 444Q210 466 108 444Z" fill={color} />
      ) : (
        <path d="M151 280Q165 270 180 272L210 296L240 272Q256 270 269 280L298 437Q210 453 122 437Z" fill={color} />
      )}
      <path d="M151 282L123 298Q103 307 92 333L72 383Q69 399 83 405Q96 411 104 396L136 345L149 337Z" fill={skin} />
      <path d="M269 282L297 298Q317 307 328 333L348 383Q351 399 337 405Q324 411 316 396L284 345L271 337Z" fill={skin} />
      <path d="M145 290Q169 307 210 326Q251 307 275 290" fill="none" stroke="#f8d997" strokeWidth="5" />
      <path d="M140 429Q210 443 280 429" fill="none" stroke="#f1ca77" strokeWidth="4" />
      {outfit === "sherwani" && (
        <>
          <path d="M210 299L210 431" fill="none" stroke="#f8db9c" strokeWidth="4" />
          {[324, 348, 372, 396].map((y) => <circle key={y} cx="210" cy={y} r="4" fill="#ffe5a0" stroke="none" />)}
          <path d="M164 338L193 350M256 338L227 350" fill="none" stroke="#f8db9c" strokeWidth="4" />
        </>
      )}
      {outfit === "kurta" && (
        <>
          <path d="M210 303L210 361" fill="none" stroke="#f8db9c" strokeWidth="4" />
          <circle cx="210" cy="327" r="4" fill="#ffe5a0" stroke="none" />
          <circle cx="210" cy="347" r="4" fill="#ffe5a0" stroke="none" />
        </>
      )}
      {outfit === "saree" && (
        <>
          <path d="M236 282Q268 299 278 333L249 359L218 323L185 305" fill="#f3c567" stroke="#56323b" strokeWidth="4" />
          <path d="M248 300L266 325M238 309L257 335M229 317L248 343" fill="none" stroke="#fff0bd" strokeWidth="3" />
        </>
      )}
      {outfit === "lehenga" && (
        <>
          <path d="M147 326Q210 344 273 326" fill="none" stroke="#f2d07f" strokeWidth="4" />
          <path d="M133 383Q210 405 287 383" fill="none" stroke="#f2d07f" strokeWidth="3" />
          {[160, 185, 210, 235, 260].map((x) => <path key={x} d={`M${x} 351l4 7-4 7-4-7z`} fill="#fce4a0" stroke="none" />)}
        </>
      )}
      {accessory.includes("bangles") && (
        <>
          <path d="M77 391Q87 398 98 392M82 400Q92 407 103 400" fill="none" stroke="#e9bd57" strokeWidth="5" />
          <path d="M322 392Q333 398 343 391M317 400Q328 407 338 400" fill="none" stroke="#e9bd57" strokeWidth="5" />
        </>
      )}
      {accessory.includes("necklace") && (
        <path d="M178 276Q210 313 242 276" fill="none" stroke="#e9bd57" strokeWidth="6" />
      )}
    </g>
  );
}

export function AvatarPortrait({
  config,
  transparent = false,
}: {
  config: AvatarConfig;
  transparent?: boolean;
}) {
  const skin = skinColors[config.skin];
  const showBindi = config.accessories.includes("bindi");
  const showTilak = config.accessories.includes("tilak");
  const showGlasses = config.accessories.includes("glasses");
  const showEarrings = config.accessories.includes("earrings");
  const showTurban = config.accessories.includes("turban");

  return (
    <svg
      id="diya-avatar-svg"
      xmlns="http://www.w3.org/2000/svg"
      viewBox="0 0 420 500"
      role="img"
      aria-label={`Festive ${config.character} character in a ${config.outfit}`}
      className="block h-full w-full"
    >
      <defs>
        <linearGradient id="avatar-sky" x1="0" x2="0" y1="0" y2="1">
          <stop offset="0" stopColor={config.scene === "gold" ? "#744333" : config.scene === "palace" ? "#172b49" : "#10172d"} />
          <stop offset="1" stopColor={config.scene === "courtyard" ? "#43223b" : config.scene === "rangoli" ? "#45305f" : "#35152e"} />
        </linearGradient>
        <linearGradient id="avatar-skin" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={skin.light} />
          <stop offset="0.57" stopColor={skin.base} />
          <stop offset="1" stopColor={skin.shade} />
        </linearGradient>
        <linearGradient id="avatar-fabric" x1="0" x2="1" y1="0" y2="1">
          <stop offset="0" stopColor={config.outfitColor} />
          <stop offset="0.52" stopColor={config.outfitColor} />
          <stop offset="1" stopColor="#2b1428" stopOpacity=".24" />
        </linearGradient>
        <radialGradient id="avatar-halo">
          <stop offset="0" stopColor="#ffe7a4" stopOpacity=".68" />
          <stop offset="1" stopColor="#ffc96b" stopOpacity="0" />
        </radialGradient>
        <filter id="avatar-shadow" x="-30%" y="-30%" width="160%" height="170%">
          <feDropShadow dx="0" dy="12" stdDeviation="10" floodColor="#100611" floodOpacity=".42" />
        </filter>
        <clipPath id="avatar-scene-clip">
          <rect width="420" height="500" rx="34" />
        </clipPath>
      </defs>

      <g clipPath="url(#avatar-scene-clip)">
        {!transparent && <rect width="420" height="500" fill="url(#avatar-sky)" />}
        {!transparent && <circle cx="210" cy="213" r="180" fill="url(#avatar-halo)" />}
        {!transparent && config.scene === "palace" && (
          <g fill="none" stroke="#d6b66e" strokeOpacity=".33" strokeWidth="8">
            <path d="M32 345V183Q32 92 120 92H300Q388 92 388 183V345" />
            <path d="M67 345V194Q67 130 127 130H293Q353 130 353 194V345" />
            <path d="M18 346H402M76 302H344" />
            <path d="M83 183V162M337 183V162M200 119V91M210 93V65" />
          </g>
        )}
        {!transparent && config.scene === "fireworks" && (
          <g fill="none" strokeWidth="3" opacity=".8">
            <path d="M67 117v-38m0 38l-27-27m27 27l28-28m-28 28l-37 5m37-5l37 7" stroke="#f8d36e" />
            <path d="M340 161v-32m0 32l-25-24m25 24l23-26m-23 26l-31 6m31-6l31 7" stroke="#d59af2" />
            <circle cx="67" cy="117" r="4" fill="#f8d36e" /><circle cx="340" cy="161" r="4" fill="#d59af2" />
          </g>
        )}
        {!transparent && config.scene === "courtyard" && (
          <g fill="#ffc76b" opacity=".7">
            <circle cx="64" cy="169" r="5" /><circle cx="352" cy="113" r="4" /><circle cx="329" cy="229" r="5" />
            <path d="M44 414q22-18 44 0t44 0M291 414q22-18 44 0t44 0" fill="none" stroke="#ffc76b" strokeWidth="3" />
          </g>
        )}
        {!transparent && config.scene === "rangoli" && (
          <g transform="translate(210 435)" fill="none" strokeWidth="5" opacity=".75">
            <circle r="49" stroke="#eec15f" /><circle r="35" stroke="#e66f68" />
            <ellipse rx="25" ry="48" stroke="#57c3b0" /><ellipse rx="25" ry="48" stroke="#a886ef" transform="rotate(60)" />
            <circle r="8" fill="#f3cf75" stroke="none" />
          </g>
        )}
        {!transparent && config.scene === "gold" && <rect y="380" width="420" height="120" fill="#efb95b" opacity=".14" />}
        {!transparent && <path d="M0 437Q100 421 210 438Q319 421 420 437V500H0Z" fill="#1b1024" opacity=".27" />}

        <g filter="url(#avatar-shadow)">
          <path d="M149 417L144 476Q162 486 187 479L194 421M226 421L233 479Q258 486 276 476L270 417" fill="url(#avatar-skin)" stroke="#56323b" strokeWidth="5" strokeLinejoin="round" />
          <path d="M132 475Q165 465 192 479L197 492H128Q122 485 132 475ZM228 479Q255 465 288 475Q298 485 292 492H223Z" fill="#4a2835" stroke="#56323b" strokeWidth="5" />
          <Clothing outfit={config.outfit} color={config.outfitColor} skin="url(#avatar-skin)" accessory={config.accessories} />

          <HairBack hair={config.hair} color={config.hairColor} />
          <g fill="url(#avatar-skin)" stroke="#56323b" strokeWidth="5" strokeLinejoin="round">
            <FaceShape character={config.character} />
          </g>

          {showEarrings && (
            <g fill="#eac66f" stroke="#7a522f" strokeWidth="3">
              <circle cx="128" cy="202" r="8" /><path d="M128 208v12l-7 9 7 9 7-9-7-9" />
              <circle cx="292" cy="202" r="8" /><path d="M292 208v12l-7 9 7 9 7-9-7-9" />
            </g>
          )}

          <HairFront hair={config.hair} color={config.hairColor} />
          {showTurban && (
            <g stroke="#573832" strokeWidth="5" strokeLinejoin="round">
              <path d="M129 111Q144 76 210 74Q276 76 291 111L279 131H141Z" fill="#bd493d" />
              <path d="M136 109Q210 125 284 109" fill="none" stroke="#f4d28c" strokeWidth="7" />
              <path d="M192 80Q210 61 228 80L219 101H201Z" fill="#e8bd63" />
            </g>
          )}

          <g fill="none" stroke="#513530" strokeWidth="4" strokeLinecap="round">
            <path d="M164 173Q178 163 191 172" />
            <path d="M229 172Q242 163 256 173" />
          </g>
          <g fill="#38272c">
            <ellipse cx="178" cy="185" rx="5.6" ry="8" />
            <ellipse cx="242" cy="185" rx="5.6" ry="8" />
          </g>
          <g fill="#fff3dc">
            <circle cx="180" cy="182" r="1.8" />
            <circle cx="244" cy="182" r="1.8" />
          </g>
          <path d="M210 185Q205 205 210 210Q215 213 220 209" fill="none" stroke={skin.shade} strokeWidth="4" strokeLinecap="round" />
          <path d="M199 215Q210 221 221 215" fill="none" stroke={skin.shade} strokeWidth="3" strokeLinecap="round" opacity=".65" />
          {config.expression === "calm" ? (
            <path d="M194 237Q210 240 226 237" fill="none" stroke="#784347" strokeWidth="4" strokeLinecap="round" />
          ) : config.expression === "joyful" ? (
            <path d="M192 231Q210 258 228 231Q210 243 192 231Z" fill="#9d4848" stroke="#784347" strokeWidth="3" strokeLinejoin="round" />
          ) : (
            <path d="M194 234Q210 250 226 234" fill="none" stroke="#784347" strokeWidth="4" strokeLinecap="round" />
          )}
          <path d="M147 220Q155 233 168 230M273 220Q265 233 252 230" fill="none" stroke="#d97871" strokeWidth="8" strokeLinecap="round" opacity=".24" />

          {showGlasses && (
            <g fill="rgba(255,255,255,.06)" stroke="#4b3843" strokeWidth="4">
              <rect x="153" y="169" width="49" height="34" rx="13" />
              <rect x="218" y="169" width="49" height="34" rx="13" />
              <path d="M202 181Q210 176 218 181M151 179L139 174M269 179L281 174" />
            </g>
          )}
          {showBindi && <circle cx="210" cy="157" r="5" fill="#bb334e" stroke="#ffe0a2" strokeWidth="2" />}
          {showTilak && (
            <g stroke="#d8473e" strokeWidth="4" strokeLinecap="round">
              <path d="M210 150v13" /><path d="M204 154h12" />
            </g>
          )}
        </g>

        {!transparent && (
          <g fill="none" stroke="#f0cd79" strokeWidth="3" opacity=".7">
            <path d="M26 32h22M37 21v22M372 32h22M383 21v22" />
            <circle cx="37" cy="32" r="4" fill="#f0cd79" /><circle cx="383" cy="32" r="4" fill="#f0cd79" />
          </g>
        )}
      </g>
    </svg>
  );
}
