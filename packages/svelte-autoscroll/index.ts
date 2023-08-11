import pDebounce from "p-debounce";
import { tweened } from "svelte/motion";
import { linear } from "svelte/easing";
import type { Action } from "svelte/action";
import type { EasingFunction } from "svelte/transition";

type AutoscrollParams = {
    axis: "x" | "y",
    speed?: number,
    delay?: number,
    easing?: EasingFunction,
    fromEnd?: boolean;
};

export const autoscroll = ((node, {
    axis, speed = 50, delay = 2000, easing = linear, fromEnd = false
}) => {
    function setScroll(pos: number) {
        axis === "x" ? (node.scrollLeft = pos) : (node.scrollTop = pos);
    }

    if (axis === "x")
        node.style.overflowX = "hidden";
    else
        node.style.overflowY = "hidden";

    let stop = false;
    let delayTimer: number;
    const scrollPosition = tweened<number>(0, { easing });
    const unsubscribe = scrollPosition.subscribe(setScroll);
    const init = pDebounce(() => {
        clearTimeout(delayTimer);
        const scrollRange = axis === "x"
            ? node.scrollWidth - node.clientWidth
            : node.scrollHeight - node.clientHeight;
        scrollPosition.set(fromEnd ? scrollRange : 0, { duration: 0 });
        function updatePosition(reverse: boolean) {
            if (scrollRange === 0) return;
            delayTimer = setTimeout(async () => {
                await scrollPosition.set(reverse ? 0 : scrollRange,
                    { duration: scrollRange / speed * 1000 }
                );
                if (stop) return;
                updatePosition(!reverse);
            }, delay);
        }
        updatePosition(fromEnd);
    }, 100);
    init();
    const resizeObserver = new ResizeObserver(init);
    resizeObserver.observe(node);
    for (const child of node.children)
        resizeObserver.observe(child);

    const mutationObserver = new MutationObserver((list) => {
        init();
        for (const elem of list) {
            for (const node of elem.addedNodes)
                node instanceof Element && resizeObserver.observe(node);
            for (const node of elem.removedNodes)
                node instanceof Element && resizeObserver.unobserve(node);
        }
    });
    mutationObserver.observe(node, { characterData: true, childList: true });

    return {
        destroy() {
            stop = true;
            unsubscribe();
            clearTimeout(delayTimer);
            resizeObserver.disconnect();
            mutationObserver.disconnect();
        }
    };
}) satisfies Action<HTMLElement, AutoscrollParams>;
