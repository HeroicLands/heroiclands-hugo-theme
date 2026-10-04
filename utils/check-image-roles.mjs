/*
 * This file is part of the Heroic Lands shared Hugo theme.
 * Copyright (c) 2024-2026 Tom Rodriguez ("Toasty") — <toasty@heroiclands.org>
 *
 * This work is licensed under the GNU General Public License v3.0 (GPLv3).
 * You may copy, modify, and distribute it under the terms of that license.
 *
 * For full terms, see the LICENSE file in the project root or visit:
 * https://www.gnu.org/licenses/gpl-3.0.html
 *
 * SPDX-License-Identifier: GPL-3.0-or-later
 */

/**
 * CI guard: the website's table of what each picture role draws at must name
 * every role the content toolchain emits, and every directive that states its
 * own width must clear that table rather than be clamped by it.
 *
 * The vocabulary is read from `@heroiclands/package-build` at run time, so a
 * role added there fails this check until the stylesheet gives it a slot — the
 * alternative being a role that renders at whatever the previous one happened
 * to set, which no page shows as broken.
 *
 * What it asserts:
 *
 *   1. Some `.note-image` rule reads {@link SLOT}, so a declared table is a
 *      table the stylesheet actually sizes from.
 *   2. Every role class sets {@link SLOT}.
 *   3. Every class carrying a width of its own — a named `size=`, or the
 *      `full-width` directive — resets {@link SLOT}, because a stated width
 *      overrides a role's slot outright.
 *
 * Usage: node utils/check-image-roles.mjs   (run as part of `npm run lint`)
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import { ASSET_ROLES } from "@heroiclands/package-build/engine/asset-index";
import {
  IMAGE_CLASSES,
  IMAGE_FIGURE_CLASS,
  IMAGE_SIZES,
  roleClass,
} from "@heroiclands/package-build/engine/content-images";

/** The stylesheet holding the table. */
const SHEET = "static/css/style.css";

/** The custom property a role's slot is stated as, and read from. */
const SLOT = "--note-image-slot";

/**
 * Every style rule in a stylesheet, as a selector and the declarations under
 * it. At-rule preludes are dropped and the rules nested inside them kept, so a
 * declaration inside a media query counts exactly as one outside it.
 *
 * @param {string} css - The stylesheet source.
 * @returns {{selector: string, body: string}[]} The rules, in source order.
 */
function rules(css) {
  const clean = css.replace(/\/\*[\s\S]*?\*\//g, "");
  /** @type {string[]} */
  const preludes = [];
  /** @type {{selector: string, body: string}[]} */
  const out = [];
  let buf = "";
  for (const ch of clean) {
    if (ch === "{") {
      preludes.push(buf.trim());
      buf = "";
    } else if (ch === "}") {
      const selector = preludes.pop() ?? "";
      if (!selector.startsWith("@")) out.push({ selector, body: buf });
      buf = "";
    } else {
      buf += ch;
    }
  }
  return out;
}

/** The line a class is first named on, so an editor can jump to the table. */
function lineOf(source, className) {
  const index = source.split("\n").findIndex((l) => l.includes(`.${className}`));
  return index === -1 ? 0 : index + 1;
}

/** Diagnostics carry the fields they can know and drop the ones they cannot. */
function diag(line, message) {
  const where = line ? `${SHEET}:${line}` : SHEET;
  console.error(`${where}: error: ${message}`);
}

/** Whether any rule naming `className` declares `property`. */
function declares(styles, className, property) {
  return styles.some(
    (rule) =>
      rule.selector.includes(`.${className}`) &&
      new RegExp(`(^|[\\s;{])${property}\\s*:`).test(rule.body),
  );
}

const source = readFileSync(resolve(SHEET), "utf8");
const styles = rules(source);

/** The classes a picture carries when it states a width of its own. */
const widthClasses = [
  ...IMAGE_SIZES.filter((size) => size !== "auto").map(
    (size) => `note-image-size-${size}`,
  ),
  ...Object.values(IMAGE_CLASSES).map((spec) => spec.class),
];

const failures = [];

const readsSlot = styles.some(
  (rule) =>
    rule.selector.includes(`.${IMAGE_FIGURE_CLASS}`) &&
    rule.body.includes(`var(${SLOT}`),
);
if (!readsSlot) {
  diag(
    lineOf(source, IMAGE_FIGURE_CLASS),
    `no .${IMAGE_FIGURE_CLASS} rule reads var(${SLOT}) — a role's slot is stated and never applied`,
  );
  failures.push(IMAGE_FIGURE_CLASS);
}

for (const role of ASSET_ROLES) {
  const className = roleClass(role);
  if (!declares(styles, className, SLOT)) {
    diag(
      lineOf(source, className) || lineOf(source, IMAGE_FIGURE_CLASS),
      `role ${role} states no slot — add .${className} { ${SLOT}: … } to the table`,
    );
    failures.push(className);
  }
}

for (const className of widthClasses) {
  if (!declares(styles, className, SLOT)) {
    diag(
      lineOf(source, className) || lineOf(source, IMAGE_FIGURE_CLASS),
      `.${className} states a width without clearing ${SLOT} — a role's slot would clamp it`,
    );
    failures.push(className);
  }
}

if (failures.length) {
  console.error(
    `check-image-roles: ${failures.length} of ${ASSET_ROLES.length + widthClasses.length + 1} image-sizing claims are unmet in ${SHEET}.`,
  );
  process.exit(1);
}

console.log(
  `check-image-roles: all ${ASSET_ROLES.length} roles state a slot and all ${widthClasses.length} stated widths clear it`,
);
