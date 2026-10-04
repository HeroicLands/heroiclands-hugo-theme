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
 * CI guard: the markup a `:::figure` fence emits must be styled here.
 *
 * A fence is a numbered, referable block, and its label is the part a reader
 * is meant to see. Unstyled, the label reads as an ordinary paragraph of body
 * text and the number says nothing — a failure no build reports, because the
 * page renders.
 *
 * The vocabulary is read from `@heroiclands/package-build` at run time:
 *
 *   1. {@link FENCE} and {@link LABEL}, the two classes every fence carries.
 *   2. Every kind's class, so a kind added upstream is covered here. A kind
 *      is styled by naming it or by the base rule that catches them all.
 *   3. Every class an author may write, from `FIGURE_CLASSES` — each of which
 *      asks for a drawing of its own, since an author writes one to change
 *      how the fence looks.
 *
 * Usage: node utils/check-figure-fences.mjs   (run as part of `npm run lint`)
 */

import { readFileSync } from "node:fs";
import { resolve } from "node:path";

import {
  FIGURE_CLASSES,
  FIGURE_NAMES,
} from "@heroiclands/package-build/engine/content-figures";

import { lineOf, rules, styled } from "./css-rules.mjs";

/** The stylesheet. */
const SHEET = "static/css/style.css";

/** The class every fence carries. */
const FENCE = "content-figure";

/** The class its label paragraph carries. */
const LABEL = "content-figure-label";

/** Diagnostics carry the fields they can know and drop the ones they cannot. */
function diag(line, message) {
  const where = line ? `${SHEET}:${line}` : SHEET;
  console.error(`${where}: error: ${message}`);
}

const source = readFileSync(resolve(SHEET), "utf8");
const styles = rules(source);

const kindClasses = Object.keys(FIGURE_NAMES).map((kind) => `${FENCE}-${kind}`);
const failures = [];

if (!styled(styles, FENCE)) {
  diag(0, `no rule names .${FENCE} — every fence renders as unstyled markup`);
  failures.push(FENCE);
}

if (!styled(styles, LABEL)) {
  diag(
    lineOf(source, FENCE),
    `no rule names .${LABEL} — a fence's number and caption read as body prose`,
  );
  failures.push(LABEL);
}

// A kind needs no rule of its own as long as the base rule draws it; this
// asks only that one of the two is true, so adding a kind upstream cannot
// land a fence nothing styles.
if (!styled(styles, FENCE)) {
  for (const className of kindClasses) {
    if (!styled(styles, className)) {
      diag(0, `.${className} is drawn by neither .${FENCE} nor a rule of its own`);
      failures.push(className);
    }
  }
}

for (const className of FIGURE_CLASSES) {
  if (!styled(styles, [FENCE, className])) {
    diag(
      lineOf(source, FENCE),
      `an author may write .${className} on a fence and nothing draws it — add a .${FENCE}.${className} rule`,
    );
    failures.push(className);
  }
}

if (failures.length) {
  console.error(
    `check-figure-fences: ${failures.length} class${failures.length === 1 ? "" : "es"} a fence emits goes unstyled in ${SHEET}.`,
  );
  process.exit(1);
}

console.log(
  `check-figure-fences: the fence, its label, ${kindClasses.length} kinds and ${FIGURE_CLASSES.length} authored class${
    FIGURE_CLASSES.length === 1 ? "" : "es"
  } are all styled`,
);
