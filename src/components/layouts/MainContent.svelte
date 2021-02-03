<style>
div {
    display: grid;
    grid-template-columns: var(--content-width);
    background-size: 100% 100%;
    background-attachment: fixed;
    margin: 2rem 2.5rem;
    margin-right: 0;
    box-sizing: border-box;
}
</style>

<div>
    <slot />
</div>