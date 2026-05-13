import { Effect } from "@donkeyclip/motorcortex";

/**
 * Volume — Effect that animates the YouTube player's volume.
 *
 * Selector: !#video
 * animatedAttrs: { volume: <target 0-1> }
 * initialValues: { volume: <start 0-1> }  — REQUIRED
 *
 * Both animatedAttrs and initialValues must be provided.
 * getScratchValue is not reliably called for custom entity Effects.
 */
export default class Volume extends Effect {
  getScratchValue() {
    return this.element?.entity?.initialVolume ?? 1;
  }

  onProgress(millisecond) {
    const entity = this.element?.entity;
    if (!entity?.player || !entity.loaded) return;

    const fraction = this.getFraction(millisecond);
    const initial = this.initialValue ?? entity.initialVolume ?? 1;
    const target = this.targetValue;
    const current = initial + (target - initial) * fraction;
    const vol = Math.round(Math.max(0, Math.min(1, current)) * 100);

    entity.player.setVolume(vol);
  }
}
