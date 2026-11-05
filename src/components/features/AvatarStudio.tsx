"use client";

import { useState, type ReactNode, type SetStateAction } from "react";
import {
  Download,
  Dice5,
  RotateCcw,
  Save,
  Sparkles,
} from "lucide-react";
import { SectionHeading } from "@/components/ui/SectionHeading";
import { useStoredJson } from "@/lib/storage";
import {
  AvatarPortrait,
  type AvatarAccessory,
  type AvatarCharacter,
  type AvatarConfig,
  type AvatarExpression,
  type AvatarHair,
  type AvatarOutfit,
  type AvatarScene,
  type AvatarSkin,
} from "@/components/features/AvatarPortrait";

const DEFAULT_AVATAR: AvatarConfig = {
  character: "girl",
  skin: "honey",
  hair: "long",
  hairColor: "#34242d",
  expression: "smile",
  outfit: "lehenga",
  outfitColor: "#ba3e62",
  accessories: ["bindi", "earrings"],
  scene: "palace",
};

function isValue<T extends string>(
  value: unknown,
  values: readonly T[],
): value is T {
  return typeof value === "string" && values.includes(value as T);
}

function normalizeAvatarConfig(value: unknown): AvatarConfig {
  const saved =
    typeof value === "object" && value !== null
      ? (value as Record<string, unknown>)
      : {};
  const characters: AvatarCharacter[] = ["boy", "girl", "neutral"];
  const skins: AvatarSkin[] = ["porcelain", "honey", "almond", "umber"];
  const hairstyles: AvatarHair[] = ["short", "long", "curly", "waves", "traditional"];
  const expressionsList: AvatarExpression[] = ["smile", "calm", "joyful"];
  const outfitsList: AvatarOutfit[] = ["kurta", "sherwani", "saree", "lehenga"];
  const accessoriesList: AvatarAccessory[] = [
    "glasses",
    "bindi",
    "earrings",
    "necklace",
    "turban",
    "bangles",
    "tilak",
  ];
  const scenesList: AvatarScene[] = ["courtyard", "palace", "fireworks", "rangoli", "gold"];
  const legacySkin: Record<string, AvatarSkin> = {
    golden: "honey",
    wheat: "almond",
    espresso: "umber",
  };
  const legacyExpression: Record<string, AvatarExpression> = {
    neutral: "calm",
    happy: "joyful",
  };

  const character = saved.character ?? saved.gender;
  const hair = saved.hair === "straight" ? "waves" : saved.hair;
  const outfit = saved.outfit === "festive" ? "kurta" : saved.outfit;
  const oldAccessories = Array.isArray(saved.accessories)
    ? saved.accessories
    : [saved.accessory];
  const accessories = oldAccessories.filter((item): item is AvatarAccessory =>
    isValue(item, accessoriesList),
  );
  const hasSavedAccessories =
    Array.isArray(saved.accessories) ||
    saved.accessory === "none" ||
    isValue(saved.accessory, accessoriesList);
  const skin =
    typeof saved.skin === "string" && legacySkin[saved.skin]
      ? legacySkin[saved.skin]
      : saved.skin;
  const expression =
    typeof (saved.expression ?? saved.face) === "string"
      ? legacyExpression[String(saved.expression ?? saved.face)] ??
        (saved.expression ?? saved.face)
      : undefined;
  const scene = saved.scene ?? saved.background;

  return {
    character: isValue(character, characters) ? character : DEFAULT_AVATAR.character,
    skin: isValue(skin, skins) ? skin : DEFAULT_AVATAR.skin,
    hair: isValue(hair, hairstyles) ? hair : DEFAULT_AVATAR.hair,
    hairColor:
      typeof saved.hairColor === "string" && /^#[\da-f]{6}$/i.test(saved.hairColor)
        ? saved.hairColor
        : DEFAULT_AVATAR.hairColor,
    expression: isValue(expression, expressionsList)
      ? expression
      : DEFAULT_AVATAR.expression,
    outfit: isValue(outfit, outfitsList) ? outfit : DEFAULT_AVATAR.outfit,
    outfitColor:
      typeof saved.outfitColor === "string" && /^#[\da-f]{6}$/i.test(saved.outfitColor)
        ? saved.outfitColor
        : DEFAULT_AVATAR.outfitColor,
    accessories: hasSavedAccessories ? accessories : DEFAULT_AVATAR.accessories,
    scene: isValue(scene, scenesList) ? scene : DEFAULT_AVATAR.scene,
  };
}

