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
 * Reading the stylesheet, for the guards that assert what it covers.
 *
 * Enough of a stylesheet to answer "is this class styled, and with what?" —
 * not a CSS parser. The guards ask only that question.
 *
 * @module
 */

/**
 * Every style rule in a stylesheet, as a selector and the declarations under
 * it. At-rule preludes are dropped and the rules nested inside them kept, so a
 * declaration inside a media query counts exactly as one outside it.
 *
 * @param {string} css - The stylesheet source.
 * @returns {{selector: string, body: string}[]} The rules, in source order.
 */
export function rules(css) {
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

/** The line a class is first named on, so an editor can jump to the rule. */
export function lineOf(source, className) {
  const index = source.split("\n").findIndex((l) => l.includes(`.${className}`));
  return index === -1 ? 0 : index + 1;
}

/** Whether any rule naming every class in `classNames` declares `property`. */
export function declares(styles, classNames, property) {
  const names = [classNames].flat();
  return styles.some(
    (rule) =>
      names.every((name) => rule.selector.includes(`.${name}`)) &&
      new RegExp(`(^|[\\s;{])${property}\\s*:`).test(rule.body),
  );
}

/** Whether any rule names every class in `classNames`. */
export function styled(styles, classNames) {
  const names = [classNames].flat();
  return styles.some((rule) => names.every((name) => rule.selector.includes(`.${name}`)));
}
