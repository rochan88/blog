{%- if theme.aplayer %}

{%- set aplayer_css_url = '//cdn.jsdelivr.net/npm/aplayer@1.10.1/dist/APlayer.min.css' or next_vendors('aplayer/APlayer.min.css') %}
<link rel="stylesheet" href="{{ aplayer_css_url }}">

{%- set aplayer_js_uri = '//cdn.jsdelivr.net/npm/aplayer@1.10.0/dist/APlayer.min.js' or next_vendors('aplayer/APlayer.min.js') %}
<div class="aplayer">
<script>
NexT.utils.loadComments(document.querySelector('#aplayer-fixed'), () => {
  NexT.utils.getScript('{{ aplayer_js_uri }}', () => {
    const apFixed = new APlayer({
      element: document.getElementById('aplayer-fixed'),
      mutex: true,
      theme: '#97dffd',
      order: 'random',
      lrcType: 3,
      fixed: true,
    });
    $.ajax({
      url: 'https://api.i-meto.com/meting/api?server=netease&type=playlist&id=3102961863',
      success: function (list) {
        //console.log(typeof list);
        apFixed.list.add(typeof list == 'string' ? JSON.parse(list):list);
        //apFixed.list.add(JSON.parse(list));
      }
    });
  },window.APlayer);
});
</script>
</div>
{%- endif %}