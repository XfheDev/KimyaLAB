const fs = require('fs');
const path = require('path');

const filePath = "c:\\Users\\cinar\\OneDrive\\Masaüstü\\efe proje\\prisma\\questions_data.json";
const currentData = JSON.parse(fs.readFileSync(filePath, 'utf8'));

const bonusQuestions = [
    {
        "subject": "Modern Atom Teorisi",
        "questions": [
            { "text": "Hangi orbitalin baş kuantum sayısı 3, açısal momentum kuantum sayısı 2'dir?", "options": ["3s", "3p", "3d", "4d"], "correctOption": 2 },
            { "text": "Elektronların orbitallere dizilme kuralı olan 'Aufbau' ne anlama gelir?", "options": ["Parçalama", "İnşa etme/Dizme", "Döndürme", "Kırılma"], "correctOption": 1 },
            { "text": "Hangi elementin elektron dizilimi [Ar] 4s1 3d10 şeklindedir?", "options": ["Fe", "Zn", "Cu", "Ag"], "correctOption": 2 },
            { "text": "Hangi orbital türü çekirdekten en uzakta başlar?", "options": ["s", "p", "d", "f"], "correctOption": 3 },
            { "text": "Manyetik kuantum sayısı (ml) -1, 0, +1 olan orbital hangisidir?", "options": ["s", "p", "d", "f"], "correctOption": 1 },
            { "text": "Pasif hidrojen iyonu (H-) dizilimi hangisidir?", "options": ["1s1", "1s2", "2s1", "1s0"], "correctOption": 1 },
            { "text": "Hangi atomun dizilimi küresel simetrik değildir?", "options": ["7N", "8O", "10Ne", "12Mg"], "correctOption": 1 },
            { "text": "4s ve 3d orbitallerinden hangisinin enerjisi daha yüksektir (Madelung kuralı)?", "options": ["4s", "3d", "Eşittir", "Sıcaklığa bağlıdır"], "correctOption": 1 },
            { "text": "Hangi kuantum sayısı orbitalin uzaydaki yönelimini belirler?", "options": ["n", "l", "ml", "ms"], "correctOption": 2 },
            { "text": "Asal gazlardan hangisi p bloğunda yer almaz?", "options": ["He", "Ne", "Ar", "Kr"], "correctOption": 0 },
            { "text": "Bir p orbitali en fazla kaç zıt spinli elektron alabilir?", "options": ["2", "6", "3", "1"], "correctOption": 0 },
            { "text": "Atom numarası 26 olan Fe elementinin tam dolu orbital sayısı kaçtır?", "options": ["10", "12", "13", "15"], "correctOption": 1 },
            { "text": "Hangi geçiş elementi tam dolu d orbitaline sahiptir?", "options": ["Fe", "Cr", "Zn", "Sc"], "correctOption": 2 },
            { "text": "L=3 olan orbitaller hangileridir?", "options": ["s", "p", "d", "f"], "correctOption": 3 },
            { "text": "Hangi iyon elektron dizilimi soygaz kararlılığındadır?", "options": ["11Na+", "9F-", "12Mg2+", "Hepsi"], "correctOption": 3 },
            { "text": "Elektron koparırken hangisinden önce kopartılır?", "options": ["En yüksek enerjili", "En dış yörüngedeki", "En iç yörüngedeki", "Rastgele"], "correctOption": 1 },
            { "text": "Paramanyetik bir atom mıknatıs tarafından ne yapılır?", "options": ["İtilir", "Çekilir", "Etkilenmez", "Isınır"], "correctOption": 1 },
            { "text": "Diamanyetik maddelerde eşleşmemiş elektron sayısı kaçtır?", "options": ["0", "1", "2", "3"], "correctOption": 0 },
            { "text": "Hangi orbital n=2 seviyesinde bulunamaz?", "options": ["2s", "2p", "2d", "Hepsi bulunur"], "correctOption": 2 },
            { "text": "Hangi kural elektronların düşük enerjiden başlayarak dizilmesini söyler?", "options": ["Pauli", "Hund", "Aufbau", "Heisenberg"], "correctOption": 2 },
            { "text": "Yükseltgenme basamağı +3 olan Al atomunun dizilimi nasıldır (13Al)?", "options": ["1s2 2s2 2p6 3s2 3p1", "1s2 2s2 2p6", "1s2 2s2 2p3", "1s2 2s2"], "correctOption": 1 }
        ]
    },
    {
        "subject": "Gazlar",
        "questions": [
            { "text": "Gaz moleküllerinin hızları ile kütleleri arasındaki ilişki nedir?", "options": ["Doğru orantılı", "Kütlenin kareköküyle ters orantılı", "Bağımsız", "Kütleyle doğru orantılı"], "correctOption": 1 },
            { "text": "Aynı sıcaklıkta He (4) ve CH4 (16) gazlarından He gazı CH4'ten kaç kat hızlıdır?", "options": ["2", "4", "1/2", "kök 2"], "correctOption": 0 },
            { "text": "Gazların sıvılaşması için ne gereklidir?", "options": ["Yüksek sıcaklık, Düşük basınç", "Düşük sıcaklık, Yüksek basınç", "Sadece vakum", "Sadece karıştırmak"], "correctOption": 1 },
            { "text": "Hangi gaz karışımı her zaman homojendir?", "options": ["Sulu çözelti", "Gaz-Gaz karışımları", "Katı-Sıvı", "Yağ-Su"], "correctOption": 1 },
            { "text": "Kısmi basınç formülü hangisidir?", "options": ["Px = Ptop * (nx / ntop)", "Px = Ptop / nx", "Px = nx * ntop", "Px = V / n"], "correctOption": 0 },
            { "text": "Gaz molekülleri arası çekim kuvveti en az olan hangisidir?", "options": ["CO2", "H2O", "He", "NH3"], "correctOption": 2 },
            { "text": "İdeal bir gazda moleküller arası çarpışmalar nasıldır?", "options": ["Esnek", "Esnek olmayan", "Sürtünmeli", "Duran"], "correctOption": 0 },
            { "text": "Birim hacimdeki gaz molekülü sayısı hangisine bağlıdır?", "options": ["P/T oranına", "Rengine", "Kaba", "Işığa"], "correctOption": 0 },
            { "text": "Normal koşullarda 11,2 L gaz kaç moldür?", "options": ["0,5", "1", "2", "0,25"], "correctOption": 0 },
            { "text": "Hangi gazın difüzyon hızı en küçüktür?", "options": ["He", "Ne", "Ar", "Xe"], "correctOption": 3 },
            { "text": "Gaz basıncı birimi olan 1 atm kaç cmHg'dır?", "options": ["76", "101.3", "1", "0"], "correctOption": 0 },
            { "text": "Hangi sıcaklıkta gaz moleküllerinin kinetik enerjisi sıfır kabul edilir?", "options": ["0°C", "-273°C (0 K)", "100°C", "273 K"], "correctOption": 1 },
            { "text": "İdeal gazlar için hangisi doğrudur?", "options": ["Molekül hacimleri ihmal edilir", "Çekim kuvvetleri çok fazladır", "Düzensiz değildirler", "Sıkıştırılamazlar"], "correctOption": 0 },
            { "text": "Aynı kapta bulunan gazların neleri eşittir?", "options": ["Hızları", "Hacimleri", "Kütleleri", "Molekül sayıları"], "correctOption": 1 },
            { "text": "Hangisi su üzerinde gaz toplama yönteminde kullanılan bir değerdir?", "options": ["Suyun buhar basıncı", "Suyun rengi", "Hava hızı", "Kabın şekli"], "correctOption": 0 },
            { "text": "Gazların genleşme katsayısı ayırt edici bir özellik midir?", "options": ["Evet", "Hayır", "Sadece soygazlarda", "Sıcaklığa bağlıdır"], "correctOption": 1 },
            { "text": "Hangi gaz ideallikten en uzaktır?", "options": ["H2", "He", "H2O (buhar)", "N2"], "correctOption": 2 },
            { "text": "Gazların basıncı ne ile doğru orantılıdır?", "options": ["Molekül sayısı ve sıcaklık", "Hacim", "Molekül ağırlığı", "Kabın kalınlığı"], "correctOption": 0 },
            { "text": "Graham difüzyon yasası formülünde hızların oranı nelerin oranıyla ilgilidir?", "options": ["Mol kütlelerinin karekökü (ters)", "Mol kütleleri", "Yoğunluklar", "Hacimler"], "correctOption": 0 },
            { "text": "Gerçek gazlar hangi koşulda sıvılaşır?", "options": ["Düşük sıcaklık", "Yüksek basınç", "Düşük sıcaklık ve yüksek basınç", "Vakumda"], "correctOption": 2 }
        ]
    },
    {
        "subject": "Sıvı Çözeltiler",
        "questions": [
            { "text": "Molarite birimi nedir?", "options": ["mol/kg", "mol/L", "g/mL", "mol"], "correctOption": 1 },
            { "text": "Hangi madde suda çözünürken ısı açığa çıkarır (ekzotermik)?", "options": ["NaOH", "KNO3", "Şeker", "NaCl"], "correctOption": 0 },
            { "text": "Çözünürlük dengesi olan katı-sıvı karışımlarına ne denir?", "options": ["Doymuş çözelti", "Doymamış çözelti", "Süspansiyon", "Emülsiyon"], "correctOption": 0 },
            { "text": "Sulu bir çözeltide %10'luk şeker varken su buharlaştırılırsa yüzde ne olur?", "options": ["Artar", "Azalır", "Değişmez", "Sıfır olur"], "correctOption": 0 },
            { "text": "Hangisi elektriği en iyi iletir?", "options": ["Saf su", "Şekerli su", "Tuzlu su", "Alkol-su"], "correctOption": 2 },
            { "text": "Hidratasyon nedir?", "options": ["Çözünenin başka çözücüyle sarılması", "Çözünenin su molekülleriyle sarılması", "Suyun donması", "Suyun kaynaması"], "correctOption": 1 },
            { "text": "Solvatasyon nedir?", "options": ["Suyla sarılma", "Herhangi bir çözücüyle sarılma", "Dengede kalma", "Erime"], "correctOption": 1 },
            { "text": "Çözünürlük hızı neye bağlı değildir?", "options": ["Sıcaklık", "Karıştırma", "Temas yüzeyi", "Dış basınç (katılarda)"], "correctOption": 3 },
            { "text": "Hangisi bir çözelti örneği değildir?", "options": ["Hava", "Şerbet", "Ayran", "Pirinç (alaşım)"], "correctOption": 2 },
            { "text": "Osmozda su nereden nereye geçer?", "options": ["Az yoğundan çok yoğuna", "Çok yoğundan az yoğuna", "Sıcakta kalana", "Işığa doğru"], "correctOption": 0 },
            { "text": "Serumların vücuda uygun olması için hangisi olması gerek?", "options": ["İzotonik", "Hipertonik", "Hipotonik", "Buz gibi"], "correctOption": 0 },
            { "text": "Hangi karışımın kaynama noktası belli bir derecede sabit kalmaz?", "options": ["Saf su", "Tuzlu su", "Etil alkol", "Doymuş şekerli su"], "correctOption": 1 },
            { "text": "Çözünürlük birimi genellikle nedir?", "options": ["g/100g su", "mol/L", "mg/kg", "kg/m3"], "correctOption": 0 },
            { "text": "Hangisi çözünürlüğü artıran bir faktördür?", "options": ["Sıcaklık (endotermiklerde)", "Basınç (gazlarda)", "Karıştırma", "Sıcaklık ve Basınç"], "correctOption": 3 },
            { "text": "Hangisi iyonik bir çözünmedir?", "options": ["Alkollü su", "Şekerli su", "Deniz suyu", "Yağlı su"], "correctOption": 2 },
            { "text": "Hangi gruptaki iyonlar genellikle tüm tuzlarıyla suda çözünür?", "options": ["1A grubu", "2A grubu", "Geçiş metalleri", "Halojenler"], "correctOption": 0 },
            { "text": "Doymuş bir çözeltiye aynı sıcaklıkta bir miktar daha şeker eklenirse ne olur?", "options": ["Çözünür", "Derişimi artar", "Dibine çöker", "Buharlaşır"], "correctOption": 2 },
            { "text": "Bir çözeltinin hacmi su eklenerek iki katına çıkarılırsa molaritesi ne olur?", "options": ["Yarıya iner", "İki katına çıkar", "Değişmez", "Karesi kadar azalır"], "correctOption": 0 },
            { "text": "Derişik çözelti ne demektir?", "options": ["Çok su içeren", "Birim hacimde çok çözünen içeren", "Sıcak olan", "Donmuş olan"], "correctOption": 1 },
            { "text": "Kütlece %20'lik 200 g çözeltide kaç g şeker vardır?", "options": ["20", "40", "100", "80"], "correctOption": 1 },
            { "text": "Gazlı içeceklerin soğuk ve kapalı tutulma nedeni nedir?", "options": ["Donmasın diye", "Gazın çözünürlüğü soğukta ve yüksek basınçta arttığı için", "Rengi bozulmasın diye", "Tadı daha acı olsun diye"], "correctOption": 1 }
        ]
    },
    {
        "subject": "Kimya ve Enerji",
        "questions": [
            { "text": "Tepkime entalpisi (Delta H) pozitif ise ürünlerin enerjisi nasıldır?", "options": ["Girenlerden küçüktür", "Girenlerden büyüktür", "Girenlere eşittir", "Sıfırdır"], "correctOption": 1 },
            { "text": "Hangi yanma tepkimesi ekzotermiktir?", "options": ["C + O2 -> CO2", "N2 + O2 -> 2NO", "He + O2", "Altının yanması"], "correctOption": 0 },
            { "text": "Bağ oluşumu ne tür bir olaydır?", "options": ["Endotermik", "Ekzotermik", "Fiziksel", "Denge"], "correctOption": 1 },
            { "text": "Entalpi değişimi (Delta H) nelere bağlıdır?", "options": ["Basınç", "Sıcaklık", "Madde miktarı", "Hepsine"], "correctOption": 3 },
            { "text": "Elementlerin en kararlı hallerinin entalpisi ne kabul edilir?", "options": ["0", "1", "100", "-273"], "correctOption": 0 },
            { "text": "Tepkime ısısı basamak sayısına neden bağlı değildir?", "options": ["Basınç sabit olduğu için", "Hess Yasası gereği", "İzole sistem olduğu için", "Katalizörlü olduğu için"], "correctOption": 1 },
            { "text": "Hangisi potansiyel enerjiyi artırır (Delta H > 0)?", "options": ["Gazın sıvılaşması", "Katının süblimleşmesi", "Asit-baz nötrleşmesi", "Bağ oluşumu"], "correctOption": 1 },
            { "text": "Isı kapsamı neyi ifade eder?", "options": ["Sıcaklığı", "Entalpiyi", "Entropiyi", "Hızı"], "correctOption": 1 },
            { "text": "Standart oluşum entalpisi 1 mol bileşik için mi geçerlidir?", "options": ["Evet", "Hayır", "Sadece gazlarda", "Katılarda geçersizdir"], "correctOption": 0 },
            { "text": "Bir tepkime 3 katına çıkarılırsa entalpi değeri ne olur?", "options": ["3 katına çıkar", "Aynı kalır", "Tersine döner", "Sıfır olur"], "correctOption": 0 },
            { "text": "Aktifleşmiş kompleksin enerjisi girenlerin enerjisinden her zaman nasıldır?", "options": ["Küçüktür", "Büyüktür", "Eşittir", "Negatiftir"], "correctOption": 1 },
            { "text": "Hangi tepkime türü her zaman ekzotermiktir?", "options": ["Metallerin asitle tepkimesi", "Nötralleşme", "Çözünme", "Buharlaşma"], "correctOption": 1 },
            { "text": "Molar yanma entalpisi neye eşittir?", "options": ["Oluşum entalpisine", "Bağ enerjisine", "Tepkime ısısına", "İç enerjiye"], "correctOption": 2 },
            { "text": "Bağ enerjisinden Delta H nasıl hesaplanır?", "options": ["Ürün - Giren", "Kopan - Oluşan", "Giren + Ürün", "Rastgele"], "correctOption": 1 },
            { "text": "Kalorimetre kabı ile ne hesaplanabilir?", "options": ["Bağ enerjisi", "Yanma ısısı", "Elektron ilgisi", "Periyot"], "correctOption": 1 },
            { "text": "Hangi olayda düzensizlik artarken entalpi de artar?", "options": ["Erime", "Donma", "Yanma", "Yoğuşma"], "correctOption": 0 },
            { "text": "Standart hal koşulları nedir?", "options": ["0°C, 1 atm", "25°C, 1 atm", "25°C, 0 atm", "100°C, 1 atm"], "correctOption": 1 },
            { "text": "Entalpi büyüklüğü madde miktarından nasıl etkilenir?", "options": ["Doğru orantılı", "Ters orantılı", "Etkilenmez", "Miktarın karesiyle orantılı"], "correctOption": 0 },
            { "text": "Hangi maddenin standart oluşum entalpisi sıfır değildir?", "options": ["O2(g)", "H2O(s)", "Fe(k)", "C(grafit)"], "correctOption": 1 },
            { "text": "Tepkime mekanizması değişirse Delta H değişir mi?", "options": ["Evet", "Hayır", "Sıcaklığa bağlı", "Katalizöre bağlı"], "correctOption": 1 },
            { "text": "Buzun suya dönüşmesi olayının türü nedir?", "options": ["Kimyasal - Endotermik", "Fiziksel - Endotermik", "Kimyasal - Ekzotermik", "Fiziksel - Ekzotermik"], "correctOption": 1 },
            { "text": "Delta H = -50 kJ olan bir tepkime nasıldır?", "options": ["Endotermik", "Ekzotermik", "Sıfır enerjili", "Stabil olmayan"], "correctOption": 1 }
        ]
    },
    {
        "subject": "Kimyasal Tepkimelerde Hız",
        "questions": [
            { "text": "Birim zamanda harcanan madde miktarı neyi verir?", "options": ["Verim", "Hız", "Denge", "Katalizör"], "correctOption": 1 },
            { "text": "Eşik enerjisini geçen tanecik sayısı hangisiyle artar?", "options": ["Derişim", "Sıcaklık", "Hacim", "Işık"], "correctOption": 1 },
            { "text": "Katalizör Delta H'ı etkiler mi?", "options": ["Evet", "Hayır", "Sadece hızlandığında", "Ender durumlarda"], "correctOption": 1 },
            { "text": "Homojen katalizör ne demektir?", "options": ["Hızlandıran", "Tepkime girenleriyle aynı fazda olan", "Katı olan", "Sıvı olan"], "correctOption": 1 },
            { "text": "Heterojen katalizör ne demektir?", "options": ["Hızı yavaşlatan", "Tepkime girenlerinden farklı fazda olan", "Gaz olan", "Sıvı olan"], "correctOption": 1 },
            { "text": "Tepkime derecesi kaç olabilir?", "options": ["Sadece tam sayı", "Kesirli, sıfır veya tam sayı", "Yalnızca 1", "Yalnızca 2"], "correctOption": 1 },
            { "text": "Basınç artışı gaz fazındaki hızı nasıl etkiler?", "options": ["Artar", "Azalır", "Değişmez", "Hacme bağlı"], "correctOption": 0 },
            { "text": "Hangi tepkime en yavaştır?", "options": ["Nötralleşme", "Kömürün yanması", "Demirin paslanması", "Patlama"], "correctOption": 2 },
            { "text": "Hız sabiti 'k' nelere bağlıdır?", "options": ["Sıcaklık, katalizör, yüzey alanı", "Sadece sıcaklık", "Yalnızca derişim", "Basınç"], "correctOption": 0 },
            { "text": "Aktifleşme enerjisi her zaman pozitif midir?", "options": ["Evet", "Hayır", "Ekzotermiklerde negatiftir", "Sıfır olabilir"], "correctOption": 0 },
            { "text": "Hangi kurala göre tepkime gerçekleşir?", "options": ["Çarpışma teorisi", "Işık teorisi", "Dalga teorisi", "Newton yasaları"], "correctOption": 0 },
            { "text": "Etkin çarpışma nedir?", "options": ["Hızlı çarpışma", "Uygun geometride ve yeterli enerjideki çarpışma", "Sadece çarpışma", "Kaçan moleküller"], "correctOption": 1 },
            { "text": "Sıcaklık arttığında kinetik enerji dağılım eğrisi nereye kayar?", "options": ["Sola", "Sağa ve aşağı", "Yukarı", "Olduğu yerde kalır"], "correctOption": 1 },
            { "text": "Hız denklemi deneysel mi bulunur?", "options": ["Evet", "Hayır", "Işıkla", "Tahminle"], "correctOption": 0 },
            { "text": "Hızı artıran ama harcanmayan madde nedir?", "options": ["Ara ürün", "Katalizör", "Yan ürün", "Giren"], "correctOption": 1 },
            { "text": "Reaksiyon hız birimi genellikle nedir?", "options": ["mol/L.s", "L/mol.s", "mol/s", "g/L"], "correctOption": 0 },
            { "text": "Zamanla reaksiyon hızı genellikle nasıl değişir?", "options": ["Artar", "Azalır", "Değişmez", "Önce artar sonra azalır"], "correctOption": 1 },
            { "text": "Hangi indikatör hızı ölçmede kullanılabilir?", "options": ["pH metre", "Spektrofotometre", "Kronomre", "Bunsen beki"], "correctOption": 1 },
            { "text": "Ara ürün ile katalizör farkı nedir?", "options": ["Biri başta var sonda yok, diğeri tam tersi", "Biri gaz diğeri katı", "Biri hızı etkilemez", "Fark yok"], "correctOption": 0 },
            { "text": "Hız tayin basamağı hangisidir?", "options": ["En hızlı", "En yavaş", "Potansiyel enerjisi en düşük", "Sıcaklığa en duyarlı"], "correctOption": 1 },
            { "text": "İleri aktifleşme enerjisi düştükçe hız ne olur?", "options": ["Artar", "Azalır", "Değişmez", "Durur"], "correctOption": 0 },
            { "text": "Sıfırıncı dereceden bir tepkime ne demektir?", "options": ["Hız derişime bağlı değildir", "Tepkime yoktur", "Sıcaklık sıfırdır", "Hız sabiti sıfırdır"], "correctOption": 0 }
        ]
    },
    {
        "subject": "Kimyasal Tepkimelerde Denge",
        "questions": [
            { "text": "Denge anında hangisi sabittir?", "options": ["Gözlenebilir olaylar", "Ölçülebilir nicelikler", "Zaman", "İvme"], "correctOption": 1 },
            { "text": "Derişim cinsinden denge sabiti Kc ne ile değişir?", "options": ["Basınç", "Hacim", "Sıcaklık", "Miktar"], "correctOption": 2 },
            { "text": "Basınç cinsinden denge sabiti Kp ile Kc arasındaki ilişki nedir?", "options": ["Kp = Kc(RT)^dn", "Kp = Kc / RT", "Kp = Kc + RT", "Eşittir"], "correctOption": 0 },
            { "text": "Denge tepkimesinde girenlerin katsayıları toplamı ürünlerinkine eşitse dn kaçtır?", "options": ["0", "1", "2", "-1"], "correctOption": 0 },
            { "text": "Dengedeki bir sisteme hacim küçültülürse denge nereye kayar?", "options": ["Katsayısı çok olan tarafa", "Katsayısı az olan tarafa", "Kaymaz", "Ürünlere"], "correctOption": 1 },
            { "text": "Sıcaklık artışı ekzotermik dengede dengeyi nereye kaydırır?", "options": ["Ürünlere", "Girenlere", "Kaydırmaz", "Işığa"], "correctOption": 1 },
            { "text": "Katalizör dengeye nasıl etki eder?", "options": ["Dengeyi sağa kaydırır", "Dengeyi sola kaydırır", "Dengeye gelme süresini kısaltır", "Kc değerini değiştirir"], "correctOption": 2 },
            { "text": "Hangi fiziksel haller denge bağıntısında yer alır?", "options": ["Katı-Gaz", "Gaz-Sulu çözelti", "Sıvı-Gaz", "Katı-Sıvı"], "correctOption": 1 },
            { "text": "Denge kesri Qç > Kc ise sistem ne yöne kayar?", "options": ["Ürünlere", "Girenlere", "Kaymaz", "Denge durur"], "correctOption": 1 },
            { "text": "Saf katı ve sıvı eklemek dengeyi bozar mı?", "options": ["Evet", "Hayır", "Basınçla bozulur", "Sıcaklıkla bozulur"], "correctOption": 1 },
            { "text": "Minimum enerji eğilimi ne tarafa doğrudur?", "options": ["Isının olduğu tarafa", "Isının olmadığı tarafa", "Her zaman ürünlere", "Her zaman girenlere"], "correctOption": 0 },
            { "text": "Hangisi bir heterojen denge örneğidir?", "options": ["Gaz fazı", "CaCO3 <=> CaO + CO2", "N2 + 3H2 <=> 2NH3", "Asit-baz"], "correctOption": 1 },
            { "text": "Tepkime ters çevrilirse denge sabiti Kc ne olur?", "options": ["Eksisi alınır", "1/Kc alınır", "Değişmez", "Karesi alınır"], "correctOption": 1 },
            { "text": "Kc değeri çok büyükse denge ürünler lehine midir?", "options": ["Evet", "Hayır", "Denge yoktur", "Gaz yoktur"], "correctOption": 0 },
            { "text": "Sıcaklık artınca Kc artıyorsa tepkime nedir?", "options": ["Endotermik", "Ekzotermik", "Yanma", "Çözünme"], "correctOption": 0 },
            { "text": "Hacim artarsa gaz fazında katsayısı çok olan tarafa kayan denge için hangisi doğrudur?", "options": ["Basınç azalmıştır", "Derişimler azalmıştır", "Toplam mol artmıştır", "Hepsi"], "correctOption": 3 },
            { "text": "Kısmi basınçlar denge bağıntısında ne tür basınçlar kullanılır?", "options": ["Denge anındaki", "Başlangıçtaki", "Toplam", "Hava"], "correctOption": 0 },
            { "text": "Sıvı-buhar dengesi ne tür bir dengedir?", "options": ["Kimyasal", "Fiziksel", "Dinamik", "Fiziksel ve Dinamik"], "correctOption": 3 },
            { "text": "Denge denkleminin katsayıları 2 katına çıkarılırsa Kc ne olur?", "options": ["2 ile çarpılır", "Karesi alınır", "Kökü alınır", "Değişmez"], "correctOption": 1 },
            { "text": "Hangi soygaz eklemek sabit hacimli dengede dengeyi bozmaz?", "options": ["Helyum", "Oksijen", "Hidrojen", "Karbon"], "correctOption": 0 }
        ]
    },
    {
        "subject": "Asit-Baz Dengesi",
        "questions": [
            { "text": "Zayıf bir asidin iyonlaşma sabiti nedir?", "options": ["Ka", "Kb", "Ksu", "Kçç"], "correctOption": 0 },
            { "text": "Bağlı asit-baz çiftinde H+ veren tarafa ne denir?", "options": ["Asit", "Baz", "İndirgen", "Tuz"], "correctOption": 0 },
            { "text": "Amfoter madde ne demektir?", "options": ["Hem asit hem baz gibi davranan", "Sadece suda çözünen", "Renksiz olan", "Metal olan"], "correctOption": 0 },
            { "text": "Hangi baz zayıf bir bazdır?", "options": ["LiOH", "NH3", "NaOH", "KOH"], "correctOption": 1 },
            { "text": "Kuvvetli asit-baz nötrleşmesinde eşdeğerlik noktası pH'ı kaçtır?", "options": ["0", "7", "14", "1"], "correctOption": 1 },
            { "text": "Hidroliz nedir?", "options": ["Tuzun suyla tepkimeye girmesi", "Asidin kuruması", "Bazın donması", "Işığın kırılması"], "correctOption": 0 },
            { "text": "Zayıf asit ile zayıf bazdan oluşan tuzun pH'ı neye bağlıdır?", "options": ["Ka ve Kb büyüklüğüne", "Işığa", "Basınca", "Hacme"], "correctOption": 0 },
            { "text": "Lewis asidi tanımına göre asit nedir?", "options": ["Proton veren", "Elektron çifti alan", "OH- veren", "Proton alan"], "correctOption": 1 },
            { "text": "Titrasyon işleminde kullanılan dereceli ince tüp nedir?", "options": ["Mezür", "Büret", "Pipet", "Beheriglas"], "correctOption": 1 },
            { "text": "Sulu çözeltilerde [H+] * [OH-] çarpımı 25°C'de neye eşittir?", "options": ["10^-7", "10^-14", "1", "14"], "correctOption": 1 },
            { "text": "pKa + pKb neyi verir?", "options": ["pH", "pOH", "pKw", "pKçç"], "correctOption": 2 },
            { "text": "Bronsted-Lowry tanımına göre baz nedir?", "options": ["Proton alan", "H+ veren", "OH- veren", "Elektron alan"], "correctOption": 0 },
            { "text": "Hangi asit poliprotiktir?", "options": ["HCl", "H2SO4", "HNO3", "CH3COOH"], "correctOption": 1 },
            { "text": "Nötrimetri nedir?", "options": ["Asit-baz titrasyonu", "Gaz ölçümü", "Isı ölçümü", "Işık ölçümü"], "correctOption": 0 },
            { "text": "Fenolftalein hangi ortamda renksizdir?", "options": ["Asidik", "Bazik", "Tuzlu", "Sabunlu"], "correctOption": 0 },
            { "text": "Asitlik gücü arttıkça Ka değeri nasıl değişir?", "options": ["Artar", "Azalır", "Değişmez", "Sıfır olur"], "correctOption": 0 },
            { "text": "Bazlık gücü arttıkça pKb nasıl değişir?", "options": ["Artar", "Azalır", "Değişmez", "Sabit kalır"], "correctOption": 1 },
            { "text": "Tampon çözeltilere örnek hangisidir?", "options": ["Sirke-tuzlar", "Kan", "Limonata", "Sirke ve Kan"], "correctOption": 3 },
            { "text": "HCl ve Amonyak tepkimesinden hangi tür tuz oluşur?", "options": ["Nötr", "Asidik", "Bazik", "Alkali"], "correctOption": 1 },
            { "text": "Saf suya baz eklenirse pH nasıl değişir?", "options": ["Artar", "Azalır", "7 kalır", "Sıfırlanır"], "correctOption": 0 }
        ]
    },
    {
        "subject": "Çözünürlük Dengesi",
        "questions": [
            { "text": "Çözünürlüğü çok az olan katılar ne tür denge oluşturur?", "options": ["Fiziksel", "Heterojen iyon dengesi", "Homojen gaz", "Hiçbiri"], "correctOption": 1 },
            { "text": "Hangi olayda Kçç değeri değişir?", "options": ["Basınç", "Hacim", "Sıcaklık", "Ortak iyon"], "correctOption": 2 },
            { "text": "AgCl doymuş çözeltisine NaCl eklenirse AgCl çözünürlüğü ne olur?", "options": ["Artar", "Azalır", "Değişmez", "Renk değiştirir"], "correctOption": 1 },
            { "text": "Kçç bağıntısı yazılırken hangileri alınır?", "options": ["Katılar", "Sulu iyonlar", "Sıvı", "Gazlar"], "correctOption": 1 },
            { "text": "Çözünürlük (s) ile Kçç XY tipi katıda nedir?", "options": ["s", "s^2", "4s^3", "27s^4"], "correctOption": 1 },
            { "text": "Çözünürlük (s) ile Kçç XY2 tipi katıda nedir?", "options": ["s^2", "4s^3", "27s^4", "s^3"], "correctOption": 1 },
            { "text": "Doygunluğa ulaşmamış bir çözeltide iyon çarpımı Qç Kçç'den nasıldır?", "options": ["Küçüktür", "Büyüktür", "Eşittir", "Karesidir"], "correctOption": 0 },
            { "text": "Dengede olan bir sistemde çökelme hızı çözünme hızına nasıldır?", "options": ["Büyüktür", "Küçüktür", "Eşittir", "Değişken"], "correctOption": 2 },
            { "text": "Sert suların boruları tıkaması hangi olayla ilgilidir?", "options": ["Kireç çökelmesi", "Oksijen", "Isınma", "Işık"], "correctOption": 0 },
            { "text": "Çözünürlüğü ekzotermik olan bir tuzun sıcaklığı artırılırsa ne olur?", "options": ["Daha çok çözünür", "Dibine çöker", "Donar", "Buharlaşır"], "correctOption": 1 },
            { "text": "Hangisi bir iyonik katının çözünürlüğünü etkiler?", "options": ["Sıcaklık", "Ortak iyon", "Yabancı iyon", "Hepsine"], "correctOption": 3 },
            { "text": "CaCO3 Kçç ifadesi nedir?", "options": ["[Ca2+][CO3 2-]", "[Ca][C][O]^3", "[Ca]/[CO3]", "[Ca]+[CO3]"], "correctOption": 0 },
            { "text": "BaSO4 tıp alanında neden kullanılır?", "options": ["Zehirli", "Çok az çözülmesi", "Pahalı", "Mavi"], "correctOption": 1 },
            { "text": "İyonlaşma yüzdesi zayıf elektrolitlerde derişimle nasıl değişir?", "options": ["Artar", "Azalır", "Aynı kalır", "Öngörülemez"], "correctOption": 1 },
            { "text": "Endotermik bir tuzu çözmek için su ne yapılmalıdır?", "options": ["Isıtılmalı", "Soğutulmalı", "Dondurulmalı", "Karıştırılmamalı"], "correctOption": 0 },
            { "text": "Basınç değişiminin katıların Kçç değerine etkisi nedir?", "options": ["Büyük", "İhmal edilecek kadar az", "Hızlandırır", "Dengeyi bozar"], "correctOption": 1 },
            { "text": "Mg(OH)2 doymuş çözeltisi bazik midir?", "options": ["Evet", "Hayır", "Nötr", "Asidik"], "correctOption": 0 },
            { "text": "Travertenler hangi olayla oluşmuştur?", "options": ["Yanma", "Çökelme", "Süblimleşme", "Uyarılma"], "correctOption": 1 }
        ]
    },
    {
        "subject": "Kimya ve Elektrik",
        "questions": [
            { "text": "İndirgenen madde hangisidir?", "options": ["Elektron alan", "Elektron veren", "Nötrleşen", "Oksijen veren"], "correctOption": 0 },
            { "text": "Yükseltgen madde hangisidir?", "options": ["Elektron alan", "Elektron veren", "Proton alan", "Donan"], "correctOption": 0 },
            { "text": "Hangi elementin yükseltgenme basamağı her zaman +1'dir?", "options": ["Li", "H", "Cu", "Fe"], "correctOption": 0 },
            { "text": "Elektroliz sırasında anyonlar nereye gider?", "options": ["Anot", "Katot", "Pil", "Priz"], "correctOption": 0 },
            { "text": "Katyonlar elektrolizde nerede indirgenir?", "options": ["Anot", "Katot", "Tel", "Çözelti"], "correctOption": 1 },
            { "text": "Hangi metal en aktiftir?", "options": ["Au", "Pt", "Li", "Ag"], "correctOption": 2 },
            { "text": "Zn > Cu olan bir pilde Zn elektrodu ne işe yarar?", "options": ["Katot", "Anot", "Değişmez", "Sıvılaşır"], "correctOption": 1 },
            { "text": "Nernst denklemi neyi hesaplamada kullanılır?", "options": ["Pil potansiyeli", "Hız sabiti", "Denge miktar", "Gaz hızı"], "correctOption": 0 },
            { "text": "Elektroliz devresinden 1 Faradaylık akım geçerse kaç mol elektron geçmiş olur?", "options": ["0,5", "1", "2", "6x10^23"], "correctOption": 1 },
            { "text": "Lityum-iyon pillerin avantajı nedir?", "options": ["Ağır", "Enerji yoğunluğu", "Tek kullanımlık", "Yavaş"], "correctOption": 1 },
            { "text": "Korozyondan korunmak için metalin üzerine aktif metal bağlanmasına ne denir?", "options": ["Kaplama", "Kurban elektrot", "Aşındırma", "Boyama"], "correctOption": 1 },
            { "text": "Suyun elektrolizinde anotta hangi gaz toplanır?", "options": ["H2", "O2", "Cl2", "CO2"], "correctOption": 1 },
            { "text": "Hangi pil türü kuru pil olarak bilinir?", "options": ["Lityum", "Zn-C", "Akü", "Güneş"], "correctOption": 1 },
            { "text": "Redoks tepkimesi ne demektir?", "options": ["Yanma", "İndirgenme-yükseltgenme", "Asit-baz", "Isı veren"], "correctOption": 1 },
            { "text": "Metallerin aktifliği neye göre belirlenir?", "options": ["Elektron verme", "Elektron alma", "Nötron", "Renk"], "correctOption": 0 },
            { "text": "Hücre diyagramında (||) neyi temsil eder?", "options": ["Kablo", "Tuz köprüsü", "Elektrot", "Işık"], "correctOption": 1 },
            { "text": "Derişim pili ne demektir?", "options": ["Aynı elektrotlar", "Güçlü pil", "Asitli pil", "Küçük pil"], "correctOption": 0 },
            { "text": "Elektrolizle kaplamacılıkta kaplanacak metal nerede olmalıdır?", "options": ["Anot", "Katot", "Dış", "Tuz köprüsü"], "correctOption": 1 },
            { "text": "Hangi olayda istemli bir tepkime vardır?", "options": ["Elektroliz", "Pil", "Şarj", "Paslanma"], "correctOption": 1 },
            { "text": "Güç kaynağı kullanılan sistem hangisidir?", "options": ["Pil", "Elektroliz", "Yanma", "Mıknatıs"], "correctOption": 1 }
        ]
    },
    {
        "subject": "Karbon Kimyasına Giriş",
        "questions": [
            { "text": "Hangi madde organiktir?", "options": ["NaCl", "CH4", "CO2", "H2O"], "correctOption": 1 },
            { "text": "Üreyi sentezleyen kimdir?", "options": ["Lavoisier", "Wöhler", "Berzelius", "Dalton"], "correctOption": 1 },
            { "text": "Karbonun bağ yapma kapasitesi neden yüksektir?", "options": ["Ağır", "Hibritleşme", "Soygaz", "Metal"], "correctOption": 1 },
            { "text": "Ametal atomları arasındaki bağlarda elektronlar nasıl kullanılır?", "options": ["Alışveriş", "Ortaklaşa", "Uçarak", "Dalarak"], "correctOption": 1 },
            { "text": "VSEPR AX2 molekül yapısı nasıldır?", "options": ["Doğrusal", "Üçgen", "Kare", "Yamuk"], "correctOption": 0 },
            { "text": "Sp3 hibritleşmesi yapan karbon kaç sigma bağı içerir?", "options": ["2", "3", "4", "1"], "correctOption": 2 },
            { "text": "Pi bağı ne zaman oluşur?", "options": ["Uç uca", "Yan yana", "Hibrit", "İyon"], "correctOption": 1 },
            { "text": "Rezonans yapı neyi ifade eder?", "options": ["Tek Lewis ile gösterilemeyen", "Titreşim", "Patlama", "Erime"], "correctOption": 0 },
            { "text": "Karbonun hangi allotropu elektriği iletir?", "options": ["Elmas", "Grafit", "Cam", "Plastik"], "correctOption": 1 },
            { "text": "Organik bileşiklerin ana kaynağı nedir?", "options": ["Kaya", "Fosil/Canlı", "Tuz", "Hava"], "correctOption": 1 },
            { "text": "Hangisi bir anorganik bileşiktir?", "options": ["Şeker", "Protein", "Karbonatlı tuzlar", "Alkol"], "correctOption": 2 },
            { "text": "Molekül geometrisi 'Kırık Doğru' olan nedir?", "options": ["CO2", "H2O", "CH4", "BeH2"], "correctOption": 1 },
            { "text": "Hangi bağ daha uzundur?", "options": ["Tekli", "İkili", "Üçlü", "Eşit"], "correctOption": 0 },
            { "text": "Merkez atomda eşleşmemiş elektron çifti varsa molekül nedir?", "options": ["Polar", "Apolar", "İyonik", "Simetrik"], "correctOption": 0 },
            { "text": "Hangi madde 'vitalizm' teorisini yıkmıştır?", "options": ["Alkol", "Üre", "Su", "Tuz"], "correctOption": 1 },
            { "text": "Fullerenler nerelerde kullanılır?", "options": ["Nanoteknoloji", "İnşaat", "Gıda", "Tekstil"], "correctOption": 0 },
            { "text": "Hibritleşme sırasında nelerin enerjisi eşitlenir?", "options": ["Proton", "Orbitaller", "Nötron", "Çekirdek"], "correctOption": 1 },
            { "text": "C-H bağı hangi tür kovalent bağdır?", "options": ["Apolar", "Polar", "Metalik", "Zayıf"], "correctOption": 1 },
            { "text": "Karbon nanotüplerin özelliği nedir?", "options": ["Kırılgan", "Güçlü/Hafif", "Sulu", "Yanmaz"], "correctOption": 1 },
            { "text": "Lewis formülünde bağ yapmayan elektronlara ne denir?", "options": ["Değerlik", "Ortaklanmamış", "Bağlayıcı", "İç"], "correctOption": 1 }
        ]
    },
    {
        "subject": "Organik Bileşikler",
        "questions": [
            { "text": "Kapalı formülleri aynı, açık formülleri farklı maddelere ne denir?", "options": ["İzomer", "İzotop", "Allotrop", "Homolog"], "correctOption": 0 },
            { "text": "Alkenlere hangi madde katılarak doymuş hale getirilir?", "options": ["O2", "H2", "N2", "CO2"], "correctOption": 1 },
            { "text": "Etil alkolün formülü nedir?", "options": ["CH3OH", "C2H5OH", "C3H7OH", "CH3COOH"], "correctOption": 1 },
            { "text": "Karboksilik asitlerin genel formülü hangisidir?", "options": ["R-OH", "R-CHO", "R-COOH", "R-O-R"], "correctOption": 2 },
            { "text": "Aseton hangi sınıfa girer?", "options": ["Alkol", "Aldehit", "Keton", "Ester"], "correctOption": 2 },
            { "text": "Formaldehit hangi amaçla kullanılır?", "options": ["Gıda", "Dezenfeksiyon", "İçecek", "Yakıt"], "correctOption": 1 },
            { "text": "Eterlerin genel formülü hangisidir?", "options": ["R-O-R", "R-OH", "R-CO-R", "R-COO-R"], "correctOption": 0 },
            { "text": "Glikoz hangi gruba aittir?", "options": ["Alkol", "Karbonhidrat", "Ester", "Alkan"], "correctOption": 1 },
            { "text": "Amino asitlerde hangi iki grup bulunur?", "options": ["OH/CHO", "COOH/NH2", "SH/OH", "CO/Cl"], "correctOption": 1 },
            { "text": "Polimerleşme hızı hangisinde daha yüksektir?", "options": ["Alkan", "Alken", "Camsı", "Gaz"], "correctOption": 1 },
            { "text": "Kandaki şeker miktarı hangi analizle ölçülür?", "options": ["Spektroskopi", "Kimyasal", "Mıknatıs", "Eleme"], "correctOption": 1 },
            { "text": "Esterleşme hangileri arasında olur?", "options": ["Alkol/Asit", "Baz/Asit", "Gaz/Sıvı", "Alkol/Su"], "correctOption": 0 },
            { "text": "Sabunlaşmada bazlarla ne tepkimeye girer?", "options": ["Glikoz", "Yağ asitleri", "Protein", "Metal"], "correctOption": 1 },
            { "text": "İzomeri türlerinden hangisi 'cis-trans' içerir?", "options": ["Yapı", "Geometrik", "Konum", "Fonksiyonel"], "correctOption": 1 },
            { "text": "Benzenin formülü nedir?", "options": ["C6H12", "C6H6", "C5H10", "C6H14"], "correctOption": 1 },
            { "text": "Hangi madde bir fosil yakıt değildir?", "options": ["Kömür", "Doğalgaz", "Biyogaz", "Petrol"], "correctOption": 2 },
            { "text": "Odun ruhu hangisidir?", "options": ["Metanol", "Etanol", "Propanol", "Butanol"], "correctOption": 0 },
            { "text": "Kireç sökücülerin ana maddesi nedir?", "options": ["Baz", "Zayıf asit", "Sabun", "Yağ"], "correctOption": 1 },
            { "text": "Saponifikasyon nedir?", "options": ["Mayalanma", "Sabunlaşma", "Yanma", "Donma"], "correctOption": 1 },
            { "text": "Organik asitler turnusolu neye çevirir?", "options": ["Mavi", "Kırmızı", "Yeşil", "Sarı"], "correctOption": 1 }
        ]
    }
];

bonusQuestions.forEach(item => {
    const index = currentData.findIndex(d => d.subject === item.subject);
    if (index !== -1) {
        currentData[index].questions = [...currentData[index].questions, ...item.questions];
    }
});

fs.writeFileSync(filePath, JSON.stringify(currentData, null, 2));

console.log('Successfully reached the target volume of questions.');
