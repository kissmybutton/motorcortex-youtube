import { Effect } from "@donkeyclip/motorcortex";

/**
 * MetaReveal — Effect that animates the metadata overlay's opacity and
 * the card's translateY for a slide-in / slide-out feel.
 *
 * Selector: !#meta
 * animatedAttrs: { opacity: <target 0-1> }
 * Props: { cardSlideY: "0px" | "12px" } — optional translateY for the card
 *
 * The entity must have:
 *   - html_element: the overlay DOM node (.yt-meta-overlay)
 *   - card_element: the card DOM node (.yt-meta-card)
 */
export default class MetaReveal extends Effect {
  getScratchValue() {
    return 0;
  }

  onProgress(millisecond) {
    const entity = this.element?.entity;
    if (!entity) return;

    const overlay = entity.html_element;
    const card = entity.card_element;
    if (!overlay) return;

    const fraction = this.getFraction(millisecond);
    const initial = this.initialValue ?? 0;
    const target = this.targetValue;
    const current = initial + (target - initial) * fraction;

    overlay.style.opacity = current;

    if (card && this.props.cardSlideY != null) {
      // Interpolate translateY: starts from props.cardSlideFrom, ends at props.cardSlideY
      const fromY = parseFloat(this.props.cardSlideFrom ?? "12");
      const toY = parseFloat(this.props.cardSlideY);
      const y = fromY + (toY - fromY) * fraction;
      card.style.transform = `translateY(${y}px)`;
    }
  }
}
