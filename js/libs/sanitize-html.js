var reg = /(<script(\s|\S)*?<\/script>)|(<style(\s|\S)*?<\/style>)|(<!--(\s|\S)*?-->)|(<\/?(\s|\S)*?>)/g;
export default function sanitizeHtml(text, tags) {
  return text.replace(reg, function(tag) {
    var tagName = tag.replace(/<|>|\//g, '');
    if(tags.indexOf(tagName) !== -1) return tag;
    return '';
  });
}