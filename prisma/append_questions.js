const fs = require('fs');
const path = require('path');

const filePath = "c:\\Users\\cinar\\OneDrive\\Masaüstü\\efe proje\\prisma\\questions_data.json";
const currentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const nextSubjects = [
    {
        "subject": "Kimya Her Yerde",
        "questions": [
            { "text": "Hangisi bir temizlik maddesi değildir?", "options": ["Kireç kaymağı", "Çamaşır suyu", "Asfalt", "Sabun"], "correctOption": 2 },
            { "text": "Sert sularla en iyi temizlik yapan madde hangisidir?", "options": ["Sabun", "Deterjan", "Sirke", "Yağ"], "correctOption": 1 },
            { "text": "Hangisi polimer bir maddedir?", "options": ["Teflon", "Su", "Tuz", "Demir"], "correctOption": 0 },
            { "text": "İlaçların farklı formlarda (tablet, şurup vb.) üretilme nedeni nedir?", "options": ["Daha pahalı yapmak", "Etkin maddenin doğru yere ve hızda ulaşmasını sağlamak", "Rengini değiştirmek", "Dayanıklılığını azaltmak"], "correctOption": 1 },
            { "text": "Hangi madde bir kozmetik bileşeni olarak nemlendirici görevi görür?", "options": ["Alkol", "Gliserin", "Zımpara", "Kül"], "correctOption": 1 },
            { "text": "Hazır gıdalarda raf ömrünü uzatmak için ne kullanılır?", "options": ["Renklendirici", "Koruyucu (E kodlu)", "Tatlandırıcı", "Yumuşatıcı"], "correctOption": 1 },
            { "text": "Hangisi bir doğal polimerdir?", "options": ["PVC", "Protein", "Naylon", "Polietilen"], "correctOption": 1 },
            { "text": "Sabunun ana maddesi nedir?", "options": ["Petrol", "Bitkisel veya hayvansal yağlar", "Kömür", "Doğalgaz"], "correctOption": 1 },
            { "text": "Deterjanların çevreye en büyük zararı nedir?", "options": ["Daha iyi temizlemesi", "Doğada kolay parçalanmaması", "Güzel kokması", "Ucuz olması"], "correctOption": 1 },
            { "text": "PVC (Polivinil klorür) nerelerde kullanılır?", "options": ["Kapı ve pencere doğramalarında", "Yiyeceklerde", "İlaç yapımında", "Hava üretiminde"], "correctOption": 0 },
            { "text": "Hangisi bir yağda çözünen vitamindir?", "options": ["C", "B", "A", "H"], "correctOption": 2 },
            { "text": "İlaçların vücuda verilme yollarından hangisi en hızlı etki eder?", "options": ["Ağızdan", "Enjeksiyon (damar yolu)", "Merhem", "Damlalık"], "correctOption": 1 },
            { "text": "Pastörizasyon ve UHT işlemleri neyi hedefler?", "options": ["Gıdanın tadını bozmayı", "Zararlı mikroorganizmaları öldürmeyi", "Gıdayı renklendirmeyi", "Gıdayı dondurmayı"], "correctOption": 1 },
            { "text": "Hangisi bir gıda tatlandırıcısıdır?", "options": ["Monosodyum glutamat", "Aspartam", "Sodyum benzoat", "Laktik asit"], "correctOption": 1 },
            { "text": "Kauçuk ağacından elde edilen polimer nedir?", "options": ["Naylon", "Doğal kauçuk", "Polyester", "Kevlar"], "correctOption": 1 },
            { "text": "Hangisi güneş kremlerinin asıl amacıdır?", "options": ["Cildi yakmak", "UV ışınlarını emmek veya yansıtmak", "Cildi kurutmak", "Kıl köklerini beslemek"], "correctOption": 1 },
            { "text": "Çelik tencere tabanlarındaki yapışmaz katman genellikle nedir?", "options": ["Bakır", "PTFE (Teflon)", "Gümüş", "Kurşun"], "correctOption": 1 },
            { "text": "Hangisi geri dönüşüm sembolüdür?", "options": ["Üçgen oklar", "Kuru kafa", "Alev", "Ünlem"], "correctOption": 0 },
            { "text": "Zeytinyağı üretiminde 'sızma' yağ ne anlama gelir?", "options": ["Isıl işlem görmüş", "Mekanik yöntemle sıkılmış, asitliği düşük", "İçine pamuk yağı katılmış", "Rengi değiştirilmiş"], "correctOption": 1 },
            { "text": "Hangisi kişisel temizlik maddesidir?", "options": ["Çamaşır suyu", "Diş macunu", "Tuz ruhu", "Kireç çözücü"], "correctOption": 1 },
            { "text": "Hangisi bir polimerleşme tepkimesiyle oluşur?", "options": ["Tuz oluşumu", "Naylon üretimi", "Su oluşumu", "Demirin paslanması"], "correctOption": 1 },
            { "text": "Bebek mamalarının üretiminde hangisinden kaçınılır?", "options": ["Vitaminden", "Katkı maddeleri ve koruyuculardan", "Kalsiyumdan", "Proteinden"], "correctOption": 1 },
            { "text": "Şampuanların saçtaki yağı temizleme mekanizması neye dayanır?", "options": ["Mıknatıslanmaya", "Yüzey aktif maddelerin suyu ve yağı tutmasına", "Isı değişimine", "Işık kırılmasına"], "correctOption": 1 },
            { "text": "Hangisi bir yapay polimer değildir?", "options": ["Pet şişe", "Naylon çorap", "Pamuk lifi", "Teflon tava"], "correctOption": 2 },
            { "text": "Endüstriyel yağların ana kaynağı nedir?", "options": ["Güneş", "Petrol", "Bitkiler", "Deniz suyu"], "correctOption": 1 }
        ]
    },
    {
        "subject": "Modern Atom Teorisi",
        "questions": [
            { "text": "Elektronların bulunma olasılığının yüksek olduğu bölgelere ne denir?", "options": ["Yörünge", "Orbital", "Çekirdek", "Işın"], "correctOption": 1 },
            { "text": "Heisenberg Belirsizlik İlkesi neyi savunur?", "options": ["Atomun kütlesi ölçülemez", "Elektronun hızı ve yeri aynı anda kesin bilinemez", "Protonlar hareketlidir", "Işık sadece dalgadır"], "correctOption": 1 },
            { "text": "n=3, l=1 olan orbital hangisidir?", "options": ["3s", "3p", "3d", "4s"], "correctOption": 1 },
            { "text": "Hangi orbitalin enerjisi en düşüktür?", "options": ["1s", "2s", "2p", "3s"], "correctOption": 0 }
        ]
    },
    {
        "subject": "Gazlar",
        "questions": [
            { "text": "İdeal gaz yasası denklemi hangisidir?", "options": ["P=MRT", "PV=nRT", "V=nPT", "P=dnRT"], "correctOption": 1 },
            { "text": "Gaz moleküllerinin hızları neye bağlıdır?", "options": ["Sıcaklığa", "Mol kütlesine", "Basınca", "Sıcaklık ve mol kütlesine"], "correctOption": 3 },
            { "text": "Mutlak sıfır noktası kaç Kelvin'dir?", "options": ["-273", "0", "273", "100"], "correctOption": 1 },
            { "text": "Gazların küçük bir delikten boşluğa yayılmasına ne denir?", "options": ["Difüzyon", "Efüzyon", "Genleşme", "Yoğuşma"], "correctOption": 1 }
        ]
    },
    {
        "subject": "Sıvı Çözeltiler",
        "questions": [
            { "text": "Molarite (M) nedir?", "options": ["1 kg çözücüdeki mol sayısı", "1 L çözeltideki mol sayısı", "100 g çözücüdeki gram", "Toplam tanecik sayısı"], "correctOption": 1 },
            { "text": "Molalite (m) nedir?", "options": ["1 L çözeltideki mol", "1 kg çözücüdeki mol sayısı", "Hacimce yüzde", "Özgül ağırlık"], "correctOption": 1 },
            { "text": "PPM hangi derişimler için kullanılır?", "options": ["Çok derişik", "Çok seyreltik", "Orta derişik", "Gazlar için sadece"], "correctOption": 1 },
            { "text": "Çözünen tanecik sayısına bağlı olan özelliklere ne denir?", "options": ["Fiziksel", "Kimyasal", "Koligatif", "İzotop"], "correctOption": 2 }
        ]
    },
    {
        "subject": "Kimya ve Enerji",
        "questions": [
            { "text": "Dışarıya ısı veren tepkimelere ne denir?", "options": ["Endotermik", "Ekzotermik", "İzotermik", "Adyabatik"], "correctOption": 1 },
            { "text": "Standart koşullarda elementlerin en kararlı hallerinin oluşum entalpisi kaçtır?", "options": ["-100", "0", "1", "100"], "correctOption": 1 },
            { "text": "Hess Yasası neyi ifade eder?", "options": ["Tepkime ısısı tepkime basamaklarına bağlı değildir", "Sıcaklık hızı artırır", "Isı enerjisi yok edilemez", "Basınç entalpiyi değiştirmez"], "correctOption": 0 }
        ]
    },
    {
        "subject": "Kimyasal Tepkimelerde Hız",
        "questions": [
            { "text": "Katalizörün tepkimeye asıl etkisi nedir?", "options": ["Verimi artırmak", "Aktifleşme enerjisini düşürmek", "Delta H'ı değiştirmek", "Ürün miktarını artırmak"], "correctOption": 1 },
            { "text": "Tepkimenin gerçekleşmesi için gerekli minimum enerjiye ne ad verilir?", "options": ["İç enerji", "Eşik enerjisi (Ea)", "Isı", "Bağ enerjisi"], "correctOption": 1 },
            { "text": "Mekanizmalı tepkimelerde hız hangi basamağa göre belirlenir?", "options": ["En hızlı", "En yavaş", "Sonuncu", "Ara basamak"], "correctOption": 1 }
        ]
    },
    {
        "subject": "Kimyasal Tepkimelerde Denge",
        "questions": [
            { "text": "Denge anında hangisi kesinlikle doğrudur?", "options": ["İleri hız = Geri hız", "Girenler = Ürünler", "Tepkime durmuştur", "Sıcaklık artmaktadır"], "correctOption": 0 },
            { "text": "Le Chatelier İlkesi neyi açıklar?", "options": ["Dengedeki sisteme müdahalenin etkisini", "Hızın sıcaklığa bağlılığını", "Katalizörün etkisini", "Basıncın erimeye etkisini"], "correctOption": 0 },
            { "text": "Hangisi denge sabitini (Kc) sadece değiştiren faktördür?", "options": ["Basınç", "Hacim", "Sıcaklık", "Derişim"], "correctOption": 2 },
            { "text": "Hangi tepkime türü denge tepkimesi olabilir?", "options": ["Tam verimli", "Tersinir (çift yönlü)", "Sadece yanma", "Tek yönlü"], "correctOption": 1 },
            { "text": "Maksimum düzensizlik ve minimum enerji eğilimi zıt yönlerdeyse ne oluşur?", "options": ["Tam verimli tepkime", "Denge tepkimesi", "Yanma", "Analiz"], "correctOption": 1 }
        ]
    },
    {
        "subject": "Asit-Baz Dengesi",
        "questions": [
            { "text": "Suyun oto-iyonizasyon sabiti (Kw) 25°C'de kaçtır?", "options": ["10^-7", "10^-14", "1", "14"], "correctOption": 1 },
            { "text": "pH + pOH toplamı 25°C'de kaça eşittir?", "options": ["7", "10", "14", "1"], "correctOption": 2 },
            { "text": "Eşlenik (konjuge) asit-baz çifti hangisidir?", "options": ["HCl / NaOH", "NH3 / NH4+", "H2O / NaCl", "KOH / KCl"], "correctOption": 1 },
            { "text": "Tampon çözeltiler ne işe yarar?", "options": ["pH'ı sabit tutmaya çalışırlar", "pH'ı hızlıca değiştirirler", "Isı verirler", "Gaz çıkarırlar"], "correctOption": 0 },
            { "text": "Zayıf bir asit ile güçlü bir bazın tepkimesinden hangi tür tuz oluşur?", "options": ["Nötr", "Asidik", "Bazik", "Amfoter"], "correctOption": 2 }
        ]
    },
    {
        "subject": "Çözünürlük Dengesi",
        "questions": [
            { "text": "Çözünürlük çarpımı sabiti hangisidir?", "options": ["Kc", "Kp", "Kçç", "Ka"], "correctOption": 2 },
            { "text": "Ortak iyon etkisi çözünürlüğü nasıl değiştirir?", "options": ["Artırır", "Azaltır", "Değişmez", "Önce artırır sonra azaltır"], "correctOption": 1 },
            { "text": "Çökelme olması için hangisi gerçekleşmelidir?", "options": ["Qç < Kçç", "Qç > Kçç", "Qç = Kçç", "Her zaman çökelir"], "correctOption": 1 }
        ]
    },
    {
        "subject": "Kimya ve Elektrik",
        "questions": [
            { "text": "Elektron verme olayına ne denir?", "options": ["İndirgenme", "Yükseltgenme", "Nötrleşme", "Hidroliz"], "correctOption": 1 },
            { "text": "Galvanik hücrede (pil) yükseltgenme nerede olur?", "options": ["Katot", "Anot", "Tuz köprüsü", "Çözelti"], "correctOption": 1 },
            { "text": "Katot elektrotunda hangi olay gerçekleşir?", "options": ["Yükseltgenme", "İndirgenme", "Erime", "Aşınma"], "correctOption": 1 },
            { "text": "Tuz köprüsünün asıl görevi nedir?", "options": ["Akım üretmek", "Yük denkliğini sağlamak", "Elektrotları korumak", "Sıcaklığı ölçmek"], "correctOption": 1 },
            { "text": "Faraday Kanunları ney ile ilgilidir?", "options": ["Hücre gerilimi", "Elektroliz sırasında toplanan madde miktarı", "Gazların basıncı", "Işık hızı"], "correctOption": 1 },
            { "text": "Standart Hidrojen Elektrodu (SHE) potansiyeli kaç volttur?", "options": ["1", "0", "-1", "7"], "correctOption": 1 }
        ]
    },
    {
        "subject": "Karbon Kimyasına Giriş",
        "questions": [
            { "text": "Karbon atomu kaç tane bağ yapar?", "options": ["2", "3", "4", "5"], "correctOption": 2 },
            { "text": "Aşağıdakilerden hangisi karbonun bir allotropudur?", "options": ["Cam", "Elmas", "Bakır", "Plastik"], "correctOption": 1 },
            { "text": "Grafitten elde edilen ve süper malzeme olarak bilinen tek atomlu tabaka nedir?", "options": ["Fulleren", "Grafen", "Karbon nanotüp", "Kömür"], "correctOption": 1 },
            { "text": "Metan (CH4) molekülünün geometrisi nedir?", "options": ["Üçgen düzlem", "Doğrusal", "Düzgün dörtyüzlü", "Kırık doğru"], "correctOption": 2 },
            { "text": "Sigma bağı mı yoksa pi bağı mı daha güçlüdür?", "options": ["Sigma", "Pi", "Eşittir", "Fark etmez"], "correctOption": 0 }
        ]
    },
    {
        "subject": "Organik Bileşikler",
        "questions": [
            { "text": "Sadece karbon ve hidrojen içeren bileşiklere ne denir?", "options": ["Alkol", "Eter", "Hidrokarbon", "Ester"], "correctOption": 2 },
            { "text": "Alkanların genel formülü nedir?", "options": ["CnH2n", "CnH2n+2", "CnH2n-2", "CnHn"], "correctOption": 1 },
            { "text": "İkili bağ içeren doymamış hidrokarbonlara ne denir?", "options": ["Alkan", "Alken", "Alkin", "Aren"], "correctOption": 1 },
            { "text": "Benzen halkası içeren bileşiklere ne ad verilir?", "options": ["Alifatik", "Aromatik", "Alisiklik", "Doymuş"], "correctOption": 1 },
            { "text": "Alkollerin fonksiyonel grubu hangisidir?", "options": ["-CHO", "-COOH", "-OH", "-NH2"], "correctOption": 2 },
            { "text": "Asetik asit hangi gruba girer?", "options": ["Alkol", "Aldehit", "Karboksilik asit", "Ester"], "correctOption": 2 },
            { "text": "Muz kokusunu veren organik bileşik türü genellikle hangisidir?", "options": ["Alkan", "Ester", "Eter", "Keton"], "correctOption": 1 }
        ]
    }
];

const updatedData = [...currentData, ...nextSubjects];
fs.writeFileSync(filePath, JSON.stringify(updatedData, null, 2));

console.log('Successfully completed 500 questions expansion.');
