{%- if theme.cursor_effect.enable %}

  {% if theme.cursor_effect.type === 'fireworks' %}
    {{- next_js('cursor/fireworks.js') }}
  {% elif theme.cursor_effect.type === 'explosion' %}
    <canvas class="fireworks" style="position: fixed;left: 0;top: 0;z-index: 1; pointer-events: none;" ></canvas>
    {{- next_js('cursor/explosion.min.js') }}
  {% elif theme.cursor_effect.type === 'love' %}
    {{- next_js('cursor/love.js') }}
  {% elif theme.cursor_effect.type === 'text' %}
    {{- next_js('cursor/text.js') }}
  {% endif %}

{%- endif %}

{{- next_js('FunnyTitle.js') }}

