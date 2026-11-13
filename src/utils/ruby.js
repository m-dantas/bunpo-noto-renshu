// Converte 漢字《かんじ》 em <ruby>漢字<rt>かんじ</rt></ruby>
export const rb = s => s.replace(/([\u4e00-\u9fff\u3005]+)《([^》]+)》/g, '<ruby>$1<rt>$2</rt></ruby>')
