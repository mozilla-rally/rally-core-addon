<script>
  import niceDate from "./nice-date";

  export let endDate;
</script>

<style>
  .study-card-header {
    display: grid;
    grid-gap: 1.5rem;
    margin-bottom: 28px;
    grid-template-columns: var(--study-card-header-columns);
  }

  .study-card-author {
    /* explicitly set this field to prevent Zilla in some contexts */
    font-family: inter;
  }

  h3 {
    margin: 0px;
    grid-area: title;
    width: 100%;
    font-family: Inter;
  }
</style>

<div class="study-card-header grid">
  <slot name="study-icon" />
  <div class="study-card-header-info">
    <h3 class="text-head-sm">
      <slot name="study-name">Study</slot>
    </h3>
    <div class="study-card-author text-body-xs">
      by
      <slot name="study-author">author</slot>
      | Ends:
      {niceDate(endDate)}
    </div>
  </div>
  <slot name="study-cta" />
</div>