const categories = [
  { id: "character", label: "Character" },
  { id: "face", label: "Face" },
  { id: "hair", label: "Hair" },
  { id: "outfit", label: "Outfit" },
  { id: "accessories", label: "Accessories" },
  { id: "background", label: "Background" },
] as const;

type Category = (typeof categories)[number]["id"];

const skinOptions: { label: string; value: AvatarSkin; color: string }[] = [
  { label: "Porcelain", value: "porcelain", color: "#f2c9a9" },
  { label: "Honey", value: "honey", color: "#dca273" },
  { label: "Almond", value: "almond", color: "#b87950" },
  { label: "Umber", value: "umber", color: "#754632" },
];

const hairOptions: { label: string; value: AvatarHair }[] = [
  { label: "Short", value: "short" },
  { label: "Long", value: "long" },
  { label: "Curly", value: "curly" },
  { label: "Soft waves", value: "waves" },
  { label: "Traditional", value: "traditional" },
];

const hairColors = [
  { label: "Espresso", value: "#34242d" },
  { label: "Chestnut", value: "#6c4033" },
  { label: "Copper", value: "#9b5135" },
  { label: "Saffron", value: "#bc713a" },
  { label: "Onyx", value: "#201d28" },
];

const expressions: { label: string; value: AvatarExpression }[] = [
  { label: "Smile", value: "smile" },
  { label: "Calm", value: "calm" },
  { label: "Joyful", value: "joyful" },
];

const outfits: { label: string; value: AvatarOutfit }[] = [
  { label: "Kurta", value: "kurta" },
  { label: "Sherwani", value: "sherwani" },
  { label: "Saree", value: "saree" },
  { label: "Lehenga", value: "lehenga" },
];

const outfitColors = [
  { label: "Ruby", value: "#ba3e62" },
  { label: "Saffron", value: "#d58231" },
  { label: "Peacock", value: "#237c7b" },
  { label: "Royal blue", value: "#405a9c" },
  { label: "Lotus", value: "#a84d83" },
  { label: "Emerald", value: "#328064" },
  { label: "Ivory", value: "#d5b981" },
];

const accessoryOptions: { label: string; value: AvatarAccessory }[] = [
  { label: "Glasses", value: "glasses" },
  { label: "Bindi", value: "bindi" },
  { label: "Earrings", value: "earrings" },
  { label: "Necklace", value: "necklace" },
  { label: "Turban", value: "turban" },
  { label: "Bangles", value: "bangles" },
  { label: "Tilak", value: "tilak" },
];

const scenes: { label: string; value: AvatarScene; colors: [string, string] }[] = [
  { label: "Courtyard", value: "courtyard", colors: ["#151d35", "#43223b"] },
  { label: "Palace", value: "palace", colors: ["#172b49", "#35152e"] },
  { label: "Fireworks", value: "fireworks", colors: ["#10172d", "#35152e"] },
  { label: "Rangoli", value: "rangoli", colors: ["#241b3d", "#45305f"] },
  { label: "Golden hour", value: "gold", colors: ["#744333", "#6a292e"] },
];

function ChoiceButton({
  label,
  selected,
  onClick,
}: {
  label: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      aria-pressed={selected}
      onClick={onClick}
      className={`rounded-xl border px-3 py-2.5 text-sm font-semibold transition-colors ${
        selected
          ? "border-gold/80 bg-gold/15 text-gold shadow-[0_0_20px_rgba(232,189,99,.09)]"
          : "border-white/10 bg-white/[0.035] text-amber-100/75 hover:border-gold/40 hover:bg-white/[0.07]"
      }`}
    >
      {label}
    </button>
  );
}

function SwatchButton({
  label,
  color,
  selected,
  onClick,
}: {
  label: string;
  color: string;
  selected: boolean;
  onClick: () => void;
}) {
  return (
    <button
      type="button"
      title={label}
      aria-label={label}
      aria-pressed={selected}
      onClick={onClick}
      className={`flex h-12 w-12 items-center justify-center rounded-full border transition ${
        selected ? "border-gold ring-2 ring-gold/40 ring-offset-2 ring-offset-[#1c0815]" : "border-white/20 hover:border-gold/60"
      }`}
    >
      <span className="h-8 w-8 rounded-full shadow-inner" style={{ backgroundColor: color }} />
    </button>
  );
}

function OptionSection({
  title,
  help,
  children,
}: {
  title: string;
  help?: string;
  children: ReactNode;
}) {
  return (
    <section className="space-y-3">
      <div>
        <h3 className="text-sm font-bold text-amber-50">{title}</h3>
        {help && <p className="mt-1 text-xs leading-5 text-amber-100/55">{help}</p>}
      </div>
      {children}
    </section>
  );
}

