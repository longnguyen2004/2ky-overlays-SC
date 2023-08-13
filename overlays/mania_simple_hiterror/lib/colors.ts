export function tickColor(offset: number, window: number[])
{
    const offsetAbs = Math.abs(offset);
    if (offsetAbs <= window[0])
        return "#ffffff";
    if (offsetAbs <= window[1])
        return "#ffa500";
    if (offsetAbs <= window[2])
        return "#228b22";
    if (offsetAbs <= window[3])
        return "#1e90ff";
    if (offsetAbs <= window[4])
        return "#ff69b4";
    return "#dc143c";
}

export function arrowColor(offset: number, window: number[])
{
    const threshold = 10;
    if (offset < -threshold)
        return "#1985ff";
    if (offset > threshold)
        return "#ff4040";
    return "#ffffff";
}
