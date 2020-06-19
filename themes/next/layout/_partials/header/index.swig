<nav class="site-nav">
  {{ partial('_partials/header/menu.swig', {}, {cache: theme.cache.enable}) }}
</nav>

{{ partial('_partials/header/brand.swig', {}, {cache: theme.cache.enable}) }}

{# add on #}
{{ partial('_partials/header/site_master.swig', {}, {cache: theme.cache.enable}) }}
{# add off #}

{%- if theme.algolia_search.enable or theme.local_search.enable %}
  <div class="site-search">
    {{ partial('_partials/search/index.swig', {}, {cache: theme.cache.enable}) }}
  </div>
{%- endif %}

{{- next_inject('header') }}
