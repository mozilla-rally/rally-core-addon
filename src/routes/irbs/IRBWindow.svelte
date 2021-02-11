<style>
    .irb-window {
        /* set color palette for children */
        --irb-background-color: var(--color-light-gray-20);
        --irb-text-color: var(--color-marketing-gray-70);
        --pad: 20px;

        box-sizing: border-box;
        width: 660px;
        height: 386px;
        padding: var(--pad);
        padding-bottom: 0;
        background-color: var(--irb-background-color);
        overflow-y: auto;
        margin-bottom: 20px;
    }

    .irb-bottom-fader {
        position: sticky;
        left: 0;
        bottom: 0;
        height: calc(var(--pad) + 1em);
        background: linear-gradient(to top, var(--irb-background-color) 1.125em, transparent);
    }
</style>
<div class="irb-window">
    <slot />
    <div class="irb-bottom-fader" />
</div>
