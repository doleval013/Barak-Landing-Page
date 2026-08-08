from pathlib import Path

# Remove homepage carousel block and modal markup
index_path = Path('public/index.html')
text = index_path.read_text(encoding='utf-8')
start = '      <section class="section recommendations-carousel" id="recommendations-preview">'
end = '      <section class="section faqs" id="faqs">'
start_idx = text.find(start)
end_idx = text.find(end, start_idx)
if start_idx == -1 or end_idx == -1:
    raise SystemExit('Could not find homepage carousel block markers')
text = text[:start_idx] + end + text[end_idx + len(end):]
text = text.replace('      <div class="modal-overlay" id="pdfModal" aria-hidden="true">', '')
index_path.write_text(text, encoding='utf-8')
print('Updated public/index.html')

# Replace recommendations page list with expandable details blocks
recommendations_path = Path('public/recommendations.html')
text = recommendations_path.read_text(encoding='utf-8')
start = '      <section class="recommendation-list">'
end = '</section>'
start_idx = text.find(start)
if start_idx == -1:
    raise SystemExit('Could not find recommendations list start marker')
end_idx = text.find(end, start_idx)
if end_idx == -1:
    raise SystemExit('Could not find recommendations list end marker')
end_idx += len(end)
replacement = '''      <section class="recommendation-list">
        <details class="recommendation-card">
          <summary>מרכז חינוך טכנולוגי אבן רושד</summary>
          <div class="recommendation-card-body">
            <img src="/content/recommendations/pics/%D7%90%D7%91%D7%9F%20%D7%A8%D7%95%D7%A9%D7%93.png" alt="המלצה מאבן רושד" />
            <p>"בית הספר זכה בצוות הדרכה מקצועי, מיומן ואחראי. באמצעות התכנית התלמידים רכשו מיומנויות רגשיות וחברתיות רבות." - באסם אבו אלהיג'א, מנהל בית הספר.</p>
          </div>
        </details>
        <details class="recommendation-card">
          <summary>ויצו נהלל</summary>
          <div class="recommendation-card-body">
            <img src="/content/recommendations/pics/%D7%95%D7%99%D7%A6%D7%95%20%D7%A0%D7%94%D7%9C%D7%9C.png" alt="המלצה מויצו נהלל" />
            <p>"השתתפות בשיעור גורמת לתלמידים להתרוממות רוח, חיזוק הביטחון העצמי והיכולת להיות משמעותי לאחר." - חגית ברוך, מנהלת חטיבת הנעורים.</p>
          </div>
        </details>
        <details class="recommendation-card">
          <summary>חטיבת הביניים כדורי</summary>
          <div class="recommendation-card-body">
            <img src="/content/recommendations/pics/%D7%9B%D7%93%D7%95%D7%A8%D7%99.png" alt="המלצה מחטיבת הביניים כדורי" />
            <p>"התוכנית מאוד מבוקשת על ידי התלמידים והצוות והיא מתבצעת מאז ברצף ולשביעות רצון הצוות והתלמידים." - משה תורג'מן, מנהל חט"ב כדורי.</p>
          </div>
        </details>
        <details class="recommendation-card">
          <summary>הרב תחומי עמק רחוד</summary>
          <div class="recommendation-card-body">
            <img src="/content/recommendations/pics/%D7%94%D7%A8%D7%91%20%D7%AA%D7%97%D7%95%D7%9E%D7%99%20%D7%A2%D7%9E%D7%A7%20%D7%A8%D7%97%D7%95%D7%93.png" alt="המלצה מהרב תחומי עמק רחוד" />
            <p>מכתב המלצה נוסף עם פירוט על עבודת התוכנית במסגרת המוסד.</p>
          </div>
        </details>
      </section>'''
text = text[:start_idx] + replacement + text[end_idx:]
recommendations_path.write_text(text, encoding='utf-8')
print('Updated public/recommendations.html')