export function AvatarStudio() {
  const [storedConfig, setStoredConfig] = useStoredJson<unknown>(
    "diya-avatar-config",
    DEFAULT_AVATAR,
  );
  const config = normalizeAvatarConfig(storedConfig);
  const setConfig = (next: SetStateAction<AvatarConfig>) => {
    setStoredConfig((previous: unknown) => {
      const current = normalizeAvatarConfig(previous);
      return typeof next === "function" ? next(current) : next;
    });
  };
  const [category, setCategory] = useState<Category>("character");
  const [transparentBackground, setTransparentBackground] = useState(false);
  const [status, setStatus] = useState<string | null>(null);

  const updateConfig = <K extends keyof AvatarConfig>(
    key: K,
    value: AvatarConfig[K],
  ) => {
    setConfig((previous) => ({ ...previous, [key]: value }));
    setStatus(null);
  };

  const randomizeAvatar = () => {
    const pick = <T,>(values: readonly T[]) =>
      values[Math.floor(Math.random() * values.length)];
    const characters: AvatarCharacter[] = ["boy", "girl", "neutral"];
    const skins: AvatarSkin[] = ["porcelain", "honey", "almond", "umber"];
    const hairStyles: AvatarHair[] = ["short", "long", "curly", "waves", "traditional"];
    const expressionsList: AvatarExpression[] = ["smile", "calm", "joyful"];
    const outfitList: AvatarOutfit[] = ["kurta", "sherwani", "saree", "lehenga"];
    const accessoryList: AvatarAccessory[] = [
      "bindi",
      "earrings",
      "necklace",
      "turban",
      "bangles",
      "tilak",
      "glasses",
    ];

    setConfig({
      character: pick(characters),
      skin: pick(skins),
      hair: pick(hairStyles),
      hairColor: pick(hairColors).value,
      expression: pick(expressionsList),
      outfit: pick(outfitList),
      outfitColor: pick(outfitColors).value,
      accessories: [pick(accessoryList)],
      scene: pick(scenes).value,
    });
    setStatus(null);
  };

  const resetAvatar = () => {
    setConfig(DEFAULT_AVATAR);
    setStatus(null);
  };

  const saveAvatar = () => {
    try {
      window.localStorage.setItem("diya-avatar-config", JSON.stringify(config));
      setStatus("Your festive look is saved on this device.");
    } catch (saveError) {
      console.error("Unable to save the Diwali avatar.", saveError);
      setStatus("This browser could not save the avatar. You can still download it.");
    }
  };

  const downloadAvatar = async () => {
    const svg = document.getElementById("diya-avatar-svg");
    if (!(svg instanceof SVGSVGElement)) {
      setStatus("The avatar preview is not ready to export.");
      return;
    }

    const serialized = new XMLSerializer().serializeToString(svg);
    const svgUrl = URL.createObjectURL(
      new Blob([serialized], { type: "image/svg+xml;charset=utf-8" }),
    );
    const image = new Image();

    try {
      await new Promise<void>((resolve, reject) => {
        image.onload = () => resolve();
        image.onerror = () => reject(new Error("Could not render the avatar SVG."));
        image.src = svgUrl;
      });

      const canvas = document.createElement("canvas");
      canvas.width = 840;
      canvas.height = 1000;
      const context = canvas.getContext("2d");
      if (!context) throw new Error("Canvas export is unavailable.");

      if (!transparentBackground) {
        context.fillStyle = "#1c0818";
        context.fillRect(0, 0, canvas.width, canvas.height);
      }
      context.drawImage(image, 0, 0, canvas.width, canvas.height);

      const png = await new Promise<Blob>((resolve, reject) => {
        canvas.toBlob((blob) => {
          if (blob) resolve(blob);
          else reject(new Error("Could not encode the avatar as PNG."));
        }, "image/png");
      });

      const pngUrl = URL.createObjectURL(png);
      const link = document.createElement("a");
      link.href = pngUrl;
      link.download = "diwali-avatar.png";
      link.click();
      window.setTimeout(() => URL.revokeObjectURL(pngUrl), 1000);
      setStatus("Your avatar PNG is ready.");
    } catch (exportError) {
      console.error("Unable to export Diwali avatar.", exportError);
      setStatus("The avatar could not be exported. Please try again.");
    } finally {
      URL.revokeObjectURL(svgUrl);
    }
  };

  const toggleAccessory = (accessory: AvatarAccessory) => {
    const accessories = config.accessories.includes(accessory)
      ? config.accessories.filter((current) => current !== accessory)
      : [...config.accessories, accessory];
    updateConfig("accessories", accessories);
  };

  const renderCategory = () => {
    switch (category) {
      case "character":
        return (
          <div className="space-y-5">
            <OptionSection title="Choose your character" help="Each character shares the same carefully aligned illustration layers.">
              <div className="grid grid-cols-3 gap-2">
                {([
                  { label: "Boy", value: "boy" },
                  { label: "Girl", value: "girl" },
                  { label: "Neutral", value: "neutral" },
                ] as const).map((character) => (
                  <ChoiceButton
                    key={character.value}
                    label={character.label}
                    selected={config.character === character.value}
                    onClick={() =>
                      setConfig((previous) => ({
                        ...previous,
                        character: character.value,
                        hair:
                          character.value === "boy"
                            ? "short"
                            : character.value === "girl"
                              ? "long"
                              : "curly",
                      }))
                    }
                  />
                ))}
              </div>
            </OptionSection>
            <OptionSection title="Skin tone">
              <div className="flex flex-wrap gap-4">
                {skinOptions.map((skin) => (
                  <SwatchButton
                    key={skin.value}
                    label={skin.label}
                    color={skin.color}
                    selected={config.skin === skin.value}
                    onClick={() => updateConfig("skin", skin.value)}
                  />
                ))}
              </div>
            </OptionSection>
          </div>
        );
      case "face":
        return (
          <div className="space-y-5">
            <OptionSection title="Expression">
              <div className="flex flex-wrap gap-2">
                {expressions.map((expression) => (
                  <ChoiceButton
                    key={expression.value}
                    label={expression.label}
                    selected={config.expression === expression.value}
                    onClick={() => updateConfig("expression", expression.value)}
                  />
                ))}
              </div>
            </OptionSection>
            <OptionSection title="Skin tone">
              <div className="flex flex-wrap gap-4">
                {skinOptions.map((skin) => (
                  <SwatchButton
                    key={skin.value}
                    label={skin.label}
                    color={skin.color}
                    selected={config.skin === skin.value}
                    onClick={() => updateConfig("skin", skin.value)}
                  />
                ))}
              </div>
            </OptionSection>
          </div>
        );
      case "hair":
        return (
          <div className="space-y-5">
            <OptionSection title="Hairstyle">
              <div className="flex flex-wrap gap-2">
                {hairOptions.map((hair) => (
                  <ChoiceButton
                    key={hair.value}
                    label={hair.label}
                    selected={config.hair === hair.value}
                    onClick={() => updateConfig("hair", hair.value)}
                  />
                ))}
              </div>
            </OptionSection>
            <OptionSection title="Hair colour">
              <div className="flex flex-wrap gap-4">
                {hairColors.map((color) => (
                  <SwatchButton
                    key={color.value}
                    label={color.label}
                    color={color.value}
                    selected={config.hairColor === color.value}
                    onClick={() => updateConfig("hairColor", color.value)}
                  />
                ))}
              </div>
            </OptionSection>
          </div>
        );
      case "outfit":
        return (
          <div className="space-y-5">
            <OptionSection title="Festive outfit">
              <div className="grid grid-cols-2 gap-2">
                {outfits.map((outfit) => (
                  <ChoiceButton
                    key={outfit.value}
                    label={outfit.label}
                    selected={config.outfit === outfit.value}
                    onClick={() => updateConfig("outfit", outfit.value)}
                  />
                ))}
              </div>
            </OptionSection>
            <OptionSection title="Outfit colour">
              <div className="flex flex-wrap gap-4">
                {outfitColors.map((color) => (
                  <SwatchButton
                    key={color.value}
                    label={color.label}
                    color={color.value}
                    selected={config.outfitColor === color.value}
                    onClick={() => updateConfig("outfitColor", color.value)}
                  />
                ))}
              </div>
            </OptionSection>
          </div>
        );
      case "accessories":
        return (
          <OptionSection title="Finishing touches" help="Select any combination to layer accessories together.">
            <div className="grid grid-cols-2 gap-2">
              {accessoryOptions.map((accessory) => (
                <ChoiceButton
                  key={accessory.value}
                  label={accessory.label}
                  selected={config.accessories.includes(accessory.value)}
                  onClick={() => toggleAccessory(accessory.value)}
                />
              ))}
            </div>
          </OptionSection>
        );
      case "background":
        return (
          <OptionSection title="Choose a scene">
            <div className="grid grid-cols-2 gap-3">
              {scenes.map((scene) => (
                <button
                  key={scene.value}
                  type="button"
                  aria-pressed={config.scene === scene.value}
                  onClick={() => updateConfig("scene", scene.value)}
                  className={`overflow-hidden rounded-2xl border text-left transition ${
                    config.scene === scene.value ? "border-gold ring-1 ring-gold/50" : "border-white/10 hover:border-gold/40"
                  }`}
                >
                  <span className="block h-16" style={{ background: `linear-gradient(145deg, ${scene.colors[0]}, ${scene.colors[1]})` }} />
                  <span className="block px-3 py-2 text-xs font-semibold text-amber-50">{scene.label}</span>
                </button>
              ))}
            </div>
          </OptionSection>
        );
    }
  };

  return (
    <section id="avatar" className="mx-auto max-w-6xl px-4 py-16 sm:py-20">
      <SectionHeading
        kicker="Create your festive identity"
        title="Design Your Diwali Avatar"
        lead="Build a festive look from a coordinated set of character, clothing and accessory layers."
      />

      <div className="mt-10 grid items-start gap-6 lg:grid-cols-[minmax(0,1.05fr)_minmax(360px,.95fr)]">
        <div className="festive-card overflow-hidden rounded-[2rem] p-3 sm:p-5">
          <div className="mb-3 flex items-center justify-between gap-3 px-1">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-gold/75">Character preview</p>
              <p className="mt-1 text-sm capitalize text-amber-100/70">{config.character} · {config.outfit}</p>
            </div>
            <label className="flex cursor-pointer items-center gap-2 text-xs text-amber-100/65">
              <input
                type="checkbox"
                checked={transparentBackground}
                onChange={(event) => setTransparentBackground(event.target.checked)}
                className="h-4 w-4 accent-amber-400"
              />
              Transparent export
            </label>
          </div>
          <div className="mx-auto aspect-[420/500] w-full max-w-[500px] overflow-hidden rounded-[1.65rem] border border-gold/15 bg-[#1a0b1d] shadow-[0_24px_70px_rgba(0,0,0,.4)]">
            <AvatarPortrait config={config} transparent={transparentBackground} />
          </div>
          <div className="mt-4 flex flex-wrap gap-2">
            <button type="button" className="btn-gold" onClick={() => void downloadAvatar()}>
              <Download size={16} />
              Download PNG
            </button>
            <button type="button" className="btn-ghost" onClick={saveAvatar}>
              <Save size={16} />
              Save look
            </button>
          </div>
          {status && <p role="status" className="mt-3 text-sm text-amber-100/75">{status}</p>}
        </div>

        <div className="festive-card overflow-hidden rounded-[2rem] p-4 sm:p-6">
          <div className="mb-5 flex items-center justify-between gap-3">
            <div>
              <p className="text-[0.65rem] font-bold uppercase tracking-[0.24em] text-gold/75">Customize</p>
              <p className="mt-1 text-sm text-amber-100/60">Choose a detail to edit</p>
            </div>
            <div className="flex gap-2">
              <button type="button" className="btn-ghost px-3 py-2" onClick={randomizeAvatar} title="Randomise avatar">
                <Dice5 size={16} />
                <span className="hidden sm:inline">Randomise</span>
              </button>
              <button type="button" className="btn-ghost px-3 py-2" onClick={resetAvatar} title="Reset avatar">
                <RotateCcw size={16} />
                <span className="hidden sm:inline">Reset</span>
              </button>
            </div>
          </div>

          <div
            role="tablist"
            aria-label="Avatar customisation categories"
            className="-mx-1 mb-5 flex gap-2 overflow-x-auto px-1 pb-2"
          >
            {categories.map((item) => (
              <button
                key={item.id}
                id={`avatar-tab-${item.id}`}
                type="button"
                role="tab"
                aria-selected={category === item.id}
                aria-controls="avatar-options"
                onClick={() => setCategory(item.id)}
                className={`shrink-0 rounded-full border px-3 py-2 text-xs font-semibold transition ${
                  category === item.id
                    ? "border-gold/60 bg-gold/15 text-gold"
                    : "border-white/10 bg-white/[0.035] text-amber-100/60 hover:text-amber-50"
                }`}
              >
                {item.label}
              </button>
            ))}
          </div>

          <div
            id="avatar-options"
            role="tabpanel"
            aria-labelledby={`avatar-tab-${category}`}
            className="min-h-64"
          >
            {renderCategory()}
          </div>

          <div className="mt-6 flex items-center gap-2 border-t border-white/10 pt-4 text-xs text-amber-100/50">
            <Sparkles size={14} className="text-gold/80" />
            Your avatar settings are stored only in this browser.
          </div>
        </div>
      </div>
    </section>
  );
}
